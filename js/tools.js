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
