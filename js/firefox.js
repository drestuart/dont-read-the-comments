var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var activeIcons = {
	"16": self.data.url("logo_drtc_16.png"),
    "19": self.data.url("logo_drtc_19.png"),
    "38": self.data.url("logo_drtc_38.png"),
    "48": self.data.url("logo_drtc_48.png")
};

var inactiveIcons = {
	"19": self.data.url("logo_drtc_gs_19.png"),
	"38": self.data.url("logo_drtc_gs_38.png"),
};

// Toolbar button for page action
var button = buttons.ActionButton({
	id: "drtc-page-action",
	label: "DRTC!",
	icon: activeIcons,
	onClick: DRTCInactive //pageAction
});

function pageAction(state) {
	tabs.open("https://www.mozilla.org/");
}

function DRTCInactive() {
	button.state("window", {
		icon: inactiveIcons
	});
}

function DRTCActive() {
	button.state("window", {
		icon: activeIcons
	});
}