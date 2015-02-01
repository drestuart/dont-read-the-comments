Browser = {};

Browser.getContentScriptData = function(func) {
	self.port.once("contentScriptDataResponse", function(pageActionData) {
		func(pageActionData);
	})

	self.port.emit("contentScriptDataRequest");
}

Browser.getOptionsPageData = function(func) {
	self.port.once("optionsPageDataResponse", function(pageActionData) {
		func(pageActionData);
	})

	self.port.emit("optionsPageDataRequest");
}

Browser.getPageActionData = function(func) {
	self.port.once("pageActionDataResponse", function(pageActionData) {
		func(pageActionData);
	});

	self.port.emit("pageActionDataRequest");
}

Browser.save = function(data, func) {
	self.port.once("saveDataResponse", function(pageActionData) {
		console.log("Saved data!");
		func(pageActionData);
	});

	self.port.emit("saveDataRequest");
}

Browser.pageActionDisabled = function() {
	self.port.emit("pageActionDisabledRequest");
}

Browser.reload = function() {
	// chrome.tabs.reload();
}

