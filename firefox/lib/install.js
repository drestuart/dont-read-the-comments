var DataStore = require("data").DataStore;
var self = require("sdk/self");
var data = self.data;

// Starting data
var starting_profiles = JSON.parse(data.load('starting_profiles.json'));
var starting_templates = JSON.parse(data.load('starting_templates.json'));

var starting_custom_words = [];

var starting_word_lists_enabled = {
	"profanity": true,
	"obscenity": true,
	"bigotry": true
};

function loadStartingData() {
	var fresh_data = {};

	fresh_data.profiles = starting_profiles;
	fresh_data.templates = starting_templates;
	fresh_data.comment_threshold = 0;
	fresh_data.custom_words = starting_custom_words;
	fresh_data.word_lists_enabled = starting_word_lists_enabled;

	DataStore.save(fresh_data);
}

function importStartingData() {
	// Get current data
	var data = DataStore.getBackgroundPageData();

	var existing_profiles = data["profiles"];
	var existing_templates = data["templates"];
	var existing_word_lists_enabled = data["word_lists_enabled"];

	// Merge in starting data
	var save_data = {};
	save_data.profiles = DataStore.mergeProfiles(existing_profiles, starting_profiles);
	save_data.templates = DataStore.mergeTemplates(existing_templates, starting_templates);
	save_data.word_lists_enabled = {};

	for (var list in starting_word_lists_enabled) {
		var existing_val = existing_word_lists_enabled[list];
		if (typeof existing_val !== 'undefined') {
			save_data.word_lists_enabled[list] = existing_val;
		}
		else {
			save_data.word_lists_enabled = starting_word_lists_enabled[list];
		}
	}
	// Save data
	DataStore.save(save_data);
}

// Export for Firefox
exports.Install = {
	loadStartingData: loadStartingData,
	importStartingData: importStartingData
};

