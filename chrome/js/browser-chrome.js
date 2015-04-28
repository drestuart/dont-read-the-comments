Browser = {};

Browser.getFromStorage = function(func) {
	Browser.sendMessage("getStoredData", function(data) {
		func(data);
	});
}

Browser.save = function(data, func) {
	console.log("Saving!");
	Browser.sendMessage({request : "saveData", data : data}, function(response) {
		func();
	});
}

Browser.sendMessage = function(message, func) {
	chrome.runtime.sendMessage(chrome.runtime.id, message, func);
}

Browser.pageActionEnabled = function() {
	Browser.sendMessage("pageActionEnabled", null);
}

Browser.pageActionDisabled = function() {
	Browser.sendMessage("pageActionDisabled", null);
}

Browser.reload = function() {
	console.log("Reloading!");
	chrome.tabs.reload();
}

Browser.getTabUrl = function(func) {
	Browser.sendMessage("getTabUrl", function(response) {
		func(response);
	});
}

Browser.tabsQuery = function(func) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		tab = tabs[0];
		url = tab.url;
		func(url);
	});
}

Browser.templateQuery = function(func) {
	chrome.runtime.onMessage.addListener(
		function(message) {
			if (message.action === "templateQueryResponse") {
				if (message.template !== null) {
					func(message.template);
				}
			}
		}
	);

	chrome.tabs.query({active: true, currentWindow: true},
		function(tabs){
			chrome.tabs.sendMessage(tabs[0].id, "templateQuery", null);
		}
	);

}

Browser.setUpTemplateQueryListener = function(func) {
	chrome.runtime.onMessage.addListener(
		function(message, sender, sendResponse) {
			if (message === "templateQuery") {
				template = func();
				if (typeof template !== 'undefined') {
					sendResponse(template);
					Browser.sendMessage({
						action: "templateQueryResponse",
						template: template
					});
				}
			}
		}
	);
}

Browser.openOptionsPage = function() {
	chrome.tabs.create({url: "chrome://extensions/?options=ohjehbcchmjagodhlgboaadkkdpegega"});
}

Browser.setUpLocationChange = function(func) {
	// Set up listener for url update message
	chrome.runtime.onMessage.addListener(
		function(message, sender, sendResponse) {
			if (message.action == "hide") {
				func();
			}
		}
	);
}

Browser.profileUploadableCheck = function (profile, callbacks) {
	if (profile === null) {
		callbacks.uploadable();
		return;
	}

	// Load starting profiles
	Browser.loadJSONFile('data/starting_profiles.json', function(prof_data) {
		starting_profiles = prof_data;

		// Check for one matching the provided profile
		for (prof of starting_profiles) {
			if (prof['domain'] === profile['domain']) {
				callbacks.notUploadable();
				return;
			}
		}

		callbacks.uploadable();
	});
}

Browser.loadJSONFile = function(file, func) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			data = JSON.parse(xhr.responseText);
			func(data);
		}
	};
	xhr.open("GET", chrome.extension.getURL(file), true);
	xhr.send();
}

