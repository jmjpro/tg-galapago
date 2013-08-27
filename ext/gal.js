/*
* Copyright 2011 Google Inc. All Rights Reserved.
 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
 
 
/**
* @fileoverview Asset loader library.
* @author smus@google.com (Boris Smus)
*/
(function(exports) {
 
/**
* @constructor
* @param {String} manifestUrl URL to manifest file.
*/
var GAL = function(manifestUrl) {
  this.manifestUrl = manifestUrl;
  // Dictionary of arrays of all of the bundles contained in the manifest.
  this.bundles = {};
  // Array of bundle names in the order that they appear in the manifest.
  this.bundleOrder = [];
  // Table of callbacks, per bundle.
  this.loaded = {};
  this.progress = {};
  this.error = {};
  this.lookupTable = new Array();
};
 
GAL.IMAGE_CACHE_DIV_ID = 'image-cache';
GAL.loadedPixels = 0;
/**
* Initializes loader.
* @param {Function} callback called when the library finishes loading the
* manifest.
*/
GAL.prototype.init = function(callback) {
  var that = this;
  if (this.online()) {
    // Fetch the manifest.
    fetchJSON_(this.manifestUrl, function(manifest) {
      // Save the manifest for offline use.
      localStorage.setItem(that.manifestUrl, JSON.stringify(manifest));
      finishInit_.call(that, manifest, callback);
    });
  } else {
    var manifest = JSON.parse(localStorage.getItem(this.manifestUrl));
    finishInit_.call(that, manifest, callback);
  }
};
 
/**
* Downloads assets contained in the named bundle.
* @param {string} bundleName name of single bundle to download.
*/
GAL.prototype.download = function(bundleName) {
  var bundle, that, bundleAlreadyLoaded, isVisualCache;
  bundle = this.bundles[bundleName];
  isVisualCache = true;
  if (!bundle) {
    // Attempting to download invalid bundle.
    throw "Invalid bundle specified";
  }
  that = this;
 
  bundleAlreadyLoaded = false;
  // Setup a loop via callback chaining.
  (function loop(index) {
    // If we've finished loading all of the assets in the bundle.
    if (index == bundle.length) {
      fireCallback_(that.loaded, bundleName, {
        bundleName: bundleName,
        success: true
      });
      return;
    }
    var key = bundle[index];
    if(!(key in that.lookupTable)){
      // Get the full url to the asset.
      var audioExts = that.manifest.audioExts;
      var collageDirectory = that.manifest.collageDirectory;
      var ignorePrefix = that.manifest.ignorePrefix;
      var noCachePrefix = that.manifest.noCachePrefix;
      var keyArray = key.split(".");
      var url;
      if( key.startsWith( noCachePrefix ) ) {
        key = key.replace( noCachePrefix, '' );
        isVisualCache = false;
      }
      if( key.startsWith( ignorePrefix ) ) {
        loop(index + 1);
      }
      else if((','+audioExts+',').indexOf(','+keyArray[keyArray.length-1]+',') > -1){
        url = that.manifest.assetRootAudio + key;
        var audio = new Audio();
        audio.onload = function() {
          that.lookupTable[key] = audio;
          fireCallback_(that.progress, bundleName, {
            current: index + 1,
            total: bundle.length
          });
          loop(index + 1);
        };
        audio.src = url;
        audio.id = key;
      }else{
        url = that.manifest.assetRootImage + key;
        var image = new Image();
        image.onload =function() {
          that.logPixelCount( image );
          that.lookupTable[key] = image;
          if(key.indexOf(collageDirectory) > -1){
            that.loadCollageImages(key, isVisualCache);
            // don't double-cache the original image collage along with the cut-up images
            that.lookupTable[key] = null;
          } else {
            if( isVisualCache ) {
              document.getElementById(GAL.IMAGE_CACHE_DIV_ID).appendChild(image);
            }
          }
          fireCallback_(that.progress, bundleName, {
            current: index + 1,
            total: bundle.length
          });
          loop(index + 1);
        };
        image.src = url;
        image.id = key;
      }
    }else{
		bundleAlreadyLoaded = true;
	}
  })(0);
  if(bundleAlreadyLoaded){
    fireCallback_(that.loaded, bundleName, {
        bundleName: bundleName,
        success: true
    });
  }
  for( var image in this.lookupTable ) {
    if( this.lookupTable[image] === null ) {
      delete this.lookupTable[image];
    }
    //console.debug( image );
  }
}; //GAL.prototype.download()

GAL.prototype.loadCollageImages = function(imageName, isVisualCache) {
  var imageCollage, images, image, index, imageId;
  imageCollage = ImageCollage.loadByName(imageName);
  images = imageCollage.getImages();
  for(index = 0; index < images.length; index++){
    image = images[index];
    this.logPixelCount( image );
    if( isVisualCache ) {
      document.getElementById(GAL.IMAGE_CACHE_DIV_ID).appendChild(image);
    }
    imageId = image.id;
    this.lookupTable[imageId] = image;
  }
  imageCollage = null;
};

GAL.prototype.logPixelCount = function( object, isLoad ) {
  var numPixels, direction;
  numPixels = object.width * object.height;
  if( typeof isLoad === 'undefined' || isLoad === true ) {
    isLoad = true;
    GAL.loadedPixels += numPixels;
  }
  else {
    GAL.loadedPixels -= numPixels;
  }
  direction = isLoad ? ' loaded ' : ' released ';
  console.debug( object + ' ' + object.id + ' width: ' + object.width + ' height: ' + object.height + ' ' + direction + numPixels + ' pixels ');
  console.log("Total pixels loaded: " + GAL.loadedPixels);
};

/**
* Adds a callback to fire when a bundle has been loaded.
* @param {string} opt_bundleName Name of bundle to monitor (if none specified,
*    monitor all bundles).
* @param {function} callback Called after bundle was downloaded.
*/
GAL.prototype.onLoaded = function(opt_bundleName, callback) {
  addCallback_(this.loaded, opt_bundleName, callback);
};

GAL.prototype.clearOnLoaded = function(opt_bundleName) {
	this.loaded[opt_bundleName] = [];
};
 
/**
* Adds a callback to fire when a bundle's downloading has progressed.
* @param {string} opt_bundleName Name of bundle to monitor (if none specified,
*    monitor all bundles).
* @param {function} callback Called after bundle download progressed.
*/
GAL.prototype.onProgress = function(opt_bundleName, callback) {
  addCallback_(this.progress, opt_bundleName, callback);
};
 
/**
* Adds a callback to fire when a bundle's downloading has failed
* @param {string} opt_bundleName Name of bundle to monitor (if none specified,
*    monitor all bundles).
* @param {function} callback Called after bundle download failed.
*/
GAL.prototype.onError = function(opt_bundleName, callback) {
  addCallback_(this.error, opt_bundleName, callback);
};
 
/**
* Checks if a bundle is already downloaded.
* @param {string} bundleName Name of bundle to check.
* @param {function} callback Called with the result.
*/
GAL.prototype.check = function(bundleName, callback) {
  var bundle = this.bundles[bundleName];
  if (!bundle) {
    callback({success: false});
    return;
  }
 
// var adapter = this.adapter;
  (function loop(index) {
    // If we've finished loading all of the assets in the bundle.
    if (index == bundle.length) {
      callback({success: true});
      return;
    }
    var key = bundle[index];
        loop(index + 1);
   /* adapter.checkAsset(key, function() {
      // Iterate to the next file.
      loop(index + 1);
    }, function() {
      // Failure.
      callback({success: false});
    });*/
 
  })(0);
};
 
/**
* Gets URL to loaded asset.
* @param {string} assetPath path of the asset relative to the manifest
* root.
* @return {string} url to the asset in the local filesystem.
* @throws {exception} if the asset doesn't actually exist.
*/
GAL.prototype.get = function(assetPath) {      
  return this.lookupTable[assetPath] || null;
};

/**
* request release of memory occupied by resource at assetPath
* @param {string} assetPath path of the asset relative to the manifest
* root.
* @throws {exception} if the asset doesn't actually exist.
*/
GAL.prototype.release = function(assetPath) {
  var numPixels, image, collageDescriptor, i;
  image = this.get(assetPath);
  // if we can't find the requested image, see if there's a corresponding image collage
  // and release all of the images that we cut up from the collage (the collage itself
  // was release immediately after it was cut up)
  if( !image ) {
    collageDescriptor = ImageCollage.findDescriptorByName(assetPath);
    for( i = 0; i < collageDescriptor.imageCoordinateArray.length; i++ ) {
      this.release(collageDescriptor.imageCoordinateArray[i].id);
    }
  }
  else {
    this.lookupTable[assetPath] = null;
    this.logPixelCount( image, false );
  }
}; //GAL.prototype.release()
 
/**
* Gets the last cached time for an asset at a given path.
* @param {string} assetPath relative path of asset.
* @return {number} UNIX time of the last time the asset was cached.
*/
GAL.prototype.cacheTime = function(assetPath) {
  // TODO(smus): implement me!
  return Math.random();
};
 
/**
* @return {Boolean} true iff the browser is online.
*/
GAL.prototype.online = function() {
  return navigator.onLine;
};
 
/**
* @private
* Initializes the adapter and calls back when that's done.
* @param {string} url The URL to the manifest file.
* @param {function} callback Called when the manifest was properly parsed.
* @throws {exception} When the manifest fails to load.
*/
function fetchJSON_(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function(e) {
    callback(JSON.parse(xhr.responseText));
  };
  xhr.send();
}
 
/**
* @private
* Sets the manifest and parses out bundles and bundle order.
* @param {function} callback Called when the adapter has initialized.
*/
function initAdapter_(callback) {
/*  this.adapter = new GAL.adapterClass();
  this.adapter.init(function() {
    callback();
  });*/
}
 
/**
* @private
* Fetches JSON at a URL and calls the callback with the parsed object.
* @param {object} manifest The manifest object.
*/
function setManifest_(manifest) {
  var i, bundle;
  this.manifest = manifest;
  // Set this.bundles object and this.bundleOrder array
  bundle = true;
  for (i = 0; i < manifest.bundles.length; ++i) {
    bundle = manifest.bundles[i];
    this.bundles[bundle.name] = bundle.contents;
    this.bundleOrder.push(bundle.name);
  }
}
 
/**
* @private
* Initializes the adapter and assigns the manifest.
* Starts downloading assets if the manifest is set to autoDownload.
* @param {object} manifest The manifest object.
* @param {function} callback Called when the initialization is finished.
*/
function finishInit_(manifest, callback) {
  var context = this;
  setManifest_.call(context, manifest);
  if (manifest.autoDownload && context.online()) {
      downloadAll_.call(context);
   }
   callback();
 
/* initAdapter_.call(context, function() {
    setManifest_.call(context, manifest);
    // Optionally, start auto-download.
    if (manifest.autoDownload && context.online()) {
      downloadAll_.call(context);
    }
    callback();
  });*/
}
 
/**
* @private
* Adds a callback associated with a bundle name.
* @param {object} callbacks an object associated with an event type
*    (ex. bundle loaded, bundle load progress updated, bundle failed).
* @param {string} bundleName the name of the bundle to monitor. If set
*    to "*", all bundles will be monitored.
* @param {function} callback the function to call.
*/
function addCallback_(callbacks, bundleName, callback) {
  if (typeof bundleName == "function") {
    // bundleName is optional, and may be a callback instead.
    callback = bundleName;
    bundleName = '*';
  }
  if (!callbacks[bundleName]) {
    // Add an empty array.
    callbacks[bundleName] = [];
  }
 
  callbacks[bundleName].push(callback);
}
 
/**
* @private
* Fires callbacks of a given type for a certain bundle.
* @param {object} object dictionary of callbacks.
* @param {string} bundleName string with the name of the bundle.
* @param {object} params to call the callback with.
*/
function fireCallback_(callbacks, bundleName, params) {
  // Fire the principle callbacks, indexed by given bundleName.
  fireCallbackHelper_(callbacks, bundleName, params);
  // Also fire all * callbacks.
  fireCallbackHelper_(callbacks, '*', params);
}
function fireCallbackHelper_(object, bundleName, params) {
  var callbacks, callback, i;
  callbacks = object[bundleName];
  if (callbacks) {
    for (i = 0; i < callbacks.length; ++i) {
      callback = callbacks[i];
      callbacks[i](params);
    }
  }
}
 
/**
* @private
* Starts downloading all of the assets in the manifest, in order.
*/
function downloadAll_() {
  var that = this;
  // Start by downloading the first bundle, then download subsequent ones.
  (function loop(bundleIndex) {
    if (bundleIndex == that.bundleOrder.length) {
      // We're done downloading stuff!
      return;
    }
    var bundleName = that.bundleOrder[bundleIndex];
    that.onLoaded(bundleName, function() {
      // Once bundle is loaded, load the next bundle.
      loop(bundleIndex + 1);
    });
    that.download(bundleName);
  })(0);
}
 
 
 
exports.GameAssetLoader = GAL;
 
})(window);
 