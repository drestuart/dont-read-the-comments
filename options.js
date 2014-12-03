
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

$(document).ready(function() {
	// Load options
	chrome.storage.sync.get("awesome_data", function(data) {
		$("#awesome_data").val(data['awesome_data']);
		console.log("Got!");
		console.log(data);
	});

	// Save options
	$("#save").on('click', function() {
		var awesome_data = $("#awesome_data").val();

		data = $("#options_form").serializeObject();
		console.log(data);

		chrome.storage.sync.set(data, function() {
			console.log("Saved!");
		});
	});

	// Clear options
	$("#clear").on('click', function() {
		chrome.storage.sync.clear(function() {
			console.log("Cleared!");
			location.reload();
		});
	});
});



