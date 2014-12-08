function loadStartingData() {
	var fresh_data = {"awesome_data" : "awesome by default"};

	// Load up default website profiles
	var profiles = [
		{"domain": "youtube.com", "mode": "all", "section_selector": "#comments", "comment_selector": ""},
		{"domain": "", "mode": "all", "section_selector": "#comments", "comment_selector": ""}
	];

	var templates = [
		{"system": "Disqus", "mode": "all", "section_selector": "#comments", "comment_selector": ""},
		{"system": "Facebook", "mode": "all", "section_selector": "#comments", "comment_selector": ""}
	];

	fresh_data.profiles = profiles;
	fresh_data.templates = templates;

	chrome.storage.sync.set(fresh_data, 
    function() {
            console.log("Installed fresh data");
    });
}