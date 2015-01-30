// SDK libs
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var storage = require("sdk/simple-storage").storage;

// Local libs
var Install = require("install").Install;
var Messages = require("messages").Messages;
var PageAction = require("page_action_setup").PageAction;

// Turn off warnings god damn your eyes
require("sdk/preferences/service").set("javascript.options.strict", false);

// Reason the addon was loaded
// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/self
console.log("loadReason: " + self.loadReason);

// Load starting data on install
if (self.loadReason === 'install') {
	Install.loadStartingData();
}

// Start listening for messages
Messages.listen();

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

// Toolbar button for page action
var button = buttons.ActionButton({
	id: "drtc-page-action",
	label: "DRTC!",
	icon: activeIcons,
	onClick: PageAction.ShowHidePageAction
});

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



