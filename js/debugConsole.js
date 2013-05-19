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

console.log = function(message) {
	var trace;
	if (1 === 1) {
		if( !(typeof printStackTrace === 'undefined') ) {
         trace = printStackTrace();
         //message += trace.join('\n\n');
		}
    }
	console.olog(message);
	debugConsole = document.getElementById('debug-console');
	debugConsole.innerHTML += message + '<br/>';
	debugConsole.scrollTop = debugConsole.scrollHeight;
};

console.error = console.debug = console.info =  console.log;

function toggleDebugConsole() {
	var debugConsoleToggle = document.getElementById('debug-console-toggle');
	if( debugConsole.style.display === 'none' || debugConsole.style.display === '' ) {
		debugConsole.style.display = 'block';
		debugConsoleToggle.innerHTML = 'Hide Debug Console';
	}
	else {
		debugConsole.style.display = 'none';
		debugConsoleToggle.innerHTML = 'Show Debug Console';
	}
}