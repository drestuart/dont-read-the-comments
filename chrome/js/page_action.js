String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var profiles = [];
var templates = [];
var siteProfile = null;
var siteIndex = -1;
var currentTab = null;
var profileFields = ["domain", "mode", "section_selector", "comment_selector", "template", "category"];

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
		$("#message").text("");
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

	// $("#export").on('click', function() {
	// 	var profile = buildProfile();
	// 	var export_text = Tools.exportProfile(profile);
	// 	$("#export_text").val(export_text).show();
	// }).button();

	$("#upload").on('click', function() {
		$("#message").text("");

		var ajaxData = {
			domain: $("#domain").val(),
			section_selector: $("#section_selector").val(),
			comment_selector: $("#comment_selector").val(),
			template: $("#template").val(),
			category: $("#category").val(),
		};

		Browser.uploadProfile(ajaxData, function(message) {
			console.log("Profile uploaded");
			$("#message").text(message);
		});
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

	$("#options").on("click", Browser.openOptionsPage);

	// Tooltips
	$(document).tooltip();

	Browser.tabsQuery(function(response) {
		var uri = parseUri(response);
		var domain = uri.authority;
		// Trim off the www from the front
		domain = domain.replace(/^www\./, "");

		// Fill in domain field whether we load anything or not
		$("#domain").val(domain);

		Browser.getPageActionData(function(data) {
			profiles = data["profiles"];
			templates = data["templates"];
			categories = data["categories"];
			
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

			// Fill in category menu
			var category_menu = $('select#category');
			for (c of categories) {
				if (c === "Uncategorized") {continue;}
				var optionHTML = "<option value='" + c + "'>" + c + "</option>";
				category_menu.append(optionHTML);
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
			}
			else {
				$("#profile_not_found").show();
			}

			// Apply jQueryUI
			$('#template').selectmenu()
				.selectmenu("menuWidget")
				.addClass("selectmenu_scroll");
			$('#category').selectmenu()
				.selectmenu("menuWidget")
				.addClass("selectmenu_scroll");
			$("#mode_buttons").buttonset();
		});
	});
});
