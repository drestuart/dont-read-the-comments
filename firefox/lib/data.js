var DataStore = {};
var self = require("sdk/self");
var storage = require("sdk/simple-storage").storage;

storage.profiles = [
		{
			"domain": "youtube.com", 
			"mode": "all", 
			"section_selector": "#watch-discussion", 
			"comment_selector": ".ve.oba.HPa, .Ik.Wv", 
			"template": ""
		}
	];
storage.templates = [
		{"system": "Disqus", "section_selector": "#dsq-2", "comment_selector": "div.post-content"}
	];

DataStore.getPageActionData = function() {
	var retData = {};

	retData.profiles = storage.profiles;
	retData.templates = storage.templates;

	return retData;
}

// Export for Firefox
exports.DataStore = DataStore;

