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
        else if (request === "pageActionDisabled") {
            chrome.pageAction.setIcon({tabId: sender.tab.id, path:
                {
                    "19": "images/logo_drtc_gs_19.png",
                    "38": "images/logo_drtc_gs_38.png"
                }
            });
            chrome.pageAction.show(sender.tab.id);
        }
        else if (request === "pageActionEnabled") {
            chrome.pageAction.setIcon({tabId: sender.tab.id, path:
                {
                    "19": "images/logo_drtc_19.png",
                    "38": "images/logo_drtc_38.png"
                }
            });
            chrome.pageAction.show(sender.tab.id);
        }
        else if (request === "getTabUrl") {
            var thisTab = sender.tab;
            sendResponse(thisTab.url);
        }
    }
);
