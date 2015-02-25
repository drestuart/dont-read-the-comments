// Starting data
var starting_profiles = [
	{"domain": "youtube.com", "mode": "all", "section_selector": "#watch-discussion", "comment_selector": ".ve.oba.HPa,  .Ik.Wv", "template": ""},
	{"domain": "npr.org", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "foxnews.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre"},
	{"domain": "yahoo.com", "mode": "all", "section_selector": "div.all-comments", "comment_selector": "li.comment", "template": ""},
	{"domain": "independent.co.uk", "mode": "all", "section_selector": "div.comment-container", "comment_selector": "div.gig-comment", "template": ""},
	{"domain": "dailykos.com", "mode": "all", "section_selector": "#rateAllForm > ul", "comment_selector": "#rateAllForm > ul li", "template": ""},
	{"domain": "aol.com", "mode": "all", "section_selector": "#aol-comments", "comment_selector": "div.comment", "template": ""},
	{"domain": "knowyourmeme.com", "mode": "all", "section_selector": "div.fbFeedbackContent,   #comments", "comment_selector": "div.postContainer.fsl.fwb.fcb,   .comment.rel", "template": ""},
	{"domain": "vice.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook"},
	{"domain": "cbsnews.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre"},
	{"domain": "america.aljazeera.com", "mode": "all", "section_selector": "#commentsDiv", "comment_selector": ".gig-comments-comment", "template": ""},
	{"domain": "rawstory.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "metro.co.uk", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook"},
	{"domain": "dailymail.co.uk", "mode": "all", "section_selector": "#reader-comments", "comment_selector": ".comment", "template": ""},
	{"domain": "thedailybeast.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre"},
	{"domain": "mediaite.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "pbs.org", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "deadspin.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja"},
	{"domain": "gawker.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja"},
	{"domain": "jezebel.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja"},
	{"domain": "io9.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja"},
	{"domain": "gizmodo.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja"},
	{"domain": "jalopnik.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja"},
	{"domain": "kotaku.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja"},
	{"domain": "lifehacker.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja"},
	{"domain": "mlive.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre"},
	{"domain": "amazon.com", "mode": "all", "section_selector": "#revMH", "comment_selector": "#revMHRL > .a-section.celwidget", "template": ""},
	{"domain": "slashdot.org", "mode": "all", "section_selector": "#commentwrap", "comment_selector": ".cw", "template": ""},
	{"domain": "buzzfeed.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook"},
	{"domain": "blogspot.com", "mode": "all", "section_selector": "#Blog1_comments-block-wrapper", "comment_selector": ".comment-body", "template": ""},
	{"domain": "dailydot.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre"},
	{"domain": "vanityfair.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre"},
	{"domain": "motherjones.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "thehill.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "talkingpointsmemo.com", "mode": "all", "section_selector": "#comments", "comment_selector": "#comments div.clearfix", "template": ""},
	{"domain": "mediamatters.org", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "bloombergview.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "economist.com", "mode": "all", "section_selector": "#comments-area", "comment_selector": ".single-comment", "template": ""},
	{"domain": "washingtonpost.com", "mode": "all", "section_selector": "div.echo-streamserver-controls-stream", "comment_selector": "div.echo-streamserver-controls-stream-item-container", "template": ""},
	{"domain": "escapistmagazine.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook"},
	{"domain": "collegehumor.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook"},
	{"domain": "mashable.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre"},
	{"domain": "*.wikia.com", "mode": "all", "section_selector": "#article-comments", "comment_selector": "li.comment", "template": ""},
	{"domain": "diply.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook"},
	{"domain": "instructables.com", "mode": "all", "section_selector": "#comments", "comment_selector": "div.comment-entry", "template": ""},
	{"domain": "avclub.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "gamasutra.com", "mode": "all", "section_selector": "#dynamiccomments", "comment_selector": ".parentComment,   .replyComment", "template": ""},
	{"domain": "clientsfromhell.net", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "theatlantic.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus"},
	{"domain": "arstechnica.com", "mode": "all", "section_selector": "#comments-area", "comment_selector": ".comment", "template": ""},
	{"domain": "huffingtonpost.co*", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook"}
];

var starting_templates = [
	{"system": "Disqus", "section_selector": "#dsq-2", "comment_selector": "div.post-content"},
	{"system": "Facebook", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb"},
	{"system": "Livefyre", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper"},
	{"system": "Kinja", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply"}
];

var starting_custom_words = [];

var starting_word_lists_enabled = {
	"profanity": true,
	"obscenity": true,
	"bigotry": true
};

function loadStartingData() {
	var fresh_data = {};

	fresh_data.profiles = starting_profiles;
	fresh_data.templates = starting_templates;
	fresh_data.comment_threshold = 0;
	fresh_data.custom_words = starting_custom_words;
	fresh_data.word_lists_enabled = starting_word_lists_enabled;

	Browser.save(fresh_data, 
    	function() {
            console.log("Installed fresh data");
    	}
    );
}

function importStartingData() {
	// Get current data
	Browser.getBackgroundPageData(function(data) {

		var existing_profiles = data["profiles"];
		var existing_templates = data["templates"];
		var existing_word_lists_enabled = data["word_lists_enabled"];
		console.log(existing_profiles.length);

		// Merge in starting data
		var save_data = {};
		save_data.profiles = Tools.mergeProfiles(existing_profiles, starting_profiles);
		save_data.templates = Tools.mergeTemplates(existing_templates, starting_templates);
		save_data.word_lists_enabled = {};
		console.log(save_data.profiles.length);

		for (var list in starting_word_lists_enabled) {
			var existing_val = existing_word_lists_enabled[list];
			if (typeof existing_val !== 'undefined') {
				save_data.word_lists_enabled[list] = existing_val;
			}
			else {
				save_data.word_lists_enabled = starting_word_lists_enabled[list];
			}
		}
		console.log("Done!");
		// Save data
		Browser.save(save_data, function() {
			console.log("Import complete!");
		});
		location.reload();
	});
}


