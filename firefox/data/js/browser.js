Browser = {};

// Temporary data
var data = {
		profiles: [
			{
				"domain": "youtube.com", 
				"mode": "all", 
				"section_selector": "#watch-discussion", 
				"comment_selector": ".ve.oba.HPa, .Ik.Wv", 
				"template": ""
			}
			],
		templates: [
			{"system": "Disqus", "section_selector": "#dsq-2", "comment_selector": "div.post-content"}
		],
		comment_threshold: 0,
		custom_words: [],
		word_lists_enabled: {
			"profanity": true,
			"obscenity": true,
			"bigotry": true
		},
	};

Browser.getFromStorage = function(fields, func) {
	// chrome.storage.sync.get(fields, func);
}

Browser.getContentScriptData = function(func) {
	// Browser.getFromStorage(["profiles", "templates", "comment_threshold",
	// 	"custom_words", "word_lists_enabled"], func);
	func(data);
}

Browser.getOptionsPageData = function(func) {
	// Browser.getFromStorage(["profiles", "templates", "comment_threshold", 
	// 	"custom_words", "word_lists_enabled"], func);
	func(data);
}

Browser.getPageActionData = function(func) {
	self.port.on("pageActionDataResponse", function(pageActionData) {
		func(pageActionData);
	})

	self.port.emit("pageActionDataRequest");
}

Browser.getBackgroundPageData = function(func) {
	// Browser.getFromStorage(["profiles", "templates",
	// 	"word_lists_enabled"], func);
	func(data);
}

Browser.save = function(data, func) {
	// chrome.storage.sync.set(data, func);
	console.log("Saved data!");
	func();
}

Browser.sendMessage = function(message, func) {
	// chrome.runtime.sendMessage(chrome.runtime.id, message, func);
	self.port.emit("myContentScriptMessage", myContentScriptMessagePayload);
}

Browser.addListener = function(func) {
	// chrome.runtime.onMessage.addListener(func);
}

Browser.reload = function() {
	// chrome.tabs.reload();
}

Browser.tabsQuery = function(data, func) {
	// chrome.tabs.query(data, function(tabs) {
	// 	currentTab = tabs[0];
	// 	var domain = parseUri(currentTab.url).authority;

	// 	func(domain);
	// });
	var domain = "youtube.com";
	func(domain);
}