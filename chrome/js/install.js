// Starting data
var starting_profiles;
var starting_templates;
var starting_custom_words = [];
var starting_word_lists_enabled = {
	"profanity": true,
	"obscenity": true,
	"bigotry": true
};

function loadData(func) {
	// Load JSON files
	Browser.loadJSONFile('data/starting_profiles.json', function(prof_data) {
		starting_profiles = prof_data;

		Browser.loadJSONFile('data/starting_templates.json', function(temp_data) {
			starting_templates = temp_data;

			func();
		});
	});
}

function loadStartingData() {
	loadData(function() {
		var fresh_data = {};

		fresh_data.profiles = starting_profiles;
		fresh_data.templates = starting_templates;
		fresh_data.comment_threshold = 0;
		fresh_data.custom_words = starting_custom_words;
		fresh_data.word_lists_enabled = starting_word_lists_enabled;

		Browser.save(fresh_data, function() {});
	});
}

function importStartingData(overwrite_category, func) {
	loadData(function() {
		// Get current data
		Browser.getBackgroundPageData(function(data) {

			var existing_profiles = data["profiles"];
			var existing_templates = data["templates"];
			var existing_word_lists_enabled = data["word_lists_enabled"];

			// Merge in starting data
			var save_data = {};

			save_data.profiles = Tools.mergeProfiles(existing_profiles, starting_profiles, overwrite_category);
			save_data.templates = Tools.mergeTemplates(existing_templates, starting_templates);
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
			Browser.save(save_data, function() {
				location.reload();
				if (typeof func !== 'undefined') {
					func();
				}
			});
		});
	});
}


