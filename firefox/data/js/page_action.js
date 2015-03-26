function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var profiles = [];
var templates = [];
var siteProfile = null;
var siteIndex = -1;
var currentTab = null;
var profileFields = ["domain", "mode", "section_selector", "comment_selector", "template"];

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

	for (f of profileFields) {
		var value;

		// Trim extraneous stuff from domain
		if (f === "domain") {
			value = $("#" + f).val().trim();
			value = parseUri(value).authority;
		}
		else if (f === 'mode') {
			value = $("input[name=mode]:checked").val();
		}
		else {
			value = $("#" + f).val().trim();
		}

		profile[f] = value;
	}
	return profile;
}

$(document).ready(function() {
	$("#save").button().on('click', function() {
		var profile = buildProfile();

		if (siteIndex !== -1) {
			profiles[siteIndex] = profile;
		}
		else {
			profiles.push(profile);
		}
		
		Browser.save({"profiles" : profiles}, function() {
			$("#message").text("Saved");
			Browser.reload();
		});
	});

	$("#export").on('click', function() {
		var profile = buildProfile();
		var export_text = Tools.exportProfile(profile);
		$("#export_text").val(export_text).show();
	}).button();

	$("#template").on("selectmenuchange", function() {
		fillInTemplateValues(this);
	});

	$('#section_selector, #comment_selector').on('input', function() {
		$('#template').val('');
		$('#template').selectmenu("refresh");
	});

	$("#enable").on("click", function() {
		$("#profile_not_found").hide();
		$("#profile_found").show();
	}).button();

	$("#showme").on("click", function() {
		$("input[name=mode][value=disabled]").prop('checked', true);
		$("#save").trigger("click");
	}).button();

	// Close page action on link click
	$("a").on('click', function() {
		self.port.emit("closePageActionRequest");
	});
});

// Clear out any old listeners
self.port.removeListener("pageActionOpen", setUpPageAction);

self.port.on("pageActionOpen", setUpPageAction);

function setUpPageAction(url) {
	var domain = parseUri(url).authority;
	// Trim off the www from the front
	domain = domain.replace(/^www\./, "");

	// Fill in domain field whether we load anything or not
	$("#domain").val(domain);

	// Set up the panel

	// Empty the template menu
	var template_menu = $('select#template');
	template_menu.html("");
	template_menu.append('<option value="">None</option>');

	// Hide sections, will show later as needed
	$("#profile_found").hide();
	$("#profile_not_found").hide();

	// Empty the message and export box
	$("#message").text("");
	$("#export_text").val("").hide();

	// Clear site profile
	siteProfile = null;

	// Tooltips
	$(document).tooltip();

	Browser.getPageActionData(function(data) {
		profiles = data["profiles"];
		templates = data["templates"];

		// Retrieve the profile matching this site
		for (i = 0 ; i < profiles.length ; i++) {
			p = profiles[i];
			// Check if the profile's domain has a glob in it
			if (p["domain"].indexOf('*') !== -1) {
				// Build it into a regex
				var checkDomain = p["domain"];
				checkDomain = checkDomain.replace(/\*/g, '[\\w\.-]*')  + '$';

				if (domain.match(checkDomain)) {
					siteProfile = p;
					siteIndex = i;
					break;
				}
			}
			else {
				if (endsWith(domain, p["domain"])) {
					siteProfile = p;
					siteIndex = i;
					break;
				}
			}
		}

		// Fill in template menu
		for (t of templates) {
			var optionHTML = "<option value='" + t["system"] + "'>" + t["system"] + "</option>";
			template_menu.append(optionHTML);
		}

		// Fill in form fields
		if (siteProfile !== null) {
			$("#profile_found").show();
			var fields = profileFields;

			if (siteProfile['template'] !== '') {
				fields = ["domain", "mode", "category"];
				template_menu.val(siteProfile['template']);
				fillInTemplateValues(template_menu);
			}

			for (f of fields) {
				var value = siteProfile[f];
				if (f === "mode") {
					$("input[name=mode][value=" + value + "]").prop('checked', true);
				}
				else {
					$("#" + f).val(value);
				}
			}

			// Apply jQueryUI
			$('#template').selectmenu();
			$("#mode_buttons").buttonset();
		}
		else {
			$("#profile_not_found").show();
		}
	});
}
