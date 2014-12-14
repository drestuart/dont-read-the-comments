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

function getCommentsSelector() {
	return siteProfile["section_selector"];
}

showText = "Show &#8595;";
hideText = "Hide &#8593;";

coverHTML = "<div id='__drtc_area'>" +
				"<div class='__drtc_showhide'>" + showText + "</div>" +
				"<div id='__drtc_cover'></div>" +
			"</div>";

function hideComments(comments_selector) {
	var c_elt = $(comments_selector);

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

	// Add our div to the page
	$("body").append(coverHTML);

	// Style and position our cover div
	$("#__drtc_area").css({
		'z-index': (z + 1).toString(),
		left: pos.left,
		top: pos.top,
		height: c_elt.css("height")
	});

	$("#__drtc_cover").css(css_obj);
	$("#__drtc_cover").css({
		top: - getElementHeight($(".__drtc_showhide"))
	});

	// Put the show/hide control at 1 higher z-index
	$(".__drtc_showhide").css({'z-index': (z + 2).toString()});

	// Style the background if the comment area
	// doesn't have a style explicitly set
	if (c_elt.css("background-color") === "rgba(0, 0, 0, 0)") {
		// Default if we don't find a background to use
		$("#__drtc_cover").css("background-color", "#fff");

		var parents = c_elt.parents();
		for (var i = 0 ; i < parents.length ; i++) {
			elt = $(parents[i]);

			var bgc = elt.css("background-color");
			if (bgc !== "rgba(0, 0, 0, 0)") {
				$("#__drtc_cover").css("background-color", bgc);
				break;
			}
		}
	}

	// Style the show/hide control
	styleShowHide(c_elt);
}

function styleShowHide(c_elt) {
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
	$(".__drtc_showhide").css({
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
	$("#__drtc_cover").toggle();

	if ($("#__drtc_cover").css("display") == 'none') {
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
			section_selector = getCommentsSelector();
			hideComments(section_selector);

			$(".__drtc_showhide").off("click").on("click", showHide);
		}
		else {

		}
	});
});
