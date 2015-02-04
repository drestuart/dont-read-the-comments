Tools = {};

Tools.cleanProfile = function(profile) {
	if (profile['template'] !== '') {
		delete profile['section_selector'];
		delete profile['comment_selector'];
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

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
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
