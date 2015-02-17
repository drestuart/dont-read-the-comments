var DataStore = {};
var self = require("sdk/self");
var data = self.data;
var storage = require("sdk/simple-storage").storage;

var fields = ["profiles", "templates", "word_lists_enabled",
	"comment_threshold", "custom_words"];

DataStore.getPageActionData = function() {
	var retData = {};

	retData.profiles = storage.profiles;
	retData.templates = storage.templates;

	return retData;
}

DataStore.getBackgroundPageData = function() {
	var retData = {};

	retData.profiles = storage.profiles;
	retData.templates = storage.templates;
	retData.word_lists_enabled = storage.word_lists_enabled;

	return retData;
}

DataStore.getOptionsPageData = function() {
	var retData = {};

	retData.profiles = storage.profiles;
	retData.templates = storage.templates;
	retData.comment_threshold = storage.comment_threshold;
	retData.custom_words = storage.custom_words;
	retData.word_lists_enabled = storage.word_lists_enabled;

	retData.profanity = JSON.parse(data.load('bad_words/profanity.json'));
	retData.obscenity = JSON.parse(data.load('bad_words/obscenity.json'));
	retData.bigotry = JSON.parse(data.load('bad_words/bigotry.json'));

	return retData;
}

DataStore.getContentScriptData = function() {
	var retData = {};

	retData.profiles = storage.profiles;
	retData.templates = storage.templates;
	retData.comment_threshold = storage.comment_threshold;
	retData.custom_words = storage.custom_words;
	retData.word_lists_enabled = storage.word_lists_enabled;

	retData.profanity = JSON.parse(data.load('bad_words/profanity.json'));
	retData.obscenity = JSON.parse(data.load('bad_words/obscenity.json'));
	retData.bigotry = JSON.parse(data.load('bad_words/bigotry.json'));

	return retData;
}

DataStore.mergeProfiles = function(existing, new_profiles) {

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

DataStore.mergeTemplates = function(existing, new_templates) {

	for (newtemp of new_templates) {
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

DataStore.importProfiles = function(profile_data) {
	var existing = profile_data.existing;
	var new_profiles = profile_data.importing;

	var merged = DataStore.mergeProfiles(existing, new_profiles);

	DataStore.save({profiles: merged});
}

DataStore.importTemplates = function(template_data) {
	var existing = template_data.existing;
	var new_templates = template_data.importing;

	var merged = DataStore.mergeTemplates(existing, new_templates);

	DataStore.save({templates: merged});
}

DataStore.save = function(data) {
	for (var field of fields) {
		if (typeof data[field] !== 'undefined') {
			storage[field] = data[field];
		}
	}
}

// Export for Firefox
exports.DataStore = DataStore;

