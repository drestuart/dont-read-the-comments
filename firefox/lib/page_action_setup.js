var PageAction = {};
var self = require("sdk/self");
var data = require("sdk/self").data;
var panel = require("sdk/panel");

var DataStore = require("data").DataStore;

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

PageAction.ShowHidePageAction = function(state) {
	if (PageAction.page_action.isShowing) {
		PageAction.page_action.hide();
	}
	else {
		PageAction.page_action.show();
	}
}

// Export for Firefox
exports.PageAction = PageAction;

