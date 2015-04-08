// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install") {
        loadStartingData();

        // Open help page
        chrome.tabs.create({url: "help.html", active: true});
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
        else if (typeof request === 'object') {
            send_ajax("https://drestuart.pythonanywhere.com/drtc/profile",
                request, function(data) {
                    console.log("Sent");
                    console.log(data);
                    sendResponse(data);
                }
            );
        }
    }
);

function send_ajax(url, data, func) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 ) {
            if(xmlhttp.status == 200){
                func(xmlhttp.responseText);
            }
            else {
               console.log(xmlhttp.responseText);
            }
        }
    }

    xmlhttp.open("POST", url, true)
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(serialize(data));
}

serialize = function(obj) {
   var str = [];

   for(var p in obj){
       if (obj.hasOwnProperty(p)) {
           str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
       }
   }

   return str.join("&");
}

