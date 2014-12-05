
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

function addProfileRow(data)
{
	var rowHTML = '<tr id="profile' + numProfiles +'">' + 
		'<td><input type="text" class="domain" name="domain"></td>' + 
		'<td>' + 
		  '<select class="mode" name="mode" class="mode">' + 
		    '<option value="all">All</option>' + 
		    '<option value="individual">Individual</option>' + 
		    '<option value="disabled">Disabled</option>' + 
		  '</select>' + 
		'</td>' + 
		'<td><input type="text" class="section_selector" name="section_selector"></td>' + 
		'<td><input type="text" class="comment_selector" name="comment_selector"></td>' + 
	'</tr>';

	$("table#profiles > tbody").append(rowHTML);

	if (typeof data !== 'undefined') {
		var row = $('tr#profile' + numProfiles);
		var fields = ["domain", "mode", "section_selector", "comment_selector"];
		
		for (f of fields) {
			row.find("." + f).val(data[f]);
		}
	}

	numProfiles++;
}

$(document).ready(function() {
	// Load options
	chrome.storage.sync.get("awesome_data", function(data) {
		$("#awesome_data").val(data['awesome_data']);
		console.log("Got!");
		console.log(data);
	});

	// Load up saved profiles
	chrome.storage.sync.get("profiles", function(data) {
		console.log(data);
		var profiles = data["profiles"];

		for (p of profiles) {
			addProfileRow(p);
		}
	});

	// Add profile button
	$("#add_profile").on('click', function() {
		addProfileRow();
	});

	// Save options
	$("#save").on('click', function() {
		data = {"awesome_data": $("#awesome_data").val(),
				"profiles": []};

		$("table#profiles > tbody").find("tr").each(function(ind, row) {
			var profile = {};
			var fields = ["domain", "mode", "section_selector", "comment_selector"];
			
			for (f of fields) {
				profile[f] = $(row).find("." + f).val();
			}
			data.profiles.push(profile);
		});

		console.log(data);

		chrome.storage.sync.set(data, function() {
			console.log("Saved!");
		});
	});

	// Clear options
	$("#clear").on('click', function() {
		loadStartingData();
		console.log("Cleared!");
		location.reload();
	});
});



