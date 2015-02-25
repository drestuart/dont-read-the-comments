Tools = {};

Tools.cleanProfile = function(profile) {
	if (profile['template'] === 'none') {
		profile['template'] = '';
	}
	return profile;
}

Tools.exportProfile = function(profile) {
	profile = Tools.cleanProfile(profile);

	return JSON.stringify(profile)
		.replace(/:/g, ": ")
		.replace(/,/g, ", ");
}

Tools.exportProfiles = function(profiles) {
	for (var profile of profiles) {
		profile = Tools.cleanProfile(profile);
	}

	return JSON.stringify(profiles)
		.replace(/:/g, ": ")
		.replace(/,/g, ", ");
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function startsWith(str, prefix) {
	return str.indexOf(prefix) === 0;
}

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
