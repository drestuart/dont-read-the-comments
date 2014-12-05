function loadStartingData() {
	var fresh_data = {"awesome_data" : "awesome by default"};

	// Load up default website profiles
	var profiles = [
		{"domain": "youtube.com", "mode": "all", "section_selector": "#comments", "comment_selector": ""},
		{"domain": "", "mode": "all", "section_selector": "#comments", "comment_selector": ""}
	];

	fresh_data.profiles = profiles;

	chrome.storage.sync.set(fresh_data, 
    function() {
            console.log("Installed fresh data");
    });
}