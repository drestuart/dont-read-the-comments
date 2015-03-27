var DataStore = require("data").DataStore;

// Starting data
var starting_profiles = [
	{"domain": "motherjones.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "World News"},
	{"domain": "nymag.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre", "category": "World News"},
	{"domain": "pbs.org", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "World News"},
	{"domain": "thedailybeast.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre", "category": "World News"},
	{"domain": "dailymail.co.uk", "mode": "all", "section_selector": "#reader-comments", "comment_selector": ".comment", "template": "", "category": "World News"},
	{"domain": "metro.co.uk", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "World News"},
	{"domain": "washingtonpost.com", "mode": "all", "section_selector": "div.echo-streamserver-controls-stream", "comment_selector": "div.echo-streamserver-controls-stream-item-container", "template": "", "category": "World News"},
	{"domain": "america.aljazeera.com", "mode": "all", "section_selector": "#commentsDiv", "comment_selector": ".gig-comments-comment", "template": "", "category": "World News"},
	{"domain": "huffingtonpost.co*", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "World News"},
	{"domain": "theguardian.com", "mode": "all", "section_selector": ".discussion__main-comments.js-discussion-main-comments", "comment_selector": ".d-comment__inner,   .d-comment--response", "template": "", "category": "World News"},
	{"domain": "theatlantic.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "World News"},
	{"domain": "economist.com", "mode": "all", "section_selector": "#comments-area", "comment_selector": ".single-comment", "template": "", "category": "World News"},
	{"domain": "vice.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "World News"},
	{"domain": "yahoo.com", "mode": "all", "section_selector": "div.all-comments", "comment_selector": "li.comment", "template": "", "category": "World News"},
	{"domain": "stream.aljazeera.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "World News"},
	{"domain": "independent.co.uk", "mode": "all", "section_selector": "div.comment-container", "comment_selector": "div.gig-comment", "template": "", "category": "World News"},
	{"domain": "foxnews.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre", "category": "World News"},
	{"domain": "telegraph.co.uk", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "World News"},
	{"domain": "npr.org", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "World News"},
	{"domain": "vanityfair.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre", "category": "World News"},
	{"domain": "dailydot.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre", "category": "World News"},
	{"domain": "cbsnews.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre", "category": "World News"},
	{"domain": "aol.com", "mode": "all", "section_selector": "#aol-comments", "comment_selector": "div.comment", "template": "", "category": "World News"},
	{"domain": "mlive.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre", "category": "Local News"},
	{"domain": "talkingpointsmemo.com", "mode": "all", "section_selector": "#comments", "comment_selector": "#comments div.clearfix", "template": "", "category": "Politics"},
	{"domain": "rawstory.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "Politics"},
	{"domain": "mediaite.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "Politics"},
	{"domain": "thehill.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "Politics"},
	{"domain": "bloombergview.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "Politics"},
	{"domain": "dailykos.com", "mode": "all", "section_selector": "#rateAllForm > ul", "comment_selector": "#rateAllForm > ul li", "template": "", "category": "Politics"},
	{"domain": "thinkprogress.org", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "Politics"},
	{"domain": "mediamatters.org", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "Politics"},
	{"domain": "politico.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "Politics"},
	{"domain": "clientsfromhell.net", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "Entertainment"},
	{"domain": "gamasutra.com", "mode": "all", "section_selector": "#dynamiccomments", "comment_selector": ".parentComment,    .replyComment", "template": "", "category": "Entertainment"},
	{"domain": "escapistmagazine.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "Entertainment"},
	{"domain": "mashable.com", "mode": "all", "section_selector": ".fyre-widget", "comment_selector": ".fyre-comment-wrapper", "template": "Livefyre", "category": "Entertainment"},
	{"domain": "collegehumor.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "Entertainment"},
	{"domain": "avclub.com", "mode": "all", "section_selector": "#dsq-2", "comment_selector": "div.post-content", "template": "Disqus", "category": "Entertainment"},
	{"domain": "youtube.com", "mode": "all", "section_selector": "#watch-discussion", "comment_selector": ".ve.oba.HPa,   .Ik.Wv", "template": "", "category": "Entertainment"},
	{"domain": "knowyourmeme.com", "mode": "all", "section_selector": "div.fbFeedbackContent,    #comments", "comment_selector": "div.postContainer.fsl.fwb.fcb,    .comment.rel", "template": "", "category": "Entertainment"},
	{"domain": "fusion.net", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "Blogs"},
	{"domain": "blogspot.com", "mode": "all", "section_selector": "#Blog1_comments-block-wrapper", "comment_selector": ".comment-body", "template": "", "category": "Blogs"},
	{"domain": "diply.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "Blogs"},
	{"domain": "buzzfeed.com", "mode": "all", "section_selector": "div.fbFeedbackContent", "comment_selector": "div.postContainer.fsl.fwb.fcb", "template": "Facebook", "category": "Blogs"},
	{"domain": "kotaku.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja", "category": "Blogs"},
	{"domain": "jalopnik.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja", "category": "Blogs"},
	{"domain": "gizmodo.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja", "category": "Blogs"},
	{"domain": "io9.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja", "category": "Blogs"},
	{"domain": "gawker.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja", "category": "Blogs"},
	{"domain": "deadspin.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja", "category": "Blogs"},
	{"domain": "jezebel.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja", "category": "Blogs"},
	{"domain": "instructables.com", "mode": "all", "section_selector": "#comments", "comment_selector": "div.comment-entry", "template": "", "category": "Technology"},
	{"domain": "slashdot.org", "mode": "all", "section_selector": "#commentwrap", "comment_selector": ".cw", "template": "", "category": "Technology"},
	{"domain": "arstechnica.com", "mode": "all", "section_selector": "#comments-area", "comment_selector": ".comment", "template": "", "category": "Technology"},
	{"domain": "lifehacker.com", "mode": "all", "section_selector": "section.js_replies", "comment_selector": "article.js_reply.reply", "template": "Kinja", "category": "Technology"},
	{"domain": "amazon.com", "mode": "all", "section_selector": "#revMH", "comment_selector": "#revMHRL > .a-section.celwidget", "template": "", "category": "Uncategorized"},
	{"domain": "*.wikia.com", "mode": "all", "section_selector": "#article-comments", "comment_selector": "li.comment", "template": "", "category": "Uncategorized"},
	{"domain": "patreon.com", "mode": "all", "section_selector": "#creation-comments > div.thread > div.cb_comment.ranked_popular.comment_0", "comment_selector": ".comment_block", "template": "", "category": "Uncategorized"}
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

	DataStore.save(fresh_data);
}

function importStartingData() {
	// Get current data
	var data = DataStore.getBackgroundPageData();

	var existing_profiles = data["profiles"];
	var existing_templates = data["templates"];
	var existing_word_lists_enabled = data["word_lists_enabled"];

	// Merge in starting data
	var save_data = {};
	save_data.profiles = DataStore.mergeProfiles(existing_profiles, starting_profiles);
	save_data.templates = DataStore.mergeTemplates(existing_templates, starting_templates);
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
	DataStore.save(save_data);
}

// Export for Firefox
exports.Install = {
	loadStartingData: loadStartingData,
	importStartingData: importStartingData
};

