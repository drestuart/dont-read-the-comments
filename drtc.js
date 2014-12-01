function getElementHeight(elt) {
	return $(elt).outerHeight(true);
}

function shouldRun() {
	var goodDomains = ["", "stackoverflow.com"];

	var uriobj = parseUri(window.location.href);
	var domain = uriobj.authority;

	for (gd of goodDomains) {
		if (domain == gd) {
			return true;
		}
	}
	return false;
}

function getCommentsSelector() {
	return "#comments";
}

showText = "Show &#8595;";
hideText = "Hide &#8593;";

coverHTML = "<div id='__drtc_area'>" +
				"<div class='__drtc_showhide'>" + showText + "</div>" +
				"<div id='__drtc_cover'>" +
				"</div>" +
			"</div>";

function hideComments(comments_selector) {
	var c_elt = $(comments_selector);

	// Get some parameters from the comments block
	var properties = ["background", "width", "height",
		"margin", "border", "padding"];
	var z = parseInt(c_elt.css("z-index"));
	var pos = c_elt.offset();
	var css_obj = {};

	// Fill in styles to impersonate
	for (p of properties) {
		css_obj[p] = c_elt.css(p);
	}

	// Add our div to the page
	$("body").append(coverHTML);

	// Style and position our cover div
	var top = parseInt(pos.top) - getElementHeight(".__drtc_showhide");

	$("#__drtc_area").css({
		'z-index': (z + 1).toString(),
		left: pos.left,
		top: top
	});
	$("#__drtc_cover").css(css_obj);

	// Style the background if the comment area
	// doesn't have a style explicitly set
	if (c_elt.css("background-color") === "rgba(0, 0, 0, 0)") {
		$("#__drtc_cover").css("background-color", "#fff");
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
	$(".__drtc_showhide").css("background", color);
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

if (shouldRun()) {
	var hideByDefault = true;
	comments_selector = getCommentsSelector();
	hideComments(comments_selector);

	$(".__drtc_showhide").off("click").on("click", showHide);

	if (!hideByDefault) {
		$(".__drtc_showhide").trigger("click");
	}
}
