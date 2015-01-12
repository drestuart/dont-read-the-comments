function loadStartingData() {
	var fresh_data = {};

	// Load up default website profiles
	var profiles = [
		{"domain": "youtube.com", "mode": "all", "section_selector": "#watch-discussion", "comment_selector": ".ve.oba.HPa, .Ik.Wv", "template": ""},
		{"domain": "npr.org", "mode": "all", "section_selector": "", "comment_selector": "", "template": "Disqus"},
		{"domain": "foxnews.com", "mode": "all", "section_selector": "", "comment_selector": "", "template": "Livefyre"},
		{"domain": "yahoo.com", "mode": "all", "section_selector": "div.all-comments", "comment_selector": "li.comment", "template": ""},
		{"domain": "independent.co.uk", "mode": "all", "section_selector": "div.comment-container", "comment_selector": "div.gig-comment", "template": ""},
		{"domain": "dailykos.com", "mode": "all", "section_selector": "#rateAllForm > ul", "comment_selector": "#rateAllForm > ul li", "template": ""},
		{"domain": "aol.com", "mode": "all", "section_selector": "#aol-comments", "comment_selector": "div.comment", "template": ""},
		{"domain": "knowyourmeme.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": ""},
	];

	var templates = [
		{"system": "Disqus", "section_selector": "#dsq-2", "comment_selector": "div.post-content"},
		{"system": "Facebook", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb"},
		{"system": "Livefyre", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper"}
	];

	var custom_words = [];

	var word_lists_enabled = {
		"profanity": true,
		"obscenity": true,
		"bigotry": true
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