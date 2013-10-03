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