function loadStartingData() {
	chrome.storage.sync.set({"awesome_data" : "awesome by default"}, 
    function() {
            console.log("Installed fresh data");
    });
}