// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install") {
        console.log("First install!");
    }
    else if(details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion);
    }
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    var files = [
    	"jquery-1.11.1.min.js", "parseUri.js", "drtc.js",
    	"drtc.css", "bad_words/en.js"
    ];
    for (var file of files) {
	    chrome.tabs.executeScript(details.tabId, {
	        file: file
	    });
	}
}, { });