Data = {};

Data.profiles = null;
Data.templates = null;
Data.comment_threshold = null;
Data.custom_words = null;
Data.word_lists_enabled = null;

Data.loadData = function(sendResponse) {
	console.log("Retrieving data");
	var MAX_ITEMS = 512;
	var fields = ["templates", "comment_threshold", "custom_words", 
				"word_lists_enabled", "categories"];

	if (Data.profiles === null) {
		// Add all possible profile chunks to the storage query
		for (var i = 1 ; i < MAX_ITEMS ; i++) {
			fields.push("profiles" + i)
		}

		console.log(fields);

		chrome.storage.sync.get(null, function(syncdata) {
			Data.profiles = [];

			// Put the profile chunks back together
			for (var i = 1 ; i < MAX_ITEMS ; i++) {
				if (typeof syncdata["profiles" + i] !== 'undefined') {
					Data.profiles = Data.profiles.concat(syncdata["profiles" + i]);
					delete syncdata["profiles" + i];
				}
				// else {
				// 	break;
				// }
			}

			console.log(syncdata);

			Data.templates = syncdata["templates"];
			Data.comment_threshold = syncdata["comment_threshold"];
			Data.custom_words = syncdata["custom_words"];
			Data.word_lists_enabled = syncdata["word_lists_enabled"];

			console.log("Returning from Chrome storage");
			console.log(Data);
			sendResponse(Data);
		});
	}
	else {
		console.log("Returning from memory");
		console.log(Data);
		sendResponse(Data);
	}
}

Data.saveData = function(savedata) {
	var fields = ["profiles", "templates", "comment_threshold", 
				"custom_words", "word_lists_enabled", "categories"];

	var QUOTA_BYTES_PER_ITEM = 8192;

	// Handle profile data specially
	if (typeof savedata.profiles !== 'undefined') {
		savedata.categories = Data.getCategories(savedata.profiles);

		// Split up profiles to make sure we're not going to exceed the QUOTA_BYTES_PER_ITEM limit!
		var bytes = (JSON.stringify(savedata.profiles) + "profiles").length;

		if (bytes >= QUOTA_BYTES_PER_ITEM) {
			var length = savedata.profiles.length;

			// How many chunks to break data into
			var num_chunks = Math.ceil(bytes/QUOTA_BYTES_PER_ITEM);
			var chunk_size = Math.floor(length/num_chunks);
			var chunks = [];

			for (var i = 0 ; i < num_chunks ; i++) {
				// Get this slice of the profiles array
				var chunk;
				if (i === num_chunks - 1) {
					chunk = savedata.profiles.slice(chunk_size*i);
				}
				else {
					chunk = savedata.profiles.slice(chunk_size*i, chunk_size*(i+1));
				}
				chunks.push(chunk);
			}

			// Put the chunks back into the data object
			// Assign each chunk to a different name
			for (var i = 0 ; i < chunks.length ; i++) {
				var chunk = chunks[i];
				if (i === 0) {
					savedata.profiles = chunk;
				}
				else {
					savedata["profiles" + i] = chunk;
				}
			}
		}
	}

	chrome.storage.sync.set(savedata, function() {
		// Save new data
		console.log("Saving new data");
		for (f of fields) {
			if (typeof savedata[f] !== 'undefined') {
				Data[f] = savedata[f]
			}
		}
	});
}

Data.getCategories = function(profiles) {
	var categories = [];

	for (var profile of profiles) {
		if (categories.indexOf(profile["category"]) === -1) {
			categories.push(profile["category"]);
		}
	}

	return categories;
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request === "getStoredData") {
			console.log("Got request: getStoredData");
			Data.loadData(sendResponse);
		}
		else if (typeof request === "object" && request.request === "saveData") {
			Data.saveData(request.data);
		}
	}
);






