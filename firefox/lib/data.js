var DataStore = {};
var self = require("sdk/self");
var data = self.data;
var storage = require("sdk/simple-storage").storage;

var fields = ["profiles", "templates", "word_lists_enabled",
	"comment_threshold", "custom_words"];

// Data fields
DataStore.profiles = null;
DataStore.templates = null;
DataStore.categories = null;
DataStore.comment_threshold = 0;
DataStore.custom_words = null;
DataStore.word_lists_enabled = null;

DataStore.lastSyncTime = null;
syncInterval = 300000; // 5 minutes in ms

DataStore.loadData = function() {
	if (DataStore.profiles === null ||
		// Check sync timer
		(Date.now() - DataStore.lastSyncTime > syncInterval)) {

		// Load data from storage
		DataStore.profiles = storage.profiles;
		DataStore.templates = storage.templates;
		DataStore.comment_threshold = storage.comment_threshold;
		DataStore.custom_words = storage.custom_words;
		DataStore.word_lists_enabled = storage.word_lists_enabled;
		DataStore.categories = DataStore.getCategories(DataStore.profiles);

		// Load bad word lists
		DataStore.profanity = JSON.parse(data.load('bad_words/profanity.json'));
		DataStore.obscenity = JSON.parse(data.load('bad_words/obscenity.json'));
		DataStore.bigotry = JSON.parse(data.load('bad_words/bigotry.json'));

		// Set sync timer
		DataStore.lastSyncTime = Date.now();

		return DataStore;
	}
	else {
		return DataStore;
	}
}

DataStore.save = function(data) {
	for (var field of fields) {
		if (typeof data[field] !== 'undefined') {
			storage[field] = data[field];
			DataStore[field] = data[field];

			// Build categories list
			if (field === "profiles") {
				storage["categories"] = DataStore.getCategories(data[field]);
			}
		}
	}
	// Reset sync timer
	DataStore.lastSyncTime = null;
}

DataStore.getTemplateData = function() {
	return storage.templates;
}

DataStore.mergeProfiles = function(existing, new_profiles, overwrite_category) {

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
			if (prof["domain"] === newprof["domain"]) {
				if (typeof prof.mode !== 'undefined') {
					// Keep the existing 'mode' field
					newprof['mode'] = prof['mode'];
				}

				// Keep the existing category?
				if (!overwrite_category || newprof['category'] === '') {
					newprof['category'] = prof['category'];
				}

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

DataStore.getCategories = function(profiles) {
	var categories = [];

	for (var profile of profiles) {
		if (categories.indexOf(profile["category"]) === -1) {
			categories.push(profile["category"]);
		}
	}

	return categories;
}

// Export for Firefox
exports.DataStore = DataStore;

