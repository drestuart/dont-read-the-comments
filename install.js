function loadStartingData() {
	var fresh_data = {};

	// Load up default website profiles
	var profiles = [
		{"domain": "youtube.com", "mode": "all", "section_selector": "#watch-discussion", "comment_selector": ".ve .oba .HPa, .Ik .Wv", "template": ""},
		{"domain": "drestuart.pythonanywhere.com", "mode": "all", "section_selector": "#comments", "comment_selector": "div.comment", "template": ""}
	];

	var templates = [
		{"system": "Disqus", "section_selector": "#dq_comments", "comment_selector": ".dq_comment"},
		{"system": "Facebook", "section_selector": "#fb_comments", "comment_selector": ".fb_comment"}
	];

	fresh_data.profiles = profiles;
	fresh_data.templates = templates;
	fresh_data.comment_threshold = 0;

	chrome.storage.sync.set(fresh_data, 
    	function() {
            console.log("Installed fresh data");
    	}
    );
}