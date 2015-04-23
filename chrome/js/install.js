// Starting data
var starting_profiles;
var starting_templates;
var starting_custom_words = [];
var starting_word_lists_enabled = {
	"profanity": true,
	"obscenity": true,
	"bigotry": true
};

function loadJSONFile(file, func) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			data = JSON.parse(xhr.responseText);
			func(data);
		}
	};
	xhr.open("GET", chrome.extension.getURL(file), true);
	xhr.send();
}

function loadData(func) {
	// Load JSON files
	loadJSONFile('data/starting_profiles.json', function(prof_data) {
		starting_profiles = prof_data;

		loadJSONFile('data/starting_templates.json', function(temp_data) {
			starting_templates = temp_data;

			func();
		});
	});
}

function loadStartingData() {
	loadData(function() {
		console.log("Loading starting data");
		var fresh_data = {};

		fresh_data.profiles = starting_profiles;
		fresh_data.templates = starting_templates;
		fresh_data.comment_threshold = 0;
		fresh_data.custom_words = starting_custom_words;
		fresh_data.word_lists_enabled = starting_word_lists_enabled;

		Data.saveData(fresh_data, function() {});
	});
}

function importStartingData(overwrite_category, func) {
	console.log("Importing starting data");

	loadData(function() {
		// Get current data
		Data.loadData(function(data) {

			if (typeof data !== 'undefined') {
				var existing_profiles = data["profiles"];
				var existing_templates = data["templates"];
				var existing_word_lists_enabled = data["word_lists_enabled"];
			}
			else {
				var existing_profiles = [];
				var existing_templates = [];
				var existing_word_lists_enabled = [];
			}
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
			Data.saveData(save_data, function() {
				if (typeof func !== 'undefined') {
					func();
				}
			});
		});
	});
}


