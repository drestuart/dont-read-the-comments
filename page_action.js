String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var profiles = [];
var templates = [];
var siteProfile = null;
var siteIndex = -1;
var currentTab = null;

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

function buildProfile() {
	var profile = {};
	var fields = ["domain", "mode", "section_selector", "comment_selector", "template"];

	for (f of fields) {
		var value = $("#" + f).val().trim();

		// Trim extraneous stuff from domain
		if (f === "domain") {
			value = parseUri(value).authority;
		}

		profile[f] = value;
	}
	return profile;
}

$(document).ready(function() {
	$("#save").on('click', function() {
		var profile = buildProfile();

		if (siteIndex !== -1) {
			profiles[siteIndex] = profile;
		}
		else {
			profiles.push(profile);
		}
		
		chrome.storage.sync.set({"profiles" : profiles}, function() {
			console.log("Saved!");
		});

		$("#message").text("Saved");

		chrome.tabs.reload();
	});

	$("#export").on('click', function() {
		var profile = buildProfile();
		var export_text = JSON.stringify(profile)
			.replace(/:/g, ": ")
			.replace(/,/g, ", ");
		$("#export_text").val(export_text).show();
	});

	$("#template").on("input", function() {
		fillInTemplateValues(this);
	});

	$('#section_selector, #comment_selector').on('input', function() {
		$('#template').val('');
	});

	$("#enable").on("click", function() {
		$("#profile_not_found").hide();
		$("#profile_found").show();
	});

	chrome.tabs.query({currentWindow: true, active: true},
		function (tabs) {
			currentTab = tabs[0];
			var domain = parseUri(currentTab.url).authority;

			// Trim off the www from the front
			domain = domain.replace(/^www\./, "");

			// Fill in domain field whether we load anything or not
			$("#domain").val(domain);

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

				// Fill in template menu
				var template_menu = $('select#template');
				for (t of templates) {
					var optionHTML = "<option value='" + t["system"] + "'>" + t["system"] + "</option>";
					template_menu.append(optionHTML);
				}

				// Fill in form fields
				if (siteProfile !== null) {
					$("#profile_found").show();
					var fields = ["domain", "mode", "section_selector", "comment_selector"];

					if (siteProfile['template'] !== '') {
						fields = ["domain", "mode"];
						template_menu.val(siteProfile['template']);
						fillInTemplateValues(template_menu);
					}

					for (f of fields) {
						$("#" + f).val(siteProfile[f]);
					}
				}
				else {
					$("#profile_not_found").show();
				}
			});
		}
	);
});
