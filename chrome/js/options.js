
// http://css-tricks.com/snippets/jquery/serialize-form-to-json/
$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

var numProfiles = 0;
var profileFields = ["domain", "mode", "section_selector", "comment_selector", "template"];
var profileFieldsWithoutTemplate = ["domain", "mode", "section_selector", "comment_selector"];
var profileFieldsWithTemplate = ["domain", "mode"];
var templateFields = ["system", "section_selector", "comment_selector"];

function addProfileRow(data) {
	var rowHTML = '<li id="profile' + numProfiles +'" class="profile_row">' +
		'<div><input type="text" class="domain" name="domain"></div>' +
		'<div class="mode_col">' +
			'<div class="mode_buttons">' +
				'<input type="radio" class="mode" name="mode' + numProfiles +'" id="mode_all' + numProfiles +'" value="all">' +
				'<label for="mode_all' + numProfiles +'">All</label>' +
				'<input type="radio" class="mode" name="mode' + numProfiles +'" id="mode_individual' + numProfiles +'" value="individual">' +
				'<label for="mode_individual' + numProfiles +'">Individual</label>' +
				'<input type="radio" class="mode" name="mode' + numProfiles +'" id="mode_disabled' + numProfiles +'" value="disabled">' +
				'<label for="mode_disabled' + numProfiles +'">Disabled</label>' +
			'</div>' +
		'</div>' +
		'<div><input type="text" class="section_selector" name="section_selector"></div>' +
		'<div><input type="text" class="comment_selector" name="comment_selector"></div>' +
		'<div><select class="template" name="template"><option value="none">None</option></select></div>' +
		'<div class="delete_col"><input type="button" value="-" class="delete_row"></div>' +
	'</li>';

	$("#profiles .scroll_area").append(rowHTML);

	var row = $('li#profile' + numProfiles);

	// Populate template select list
	for (t of templates) {
		var optionHTML = "<option value='" + t["system"] + "'>" + t["system"] + "</option>";
		row.find('.template').append(optionHTML);
	}

	// Populate supplied data
	if (typeof data !== 'undefined') {
		var fields = profileFields;

		if (data['template'] !== 'none' && data['template'] !== '') {
			var template_selector = row.find('.template');
			template_selector.val(data['template']);

			// If we got a valid template, fill in the selector values
			if (fillInTemplateValues(template_selector)) {
				fields = profileFieldsWithTemplate;
			}
			// If not, don't fill in the erroneous template value
			else {
				fields = profileFieldsWithoutTemplate;
			}
		}

		for (f of fields) {
			var value = data[f];
			if (f === 'template' && value === '') {
				row.find("." + f).val('none');
			}
			else if (f === 'mode') {
				row.find(".mode_col input[type=radio][value=" + value + "]").prop('checked', true);
			}
			else {
				row.find("." + f).val(value);
			}
		}
	}

	// Wire up delete button
	row.find('.delete_row').on('click', function() {
		$(this).parents("li").remove();
	}).button();

	// Apply jQueryUI
	row.find(".template").selectmenu();
	row.find(".mode_buttons").buttonset();

	// Wire up profile select
	row.find('.template').on('selectmenuchange', function() {
		fillInTemplateValues(this);
	});

	// Wire up other fields
	row.find('.section_selector, .comment_selector').on('input', function() {
		row.find('.template').val('none');
		row.find('.template').selectmenu("refresh");
	});

	numProfiles++;
}

function fillInTemplateValues(element) {
	var template_name = $(element).val();
	var row = $(element).parents("li");
	if (template_name !== 'none') {
		var selected_template = null;

		for (t of templates) {
			if (t['system'] === template_name) {
				selected_template = t;
				break;
			}
		}

		// Fill in template values
		if (selected_template != null) {
			row.find('.section_selector').val(selected_template['section_selector']);
			row.find('.comment_selector').val(selected_template['comment_selector']);
			return true;
		}
		// Didn't find the specified template for some reason
		else {
			$(element).val('none');
			return false;
		}
	}
}

numTemplates = 0;

function addTemplateRow(data) {
	var rowHTML = '<li id="template' + numTemplates +'"  class="template_row">' +
		'<div><input type="text" class="system" name="system"></div>' +
		'<div><input type="text" class="section_selector" name="section_selector"></div>' +
		'<div><input type="text" class="comment_selector" name="comment_selector"></div>' +
		'<div class="delete_col"><input type="button" value="-" class="delete_row"></div>' +
	'</li>';

	$("#templates > .scroll_area").append(rowHTML);

	if (typeof data !== 'undefined') {
		var row = $('li#template' + numTemplates);
		var fields = ["system", "mode", "section_selector", "comment_selector"];
		
		for (f of fields) {
			row.find("." + f).val(data[f]);
		}

		// Make the system name field readonly
		row.find(".system").attr("readonly", "readonly");
	}

	// Wire up the delete button
	$('#template' + numTemplates + ' .delete_row').on('click', function() {
		$(this).parents("li").remove();
	}).button();

	numTemplates++;
}

function getProfileData() {

	var retArr = [];

	$("#profiles > .scroll_area").find("li").each(function(ind, row) {
		row = $(row); // I mean really
		var profile = {};
		var fields = profileFields;
		var empty = true;

		if (row.hasClass("control_row")) {
			return; // continue
		}

		for (f of fields) {
			var value = row.find("." + f).val();

			// Trim extraneous stuff from domain
			if (f === "domain") {
				value = parseUri(value).authority;
			}
			else if (f === 'template' && value == 'none') {
				value = '';
			}
			else if (f === 'mode') {
				value = row.find("input.mode[type=radio]:checked").val();
			}

			profile[f] = value.trim();

			// Don't save empty rows!
			if (f !== "mode" && value !== "") {
				empty = false;
			}
		}

		if (!empty) {
			retArr.push(profile);
		}
	});

	return retArr;
}

function getTemplateData() {
	var retArr = [];

	$("#templates > .scroll_area").find("li").each(function(ind, row) {
		var template = {};
		var fields = templateFields;
		var empty = true;

		if ($(row).hasClass("control_row")) {
			return; // continue
		}

		for (f of fields) {
			var value = $(row).find("." + f).val().trim();
			template[f] = value;

			// Don't save empty rows!
			if (value !== "") {
				empty = false;
			}
		}

		if (!empty) {
			retArr.push(template);
		}
	});

	return retArr;
}

function exportProfiles() {
	profiles_json = Tools.exportProfiles(getProfileData());
	$("#import_profiles_go").hide();
	$("#profiles_textarea").show().val(profiles_json).prop('readonly', true);
}


function importProfiles() {
	var imp_profiles = JSON.parse($("#profiles_textarea").val());

	// Validate input
	if (Array.isArray(imp_profiles)) {
		for (prof of imp_profiles) {

			// Set default values
			prof = setProfileDefaults(prof);

			if (!validateProfile(prof)) {
				console.log("Failed validation: ");
				console.log(prof);
				return;
			}
		}
	}
	else if (imp_profiles !== null && typeof imp_profiles === 'object') {
		if (!validateProfile(imp_profiles)) {
			console.log("Failed validation:");
			console.log(imp_profiles);
			return;
		}
		// Put it in an array
		imp_profiles = [imp_profiles];
	}
	else {
		alert("JSON parsing failed");
		return;
	}

	// Import
	var profiles = getProfileData();

	profiles = Tools.mergeProfiles(profiles, imp_profiles);

	// Save and reload
	var data = {profiles : profiles};
	Browser.save(data, function() {
		console.log("Saved!");
		location.reload();
	});
}

function importTemplates() {
	var imp_templates = JSON.parse($("#templates_textarea").val());

	if (Array.isArray(imp_templates)) {
		for (temp of imp_templates) {
			if (!validateTemplate(temp)) {
				console.log("Failed validation: ");
				console.log(temp);
				return;
			}
		}
	}
	else if (imp_templates !== null && typeof imp_templates === 'object') {
		if (!validateTemplate(imp_templates)) {
			console.log("Failed validation:");
			console.log(imp_templates);
			return;
		}
		// Put it in an array
		imp_templates = [imp_templates];
	}
	else {
		alert("JSON parsing failed");
		return;
	}

	// Import
	console.log("Importing templates: ");
	console.log(imp_templates);

	var temps = getTemplateData();

	temps = Tools.mergeTemplates(temps, imp_templates);

	// Save and reload
	var data = {templates : temps};
	Browser.save(data, function() {
		console.log("Saved!");
		location.reload();
	});
}

function setProfileDefaults(profile) {
	var defaults = {'mode' : 'all', 'category' : 'uncategorized'};

	for (var field in defaults) {
		if (typeof profile[field] === 'undefined' || profile[field] === '') {
			profile[field] = defaults[field];
		}
	}

	return profile;
}

function validateProfile(obj) {
	var fields = profileFields;
	
	for (field in obj) {
		if (fields.indexOf(field) === -1) {
			var msg = "Bad field: " + field;
			console.log(msg);
			alert("Import failed. " + msg);
			return false;
		}
	}

	for (field of fields) {
		if (typeof obj[field] === 'undefined') {
			// These fields can be missing if we have a template defined
			if ((field === 'section_selector' || field === 'comment_selector') &&
				(typeof obj["template"] !== 'undefined' && obj["template"] !== "")) {
				continue;
			}

			var msg = "Missing field: " + field;
			console.log(msg);
			alert("Import failed. " + msg);
			return false;
		}
	}

	return true;
}

function validateTemplate(temp) {
	var fields = templateFields;
	return validateImport(temp, fields);
}

function validateImport(obj, fields) {
	for (field in obj) {
		console.log(field);
		if (fields.indexOf(field) === -1) {
			var msg = "Bad field: " + field;
			console.log(msg);
			alert("Import failed. " + msg);
			return false;
		}
	}

	for (field of fields) {
		console.log(field);
		if (typeof obj[field] === 'undefined') {
			var msg = "Missing field: " + field;
			console.log(msg);
			alert("Import failed. " + msg);
			return false;
		}
	}

	return true;
}

function getSliderText(val) {
    if (val === 0) {
	    return val + " (hide everything)";
    }

    return val;
}

$(document).ready(function() {

	// Load up comment system templates and profiles
	Browser.getOptionsPageData(function(data) {

		templates = data["templates"];
		ct = data["comment_threshold"];
		var profiles = data["profiles"];
		var custom_words = data["custom_words"];
		var word_lists_enabled = data["word_lists_enabled"];

		// Build profile and template tables
		for (t of templates) {
			addTemplateRow(t);
		}

		for (p of profiles) {
			addProfileRow(p);
		}

		// Set up sortable jQueryUI on profile and template tables
		$(".profile_table > .scroll_area").sortable({
			connectWith: ".profile_table > .scroll_area",
			placeholder: "ui-state-highlight",
			axis: "y",
		});

		$(".template_table > .scroll_area").sortable({
			connectWith: ".template_table > .scroll_area",
			placeholder: "ui-state-highlight",
			axis: "y",
		});

		// Fill in word lists
		$("#custom_list").val(custom_words.join(", "));
		$("#profanity_list").val(profanity_words.join(", "));
		$("#obscenity_list").val(obscenity_words.join(", "));
		$("#bigotry_list").val(bigotry_words.join(", "));

		// Fill in word list check boxes
		$("#profanity_check").prop('checked', word_lists_enabled["profanity"]).button();
		$("#obscenity_check").prop('checked', word_lists_enabled["obscenity"]).button();
		$("#bigotry_check").prop('checked', word_lists_enabled["bigotry"]).button();

		$("#profanity_check, #obscenity_check, #bigotry_check").each(function() {
			setCheckboxLabel(this);
		});
		$("#profanity_check, #obscenity_check, #bigotry_check").on('click', function() {
			setCheckboxLabel(this);
		});

		function setCheckboxLabel(elt) {
			var text;
			if ($(elt).prop('checked')) {
				text = "Enabled";
			}
			else {
				text = "Disabled";
			}
			console.log("Setting text " + text + " for label[for=" + $(elt).attr('id') + "]");
			$("label[for=" + $(elt).attr('id') + "] span.ui-button-text").text(text);
		}

		// Set up slider
		var ctselect = $("#comment_threshold_select");
		ctselect[0].selectedIndex = ct;
	    $("#comment_threshold").slider({
			min: 0,
			max: 11, // !!!
			range: "min",
			value: ctselect[0].selectedIndex,
			orientation: "horizontal",
			slide: function( event, ui ) {
				ctselect[0].selectedIndex = ui.value;
				$("#comment_threshold_value").val(ctselect.find("option:selected").text());
			}
	    });
		$("#comment_threshold_value").val(ctselect.find("option:selected").text());
	});

	// Add profile button
	$("#add_profile").on('click', function() {
		addProfileRow();

		// Scroll table to the bottom
		$("#profiles .scroll_area").scrollTop($("#profiles .scroll_area")[0].scrollHeight);
	}).button();

	// Add template button
	$("#add_template").on('click', function() {
		addTemplateRow();

		// Scroll table to the bottom
		$("#templates .scroll_area").scrollTop($("#templates .scroll_area")[0].scrollHeight);
	}).button();

	$(".textarea_show").on("click", function() {
		var textarea_id = $(this).attr("data-for");
		$("#" + textarea_id).show();
		$(this).hide();
	}).button();

	// Export buttons
	$("#export_profiles").on("click", exportProfiles).button();

	$("#export_templates").on("click", function() {
		var templates_json = JSON.stringify(getTemplateData());
		$("#import_templates_go").hide();
		$("#templates_textarea").show().val(templates_json).prop('readonly', true);
	}).button();

	// Import buttons
	$("#import_profiles").on("click", function() {
		$("#import_profiles_go").show();
		$("#profiles_textarea").show().val("").prop('readonly', false);
	}).button();

	$("#import_templates").on("click", function() {
		$("#import_templates_go").show();
		$("#templates_textarea").show().val("").prop('readonly', false);
	}).button();

	// Save options
	$(".save_button").button().click(function(event) {
		var data = {};

		data.profiles = getProfileData();
		data.templates = getTemplateData();
		data.comment_threshold = $("#comment_threshold").slider("value");
		data.custom_words = $("#custom_list").val()
			.replace(/\s+/g, " ")
			.trim()
			.toLowerCase()
			.split(/\s*,\s*/m);

		word_lists_enabled = {};

		word_lists_enabled["profanity"] = $("#profanity_check").prop('checked');
		word_lists_enabled["obscenity"] = $("#obscenity_check").prop('checked');
		word_lists_enabled["bigotry"] = $("#bigotry_check").prop('checked');

		data.word_lists_enabled = word_lists_enabled;

		Browser.save(data, function() {
			location.reload();
		});
	});

	// Set up modals
	var resetConfirm = $("#reset-confirm").dialog({
		resizable: false,
		autoOpen: false,
		modal: true,
		buttons: {
			"Reset": function() {
				importStartingData();
				$(this).dialog("close");
				location.reload();
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		}
	});

	$(".reset_button").button().click(function(event) {
		resetConfirm.dialog("open");
	});

	var profileImportConfirm = $("#profile-import-confirm").dialog({
		resizable: false,
		autoOpen: false,
		modal: true,
		buttons: {
			"Import": function() {
				importProfiles();
				$(this).dialog("close");
				location.reload();
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		}
	});

	var templateImportConfirm = $("#template-import-confirm").dialog({
		resizable: false,
		autoOpen: false,
		modal: true,
		buttons: {
			"Import": function() {
				importTemplates();
				$(this).dialog("close");
				location.reload();
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		}
	});

	// Import trigger buttons
	$("#import_profiles_go").on("click", function() {
		profileImportConfirm.dialog("open");
	}).button();

	$("#import_templates_go").on("click", function() {
		templateImportConfirm.dialog("open");
	}).button();

});



