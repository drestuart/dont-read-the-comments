// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install") {
        console.log("First install!");

        loadStartingData();
    }
    else if(details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion);
    }
});

var alreadyRan = false;

chrome.webNavigation.onCompleted.addListener(function(details) {
    if (!alreadyRan) {
        alreadyRan = true;  // Only run once!
        var scripts = [
            "jquery-1.11.1.min.js", "parseUri.js", "drtc.js",
            "bad_words/en.js"
        ];

        for (var file of scripts) {
            chrome.tabs.executeScript(details.tabId, {
                file: file
            });
        }

        var css = ["drtc.css"];
        for (var file of css) {
            chrome.tabs.insertCSS(details.tabId, {
                file: file
            });
        }
    }
}, { });