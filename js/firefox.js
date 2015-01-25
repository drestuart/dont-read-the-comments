// SDK libs
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
// var lib = require("sdk/self").lib;
var panel = require("sdk/panel");

// Local libs
var Browser = require("browser-ff");
var Install = require("install");
var Tools = require("tools");
var parseUri = require("parseUri");

var activeIcons = {
	"16": data.url("logo_drtc_16.png"),
    "19": data.url("logo_drtc_19.png"),
    "38": data.url("logo_drtc_38.png"),
    "48": data.url("logo_drtc_48.png")
};

var inactiveIcons = {
	"19": data.url("logo_drtc_gs_19.png"),
	"38": data.url("logo_drtc_gs_38.png"),
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
pageMod.PageMod({
  include: "*",
  contentScriptFile: [data.url("jquery-1.11.1.min.js"), data.url("my-content-script.js"), 
	data.url("jquery-ui.js"), data.url("parseUri.js"), data.url("ga.js"),
    data.url("bad_words/bigotry.js"), data.url("bad_words/profanity.js"), data.url("bad_words/obscenity.js"),
    data.url("browser-ff.js"), data.url("tools.js"), data.url("drtc.js")],
  contentStyleFile: "./css/drtc.css"
});

function pageAction(state) {
	var page_action = panel.Panel({
		contentURL: data.url("html/page_action.html"),
  		contentScriptFile: [data.url("jquery-1.11.1.min.js"), data.url("page_action.js")],
  		contentStyleFile: data.url("css/page_action.css"),
	});

	page_action.show();
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