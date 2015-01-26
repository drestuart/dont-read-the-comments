Tools = {};

Tools.mergeProfiles = function(existing, new_profiles) {

	for (newprof of new_profiles) {
		var overwrote = false;
		for (var i = 0; i < existing.length; i++) {
			prof = existing[i];

			// Overwrite matching domains with the imported data
			if (prof["domain"] === newprof["domain"]) {
				// Keep the existing 'mode' field
				newprof['mode'] = prof['mode'];
				existing[i] = newprof;
				overwrote = true;
				break;
			}
		}

		if (!overwrote) {
			existing.push(newprof);
		}
	}

	return existing;
}

Tools.mergeTemplates = function(existing, new_tempaltes) {

	for (newtemp of new_tempaltes) {
		var overwrote = false;
		for (var i = 0; i < existing.length; i++) {
			temp = existing[i];

			// Overwrite matching domains with the imported data
			if (temp["system"] === newtemp["system"]) {
				overwrote = true;
				existing[i] = newtemp;
				break;
			}
		}

		if (!overwrote) {
			existing.push(newtemp);
		}
	}

	return existing;
}

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
