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
				"<a id='__drtc_showhide' href='javascript:void(0)'>" + showText + "</a>" +
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
	$("#__drtc_area").css({
		'z-index': (z + 1).toString(),
		left: pos.left,
		top: parseInt(pos.top) - parseInt($("#__drtc_showhide").css("height")),
	});
	$("#__drtc_cover").css(css_obj);
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
	// alert(window.location.href);
	var hideByDefault = true;
	comments_selector = getCommentsSelector();
	hideComments(comments_selector);

	$("#__drtc_showhide").off("click").on("click", showHide);

	if (!hideByDefault) {
		$("#__drtc_showhide").trigger("click");
	}
	// $("div").css("font-weight", "bold").css("color", "red");	
}
