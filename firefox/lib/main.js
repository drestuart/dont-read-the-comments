// SDK libs
var self = require("sdk/self");

// Local libs
var Install = require("install").Install;
// var ActionButton = require("button_setup").ActionButton;
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



