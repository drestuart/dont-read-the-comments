chrome.webNavigation.onCompleted.addListener(function(details) {
    var files = ["jquery-1.11.1.min.js", "parseUri.js", "drtc.js"];
    for (var file of files) {
	    chrome.tabs.executeScript(details.tabId, {
	        file: file
	    });
	}
}, { });