var window = Ti.UI.createWindow({
	backgroundColor:'white'
});

var my_module = require('path.animator');
var foo = my_module.createView({
  	backgroundColor: '#f00',
  	width: 100,
  	height: 100
});

var image = Ti.UI.createImageView({
	image: 'http://appcodingeasy.com/cms.design/images/appcelerator.png',
  	width: 100,
  	height: 100
});
foo.add(image);


foo.addEventListener('click', function() {
	foo.rotate({
		angle: 720,
		duration: 3000,
		delay: 1000,
		timingFunction: Ti.UI.iOS.ANIMATION_CURVE_EASE_OUT
	});
});
 
window.add(foo);
window.open();
