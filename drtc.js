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

wrapHTML = "<div id='__drtc_wrap'></div>";

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
	$("body").append(wrapHTML);

	// Style and position our wrap div
	$("#__drtc_wrap").css({
		'z-index': (z + 1).toString(),
		left: pos.left,
		top: pos.top,
	});
	$("#__drtc_wrap").css(css_obj);
}

if (shouldRun()) {
	// alert(window.location.href);

	var comments_selector = getCommentsSelector();
	hideComments(comments_selector);
	// $("div").css("font-weight", "bold").css("color", "red");	
}
