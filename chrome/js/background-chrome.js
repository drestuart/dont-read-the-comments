// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "install") {
		loadStartingData();

		// Open help page
		chrome.tabs.create({url: "install.html", active: true});
	}
	else if(details.reason == "update") {
		var thisVersion = chrome.runtime.getManifest().version;
		importStartingData(false);
	}
});

// Detect tab url changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (typeof(changeInfo["url"]) !== 'undefined') {
		var message = {
			action : "hide"
		};
		chrome.tabs.sendMessage(tabId, message);
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
			sendResponse(sender.tab.url);
		}
	}
);

