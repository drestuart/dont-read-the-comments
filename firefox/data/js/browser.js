Browser = {};

Browser.getContentScriptData = function(func) {
	self.port.once("contentScriptDataResponse", function(contentScriptData) {
		func(contentScriptData);
	})

	self.port.emit("contentScriptDataRequest");
}

Browser.getOptionsPageData = function(func) {
	self.port.once("optionsPageDataResponse", function(optionsPageData) {
		func(optionsPageData);
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
	self.port.once("saveDataResponse", function() {
		console.log("Saved data!");
		func();
	});

	self.port.emit("saveDataRequest", data);
}

Browser.pageActionDisabled = function() {
	self.port.emit("pageActionDisabledRequest");
}

Browser.reload = function() {
	self.port.emit("reloadActiveTabRequest");
}

