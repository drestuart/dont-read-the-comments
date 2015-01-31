var PageAction = {};
var self = require("sdk/self");
var data = require("sdk/self").data;
var panel = require("sdk/panel");
var tabs = require("sdk/tabs");

var DataStore = require("data").DataStore;
var OptionsPage = require("options_setup").OptionsPage;

PageAction.page_action = panel.Panel({
	contentURL: data.url("html/page_action.html"),
	width: 202,
	height: 225,
	contentScriptFile: [
		data.url("js/jquery-1.11.1.min.js"), 
		data.url("js/parseUri.js"),
		data.url("js/browser.js"),
		data.url("js/page_action.js"),
		data.url("js/tools.js")
	],
	contentStyleFile: [
		data.url("css/page_action.css"),
	]
});

PageAction.page_action.port.on("pageActionDataRequest", function() {
	// Get the data for the page action
	var pageActionData = DataStore.getPageActionData();
	PageAction.page_action.port.emit("pageActionDataResponse", pageActionData);
});

PageAction.page_action.port.on("openOptionsPageRequest", function() {
	OptionsPage.open();
	PageAction.page_action.hide();
});

PageAction.page_action.port.on("getUrlRequest", function() {
	PageAction.page_action.port.emit("getUrlResponse", tabs.activeTab.url);
});

PageAction.ShowHidePageAction = function(state) {
	PageAction.page_action.port.emit("pageActionOpen", tabs.activeTab.url);
	if (PageAction.page_action.isShowing) {
		PageAction.page_action.hide();
	}
	else {
		PageAction.page_action.show();
	}
}

// Export for Firefox
exports.PageAction = PageAction;

