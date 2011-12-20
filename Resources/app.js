var win = Ti.UI.createWindow({
	backgroundColor: '#fff',
	fullscreen: false,
	exitOnClose: true
});
var menu = require('/path').createMenu({
	iconSize: 35,
	iconList: [
		{ image: 'images/star.png', id: 'email' },
		{ image: 'images/star.png', id: 'blog' },
		{ image: 'images/star.png', id: 'tony' },
		{ image: 'images/star.png', id: 'joejoe' }
	]
});
menu.addEventListener('iconClick', function(e) {
	Ti.API.info(e.source);
	Ti.API.info(e.icon);
	Ti.API.info(e.index);
	Ti.API.info(e.id);
});


win.add(menu);

win.open();