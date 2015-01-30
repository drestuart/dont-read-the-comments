var DataStore = {};
var self = require("sdk/self");
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

DataStore.save = function(data) {
	for (var field of fields) {
		if (typeof data[field] !== 'undefined') {
			console.log("Saving " + field);
			storage[field] = data[field];
		}
		else {
			console.log("Not saving " + field);
		}
	}
}

// Export for Firefox
exports.DataStore = DataStore;

