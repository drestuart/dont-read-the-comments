// SDK libs
var self = require("sdk/self");
var data = self.data;
var tabs = require("sdk/tabs");

// Local libs
var Install = require("install").Install;
var PageAction = require("page_action_setup").PageAction;
var ContentScript = require("content_script_setup").ContentScript;

// Turn off warnings god damn your eyes
require("sdk/preferences/service").set("javascript.options.strict", false);

// Reason the addon was loaded
// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/self

// Load starting data on install
if (self.loadReason === 'install') {
	Install.loadStartingData();
}
else if (self.loadReason === 'upgrade' || self.loadReason === 'downgrade') {
	Install.importStartingData(false);
}

// Show help page
if (self.loadReason === 'install') {
	tabs.open(data.url("html/install.html"));
}

// Hide DRTC content when a tab updates
tabs.on("ready", function(tab) {
	worker = tab.attach({});
	worker.port.emit("hide");
});