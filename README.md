# angular-image-load

Display default image while loading the main image. Preload images in your application before browserr encounter them.

## Installation

### npm

```shell
npm install ng-image-load
```

### bower

```shell
bower install ng-image-load
```

## Usage

Add **ng-image-load.js** or minified one **ng-image-load.min.js** to index.html

```html
<script src="ng-image-load.js"></script>
```

Then add `ngMessages` as a dependency for your app:

```javascript
var myApp = angular.module('myApp', ['ng-image-load']);
```

Add default image which will be displayed while loading main image

```javascript
    myApp
        .config(function(NgImageLoadServiceProvider) {
            NgImageLoadServiceProvider.setDefault('image_path');
        });
```

Use default-image while loading of main image in progress

```html
    <img ng-image-load="main_image_path"/>
```

Override default image

```html
    <img ng-image-load="main_image_path" default-image-url="default_image_path">
```

Preload images in your application before browser encounter them

```javascript
    // preload image
    myApp
        .config(function(NgImageLoadServiceProvider) {
                NgImageLoadServiceProvider.preloadImage({
                    url: 'image_path'
                });
        });

    // preload images
    myApp
        .config(function() {
            NgImageLoadServiceProvider.preloadImages([{
                url: 'image_path1'
            }, {
                url: 'image_path2'
            }]);
        });

    // provide a key name to the image
    myApp
        .config(function(NgImageLoadServiceProvider) {
            NgImageLoadServiceProvider.preloadImage({
                key: 'coverPic',
                url: 'image_path'
            });
        });
    }]);
```

Override the default image by providing image key. Benefit of providing key to the image is, a particular image can be used as a default image for loading at multiple places. Example of this can be loading a cover pic, this can have a default image which will be displayed while cover pic loading is under progress and this can be used in the places where cover pic is used. So in such scenarios providing image key proves to be beneficial

```html
    <img ng-image-load="image_path" default-image-key="coverPic"/>
```

Loading images in application manually

```javascript
    myApp
        .controller('MyController', function(NgImgLoadService) {
            // load image
            NgImageLoadService.loadImage('image_path').then(function(imageUrl) {
                // do things on successfull load of image
            });

            // load images
            var images = NgImageLoadService.loadImages([
                'image_path1',
                'image_path2',
                'image_path3'
            ]);
            for(var i = 0; i < images.length; i++) {
                images[i].then(function(imageUrl) {
                    // do things on successfull load of image
                });
            }
        });
```

fetching images in application manually

```javascript
    myApp
        .controller('MyController', function(NgImageLoadService) {
            // take action on preloaded images
            NgImageLoadService.getImageByKey('coverPic').then(function(imageUrl) {
                // take action once the image is loaded
            });
            var images = NgImageLoadService.getImagesByKey([
                'key1',
                'key2',
                'key3'
            ]);
            for(var i = 0; i < images.length; i++) {
                images[i].then(function(imageUrl) {
                    // take action
                });
            }
        });
```

# CONS
- Can be used only with **img** element
- ng-repeat haven't taken into consideration

# Contribution

If you find anything to add or find a bug, please send the pull request.

