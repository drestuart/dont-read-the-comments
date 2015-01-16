Browser = {};

Browser.getFromStorage = function(fields, func) {
	chrome.storage.sync.get(fields, func);
}

Browser.getContentScriptData = function(func) {
	Browser.getFromStorage(["profiles", "comment_threshold",
		"custom_words", "word_lists_enabled"], func);
}

Browser.getOptionsPageData = function(func) {
	Browser.getFromStorage(["profiles", "templates", "comment_threshold", 
		"custom_words", "word_lists_enabled"], func);
}

Browser.getPageActionData = function(func) {
	Browser.getFromStorage(["profiles", "templates"], func);
}

Browser.getBackgroundPageData = function(func) {
	Browser.getFromStorage(["profiles", "templates",
		"word_lists_enabled"], func);
}

Browser.save = function(data, func) {
	chrome.storage.sync.set(data, func);
}

Browser.sendMessage = function(message, func) {
	chrome.runtime.sendMessage(chrome.runtime.id, message, func);
}

Browser.addListener = function(func) {
	chrome.runtime.onMessage.addListener(func);
}

Browser.reload = function() {
	chrome.tabs.reload();
}

Browser.tabsQuery = function(data, func) {
	chrome.tabs.query(data, function(tabs) {
		currentTab = tabs[0];
		var domain = parseUri(currentTab.url).authority;

		func(domain);
	});
}