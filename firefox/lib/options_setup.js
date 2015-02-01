var OptionsPage = {};
var self = require("sdk/self");
var data = require("sdk/self").data;
var panel = require("sdk/panel");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");

var DataStore = require("data").DataStore;
var Install = require("install").Install;

OptionsPage.pagemod = pageMod.PageMod({
	include: data.url("html/options.html"),
	contentScriptFile: [
		data.url("js/jquery-1.11.1.min.js"), 
		data.url("js/jquery-ui.js"),
		data.url("js/ga.js"),
		data.url("js/parseUri.js"),
		data.url("js/browser.js"),
		data.url("js/options.js"),
		data.url("js/tools.js"),
		data.url("bad_words/bigotry.js"),
		data.url("bad_words/profanity.js"),
		data.url("bad_words/obscenity.js")
	],
	contentStyleFile: [
		data.url("css/options.css"),
		data.url("css/jquery-ui.css")
	],
	onAttach: function(worker) {
		worker.port.on('importStartingDataRequest', function() {
			Install.importStartingData();
		});
	}
});

OptionsPage.open = function() {
	tabs.open(data.url("html/options.html"));
}


// Export for Firefox
exports.OptionsPage = OptionsPage;

