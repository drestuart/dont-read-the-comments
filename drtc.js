String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function getElementHeight(elt, margin) {
	if (typeof margin === 'undefined') {
		margin = false;
	}
	return $(elt).outerHeight(margin);
}

function getElementWidth(elt, margin) {
	if (typeof margin === 'undefined') {
		margin = false;
	}
	return $(elt).outerWidth(margin);
}

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

showText = "Show &#8595;";
hideText = "Hide &#8593;";

coverHTML = "<div class='__drtc_area' id='__drtc_area%id%'>" +
				"<div class='__drtc_showhide' __drtc_id='%id%'>" + showText + "</div>" +
				"<div class='__drtc_cover' id='__drtc_cover%id%'></div>" +
			"</div>";
id = 0;
showEltId = [];

function hideComments(comment_selector) {
	var comments = $(comment_selector);

	// If the element we want isn't present on the page, do nothing
	if (comments.length === 0) {
		console.log("No comments found");
		return;
	}

	comments.each(function(index, elt) {
		hideElement($(elt), comment_threshold);
	});
}

function hideCommentSection(section_selector) {
	var section = $(section_selector);

	// If the element we want isn't present on the page, do nothing
	if (section.length === 0) {
		console.log("No comment section found");
		return;
	}

	hideElement(section);
}

function hideElement(elt, ct) {
	if (typeof(ct) === 'undefined') {
		ct = 0;
	}

	var css_obj = {};

	// Get some parameters from the comments block
	var properties = ["background", "width", "height",
		"margin", "border"];
	var pos = elt.offset();
	var z = parseInt(elt.css("z-index"));
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
		height: elt.css("height")
	});

	// Get some of the children
	var cover = drtcArea.find(".__drtc_cover");
	var showHide = drtcArea.find(".__drtc_showhide");

	cover.css(css_obj);
	cover.css({
		top: - getElementHeight(showHide)
	});

	showHide.css({
		// Put the show/hide control at 1 higher z-index
		'z-index': (z + 2).toString(),
		// Move the control over to the right
		'margin-left': parseInt(getElementWidth(elt)) - parseInt(getElementWidth(showHide))
	});

	// Style the background if the comment area
	// doesn't have a style explicitly set
	if (elt.css("background-color") === "rgba(0, 0, 0, 0)") {
		// Default if we don't find a background to use
		cover.css("background-color", "#fff");

		var parents = elt.parents();
		for (var i = 0 ; i < parents.length ; i++) {
			elt = $(parents[i]);

			var bgc = elt.css("background-color");
			if (bgc !== "rgba(0, 0, 0, 0)") {
				cover.css("background-color", bgc);
				break;
			}
		}
	}

	// Style the show/hide control
	styleShowHide(elt, showHide, element_id, ct);
}

function styleShowHide(elt, showHideElt, element_id, ct) {
	// Get the words into an array
	var num_words = 0;
	shown = false;

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
		if (text.indexOf(bw) != -1) {
			var re = new RegExp('\\b' + bw + '\\b',"g");
			var count = (text.match(re) || []).length;
			num_bad += bw.split(" ").length * count;
		}
	}

	var bad_ratio = num_bad/num_words;

	color = getShowHideColor(bad_ratio);
	showHideElt.css({
		background: color,
	});

	showHideElt.off("click").on("click", showHide);

	// Show or hide based on comment threshold or previous setting
	if (bad_ratio < ct || showEltId[element_id]) {
		showHideElt.trigger("click");
		shown = true;
	}

	// Keep track of the show/hide status of this element
	if(typeof showEltId[element_id] !== 'undefined') {
		showEltId[element_id] = shown;
	}
	else {
		showEltId.push(shown);
	}
}

color_map = {
			0.4 : "#f00",
			0.2 : "orange",
			0 : "#bbb"};
ratios = [0.4, 0.2, 0];

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

	// TODO: The __drtc_area element is still blocking the stuff underneath it

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

var siteProfile;
var profiles;
var refreshInterval = 1000;

function drtcRun() {
	// Delete all DRTC cover elements before running again
	$(".__drtc_area").remove();

	if (shouldRun()) {
		// Message the background page to show the page action
		chrome.runtime.sendMessage("pageActionEnabled");

		if (siteProfile["mode"] === "all") {
			section_selector = getSectionSelector();
			hideCommentSection(section_selector);
		}
		else if (siteProfile["mode"] === "individual") {
			comment_selector = getCommentSelector();
			hideComments(comment_selector);
		}
	}
	else {
		chrome.runtime.sendMessage("pageActionDisabled");
	}
}

$(document).ready(function() {
	// Load profile and template data

	console.log("Getting data");
	chrome.storage.sync.get(["profiles", "comment_threshold"], function(data) {
		profiles = data["profiles"];
		comment_threshold = data["comment_threshold"]/10;

		var domain = parseUri(window.location.href).authority;

		for (p of profiles) {
			// Check if the profile's domain has a glob in it
			if (p["domain"].indexOf('*') !== -1) {
				// Build it into a regex
				p["domain"] = p["domain"].replace(/\*/g, '[\\w\.-]*')  + '$';

				console.log("Matching " + p["domain"] + " against " + domain);

				if (domain.match(p["domain"])) {
					siteProfile = p;
					break;
				}
			}
			else {
				if (domain.endsWith(p["domain"])) {
					siteProfile = p;
					break;
				}
			}
		}

		// Add a listener for the page action
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				console.log(request);
				if (request === "getSiteProfile") {
					console.log("Returning site profile")
					sendMessage(siteProfile);
				}
			}
		);

		// Run all the DRTC code
		drtcRun();

		// Run it again periodically
		setInterval(drtcRun, refreshInterval);
	});
});
