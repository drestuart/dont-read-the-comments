function loadStartingData() {
	var fresh_data = {};

	// Load up default website profiles
	var profiles = [
		{"domain": "youtube.com", "mode": "all", "section_selector": "#comments", "comment_selector": ""},
		{"domain": "", "mode": "all", "section_selector": "#comments", "comment_selector": ""}
	];

	var templates = [
		{"system": "Disqus", "section_selector": "#dq_comments", "comment_selector": ".dq_comment"},
		{"system": "Facebook", "section_selector": "#fb_comments", "comment_selector": ".fb_comment"}
	];

	fresh_data.profiles = profiles;
	fresh_data.templates = templates;

	chrome.storage.sync.set(fresh_data, 
    function() {
            console.log("Installed fresh data");
    });
}