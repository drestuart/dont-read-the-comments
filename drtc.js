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

function hideComments(comments_selector) {
	var comments_elt = $(comments_selector);
}

if (shouldRun()) {
	// alert(window.location.href);

	var comments_selector = getCommentsSelector();
	hideComments(comments_selector);
	// $("div").css("font-weight", "bold").css("color", "red");	
}
