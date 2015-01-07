
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

numProfiles = 0;

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
		var fields = ["domain", "mode", "section_selector", "comment_selector"];

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
		var fields = ["domain", "mode", "section_selector", "comment_selector", "template"];
		var empty = true;

		if ($(row).hasClass("control_row")) {
			return; // continue
		}

		for (f of fields) {
			console.log(f);
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
		var fields = ["system", "section_selector", "comment_selector"];
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

$(document).ready(function() {

	// Load up comment system templates and profiles
	chrome.storage.sync.get(["profiles", "templates", "comment_threshold", 
		"custom_words", "word_lists_enabled"], function(data) {

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
	});

	// Add profile button
	$("#add_profile").on('click', function() {
		addProfileRow();
	});

	// Add template button
	$("#add_template").on('click', function() {
		addTemplateRow();
	});

	// Save options
	$("#save").on('click', function() {
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

		chrome.storage.sync.set(data, function() {
			console.log("Saved!");
		});
		location.reload();
	});

	// Reset options
	$("#reset").on('click', function() {
		if (confirm("This will reset all DRTC settings to their starting values. Are you sure?")) {
			loadStartingData();
		}
		location.reload();
	});
});



