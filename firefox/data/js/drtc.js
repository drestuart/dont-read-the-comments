function shouldRun() {
	if (typeof siteProfile === "undefined") {
		return false;
	}

	if (siteProfile["mode"] !== "disabled") {
		return true;
	}
	else {
		return false;
	}
}

function getSectionSelector() {
	return siteProfile["section_selector"];
}

function getCommentSelector() {
	return siteProfile["comment_selector"];
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegExp(string){
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

showText = "Show &#8595;";
hideText = "Hide &#8593;";

coverHTML = "<div class='__drtc_area' id='__drtc_area%id%'>" +
				"<div class='__drtc_showhide' __drtc_id='%id%'>" + showText + "</div>" +
				"<div class='__drtc_cover' id='__drtc_cover%id%'></div>" +
			"</div>";
id = 0;
showEltId = [];

function getZIndex(elt) {
	var z = 0;

	if (typeof elt.attr("__drtc_z_index") !== 'undefined') {
		z = elt.attr("__drtc_z_index");
	}
	else {
		// Search parents
		$(elt).parents().each(function(index, e) {
			var zind = $(e).zIndex();
			if (zind > z) {
				z = zind;
			}
		});

		// Search children
		$(elt).find().each(function(index, e) {
			var zind = $(e).zIndex();
			if (zind > z) {
				z = zind;
			}
		});

		// Store z-index on the element so we don't have to calculate it again
		elt.attr("__drtc_z_index", z);
	}

	return z + 1;
}

function constructSelector(selector_in) {
	var selector = '';
	var selectors = selector_in.split(/\s*,\s*/);

	for (var sel of selectors) {
		selector += sel + ":visible, "
	}
  
	selector = selector.replace(/, $/, ''); // Trim off the last comma and space
	return selector;
}

function hideComments(comment_selector) {
	// Ignore empty selector
	if (comment_selector.trim() === "") {
		return false;
	}

	var selector = constructSelector(comment_selector);
 	var comments = $(selector);

	// If the element we want isn't present on the page, do nothing
	if (comments.length === 0) {
		return false;
	}

	comments.each(function(index) {
		hideElement($(this), comment_threshold);
	});
	return true;
}

function hideCommentSection(section_selector) {
	// Ignore empty selector
	if (section_selector.trim() === "") {
		return false;
	}

	var selector = constructSelector(section_selector);
 	var section = $(selector);

	// If the element we want isn't present on the page, do nothing
	if (section.length === 0) {
		return false;
	}

	hideElement(section);
	return true;
}

function hideElement(elt, ct) {
	if (typeof(ct) === 'undefined') {
		ct = 0;
	}

	var css_obj = {};

	// Get some parameters from the comments block
	var properties = ["background", "border"];
	var pos = elt.offset();
	var z = getZIndex(elt);
	var element_id;

	// Get this element's __drtc_id if it exists, define it if not
	if (typeof elt.attr("__drtc_id") !== 'undefined') {
		element_id = parseInt(elt.attr("__drtc_id"));
	}
	else {
		element_id = id;
		elt.attr("__drtc_id", element_id);
		id++;
	}

	// Get the comments section element
	var comments_section = $(getSectionSelector());

	// Check if this element is actually visible in the comments section
	// If it's not, skip the rest of the function
	if (!elt.is(comments_section) && comments_section.clientHeight !== comments_section.scrollHeight) {
		var eltTop = elt.offset().top;
		var eltBottom = eltTop + elt.outerHeight(true);

		var sectionTop = comments_section.scrollTop();
		var sectionBottom = sectionTop + comments_section.outerHeight(true);

		if ((eltTop > sectionBottom) || (eltBottom < sectionTop)) {
			return;
		}
	}

	if (isNaN(z)) {
		z = 0;
	}

	// Fill in styles to impersonate
	for (p of properties) {
		css_obj[p] = elt.css(p);
	}

	// Put the area number into the html
	var drtcArea = $(coverHTML.replace(/%id%/g, element_id.toString()));

	// Add our div to the page
	$("body").append(drtcArea);

	// Style and position our area div
	$(drtcArea).css({
		'z-index': (z + 1).toString(),
		left: pos.left,
		top: pos.top,
	});

	// Get some of the children
	var cover = drtcArea.find(".__drtc_cover");
	var showHide = drtcArea.find(".__drtc_showhide");

	cover.css(css_obj);
	cover.css({
		top: - getElementHeight(showHide),
		width: getElementWidth(elt),
		height: elt.outerHeight()
	});

	showHide.css({
		// Put the show/hide control at 1 higher z-index
		'z-index': (z + 2).toString(),
		// Move the control over to the right
		'margin-left': parseInt(getElementWidth(elt)) - parseInt(getElementWidth(showHide))
	});

	// Style the background if the comment area
	// doesn't have a style explicitly set
	var bgc = elt.css("background-color");

	if (bgc === "rgba(0, 0, 0, 0)" || bgc === "hsla(0, 0, 0, 0)" || bgc === "transparent") {
		// Default if we don't find a background to use
		bgc = "#fff";

		var parents = elt.parents();
		for (var i = 0 ; i < parents.length ; i++) {
			elti = $(parents[i]);

			bgci = elti.css("background-color");
			if (bgci !== "rgba(0, 0, 0, 0)" && bgci !== "hsla(0, 0, 0, 0)" && bgci !== "transparent") {
				bgc = bgci;
				break;
			}
		}
	}

	// If the background has an alpha value specified, 
	// set it to 1.0 (fully opaque)
	if (startsWith(bgc, "rgba") || startsWith(bgc, "hsla")) {
		bgc = bgc.replace(/\d\.\d+\)$/, "1.0)");
	}

	// Finally, set the cover background
	cover.css("background-color", bgc);

	// Style the show/hide control
	styleShowHide(elt, showHide, element_id, ct);
}

function styleShowHide(elt, showHideElt, element_id, ct) {
	var bad_ratio;

	if (typeof elt.attr("__drtc_ratio") !== 'undefined') {
		bad_ratio = elt.attr("__drtc_ratio");
	}
	else {
		// Get the words into an array
		var num_words = 0;

		var text = elt.text()
			.split(/\W+/)
			// The filter throws out empty strings
			.filter(Boolean)
			// lowercase
			.map(function(value) {
				// Count words while we're at it
				num_words++;
				return value.toLowerCase();
			})
			// join back into a string with spaces
			.join(" ");

		// How many of these are bad words?
		var num_bad = 0;
		for (bw of bad_words) {
			if (bw === "") {
				continue;
			}
			if (text.indexOf(bw) != -1) {
				var re = new RegExp(bw,"g");
				var count = (text.match(re) || []).length;
				num_bad += bw.split(" ").length * count;
			}
		}

		bad_ratio = num_bad/num_words;
		elt.attr("__drtc_ratio", bad_ratio);
	}

	color = getShowHideColor(bad_ratio);
	showHideElt.css({
		background: color,
	});

	showHideElt.off("click").on("click", showHide);

	shown = false;

	// Keep track of the show/hide status of this element
	if(typeof showEltId[element_id] === 'undefined') {
		showEltId.push(shown);

		// Show or hide based on comment threshold or previous setting
		if (bad_ratio < ct) {
			showHideElt.trigger("click");
		}
	}
	else if (showEltId[element_id]) {
		showHideElt.trigger("click");
	}
}

color_map = {
			0.2 : "#f00",
			0.1 : "orangered",
			0.0001 : "yellow",
			0 : "#bbb"};
ratios = [0.2, 0.1, 0.00001, 0];

function getShowHideColor(ratio) {
	for (var r of ratios) {
		if (ratio >= r) {
			return color_map[r];
		}
	}
}

function showHide() {
	var id = parseInt($(this).attr("__drtc_id"));
	var cover = $(this).siblings(".__drtc_cover");
	cover.toggle();

	// Update text and track show/hide status of this element
	if (cover.css("display") == 'none') {
		$(this).html(hideText);
		showEltId[id] = true;
	}
	else {
		$(this).html(showText);
		showEltId[id] = false;
	}
}

var siteProfile = undefined;
var profiles;

var refreshIntervalElementFound = 5; // seconds
var refreshIntervalNothingFound = 1;

var drtcTimeout;

function drtcRun() {
	var refreshInterval;

	// Delete all DRTC cover elements before running again
	$(".__drtc_area").remove();

	if (siteProfile["mode"] === "all") {
		section_selector = getSectionSelector();
		if (hideCommentSection(section_selector)) {
			refreshInterval = refreshIntervalElementFound;
		}
		else {
			refreshInterval = refreshIntervalNothingFound;
		}
	}
	else if (siteProfile["mode"] === "individual") {
		comment_selector = getCommentSelector();
		if (hideComments(comment_selector)) {
			refreshInterval = refreshIntervalElementFound;
		} else {
			refreshInterval = refreshIntervalNothingFound;
		}
	}

	// Run this function again periodically
	drtcTimeout = setTimeout(drtcRun, refreshInterval*1000);
}

function drtcHide() {
	$(".__drtc_area").remove();
}

$(document).ready(function() {
	// Load profile and template data
	Browser.getContentScriptData(function(data) {
		var profiles = data["profiles"];
		var templates = data["templates"];
		comment_threshold = data["comment_threshold"]/20;
		var custom_words = data["custom_words"];
		var word_lists_enabled = data["word_lists_enabled"];

		var profanity_words = data["profanity"];
		var obscenity_words = data["obscenity"];
		var bigotry_words = data["bigotry"];

		Browser.getTabUrl(function(response) {
			var uri = parseUri(response);
			var domain = uri.authority;
			// Trim off the www from the front
			domain = domain.replace(/^www\./, "");


			for (p of profiles) {
				if (Browser.domainMatch(domain, p["domain"])) {
					siteProfile = p;
					break;
				}
			}

			if (siteProfile && siteProfile["template"] !== "") {
				for (t of templates) {
					if (t["system"] === siteProfile["template"]) {
						siteProfile["section_selector"] = t["section_selector"];
						siteProfile["comment_selector"] = t["comment_selector"];
						break;
					}
				}
			}

			if (shouldRun()) {
				// Build bad word list
				bad_words = custom_words;

				if (word_lists_enabled["profanity"]) {
					bad_words = bad_words.concat(profanity_words);
				}
				if (word_lists_enabled["obscenity"]) {
					bad_words = bad_words.concat(obscenity_words);
				}
				if (word_lists_enabled["bigotry"]) {
					bad_words = bad_words.concat(bigotry_words);
				}

				// Message the background page to show the page action
				Browser.pageActionEnabled();

				// Location change handler
				self.port.on("hide", drtcHide);

				// Run all the DRTC code
				drtcRun();
			}
			else {
				Browser.pageActionDisabled();
			}
		});
	});
});
