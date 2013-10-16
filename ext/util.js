/* class FileUtil */
// helper functions for manipulating files and filenames
function FileUtil() {}
//strip everything after the last slash in a file path
FileUtil.stripFileName = function (filePath) {
	if( !(filePath === undefined || filePath === null) ) {
		return filePath.substr(0, filePath.lastIndexOf('/') + 1);
	}
};
/* end class FileUtil */

/* class ArrayUtil */
// helper functions for manipulating arrays
function ArrayUtil() {}

//from Justin Johnson at http://stackoverflow.com/a/1890233/567525
ArrayUtil.unique = function(arr) {
	var hash, result;
	hash = {};
	result = [];
	for ( var i = 0, l = arr.length; i < l; ++i ) {
		//it works with objects! tested with Chrome, FF, Opera on Windows 7
		if ( !hash.hasOwnProperty(arr[i]) ) {
			hash[ arr[i] ] = true;
			result.push(arr[i]);
		}
	}
	return result;
};
/* end class ArrayUtil */

// define a startsWith method on String if it doesn't exist already
if (typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function (str){
		return this.slice(0, str.length) === str;
	};
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
} //function replaceAll()

function findAllPixels(element, deep, pixels, prevId) {
	if(typeof deep === 'undefined') {
		deep = 0;
		pixels = 0;
	}
	var child, next;
	child = element.firstElementChild;
	while (child) {
		if(child.nodeName.toLocaleLowerCase() === 'canvas') {
			console.log("Found canvas id = " + child.id + ", pixels: " + (child.width * child.height) + " in div id = " + prevId);
			pixels += child.width * child.height;
		}
		if(typeof child.style !== 'undefined' && typeof child.style.backgroundImage !== 'undefined' &&
			child.style.backgroundImage !== null && child.style.backgroundImage !== "") {
			var w = parseInt(window.getComputedStyle(child, null).width);
			var h = parseInt(window.getComputedStyle(child, null).height);
			if(w*h > 0) {
				console.log("Found background-image of ELEMENT id = " + child.id + ", pixels: " + (w*h) + " in div id = " + prevId);
				pixels += w*h;
				//child.parentNode.removeChild(child);
			}
		}
		if(child.nodeName.toLowerCase() === 'img' && child.naturalWidth !== 0) {
			var im = child;
			console.log("Found IMG id = " + child.id + ", pixels: " + (im.naturalWidth * child.naturalHeight) + " in div id = " + prevId);
			pixels += im.naturalWidth * child.naturalHeight;
		}

		next = child.nextElementSibling;
		deep++;
		pixels = findAllPixels(child, deep, pixels, child.id);
		deep--;
		child = next;
	}

	if(deep === 0) {
		console.log("Total number of pixels in canvases: " + pixels);
	}
	return pixels;
}

function GameUtil(){

}

GameUtil.addEventBarrier = function(parentElementSelector) {
	var parentElement = $('#' + parentElementSelector);
	var eventBarrierDiv = $('<div>');
	eventBarrierDiv[0].id = parentElement[0].id + '-transparency';
	eventBarrierDiv.addClass('event-barrier');
	parentElement.append(eventBarrierDiv);
	return eventBarrierDiv;
};

GameUtil.removeEventBarrier = function(eventBarrierDiv) {
	eventBarrierDiv.remove();
};
