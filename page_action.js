String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

$(document).ready(function() {
	$("#hi").on('click', function() {
		alert("Hi!");
	});

	chrome.tabs.query({ currentWindow: true, active: true },
		function (tabs) {
			var profiles;
			var tab = tabs[0];
			var domain = parseUri(tab.url).authority;

			chrome.storage.sync.get("profiles", function(data) {
				profiles = data["profiles"];
				siteProfile = null;

				for (p of profiles) {
					// Check if the profile's domain has a glob in it
					if (p["domain"].indexOf('*') !== -1) {
						// Build it into a regex
						p["domain"] = p["domain"].replace(/\*/g, '[\\w\.-]*')  + '$';

						if (domain.match(p["domain"])) {
							siteProfile = p;
							break;
						}
					}
					else {
						if (domain.endsWith(p["domain"])) {
							siteProfile = p;
							break;
						}
					}
				}
			});
		}
	);
});
