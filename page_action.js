String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var profiles = [];
var templates = [];
var siteProfile = null;
var siteIndex = -1;

function fillInTemplateValues(element) {
	var template_name = $(element).val();
	if (template_name !== '') {
		var selected_template = null;

		for (t of templates) {
			if (t['system'] === template_name) {
				selected_template = t;
				break;
			}
		}

		// Fill in template values
		if (selected_template != null) {
			$('input#section_selector').val(selected_template['section_selector']);
			$('input#comment_selector').val(selected_template['comment_selector']);
		}
	}
}

$(document).ready(function() {
	$("#save").on('click', function() {
		
	});

	chrome.tabs.query({ currentWindow: true, active: true },
		function (tabs) {
			var tab = tabs[0];
			var domain = parseUri(tab.url).authority;

			chrome.storage.sync.get(["profiles", "templates"], function(data) {
				profiles = data["profiles"];
				templates = data["templates"];
				
				// Retrieve the profile matching this site
				for (i = 0 ; i < profiles.length ; i++) {
					p = profiles[i];
					// Check if the profile's domain has a glob in it
					if (p["domain"].indexOf('*') !== -1) {
						// Build it into a regex
						p["domain"] = p["domain"].replace(/\*/g, '[\\w\.-]*')  + '$';

						if (domain.match(p["domain"])) {
							siteProfile = p;
							siteIndex = i;
							break;
						}
					}
					else {
						if (domain.endsWith(p["domain"])) {
							siteProfile = p;
							siteIndex = i;
							break;
						}
					}
				}

				// Fill in form fields
				if (siteProfile !== null) {
					var template_menu = $('select#template');
					for (t of templates) {
						var optionHTML = "<option value='" + t["system"] + "'>" + t["system"] + "</option>";
						template_menu.append(optionHTML);
					}

					var fields = ["domain", "mode", "section_selector", "comment_selector"];

					if (siteProfile['template'] !== '') {
						fields = ["domain", "mode"];
						template_menu.val(data['template']);
						fillInTemplateValues(template_menu);
					}

					for (f of fields) {
						$("input#" + f).val(siteProfile[f]);
					}
				}
			});
		}
	);
});
