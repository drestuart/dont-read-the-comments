var ContentScript = {};
var self = require("sdk/self");
var data = require("sdk/self").data;
var panel = require("sdk/panel");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var array = require("sdk/util/array");

var DataStore = require("data").DataStore;
var PageAction = require("page_action_setup").PageAction;
var parseURI = require("parseURI").parseURI;

tabs.on("ready", function(tab) {
	// Check protocol
	var protocol = parseURI.parse(tab.url).protocol;

	if (protocol === 'http' || protocol === 'https') {
		worker = tab.attach({
			contentScriptFile: [
				data.url("js/jquery-1.11.1.min.js"),
				data.url("js/jquery-ui.js"),
				data.url("js/parseUri.js"),
				data.url("js/browser.js"),
				data.url("js/tools.js"),
				data.url("bad_words/bigotry.js"),
				data.url("bad_words/profanity.js"),
				data.url("bad_words/obscenity.js"),
				data.url("js/drtc.js")
			],
			contentStyleFile: [
				data.url("css/drtc.css")
			]
		});

		worker.port.on("getUrlRequest", function() {
			worker.port.emit("getUrlResponse", tabs.activeTab.url);
		});

		worker.port.on("contentScriptDataRequest", function() {
			worker.port.emit("contentScriptDataResponse", DataStore.getContentScriptData());
		});

		worker.port.on("pageActionEnabledRequest", function() {
			PageAction.DRTCActive();
		});

		worker.port.on("pageActionDisabledRequest", function() {
			PageAction.DRTCInactive();
		});
	}
});

// Export for Firefox
exports.ContentScript = ContentScript;

