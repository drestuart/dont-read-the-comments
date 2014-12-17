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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request === "showPageAction") {
            // Show the page action icon
            chrome.pageAction.show(sender.tab.id);
        }
        else if (request === "showDisabledPageAction") {
            chrome.pageAction.show(sender.tab.id);
            chrome.pageAction.setIcon({tabId: sender.tab.id, path:
                {
                    "19": "images/logo_drtc_gs_19.png",
                    "38": "images/logo_drtc_gs_38.png"
                }
            });
        }
    }
);
