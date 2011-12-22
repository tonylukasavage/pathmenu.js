var win = Ti.UI.createWindow({
	backgroundColor: '#fff',
	fullscreen: false,
	exitOnClose: true
});
var menu = require('/path').createMenu({
	iconSize: 35,
	iconList: [
		{ image: 'images/sm/facebook.png', id: 'facebook' },
		{ image: 'images/sm/pridat.png', id: 'pridat' },
		{ image: 'images/sm/twitter.png', id: 'twitter' },
		{ image: 'images/sm/vimeo.png', id: 'vimeo' },
		{ image: 'images/sm/youtube.png', id: 'youtube' }
	]
});
var label = Ti.UI.createLabel({
	text: 'index: ???\nid: ???',
	color: '#222',
	font: {
		fontSize: 24,
		fontWeight: 'bold'	
	},
	textAlign: 'center'
});

menu.addEventListener('iconClick', function(e) {
	Ti.API.info(e.source);
	Ti.API.info(e.index);
	Ti.API.info(e.id);
	label.text = 'index: ' + e.index + '\nid: ' + (e.id ? e.id : 'undefined');
});

var button = Ti.UI.createButton({
	title: 'reset menu',
	width: 120,
	height: 40,
	top: 20
});
button.addEventListener('click', function(e) {
	menu.initMenu();
	label.text = 'index: ???\nid: ???';
});

win.add(menu);
win.add(label);
win.add(button);

win.open();