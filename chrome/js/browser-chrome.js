Browser = {};

Browser.getFromStorage = function(fields, func) {
	var MAX_ITEMS = 512;

	// Add all possible profile chunks to the storage query
	if (fields.indexOf("profiles") !== -1) {
		for (var i = 1 ; i < MAX_ITEMS ; i++) {
			fields.push("profiles" + i)
		}
	}
	chrome.storage.sync.get(fields, function(data) {
		// Put the profile chunks back together
		for (var i = 1 ; i < MAX_ITEMS ; i++) {
			if (typeof data["profiles" + i] !== 'undefined') {
				data.profiles = data.profiles.concat(data["profiles" + i]);
				delete data["profiles" + i];
			}
		}
		func(data);
	});
}

Browser.getContentScriptData = function(func) {
	Browser.getFromStorage(["profiles", "templates", "comment_threshold",
		"custom_words", "word_lists_enabled"], func);
}

Browser.getOptionsPageData = function(func) {
	Browser.getFromStorage(["profiles", "templates", "comment_threshold", 
		"custom_words", "word_lists_enabled"], func);
}

Browser.getPageActionData = function(func) {
	Browser.getFromStorage(["profiles", "templates"], func);
}

Browser.getBackgroundPageData = function(func) {
	Browser.getFromStorage(["profiles", "templates",
		"word_lists_enabled"], func);
}

Browser.save = function(data, func) {
	// Make sure we're not going to exceed the QUOTA_BYTES_PER_ITEM limit!
	var QUOTA_BYTES_PER_ITEM = 8192;

	if (typeof data.profiles !== 'undefined') {
		var bytes = (JSON.stringify(data.profiles) + "profiles").length;

		if (bytes >= QUOTA_BYTES_PER_ITEM) {
			var length = data.profiles.length;

			// How many chunks to break data into
			var num_chunks = Math.ceil(bytes/QUOTA_BYTES_PER_ITEM);
			var chunk_size = Math.floor(length/num_chunks);
			var chunks = [];

			for (var i = 0 ; i < num_chunks ; i++) {
				// Get this slice of the profiles array
				var chunk;
				if (i === num_chunks - 1) {
					chunk = data.profiles.slice(chunk_size*i);
				}
				else {
					chunk = data.profiles.slice(chunk_size*i, chunk_size*(i+1));
				}
				chunks.push(chunk);
			}

			// Put the chunks back into the data object
			// Assign each chunk to a different name
			for (var i = 0 ; i < chunks.length ; i++) {
				var chunk = chunks[i];
				if (i === 0) {
					data.profiles = chunk;
				}
				else {
					data["profiles" + i] = chunk;
				}
			}
		}
	}

	chrome.storage.sync.set(data, function() {
		if (typeof chrome.runtime.lastError !== 'undefined') {
			console.log("Error: " + chrome.runtime.lastError.message);
		}
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

Browser.addListener = function(func) {
	chrome.runtime.onMessage.addListener(func);
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
	chrome.tabs.query({active: true}, function(tabs) {
        tab = tabs[0];
        url = tab.url;
        func(url);
    });
}

Browser.openOptionsPage = function() {
	chrome.tabs.create({url: "chrome://extensions/?options=ohjehbcchmjagodhlgboaadkkdpegega"});
}


