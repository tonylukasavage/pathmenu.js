var win = Ti.UI.createWindow({
	backgroundColor: '#fff',
	fullscreen: false,
	exitOnClose: true
});
var menu = require('/path').createMenu({
	iconSize: 35	
});

win.add(menu);

win.open();