// // Path menu for Titanium
// // Tony Lukasavage
// //
// // Notes:
// // - Transforms must be declared outside the animation to
// //   work on Android. (http://jira.appcelerator.org/browse/TIMOB-5796)
// // - Animation 'complete' listeners seem to remove themselves 
// //   automatically after they execute and need to be re-added on
// //   every execution
// 
// // There MUST be more than 1 icon or the math breaks
var DEFAULTS = {
	ICON_IMAGE: '/images/star.png',
	ICON_SIZE: 35,
	ICON_NUMBER: 6,
	BUTTON_IMAGE: '/images/add.png',
	BUTTON_SIZE: 35,
	MENU_DURATION: 350,
	FADE_DURATION: 500,
	BOUNCE_DISTANCE: 25,
	STAGGER: 25
};
var isAndroid = Ti.Platform.osname === 'android';

exports.createMenu = function(o) {
	// Configure the settings for the menu
	o.iconImages = o.iconImages || createDefaultIconImages();
	o.iconSize = o.iconSize || DEFAULTS.ICON_SIZE;
	o.buttonImage = o.buttonImage || DEFAULTS.BUTTON_IMAGE;
	o.buttonSize = o.buttonSize || DEFAULTS.BUTTON_SIZE;
	o.menuDuration = o.menuDuration || DEFAULTS.MENU_DURATION;
	o.fadeDuration = o.fadeDuration || DEFAULTS.FADE_DURATION;
	o.radius = o.radius || (Ti.Platform.displayCaps.platformWidth/2 - o.iconSize/2);
	o.bounceDistance = o.bounceDistance || DEFAULTS.BOUNCE_DISTANCE;
	o.stagger = o.stagger || DEFAULTS.STAGGER;
	
	// Create reusable fade & scale animations
	var fadeOut = Ti.UI.createAnimation({
		duration: o.fadeDuration,
		opacity: 0,
	});
	fadeOut.transform = Ti.UI.create2DMatrix().scale(0, 0);
	var fadeLarge = Ti.UI.createAnimation({
		duration: o.fadeDuration,
		opacity: 0
	});
	fadeLarge.transform = Ti.UI.create2DMatrix().scale(4, 4);
	
	// Construct menu UI components and establish view hierarchy
	var menu = Ti.UI.createView();
	var menuIcons = [];
	var menuButton = createMenuButton(o);
	for (var i = 0; i < o.iconImages.length; i++) {
		var menuIcon = createMenuIcon(i, o);
		menuIcon.addEventListener('click', function(e) {
			for (var j = 0; j < menuIcons.length; j++) {
				if (j !== e.source.index) {
					menuIcons[j].animate(fadeOut);	
				} else {
					menuIcons[j].animate(fadeLarge);
				}	
			}
		});
		
		menuIcons.push(menuIcon);
		menu.add(menuIcon);
	}
	menu.add(menuButton);
 	
	menuButton.addEventListener('click', function(e) {
		var anim = menuButton.isOpen ? 'close' : 'open';
		menuButton.isOpen = !menuButton.isOpen;
		menuButton.animate(menuButton.animations[anim]);
		
		for (i = 0; i < menuIcons.length; i++) {
			var icon = menuIcons[i];
			icon.animations[anim + 'Bounce'].addEventListener(
				'complete', 
				anim === 'open' ? doCompleteOpen : doCompleteClose
			);
			icon.animate(icon.animations[anim + 'Bounce']);
			
			if (!isAndroid && icon.rotateAnimation) {
				icon.rotateAnimation();
			}
		}
	});
	
	return menu;
};

var createMenuButton = function(o) {
	var animations = {
		open: Ti.UI.createAnimation({
			duration: o.menuDuration	
		}),
		close: Ti.UI.createAnimation({
			duration: o.menuDuration
		})
	};
	animations.open.transform = Ti.UI.create2DMatrix().rotate(45);
	animations.close.transform = Ti.UI.create2DMatrix().rotate(0);
	
	var menuButton = Ti.UI.createImageView({
		image: o.buttonImage,
		height: o.buttonSize,
		width: o.buttonSize,
		left: 0,
		bottom: 0,
		isOpen: false,
		animations: animations
	});
	
	return menuButton;
};

var createMenuIcon = function(index, o) {
	var length = o.iconImages.length;
	var radians = (90 / (length - 1)) * index * Math.PI / 180;
	var bounceLeft = Math.sin(radians) * (o.radius + o.bounceDistance);
	var bounceBottom = Math.cos(radians) * (o.radius + o.bounceDistance);
	var finalLeft = Math.sin(radians) * o.radius;
	var finalBottom = Math.cos(radians) * o.radius;
	var animations = {
		openBounce: Ti.UI.createAnimation({
			duration: o.menuDuration,
			bottom: bounceBottom,
			left: bounceLeft,
			delay: index * o.stagger
		}),
		openFinal: Ti.UI.createAnimation({
			duration: o.menuDuration / 3.5,
			bottom: finalBottom,
			left: finalLeft
		}),
		closeBounce: Ti.UI.createAnimation({
			duration: o.menuDuration / 3.5,
			bottom: bounceBottom,
			left: bounceLeft,
			delay: (length - (index+1)) * o.stagger,
		}),
		closeFinal: Ti.UI.createAnimation({
			duration: o.menuDuration,
			bottom: 0,
			left: 0
		})
	};
	
	if (isAndroid) {
		animations.openBounce.transform = Ti.UI.create2DMatrix().rotate(720);
		animations.closeFinal.transform = Ti.UI.create2DMatrix().rotate(-720);
	}
	
	var icon = Ti.UI.createImageView({
		image: o.iconImages[index],
		height: o.iconSize,
		width: o.iconSize,
		left: 0,
		bottom: 0,
		animations: animations,
		index: index
	});
	icon.animations.openBounce.icon = icon;
	icon.animations.closeBounce.icon = icon;
	
	return icon;
};

var doCompleteOpen = function(e) {
	e.source.removeEventListener('complete', doCompleteOpen);
	e.source.icon.animate(e.source.icon.animations.openFinal);
};

var doCompleteClose = function(e) {
	e.source.removeEventListener('complete', doCompleteClose);
	e.source.icon.animate(e.source.icon.animations.closeFinal);
};

var createDefaultIconImages = function() {
	var icons = [];
	for (var i = 0; i < DEFAULTS.ICON_NUMBER; i++) {
		icons.push(DEFAULTS.ICON_IMAGE);	
	}
	return icons;	
};