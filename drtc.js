String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function getElementHeight(elt) {
	return $(elt).outerHeight(true);
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
				"<div class='__drtc_showhide'>" + showText + "</div>" +
				"<div class='__drtc_cover' id='__drtc_cover%id%'></div>" +
			"</div>";
coversAdded = 0;

function hideCommentSection(section_selector) {
	var c_elt = $(section_selector);

	// If the element we want isn't present on the page, do nothing
	if (c_elt.length === 0) {
		console.log("No comment element found");
		return;
	}

	// Get some parameters from the comments block
	var properties = ["background", "width", "height",
		"margin", "border", "padding"];
	var z = parseInt(c_elt.css("z-index"));
	var pos = c_elt.offset();
	var css_obj = {};

	if (isNaN(z)) {
		z = 0;
	}

	// Fill in styles to impersonate
	for (p of properties) {
		css_obj[p] = c_elt.css(p);
	}

	// Put the area number into the html
	var drtcArea = $(coverHTML.replace("%id%", coversAdded.toString()));

	// Add our div to the page
	$("body").append(drtcArea);

	// Style and position our area div
	$(drtcArea).css({
		'z-index': (z + 1).toString(),
		left: pos.left,
		top: pos.top,
		height: c_elt.css("height")
	});

	// Get some of the children
	var cover = drtcArea.find(".__drtc_cover");
	var showHide = drtcArea.find(".__drtc_showhide");

	cover.css(css_obj);
	cover.css({
		top: - getElementHeight(showHide)
	});

	// Put the show/hide control at 1 higher z-index
	showHide.css({'z-index': (z + 2).toString()});

	// Style the background if the comment area
	// doesn't have a style explicitly set
	if (c_elt.css("background-color") === "rgba(0, 0, 0, 0)") {
		// Default if we don't find a background to use
		cover.css("background-color", "#fff");

		var parents = c_elt.parents();
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
	styleShowHide(c_elt, showHide);

	coversAdded++;
}

function hideComments(comment_selector) {

}

function styleShowHide(c_elt, showHideElt) {
	// Get the words into an array
	var num_words = 0;

	var text = c_elt.text()
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
	var cover = $(this).siblings(".__drtc_cover");
	cover.toggle();

	if (cover.css("display") == 'none') {
		$(this).html(hideText);
	}
	else {
		$(this).html(showText);
	}
}


var siteProfile;

$(document).ready(function() {
	var profiles;

	console.log("Getting profiles");
	chrome.storage.sync.get("profiles", function(data) {
		profiles = data["profiles"];

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

		if (shouldRun()) {
			if (siteProfile["mode"] === "all") {
				section_selector = getSectionSelector();
				hideCommentSection(section_selector);
			}
			else if (siteProfile["mode"] === "individual") {
				comment_selector = getCommentSelector();
				hideComments(comment_selector);
			}

			$(".__drtc_showhide").off("click").on("click", showHide);
		}
		else {

		}
	});
});
