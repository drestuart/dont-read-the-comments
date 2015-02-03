var OptionsPage = {};
var self = require("sdk/self");
var data = require("sdk/self").data;
var panel = require("sdk/panel");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var array = require("sdk/util/array");

var DataStore = require("data").DataStore;
var Install = require("install").Install;

tabs.on("ready", function(tab) {
	if (tab.url === data.url("html/options.html")) {
		console.log("Attaching to options page!");
		worker = tab.attach({
			contentScriptFile: [
				data.url("js/jquery-1.11.1.min.js"),
				data.url("js/jquery-ui.js"),
				data.url("js/parseUri.js"),
				data.url("js/browser.js"),
				data.url("js/options.js"),
				data.url("js/tools.js"),
				data.url("bad_words/bigotry.js"),
				data.url("bad_words/profanity.js"),
				data.url("bad_words/obscenity.js")
			],
		});
		worker.port.on('importStartingDataRequest', function() {
			Install.importStartingData();
		});

		worker.port.on("optionsPageDataRequest", function() {
			worker.port.emit("optionsPageDataResponse", DataStore.getOptionsPageData());
		});

		worker.port.on("saveDataRequest", function(saveData) {
			DataStore.save(saveData);
			worker.port.emit("saveDataResponse");
		});
	}
});

OptionsPage.open = function() {
	tabs.open(data.url("html/options.html"));
}


// Export for Firefox
exports.OptionsPage = OptionsPage;

