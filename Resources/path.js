// Path menu for Titanium
// Tony Lukasavage
//
// Notes:
// - Transforms must be declared outside the animation to
//   work on Android. (http://jira.appcelerator.org/browse/TIMOB-5796)
// - Animation 'complete' listeners seem to remove themselves 
//   automatically after they execute and need to be re-added on
//   every execution

// There MUST be more than 1 icon or the math breaks
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

/////////////////////////////////////////
////////// "Private" variables //////////
/////////////////////////////////////////
var settings = {},
	menu, 
    menuButton,
    menuIcons,
    fadeOut,
    fadeIn;

//////////////////////////////////////
////////// "Public" members //////////
//////////////////////////////////////
exports.EVENT_ICONCLICK = 'iconClick';
exports.createMenu = function(o) {
	// Configure the settings for the menu
	settings.iconList = o.iconList || createDefaultIconList();
	settings.iconSize = o.iconSize || DEFAULTS.ICON_SIZE;
	settings.buttonImage = o.buttonImage || DEFAULTS.BUTTON_IMAGE;
	settings.buttonSize = o.buttonSize || DEFAULTS.BUTTON_SIZE;
	settings.menuDuration = o.menuDuration || DEFAULTS.MENU_DURATION;
	settings.fadeDuration = o.fadeDuration || DEFAULTS.FADE_DURATION;
	settings.radius = o.radius || (Ti.Platform.displayCaps.platformWidth/2 - o.iconSize/2);
	settings.bounceDistance = o.bounceDistance || DEFAULTS.BOUNCE_DISTANCE;
	settings.stagger = o.stagger || DEFAULTS.STAGGER;
	
	// Create reusable fade & scale animations. Need to declare
	// the transforms outside of the animation. See notes at the beginning
	// of this file.
	fadeOut = Ti.UI.createAnimation({
		duration: settings.fadeDuration,
		opacity: 0,
	});
	fadeOut.transform = Ti.UI.create2DMatrix().scale(0, 0);
	fadeLarge = Ti.UI.createAnimation({
		duration: settings.fadeDuration,
		opacity: 0
	});
	fadeLarge.transform = Ti.UI.create2DMatrix().scale(4, 4);
	
	// Construct menu UI components and establish view hierarchy
	menu = Ti.UI.createView();
	menuButton = createMenuButton();
	menuIcons = [];
	
	menuButton.addEventListener('click', handleMenuButtonClick);
	for (var i = 0; i < o.iconList.length; i++) {
		var menuIcon = createMenuIcon(i);
		menuIcon.addEventListener('click', handleMenuIconClick);
		menuIcons.push(menuIcon);
		menu.add(menuIcon);
	}
	menu.add(menuButton);
	
	return menu;
};

/////////////////////////////////////////
////////// "Private" functions //////////
/////////////////////////////////////////
var handleMenuButtonClick = function(e) {
	var i, icon;
	var anim = menuButton.isOpen ? 'close' : 'open';
	
	// change the menu button state
	menuButton.isOpen = !menuButton.isOpen;
	menuButton.animate(menuButton.animations[anim]);
	
	// Open/close all the icons with animation
	for (i = 0; i < menuIcons.length; i++) {
		icon = menuIcons[i];
		icon.animations[anim + 'Bounce'].addEventListener(
			'complete', 
			anim === 'open' ? doCompleteOpen : doCompleteClose
		);
		icon.animate(icon.animations[anim + 'Bounce']);
		
		// ios requires the TiViewProxy.h hack for rotational animation
		if (!isAndroid && icon.rotateAnimation) {
			icon.rotateAnimation();
		}
	}
};

var handleMenuIconClick = function(e) {
	var i, radians, icon;
	
	menu.fireEvent(exports.EVENT_ICONCLICK, {
		source: menu,
		icon: e.source,
		index: e.source.index,
		id: e.source.id
	});
	
	// iterate through icons, fade and scale down the ones that weren't clicked,
	// fade and scale up the one that was.
	for (i = 0; i < menuIcons.length; i++) {
		radians = (90 / (menuIcons.length - 1)) * i * Math.PI / 180;
		icon = menuIcons[i];
		
		// android scales from the top left, not the center like ios,
		// hence the extra left/bottom animations
		if (i !== e.source.index) {
			if (isAndroid) {
				fadeOut.left = Math.sin(radians) * settings.radius + (icon.width * 0.5);
				fadeOut.bottom = Math.cos(radians) * settings.radius - (icon.height * 0.5);		
			}	
			icon.animate(fadeOut);
		} else {
			if (isAndroid) {
				fadeLarge.left = Math.sin(radians) * settings.radius - (icon.width * 1.5);
				fadeLarge.bottom = Math.cos(radians) * settings.radius + (icon.height * 1.5);
			}
			icon.animate(fadeLarge);
		}	
	}
};

var createMenuButton = function() {
	var animations = {
		open: Ti.UI.createAnimation({
			duration: settings.menuDuration	
		}),
		close: Ti.UI.createAnimation({
			duration: settings.menuDuration
		})
	};
	animations.open.transform = Ti.UI.create2DMatrix().rotate(45);
	animations.close.transform = Ti.UI.create2DMatrix().rotate(0);
	
	var menuButton = Ti.UI.createImageView({
		image: settings.buttonImage,
		height: settings.buttonSize,
		width: settings.buttonSize,
		left: 0,
		bottom: 0,
		isOpen: false,
		animations: animations
	});
	
	return menuButton;
};

var createMenuIcon = function(index) {
	var length = settings.iconList.length;
	var id = settings.iconList[index].id;
	var radians = (90 / (length - 1)) * index * Math.PI / 180;
	var bounceLeft = Math.sin(radians) * (settings.radius + settings.bounceDistance);
	var bounceBottom = Math.cos(radians) * (settings.radius + settings.bounceDistance);
	var finalLeft = Math.sin(radians) * settings.radius;
	var finalBottom = Math.cos(radians) * settings.radius;
	var animations = {
		openBounce: Ti.UI.createAnimation({
			duration: settings.menuDuration,
			bottom: bounceBottom,
			left: bounceLeft,
			delay: index * settings.stagger
		}),
		openFinal: Ti.UI.createAnimation({
			duration: settings.menuDuration / 3.5,
			bottom: finalBottom,
			left: finalLeft
		}),
		closeBounce: Ti.UI.createAnimation({
			duration: settings.menuDuration / 3.5,
			bottom: bounceBottom,
			left: bounceLeft,
			delay: (length - (index+1)) * settings.stagger,
		}),
		closeFinal: Ti.UI.createAnimation({
			duration: settings.menuDuration,
			bottom: 0,
			left: 0
		})
	};
	
	if (isAndroid) {
		animations.openBounce.transform = Ti.UI.create2DMatrix().rotate(720);
		animations.closeFinal.transform = Ti.UI.create2DMatrix().rotate(-720);
	}
	
	var icon = Ti.UI.createImageView({
		image: settings.iconList[index].image,
		height: settings.iconSize,
		width: settings.iconSize,
		left: 0,
		bottom: 0,
		animations: animations,
		index: index,
		id: id
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

var createDefaultIconList = function() {
	var icons = [];
	for (var i = 0; i < DEFAULTS.ICON_NUMBER; i++) {
		icons.push({
			image: DEFAULTS.ICON_IMAGE,
			id: undefined
		});	
	}
	return icons;	
};

var resetIcon = function(icon) {
	icon.opacity = 1;
	icon.transform.scale(1,1);
	icon.left = 0;
	icon.bottom = 0;
};