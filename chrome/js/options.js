
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
var templateFields = ["system", "section_selector", "comment_selector"];

function addProfileRow(data) {
	var rowHTML = '<tr id="profile' + numProfiles +'">' + 
		'<td><input type="text" class="domain" name="domain"></td>' + 
		'<td>' + 
		  '<select class="mode" name="mode">' + 
		    '<option value="all">All</option>' + 
		    '<option value="individual">Individual</option>' + 
		    '<option value="disabled">Disabled</option>' + 
		  '</select>' + 
		'</td>' + 
		'<td><input type="text" class="section_selector" name="section_selector"></td>' + 
		'<td><input type="text" class="comment_selector" name="comment_selector"></td>' + 
		'<td><select class="template" name="template"><option value="">None</option></select></td>' +
		'<td class="delete_col"><input type="button" value="-" class="delete_row"></td>' +
	'</tr>';

	$("table#profiles > tbody").append(rowHTML);

	var row = $('tr#profile' + numProfiles);

	// Populate template select list
	for (t of templates) {
		var optionHTML = "<option value='" + t["system"] + "'>" + t["system"] + "</option>";
		row.find('.template').append(optionHTML);
	}

	// Populate supplied data
	if (typeof data !== 'undefined') {
		var fields = profileFields;

		if (data['template'] !== '') {
			fields = ["domain", "mode"];
			var template_selector = row.find('.template');
			template_selector.val(data['template']);
			fillInTemplateValues(template_selector);
		}

		for (f of fields) {
			row.find("." + f).val(data[f]);
		}
	}

	// Wire up delete button
	row.find('.delete_row').on('click', function() {
		$(this).parents("tr").remove();
	});

	// Wire up profile select
	row.find('.template').on('change', function() {
		fillInTemplateValues(this);
	});

	// Wire up other fields
	row.find('.section_selector, .comment_selector').on('input', function() {
		row.find('.template').val('');
	});

	numProfiles++;
}

function fillInTemplateValues(element) {
	var template_name = $(element).val();
	var row = $(element).parents("tr");
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
			row.find('.section_selector').val(selected_template['section_selector']);
			row.find('.comment_selector').val(selected_template['comment_selector']);
		}
	}
}

numTemplates = 0;

function addTemplateRow(data) {
	var rowHTML = '<tr id="template' + numTemplates +'">' + 
		'<td><input type="text" class="system" name="system"></td>' + 
		'<td><input type="text" class="section_selector" name="section_selector"></td>' + 
		'<td><input type="text" class="comment_selector" name="comment_selector"></td>' + 
		'<td class="delete_col"><input type="button" value="-" class="delete_row"></td>' +
	'</tr>';

	$("table#templates > tbody").append(rowHTML);

	if (typeof data !== 'undefined') {
		var row = $('tr#template' + numTemplates);
		var fields = ["system", "mode", "section_selector", "comment_selector"];
		
		for (f of fields) {
			row.find("." + f).val(data[f]);
		}
	}

	// Wire up the delete button
	$('#template' + numTemplates + ' .delete_row').on('click', function() {
		$(this).parents("tr").remove();
	});

	numTemplates++;
}

function getProfileData() {

	var retArr = [];

	$("table#profiles > tbody").find("tr").each(function(ind, row) {
		var profile = {};
		var fields = profileFields;
		var empty = true;

		if ($(row).hasClass("control_row")) {
			return; // continue
		}

		for (f of fields) {
			var value = $(row).find("." + f).val().trim();

			// Trim extraneous stuff from domain
			if (f === "domain") {
				value = parseUri(value).authority;
			}

			profile[f] = value;

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

	$("table#templates > tbody").find("tr").each(function(ind, row) {
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

function validateProfile(prof) {
	var fields = profileFields;
	return validateImport(prof, fields);
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

$(document).ready(function() {

	// Load up comment system templates and profiles
	Browser.getOptionsPageData(function(data) {

		templates = data["templates"];
		ct = data["comment_threshold"];
		var profiles = data["profiles"];
		var custom_words = data["custom_words"];
		var word_lists_enabled = data["word_lists_enabled"];

		for (t of templates) {
			addTemplateRow(t);
		}

		for (p of profiles) {
			addProfileRow(p);
		}

		// Fill in word lists
		$("#custom_list").val(custom_words.join(", "));
		$("#profanity_list").val(profanity_words.join(", "));
		$("#obscenity_list").val(obscenity_words.join(", "));
		$("#bigotry_list").val(bigotry_words.join(", "));

		// Fill in word list check boxes
		$("#profanity_check").prop('checked', word_lists_enabled["profanity"]);
		$("#obscenity_check").prop('checked', word_lists_enabled["obscenity"]);
		$("#bigotry_check").prop('checked', word_lists_enabled["bigotry"]);

		// Set up slider
	    $("#comment_threshold").slider({
			value: ct,
			min: 0,
			max: 5,
			step: 0.5,
			slide: function( event, ui ) {
				if (ui.value === 0) {
					$("#comment_threshold_value").val(ui.value + " (hide everything)");
				}
				else {
					$("#comment_threshold_value").val(ui.value);
				}
			}
	    });
	    $("#comment_threshold_value").val($("#comment_threshold").slider("value"));
	    if (ct === 0) {
		    $("#comment_threshold_value").val($("#comment_threshold").slider("value") + " (hide everything)");
	    }
	});

	// Add profile button
	$("#add_profile").on('click', function() {
		addProfileRow();

		// Scroll table to the bottom
		$("#profiles tbody").scrollTop($("#profiles tbody")[0].scrollHeight);
	});

	// Add template button
	$("#add_template").on('click', function() {
		addTemplateRow();

		// Scroll table to the bottom
		$("#templates tbody").scrollTop($("#templates tbody")[0].scrollHeight);
	});

	$(".textarea_show").on("click", function() {
		var textarea_id = $(this).attr("data-for");
		$("#" + textarea_id).show();
		$(this).hide();
	});

	// Export buttons
	$("#export_profiles").on("click", exportProfiles);

	$("#export_templates").on("click", function() {
		var templates_json = JSON.stringify(getTemplateData());
		$("#import_templates_go").hide();
		$("#templates_textarea").show().val(templates_json).prop('readonly', true);
	});

	// Import buttons
	$("#import_profiles").on("click", function() {
		$("#import_profiles_go").show();
		$("#profiles_textarea").show().val("").prop('readonly', false);
	});

	$("#import_templates").on("click", function() {
		$("#import_templates_go").show();
		$("#templates_textarea").show().val("").prop('readonly', false);
	});

	// Import trigger buttons
	$("#import_profiles_go").on("click", function() {
		if (confirm("This will overwrite any existing profiles with the same domain. Continue?")) {
			importProfiles();
		}
	});

	$("#import_templates_go").on("click", function() {
		if (confirm("This will overwrite any existing templates with the same name. Continue?")) {
			importTemplates();
		}
	});

	// Save options
	$(".save_button").on('click', function() {
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
			console.log("Saved!");
		});
		location.reload();
	});

	// Reset options
	$(".reset_button").on('click', function() {
		if (confirm("This will re-import DRTC's starting settings. Are you sure?")) {
			importStartingData();
		}
	});
});


