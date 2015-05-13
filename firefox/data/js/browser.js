Browser = {};

Browser.getContentScriptData = function(func) {
	self.port.once("contentScriptDataResponse", function(contentScriptData) {
		func(contentScriptData);
	});

	self.port.emit("contentScriptDataRequest");
}

Browser.getOptionsPageData = function(func) {
	self.port.once("optionsPageDataResponse", function(optionsPageData) {
		func(optionsPageData);
	});

	self.port.emit("optionsPageDataRequest");
}

Browser.getPageActionData = function(func) {
	self.port.once("pageActionDataResponse", function(pageActionData) {
		func(pageActionData);
	});

	self.port.emit("pageActionDataRequest");
}

Browser.importStartingData = function(func) {
	self.port.once("importDataResponse", function() {
		func();
	});

	self.port.emit("importDataRequest");
}

Browser.importProfiles = function(profiles, imp_profiles, func) {
	self.port.once("importProfileResponse", function() {
		func();
	});

	var data = {existing: profiles, importing: imp_profiles};
	self.port.emit("importProfileRequest", data);
}

Browser.importTemplates = function(temps, imp_templates, func) {
	self.port.once("importTemplateResponse", function() {
		func();
	});

	var data = {existing: templates, importing: imp_templates};
	self.port.emit("importTemplateRequest", data);
}

Browser.getTabUrl = function(func) {
	self.port.once("getUrlResponse", function(response) {
		func(response);
	});

	self.port.emit("getUrlRequest");
}

Browser.save = function(data, func) {
	self.port.once("saveDataResponse", function() {
		func();
	});

	self.port.emit("saveDataRequest", data);
}

Browser.pageActionEnabled = function() {
	self.port.emit("pageActionEnabledRequest");
}

Browser.pageActionDisabled = function() {
	self.port.emit("pageActionDisabledRequest");
}

Browser.reload = function() {
	self.port.emit("reloadActiveTabRequest");
}

Browser.profileUploadableCheck = function(profile, callbacks) {
	if (profile === null) {
		callbacks.uploadable();
		return;
	}

	self.port.once("profileUploadableCheckResponse", function(uploadable) {
		if (uploadable) {
			callbacks.uploadable();
		}
		else {
			callbacks.notUploadable();
		}
	});

	self.port.emit("profileUploadableCheckRequest", profile);
}

Browser.templateQuery = function(func) {
	self.port.once("templateQueryResponse", function(template) {
		if (template !== null) {
			func(template);
		}
	});

	self.port.emit("templateQuery", null);
}


// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegExp(string){
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

Browser.domainMatch = function (domain, toCheck) {
	// Check if the check domain has a glob in it
	if (toCheck.indexOf('*') !== -1) {
		// Build it into a regex
		toCheck = escapeRegExp(toCheck);
		toCheck = toCheck.replace(/\\\*/g, '[\\w\.-]*')  + '$';
		if (domain.match(toCheck)) {
			return true;
		}
	}
	else {
		// Check if the domain matches or is a subdomain
		// of the domain to check
		if (domain === toCheck) {
			return true;
		}

		var domainRe = new RegExp(".+\\." + escapeRegExp(toCheck) + "$");
		if (domain.match(domainRe)) {
			return true;
		}
	}
	return false;
}