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
menu.addEventListener('iconClick', function(e) {
	Ti.API.info(e.source);
	Ti.API.info(e.icon);
	Ti.API.info(e.index);
	Ti.API.info(e.id);
});


win.add(menu);

win.open();