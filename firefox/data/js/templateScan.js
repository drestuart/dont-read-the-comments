var templates = self.options.templates;

function templateQuery() {
	for (t of templates) {
		var section_selector = t['section_selector'];

		if ($(section_selector).length) {
			return t["system"];
		}
	}
}

self.port.on("templateQuery", function() {
	template = templateQuery();
	if (typeof template !== 'undefined') {
		self.port.emit("templateQueryResponse", template);
	}
});
