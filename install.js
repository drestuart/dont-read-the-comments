function loadStartingData() {
	var fresh_data = {};

	// Load up default website profiles
	var profiles = [
		{"domain": "youtube.com", "mode": "all", "section_selector": "#comments", "comment_selector": ""},
		{"domain": "", "mode": "all", "section_selector": "#comments", "comment_selector": ""}
	];

	var templates = [
		{"system": "Disqus", "section_selector": "#comments", "comment_selector": ""},
		{"system": "Facebook", "section_selector": "#comments", "comment_selector": ""}
	];

	fresh_data.profiles = profiles;
	fresh_data.templates = templates;

	chrome.storage.sync.set(fresh_data, 
    function() {
            console.log("Installed fresh data");
    });
}