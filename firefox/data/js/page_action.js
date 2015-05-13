function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var profiles = [];
var templates = [];
var siteProfile = null;
var siteIndex = -1;
var currentTab = null;
var profileFields = ["domain", "mode", "section_selector", "comment_selector", "template", "category"];

function fillInTemplateValues() {
	var template_name = $("#template").val();
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

function showHideNewCategory() {
	if ($("#category").val() == "New Category") {
		$("#new_category").parents("tr").show();
	}
	else {
		$("#new_category").parents("tr").hide();
	}
	resize();
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
		else if (f === 'category') {
			if ($("#category").val() === "New Category") {
				value = $("#new_category").val().trim();
			}
			else {
				value = $("#" + f).val().trim();
			}
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

	// Set up Upload button
	Browser.profileUploadableCheck(siteProfile, {
		uploadable: function() {
			$("#upload").on('click', function() {
				$("#message").text("");

				var ajaxData = buildProfile();

				Browser.profileUploadableCheck(ajaxData, {
					uploadable: function() {
						$.ajax({
							method: "POST",
							url: "http://www.coldbrewsoftware.com/drtc/profile",
							data: ajaxData,
						})
						.done(function(data, textStatus, jqXHR) {
							$("#message").text(data);
						})
						.fail(function(jqXHR, textStatus, errorThrown) {
							$("#message").text("Error: " + errorThrown);
						});
					},
					notUploadable: function() {
						$("#message").text("A profile for this site already exists.");
					}
				});
			});
		},
		notUploadable: function() {
			$("#upload").parents("tr").hide();
		}
	});
	$("#upload").button();

	// Fill in template values
	$("#template").on("selectmenuchange", fillInTemplateValues);

	// Show or hide the New Category input
	$("#category").on("selectmenuchange", showHideNewCategory);

	$('#section_selector, #comment_selector').on('input', function() {
		$('#template').val('');
		$('#template').selectmenu();
	});

	$("#enable").on("click", function() {
		$("#profile_not_found").hide();
		$("#profile_found").show();
		resize();

		Browser.templateQuery(function(template){
			var template_menu = $('select#template');
			template_menu.val(template).selectmenu("refresh");
			fillInTemplateValues(template_menu);
		});
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

self.port.on('fetch_panel_size', resize);

function resize() {
	var height = $("html").outerHeight();
	var width = $("html").outerWidth();
    self.port.emit("panel_size", {height: height, width: width});
}

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

	// Empty the category menu
	var category_menu = $('#category');
	category_menu.html("");
	category_menu.append('<option value="Uncategorized">Uncategorized</option>');
	category_menu.append('<option value="New Category">New Category</option>');
	category_menu.selectmenu();

	// Hide the new category input
	$("#new_category").parents("tr").hide();
	$("#new_category").val('');

	// Hide sections, will show later as needed
	$("#profile_found").hide();
	$("#profile_not_found").hide();

	// Empty the message and export box
	$("#message").text("");
	$("#export_text").val("").hide();

	// Empty the fields
	$("#section_selector, #comment_selector").val("");

	// Show the upload button
	$("#upload").parents("tr").show();

	// Clear site profile
	siteProfile = null;

	// Tooltips
	$(document).tooltip();

	Browser.getPageActionData(function(data) {
		profiles = data["profiles"];
		templates = data["templates"];
		categories = data["categories"];

		// Retrieve the profile matching this site
		for (i = 0 ; i < profiles.length ; i++) {
			p = profiles[i];
			// Retrieve the profile matching this site
			for (i = 0 ; i < profiles.length ; i++) {
				p = profiles[i];
				if (Browser.domainMatch(domain, p["domain"])) {
					siteProfile = p;
					siteIndex = i;
					break;
				}
			}
		}

		// Fill in template menu
		var template_menu = $('select#template');
		for (t of templates) {
			var optionHTML = "<option value=''></option>";
			template_menu.append(optionHTML);

			// Set up the option safely!
			template_menu.find("option")
				.filter(":last")
				.attr("value", t["system"])
				.text(t["system"]);
		}

		// Fill in category menu
		var category_menu = $('select#category');
		for (c of categories) {
			if (c === "Uncategorized") {continue;}

			var optionHTML = "<option value=''></option>";
			category_menu.append(optionHTML);

			// Set up the option safely!
			category_menu.find("option")
				.filter(":last")
				.attr("value", c)
				.text(c);
		}

		$("#mode_buttons").buttonset();

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
			$('#category').selectmenu('refresh');

			// Apply jQueryUI
			$('#template').selectmenu()
				.selectmenu("menuWidget")
				.addClass("selectmenu_scroll");
			$('#category').selectmenu()
				.selectmenu("menuWidget")
				.addClass("selectmenu_scroll");
			$("#mode_buttons").buttonset();
		}
		else {
			$("#profile_not_found").show();
		}
	});
}
