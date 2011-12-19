# pathmenu.js by [@tonylukasavage](http://twitter.com/#!/tonylukasavage)

Add the super-hyped Path menu interface to your Appcelerator Titanium apps. Check out [path.com](http://path.com) for the inspiration.

## Highlights

* [12 second demo video](http://www.youtube.com/watch?v=VJrXuNkvkZc)
* Supported on iOS and Android
* Tested against Titanium Mobile 1.8.0.1 CI and 1.8 RC
* Written almost entirely in Javascript, but leverages the underlying native platforms for _great_ performance

## IMPORTANT 

A minor hack to the core Titanium Mobile SDK is required to get icon rotations working correctly with iOS. The reason I'm not submitting it as a pull request to [titanium_mobile](https://github.com/appcelerator/titanium_mobile) is because it is very function-specific and would create a parity issue between ios and android. If you can live with out the icon rotation on iOS, you don't have to bother. But if you want them, you need to patch the Titanium Mobile SDK's TiViewProxy.m file. Here's how to do it:

### Patching TiViewProxy.m

**TITANIUM_SDK**: Your Titanium SDK directory. Just in case, here's the [Titanium SDK locations on all supported operating systems](https://wiki.appcelerator.org/display/guides/Installing+Titanium+SDK+Continuous+Builds#InstallingTitaniumSDKContinuousBuilds-ManualInstall).
**TITANIUM_SDK_VERSION**: The Titanium SDK version you are targeting

1. Open TiViewProxy.m, found at `TITANIUM_SDK/mobilesdk/osx/TITANIUM_SDK_VERSION/iphone/Classes/TiViewProxy.m`
2. Add the content of [TiViewProxy.m.patch](https://github.com/tonylukasavage/pathmenu.js/blob/master/patch/TiViewProxy.m.patch) anywhere before the final `@end` in `TiViewProxy.m`.
3. Save TiViewProxy.m
4. Be sure to delete the contents of your project's `build/iphone` directory, but not the directory itself. This will force Titanium to do a full rebuild of your project, including recompiling the native code you just edited.

## Bugs and Feature Requests

[https://github.com/tonylukasavage/pathmenu.js/issues](https://github.com/tonylukasavage/pathmenu.js/issues)