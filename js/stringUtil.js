function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
} //function replaceAll()

// define a startsWith method on String if it doesn't exist already
if (typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function (str){
		return this.slice(0, str.length) === str;
	};
}