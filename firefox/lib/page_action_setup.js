var PageAction = {};
var self = require("sdk/self");
var data = self.data;
var panel = require("sdk/panel");
var tabs = require("sdk/tabs");

var DataStore = require("data").DataStore;
var OptionsPage = require("options_setup").OptionsPage;

var buttons = require('sdk/ui/button/action');

var activeIcons = {
	"16": data.url("images/logo_drtc_16.png"),
    "32": data.url("images/logo_drtc_32.png"),
    "64": data.url("images/logo_drtc_64.png")
};

var inactiveIcons = {
	"19": data.url("images/logo_drtc_gs_19.png"),
	"32": data.url("images/logo_drtc_gs_32.png"),
	"64": data.url("images/logo_drtc_gs_64.png"),
};

PageAction.page_action = panel.Panel({
	contentURL: data.url("html/page_action.html"),
	contentScriptFile: [
		data.url("js/jquery-1.11.1.min.js"),
		data.url("js/jquery-ui.min.js"),
		data.url("js/parseUri.js"),
		data.url("js/browser.js"),
		data.url("js/page_action.js"),
		data.url("js/tools.js")
	],
	contentStyleFile: [
		data.url("css/page_action.css"),
		data.url("css/jquery-ui.css")
	],
	onShow: function() {
		PageAction.page_action.port.emit('fetch_panel_size');
	}
});

PageAction.page_action.port.on('panel_size', function(data) {
    PageAction.page_action.resize((data.width+30), (data.height+30));
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

PageAction.page_action.port.on("closePageActionRequest", function() {
	PageAction.page_action.hide();
});

PageAction.page_action.port.on("pageActionEnabledRequest", function() {
	PageAction.DRTCActive();
});

PageAction.page_action.port.on("pageActionDisabledRequest", function() {
	PageAction.DRTCInactive();
});

PageAction.page_action.port.on("saveDataRequest", function(saveData) {
	DataStore.save(saveData);
	PageAction.page_action.port.emit("saveDataResponse");
});

PageAction.page_action.port.on("reloadActiveTabRequest", function() {
	PageAction.page_action.hide();
	tabs.activeTab.reload();
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

// Toolbar button for page action
var button = buttons.ActionButton({
	id: "drtc-page-action",
	label: "DRTC!",
	icon: activeIcons,
	onClick: PageAction.ShowHidePageAction
});

PageAction.DRTCInactive = function() {
	button.state("tab", {
		icon: inactiveIcons
	});
}

PageAction.DRTCActive = function() {
	button.state("tab", {
		icon: activeIcons
	});
}

// Export for Firefox
exports.PageAction = PageAction;

