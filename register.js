chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.tabs.executeScript(details.tabId, {
        runAt: "document_end",
        file: "jquery-1.11.1.min.js"
    });
    chrome.tabs.executeScript(details.tabId, {
        runAt: "document_idle",
        file: "check.js"
    });
}, { });