Tools = {};

Tools.mergeProfiles = function(existing, new_profiles, overwrite_category) {

	if (typeof overwrite_category === 'undefined') {
		overwrite_category = true;
	}

	for (newprof of new_profiles) {
		// Set the default mode
		newprof.mode = "all";
		var overwrote = false;
		for (var i = 0; i < existing.length; i++) {
			prof = existing[i];

			// Overwrite matching domains with the imported data
			if (prof.domain === newprof.domain) {
				if (typeof prof.mode !== 'undefined') {
					// Keep the existing 'mode' field
					newprof.mode = prof.mode;
				}

				// Keep the existing category?
				if (!overwrite_category || newprof.category === '') {
					newprof.category = prof.category;
				}

				existing[i] = newprof;
				overwrote = true;
				break;
			}
		}

		// If this is a new domain
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
	if (profile.template === 'none') {
		profile.template = '';
	}
	delete profile.mode;
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


