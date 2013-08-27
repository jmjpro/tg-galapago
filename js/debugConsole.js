"use strict";

var debugConsole;

/*
code from http://stackoverflow.com/questions/6604192/showing-console-errors-and-alerts-in-a-div-inside-the-page
*/

if (typeof console  != "undefined")  {
	if (typeof console.log != 'undefined') {
		console.olog = console.log;
	}
	else {
		console.olog = function() {};
	}
}
registerEventHandlers();

console.log = function(message, logType) {
	var trace;
	if (1 === 1) {
		if( !(typeof printStackTrace === 'undefined') ) {
         trace = printStackTrace();
         //message += trace.join('\n\n');
		}
    }
	console.olog(message);
	debugConsole = document.getElementById('debug-console');
	debugConsole.style.display = 'block';
	if( typeof logType === 'undefined' ) {
		logType = 'log';
	}
	else {
		logType = logType;
	}
	debugConsole.innerHTML += '<p class="' + logType + '">' + message + '</p>';
	debugConsole.scrollTop = debugConsole.scrollHeight;
};

console.error = function(message) {
	console.log(message, 'error');
}

console.debug = console.info =  console.log;

function toggleDebugConsole(position) {
	//var debugConsoleToggle = document.getElementById('debug-console-toggle');
	var debugConsole = document.getElementById('debug-console');
	if( debugConsole.style.display === 'none' || debugConsole.style.display === '' ) {
		debugConsole.style.display = 'block';
		//debugConsoleToggle.innerHTML = 'Hide Debug Console';
	}
	else {
		debugConsole.style.display = 'none';
		//debugConsoleToggle.innerHTML = 'Show Debug Console';
	}
	debugConsole.className = position;
}

function registerEventHandlers () {
	var progressBar = this;
	window.onkeydown = function(evt) {
		switch( evt.keyCode ) {
			case 56: // 8
				toggleDebugConsole('top');
				break;
			case 57: // 9
				toggleDebugConsole('bottom');
				break;
		}
	};
}
