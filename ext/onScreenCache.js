/**
 * @example
 * 		var image1 = new Image(),
 * 			image2 = document.createElement('img'),
 * 			image1000 = document.getElementsByTagName('img')[0],
 * 			evenArrayIsSupported = [ new Image(), new Image() ];
 *
 *      // Do this before any access to screen. Attention: consumes video memory (pixels).
 * 		var mainMenuOnScreenCache = new OnScreenCache(
 * 			[
 * 				image1,
 * 				image2,
 *		 		image1000,
 *		 		evenArrayIsSupported
 * 			],
 * 			function() {
 * 		    	// do something after all images cached on screen
 * 			}
 * 		);
 *
 * 		// Do this BEFORE any current screen cleanup and BEFORE any other screen preparing/loading
 * 		mainMenuOnScreenCache.destroy();
 *
 * @class OnScreenCache
 * @param {Array.<Image|HTMLImageElement|Array.<Image|HTMLImageElement>>} imagesArray
 * @param {function} [onCachedCallBack]
 * @param {number} [timeOutInMilliSeconds]
 * @constructor
 */

/**
 * @static
 * @private
 * @type {string}
 */
OnScreenCache.TIMEOUT_DEFAULT_MS = 700;
/**
 * @static
 * @private
 * @type {string}
 */
OnScreenCache.STYLE =
	'position: fixed; top: 0; left: 1279px; width: 1px; height: 1px;' +
	'-webkit-background-size: 1px 1px;' +
	'-o-background-size: 1px 1px;' +
	'-moz-background-size: 1px 1px;' +
	'-khtml-background-size: 1px 1px;' +
	'-ms-background-size: 1px 1px;' +
	'background-size: 1px 1px;';

/**
 * @static
 * @private
 * @type {string}
 */
OnScreenCache.ID_PREFIX = "on-screen-cache" + Date.now() + Math.random();

/**
 * @static
 * @private
 * @type {number}
 */
OnScreenCache.nextId = 0;

function OnScreenCache(imagesArray, onCachedCallBack, timeOutInMilliSeconds) {
	var id = OnScreenCache.ID_PREFIX + OnScreenCache.nextId++,
		element = document.createElement('div');

	if(typeof timeOutInMilliSeconds === 'undefined') {
		timeOutInMilliSeconds = OnScreenCache.TIMEOUT_DEFAULT_MS;
	}

	element.id = id;
	element.setAttribute('style', OnScreenCache.STYLE);
	this.processImages(imagesArray, element);

	document.body.appendChild(element);

	/**
	 * @private
	 * @type {HTMLDivElement}
	 */
	this.cacheElement = element;

	/**
	 * @private
	 * @type {string}
	 */
	this.id = id;

	if(typeof onCachedCallBack !== 'undefined') {
		//TODO: there is no way to determine that image is completely DRAWN on screen!
		//TODO: currently this is just a timeout.
		//TODO: NOTE: image LOADED is not the same as image DRAWN.
		setTimeout(onCachedCallBack, timeOutInMilliSeconds);
	}
}

/**
 * @public
 */
OnScreenCache.prototype.destroy = function() {
	var element = this.cacheElement;

	// cacheElement can be detached from screen,
	// so we can't find it by 'id', so we use reference to it
	if(element) {
		if(element.parentNode) {
			this.removeImages(element);
			element.parentNode.removeChild(element);
		}
		element.innerHTML = '';
	}

	// if someone did cacheElement.parentNode.innerHTML += 'someThing',
	// reference this.cacheElement points to OLD instance of element,
	// and innerHTML recreated new instance, so search by 'id'!
	if(this.id !== null) {
		element = document.getElementById(this.id);
		if(element) {
			if(element.parentNode) {
				this.removeImages(element);
				element.parentNode.removeChild(element);
			}
			element.innerHTML = '';
		}
	}

	this.cacheElement = null;
	this.id = null;
};

/**
 * @private
 * @param {HTMLDivElement|Node} rootElement
 * @param {Array.<Image|HTMLImageElement|Array.<Image|HTMLImageElement>>} imagesArray
 */
OnScreenCache.prototype.processImages = function(imagesArray, rootElement) {
	// error protection
	if(imagesArray) {
		for(var i = imagesArray.length - 1; i >= 0; i--) {
			var item = imagesArray[i];
			// error protection
			if(!item) {
				continue;
			}

			// check if item is array
			if(Object.prototype.toString.call( item ) === '[object Array]') {
				this.processImages(item, rootElement);
			} else {
				var image = document.createElement('div');
				image.setAttribute(
					'style',
					OnScreenCache.STYLE + "background-image: url('" + item.src + "'); background-repeat: no-repeat;"
				);
				rootElement.appendChild(image);
			}
		}
	}
};

/**
 * @private
 * @param {HTMLDivElement|Node} rootElement
 */
OnScreenCache.prototype.removeImages = function(rootElement) {
	if(rootElement) {
		var el = rootElement.firstElementChild;
		while(el) {
			el.style.backgroundImage = '';
			el = el.nextElementSibling;
		}
	}
};
