function loadStartingData() {
	var fresh_data = {};

	// Load up default website profiles
	var profiles = [
		{"domain": "youtube.com", "mode": "all", "section_selector": "#watch-discussion", "comment_selector": ".ve .oba .HPa, .Ik .Wv", "template": ""},
		{"domain": "drestuart.pythonanywhere.com", "mode": "all", "section_selector": "#comments", "comment_selector": "div.comment", "template": ""},
		{"domain": "npr.org", "mode": "all", "section_selector" : "#commentBlock", "comment_selector" : "", "template": ""},
		{"domain": "foxnews.com", "mode": "all", "section_selector" : "#commenting", "comment_selector" : ".fyre-comment-wrapper", "template": ""},
		// {"domain": "", "mode": "", "section_selector" : "", "comment_selector" : "", "template": ""},
		// {"domain": "", "mode": "", "section_selector" : "", "comment_selector" : "", "template": ""},
		// {"domain": "", "mode": "", "section_selector" : "", "comment_selector" : "", "template": ""},
		// {"domain": "", "mode": "", "section_selector" : "", "comment_selector" : "", "template": ""},
		// Comment system iframes
		{"domain": "disqus.com", "mode": "individual", "section_selector" : "", "comment_selector" : "div.post-content", "template": ""}
	];

	var templates = [
		{"system": "Disqus", "section_selector": "#dq_comments", "comment_selector": ".dq_comment"},
		{"system": "Facebook", "section_selector": "#fb_comments", "comment_selector": ".fb_comment"}
	];

	var custom_words = [];

	var word_lists_enabled = {
		"profanity" : true,
		"obscenity" : true,
		"bigotry" : true
	};

	fresh_data.profiles = profiles;
	fresh_data.templates = templates;
	fresh_data.comment_threshold = 0;
	fresh_data.custom_words = custom_words;
	fresh_data.word_lists_enabled = word_lists_enabled;

	chrome.storage.sync.set(fresh_data, 
    	function() {
            console.log("Installed fresh data");
    	}
    );
}