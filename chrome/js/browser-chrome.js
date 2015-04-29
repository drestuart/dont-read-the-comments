Browser = {};

Browser.getFromStorage = function(func) {
	Browser.sendMessage("getStoredData", function(data) {
		func(data);
	});
}

Browser.save = function(data, func) {
	Browser.sendMessage({method : "saveData", data : data}, func);
}

Browser.sendMessage = function(message, func) {
	chrome.runtime.sendMessage(chrome.runtime.id, message, function(response) {
		func(response);
	});
}

Browser.pageActionEnabled = function() {
	Browser.sendMessage("pageActionEnabled", null);
}

Browser.pageActionDisabled = function() {
	Browser.sendMessage("pageActionDisabled", null);
}

Browser.reload = function() {
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
			return true;
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

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegExp(string){
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

Browser.domainMatch = function (domain, toCheck) {
	// Check if the check domain has a glob in it
	if (toCheck.indexOf('*') !== -1) {
		// Build it into a regex
		toCheck = escapeRegExp(toCheck);
		toCheck = toCheck.replace(/\\\*/g, '[\\w\.-]*')  + '$';
		if (domain.match(toCheck)) {
			return true;
		}
	}
	else {
		// Check if the domain matches or is a subdomain
		// of the domain to check
		var domainRe = new RegExp(".+\\." + toCheck + "$");
		if (domain.match(domainRe)) {
			return true;
		}
		else if (domain === toCheck) {
			return true;
		}
	}
	return false;
}

