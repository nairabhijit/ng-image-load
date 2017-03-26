// your library here
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular'], factory);
  } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
    // CommonJS support (for us webpack/browserify/ComponentJS folks)
    module.exports = factory(require('angular'));
  } else {
    // in the case of no module loading system
    // then don't worry about creating a global
    // variable like you would in normal UMD.
    // It's not really helpful... Just call your factory
    return factory(root.angular);
  }
}(this, NgImageLoad));

function NgImageLoad(angular) {
    'use strict';
    
    var moduleName = 'ngImageLoad';
    angular
        .module(moduleName, [])
        .run(['NgImageLoadService', function(NgImageLoadService) {
            NgImageLoadService.load();
        }])
        .directive('ngImageLoad', ['NgImageLoadService', ngImageLoadDirective])
        .provider('NgImageLoadService', NgImageLoadServiceProvider);

    return moduleName;
}

function ngImageLoadDirective(NgImageLoadService) {
    return {
        restrict: 'A',
        scope: {
            ngImageLoad: '@',
            defaultImageKey: '@',
            defaultImageUrl: '@'
        },
        link: function(scope, element, attrs) {
            var isImageLoaded = false;
            getDefaultImage();
            var imageUrl = scope.ngImageLoad;

            if(imageUrl) {
                _loadImage(imageUrl);
            }

            function getDefaultImage() {
                var promise;
                if(scope.defaultImageUrl) {
                    promise = NgImageLoadService.loadImage(scope.defaultImageUrl);
                } else if (scope.defaultImageKey) {
                    promise = NgImageLoadService.getImageByKey(scope.defaultImageKey);
                } else {
                    promise = NgImageLoadService.getDefaultImage();
                }
                promise.then(function(url) {
                    if(!url) {
                        console.error('No default image provided');
                    } else {
                        if(!isImageLoaded) {
                            _updateImage(url);
                        }
                    }
                }, function(err) {
                    console.error(err);
                });
            }
            function _loadImage(url) {
                NgImageLoadService.loadImage(url).then(function (url) {
                    isImageLoaded = true;
                    _updateImage(url);
                }, function(err) {
                    console.error(err);
                });
            }
            function _updateImage(url) {
                element.attr('src', url);
            }
        }
    };
}

function NgImageLoadServiceProvider() {
    var defaultImage = {
        url: '',
        promise: null
    };
    var images = [];

    return {
        $get: ['$q', NgImageLoadService],
        setDefault: setDefault,
        preloadImage: preloadImage,
        preloadImages: preloadImages
    };

    function setDefault(url) {
        defaultImage.url = url;
    }

    function preloadImage(details) {
        images.push(details);
    }

    function preloadImages(details) {
        for(var i = 0; i < details.length; i++) {
            preloadImage(details[i]);
        }
    }

    function NgImageLoadService($q) {
        return {
            load: load,
            loadImage: loadImage,
            loadImages: loadImages,
            getImageByKey: getImageByKey,
            getImagesByKey: getImagesByKey,
            getDefaultImage: getDefaultImage
        };
        
        function load() {
            if(defaultImage.url) {
                defaultImage.promise = loadImage(defaultImage.url);
            }
            for(var i = 0; i < images.length; i++) {
                images[i].promise = loadImage(images[i].url);
            }
        }

        function loadImage(url) {
            var defer = $q.defer();
            if(url) {
                var image = new Image();
                image.addEventListener('load', function() {
                    defer.resolve(url);
                });
                image.addEventListener('error', function(error) {
                    defer.reject(error);
                });
                image.src = url;
            } else {
                defer.reject('parameter \'url\' not provided');
            }
            return defer.promise;
        }

        function loadImages(details) {
            var _images = [];
            for(var i = 0; i < details.length; i++) {
                _images.push(loadImage(details[i]));
            }
            return _images;
        }

        function getImageByKey(key) {
            var defer = $q.defer();
            var imageKeyExist = false;
            if(!key) {
                defer.reject('parameter \'key\' not provided');
            } else {
                for(var i = 0; i < images.length; i++) {
                    if(images[i].hasOwnProperty('key') && images[i].key === key) {
                        imageKeyExist = true;
                        images[i].promise.then(defer.resolve, defer.reject);
                        break;
                    }
                }
                if(imageKeyExist === false) {
                    defer.reject('no image exist with key \'' +key+ '\'');
                }
            }
            return defer.promise;
        }

        function getImagesByKey(details) {
            var _images = [];
            for(var i = 0; i < details.length; i++) {
                _images.push(getImageByKey(details[i]));
            }
            return _images;
        }

        function getDefaultImage() {
            var defer = $q.defer();
            if(!defaultImage.promise) {
                defer.reject('default image url not provided');
            } else {
                defaultImage.promise.then(defer.resolve, defer.reject);
            }
            return defer.promise;
        }
    }
}