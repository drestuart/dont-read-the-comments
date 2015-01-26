// SDK libs
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
// var lib = require("sdk/self").lib;
var panel = require("sdk/panel");

// Local libs
var Install = require("install");

// Turn off warnings god damn your eyes
require("sdk/preferences/service").set("javascript.options.strict", false);

var activeIcons = {
	"16": data.url("images/logo_drtc_16.png"),
    "19": data.url("images/logo_drtc_19.png"),
    "38": data.url("images/logo_drtc_38.png"),
    "48": data.url("images/logo_drtc_48.png")
};

var inactiveIcons = {
	"19": data.url("images/logo_drtc_gs_19.png"),
	"38": data.url("images/logo_drtc_gs_38.png"),
};

// Reason the addon was loaded
// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/self
console.log("loadReason: " + self.loadReason);

// Toolbar button for page action
var button = buttons.ActionButton({
	id: "drtc-page-action",
	label: "DRTC!",
	icon: activeIcons,
	onClick: pageAction
});

// Inject DRTC script with pageMod
// pageMod.PageMod({
//   include: "*",
//   contentScriptFile: [
//   	data.url("jquery-1.11.1.min.js"), data.url("jquery-ui.js"), 
//   	data.url("parseUri.js"), data.url("ga.js"), data.url("bad_words/bigotry.js"), 
//   	data.url("bad_words/profanity.js"), data.url("bad_words/obscenity.js"),
//     data.url("browser-ff.js"), data.url("tools.js"), data.url("drtc.js")],
//   contentStyleFile: data.url("./css/drtc.css")
// });

var page_action = panel.Panel({
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

function pageAction(state) {
	if (page_action.isShowing) {
		page_action.hide();
	}
	else {
		page_action.show();
	}
}

function DRTCInactive() {
	button.state("tab", {
		icon: inactiveIcons
	});
}

function DRTCActive() {
	button.state("tab", {
		icon: activeIcons
	});
}