Browser = {};

Browser.getContentScriptData = function(func) {
	self.port.on("contentScriptDataResponse", function(pageActionData) {
		func(pageActionData);
	})

	self.port.emit("contentScriptDataRequest");
}

Browser.getOptionsPageData = function(func) {
	self.port.on("optionsPageDataResponse", function(pageActionData) {
		func(pageActionData);
	})

	self.port.emit("optionsPageDataRequest");
}

Browser.getPageActionData = function(func) {
	self.port.on("pageActionDataResponse", function(pageActionData) {
		func(pageActionData);
	})

	self.port.emit("pageActionDataRequest");
}

Browser.save = function(data, func) {
	self.port.on("saveDataResponse", function(pageActionData) {
		console.log("Saved data!");
		func(pageActionData);
	})

	self.port.emit("saveDataRequest");
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
