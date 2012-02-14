# pathmenu.js by [@tonylukasavage](http://twitter.com/#!/tonylukasavage)

Add the super-hyped Path menu interface to your Appcelerator Titanium apps. Check out [path.com](http://path.com) for the inspiration.

## Highlights

* Forging Titanium Episode video - coming soon...
* Supported on iOS and Android
* Tested against Titanium Mobile 1.8.1
* Written almost entirely in Javascript, but leverages the underlying native platforms for _great_ performance

## Usage

Basic usage can be found in this repository's [app.js](https://github.com/tonylukasavage/pathmenu.js/blob/master/Resources/app.js) file

## iconClick Event

When you create a menu with `require('path').createMenu()`, you have one new event to work with. `iconClick` will let you know when ever you click on a menu icon. The event object in the `iconClick` event has the following properties.

* **source** - The view that generated the event. In this case, it will be the menu icon that you clicked.
* **index** - The index of the icon you clicked on. This can be used to determine which icon you clicked.
* **id** - The id of the icon you clicked on. This is a more direct way to identify the icon you clicked, but requires that you set each icons `id` property when defining the <a href="#iconList">iconList</a> property of the menu.

```javascript
var menu = require('path').createMenu();
menu.addEventListener('iconClick', function(e) {
    Ti.API.info(e.source);
	Ti.API.info(e.index);
	Ti.API.info(e.id);
});
```

## Menu configuration

The pathmenu.js module's `createMenu()` call can take a number of parameters to customize its appearance and behavior. All parameters are optional, though you'll likely want to define the <a href="#iconList">iconList</a> property to customize your menu. 

* **bounceDistance** - Determines the distance of the "bounce" effect when the menu opens. So if the `radius` of your menu is 100, and your `bounceDistance` is the default 25, the icons will actually travel 125 pixels/points along their vector before "bouncing" back to 100. **_(default: 25)_** 
* **buttonImage** - The image file or URL to be used to display the main menu button. **_(default: 'images/add.png')_**
* **buttonSize** - The height and width in pixels/points of the main menu button. **_(default: 35)_**
* **fadeDuration** - The amount of time, in milliseconds, that it takes for a menu icon to fade and scale out after you click it. **_(default: 500)_**
* **iconList** - <a href="#iconList">see details below</a>
* **iconRotation** - The number of degrees the icons will rotate when the menu is opened/closed
* **iconSize** - The height and width in pixels/points of the menu icon buttons **_(default: 35)_**
* **menuDuration** - The duration, in milliseconds, of the animation necessary to position all menu icons when you either open or close the main menu button via click. **NOTE:** An additional `(menuDuration / 3.5)` milliseconds is added to the animation duration to account for the time of the "bounce" effect. **_(default: 500)_**
* **radius** - The path menu displays menu icons along a 90 degree arc (1st quadrant). The `radius` determines the radius of the arc with respect to the position of the main menu button. **_(default: Ti.Platform.displayCaps.platformWidth/2 - iconSize/2)_**
* **stagger** - The amount of time, in milliseconds, to delay animations of each menu icon when it is opened/closed. This gives the menu that staggered, cascading behavior. **_(default: 25)_**


### iconList details<a name="iconList">&nbsp;</a>

An array of icons that represent the icons that will appear when you click the menu button. Each icon in `iconList` has the following properties.

* **image** - The actual image file or URL used to display the icon
* **id** - (optional) Identifies the icon, used in click events
       
A sample `iconList` might look something like this

```javascript
    var menu = require('path').createMenu({
        iconList: [
          	{ image: 'images/sm/facebook.png', id: 'facebook' },
        	{ image: 'images/sm/pridat.png', id: 'pridat' },
        	{ image: 'images/sm/twitter.png', id: 'twitter' },
        	{ image: 'images/sm/vimeo.png', id: 'vimeo' },
        	{ image: 'images/sm/youtube.png', id: 'youtube' }
        ]
    });
```

## iOS Needs a little help with rotations

The included **path.animator module** ([github project found here](https://github.com/tonylukasavage/path.animator)) allows iOS views to have a rotation value greater than 180 degrees. This is a limitation of native iOS transform matrices, not Titanium. A more robust, and platform-specific, animation method is required for these rotations. **path.animator** is an iOS module that resolves that problem. Please check out the [path.animator module project page](https://github.com/tonylukasavage/path.animator) for all the details. 

## Problems?

Log them in the [Issues section](https://github.com/tonylukasavage/pathmenu.js/issues?milestone=2&sort=created&direction=desc&state=open) of this project. The more detailed the issue, the better the chance it has of getting to the top of my todo list. Bonus points for reproducible test cases.
