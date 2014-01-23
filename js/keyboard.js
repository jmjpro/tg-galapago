Keyboard.KEY_LAYOUT = [
	["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
	["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
	["U", "V", "W", "X", "Y", "Z", "Space"],
	["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
	["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
	["Reset", "DONE", "Delete"]
];
Keyboard.KEY_SPECIAL_MAPPING = [
	{ "keyOrigin" : [0,0], "direction" : "up", "keyDestination" : [0,5] },
	{ "keyOrigin" : [1,0], "direction" : "up", "keyDestination" : [0,5] },
	{ "keyOrigin" : [2,0], "direction" : "up", "keyDestination" : [0,5] },
	{ "keyOrigin" : [3,0], "direction" : "up", "keyDestination" : [1,5] },
	{ "keyOrigin" : [4,0], "direction" : "up", "keyDestination" : [1,5] },
	{ "keyOrigin" : [5,0], "direction" : "up", "keyDestination" : [1,5] },
	{ "keyOrigin" : [6,0], "direction" : "up", "keyDestination" : [1,5] },
	{ "keyOrigin" : [7,0], "direction" : "up", "keyDestination" : [2,5] },
	{ "keyOrigin" : [8,0], "direction" : "up", "keyDestination" : [2,5] },
	{ "keyOrigin" : [9,0], "direction" : "up", "keyDestination" : [2,5] },
	{ "keyOrigin" : [6,2], "direction" : "up", "keyDestination" : [9,1] },
	{ "keyOrigin" : [0,5], "direction" : "up", "keyDestination" : [1,4] },
	{ "keyOrigin" : [1,5], "direction" : "up", "keyDestination" : [5,4] },
	{ "keyOrigin" : [2,5], "direction" : "up", "keyDestination" : [8,4] },
	{ "keyOrigin" : [6,3], "direction" : "up", "keyDestination" : [6,2] },
	{ "keyOrigin" : [7,3], "direction" : "up", "keyDestination" : [6,2] },
	{ "keyOrigin" : [8,3], "direction" : "up", "keyDestination" : [6,2] },
	{ "keyOrigin" : [9,3], "direction" : "up", "keyDestination" : [6,2] },
	{ "keyOrigin" : [6,2], "direction" : "down", "keyDestination" : [9,3] },
	{ "keyOrigin" : [6,1], "direction" : "down", "keyDestination" : [6,2] },
	{ "keyOrigin" : [7,1], "direction" : "down", "keyDestination" : [6,2] },
	{ "keyOrigin" : [8,1], "direction" : "down", "keyDestination" : [6,2] },
	{ "keyOrigin" : [9,1], "direction" : "down", "keyDestination" : [6,2] },
	{ "keyOrigin" : [0,4], "direction" : "down", "keyDestination" : [0,5] },
	{ "keyOrigin" : [1,4], "direction" : "down", "keyDestination" : [0,5] },
	{ "keyOrigin" : [2,4], "direction" : "down", "keyDestination" : [0,5] },
	{ "keyOrigin" : [3,4], "direction" : "down", "keyDestination" : [1,5] },
	{ "keyOrigin" : [4,4], "direction" : "down", "keyDestination" : [1,5] },
	{ "keyOrigin" : [5,4], "direction" : "down", "keyDestination" : [1,5] },
	{ "keyOrigin" : [6,4], "direction" : "down", "keyDestination" : [1,5] },
	{ "keyOrigin" : [7,4], "direction" : "down", "keyDestination" : [2,5] },
	{ "keyOrigin" : [8,4], "direction" : "down", "keyDestination" : [2,5] },
	{ "keyOrigin" : [9,4], "direction" : "down", "keyDestination" : [2,5] },
	{ "keyOrigin" : [0,5], "direction" : "down", "keyDestination" : [1,0] },
	{ "keyOrigin" : [1,5], "direction" : "down", "keyDestination" : [5,0] },
	{ "keyOrigin" : [2,5], "direction" : "down", "keyDestination" : [8,0] }
];
//width, height, and src data URL are dynamically filled in at the time this class is loaded
Keyboard.BOUNDARY_IMAGE_SPECS = [
	{"id":"dialog/keypad-hilight-space.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-active-space.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-hilight-done.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-active-done.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-hilight-delete.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-active-delete.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-hilight-reset.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-active-reset.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-hilight-key.png", "width":0, "height":0, src:""},
	{"id":"dialog/keypad-active-key.png", "width":0, "height":0, src:""}
];
Keyboard.MAX_PROFILE_LENGTH = 12;
Keyboard.MOUSEDOWN_DELAY_MS = 250;
Keyboard.MOUSEUP_DELAY_MS = 500;

function Keyboard() {
}

Keyboard.prototype.init = function(dialogObject) {
	this.container = dialogObject;
	this.elementParent = $( '#screen-dialog-container' ).find( '#' + dialogObject.dialogId );
	this.elementKeyboardBackground = this.elementParent.find( '#keyboard-background' );
	this.elementKeyboard = this.elementParent.find( '#keyboard' );
	this.elementProfile = this.elementParent.find('#profile');
	this.keyHilighted = this.elementParent.find( '#key-hilight' );
	this.keyHilighted.hide();
	this.keySelected = this.elementParent.find( '#key-selected' );
	this.keySelected.hide();
	this.generate( this.elementKeyboard );
	console.debug( this.toString() );
	this.initBoundaryImages();
	this.keyCurrent = this.elementKeyboard.find( '#' + this.toKeyId('A') );
	this.hilightKey( this.keyCurrent );
	this.show();
	this.addEventHandlers();
}; //Keyboard.prototype.init()

Keyboard.prototype.initBoundaryImages = function() {
	var dimensions, galPath;
	_.each( Keyboard.BOUNDARY_IMAGE_SPECS, function( imageSpec ) {
		galPath = imageSpec.id;
		dimensions = ImageCollage.getImageDimensions( galPath );
		if( dimensions ) {
			imageSpec.width = dimensions[0];
			imageSpec.height = dimensions[1];
		}
		else {
			console.debug( 'dimensions for gal image path ' + galPath + ' not found ');
		}
		imageSpec.src = LoadingScreen.gal.get( galPath ).src;
	});
}; //Keyboard.prototype.initBoundaryImages()

Keyboard.prototype.getBoundaryImage = function( imageId ) {
	var image, imageSpec;
	imageSpec = _.find( Keyboard.BOUNDARY_IMAGE_SPECS, {'id' : imageId} );
	image = new Image();
	image.src = imageSpec.src;
	image.width = imageSpec.width;
	image.height = imageSpec.height;
	return image;
}; //Keyboard.prototype.getBoundaryImage()

Keyboard.prototype.show = function() {
	var profileBgImageGalPath, keyboardBgImageGalPath;
	profileBgImageGalPath = 'dialog/button-regular.png';
	keyboardBgImageGalPath = 'dialog/keypad.png';

	LoadingScreen.gal.setBG( this.elementProfile[0], profileBgImageGalPath );
	LoadingScreen.gal.setBG( this.elementKeyboardBackground[0], keyboardBgImageGalPath );
	this.elementProfile.val('').focus();
}; //Keyboard.prototype.show()

Keyboard.prototype.hilightKey = function( elementKey ) {
	var imageHilight, nudgeCoords = {};
	switch( elementKey.attr('id') ) {
		case 'key-space':
			imageHilight = this.getBoundaryImage( 'dialog/keypad-hilight-space.png' );
			nudgeCoords.left = 2;
			nudgeCoords.top = 0;
			break;		
		case 'key-reset':
			imageHilight = this.getBoundaryImage( 'dialog/keypad-hilight-reset.png' );
			nudgeCoords.left = 0;
			nudgeCoords.top = -2;
			break;
		case 'key-done':
			imageHilight = this.getBoundaryImage( 'dialog/keypad-hilight-done.png' );
			nudgeCoords.left = -3;
			nudgeCoords.top = 2;
			break;		
		case 'key-delete':
			imageHilight = this.getBoundaryImage( 'dialog/keypad-hilight-delete.png' );
			nudgeCoords.left = -4;
			nudgeCoords.top = -3;
			break;		
		default:
			imageHilight = this.getBoundaryImage( 'dialog/keypad-hilight-key.png' );
			nudgeCoords.left = 0;
			nudgeCoords.top = 0;
			break;
	}
	this.keyHilighted.width( imageHilight.width );
	this.keyHilighted.height( imageHilight.height );
	this.keyHilighted.css( 'background-image', 'url(' + imageHilight.src + ')' );
	this.keyHilighted.show();

	this.nudgePosition( this.keyHilighted, elementKey, nudgeCoords );

	this.keyCurrent = elementKey;
	//elementKey.focus();
	return this;
}; //Keyboard.prototype.hilightKey()

// positive an element above another element, with an optional slight difference
Keyboard.prototype.nudgePosition = function( element, elementRelative, nudgeCoords ) {
	var position = elementRelative.offset();
	if( nudgeCoords.left || nudgeCoords.top ) {
		position.left += nudgeCoords.left;
		position.top += nudgeCoords.top;
	}
	element.offset( position );
	return this;
}; //Keyboard.prototype.nudgePosition()

// center an element within another relative element; assumes relative element is larger
Keyboard.prototype.centerWithin = function( element, elementRelative ) {
	var nudge = {}, nudgeLeft, nudgeTop;
	nudgeLeft = Math.round( ( elementRelative.width() - element.width() ) / 2 );
	nudgeTop = Math.round( ( elementRelative.height() - element.height() ) / 2 );
	nudge.left = nudgeLeft;
	nudge.top = nudgeTop;
	return this.nudgePosition( element, elementRelative, nudge );
}; //Keyboard.prototype.nudgePosition()

/* move the "selected" div onto the input key element */
Keyboard.prototype.selectKey = function( elementKey ) {
	var imageSelect, rawKeyId, imageType;
	rawKeyId = elementKey.attr('id').slice( 4 );
	if( isNumber(rawKeyId) ) {
		imageType = 'key';
	}
	else {
		imageType = rawKeyId;
	}
	imageSelect = this.getBoundaryImage( 'dialog/keypad-active-' + imageType + '.png' );
	this.keySelected.width( imageSelect.width );
	this.keySelected.height( imageSelect.height );
	this.keySelected.css( 'background-image', 'url(' + imageSelect.src + ')' );
	this.keySelected.show();
	this.centerWithin( this.keySelected, elementKey );
	return this;
}; //Keyboard.prototype.selectKey()

Keyboard.prototype.getSpecialNeighborCoords = function( originCoords, direction ) {
	var mappingRecord, neighborCoords;
	mappingRecord = _.find(Keyboard.KEY_SPECIAL_MAPPING, function(record) {
		return _.isEqual( record.keyOrigin, originCoords ) && record.direction === direction;
	});
	if( mappingRecord ) {
		neighborCoords = mappingRecord.keyDestination;
	}
	return neighborCoords;
}; //Keyboard.prototype.getSpecialMapping()

Keyboard.prototype.generate = function( elementKeyboard ) {
	var keyboard, elementKey;
	keyboard = this;
	elementKeyboard.empty();
	$.each( Keyboard.KEY_LAYOUT, function(rowNum, row) {
		$.each( row, function(colNum, key) {
			elementKey = $( '<li>' );
			elementKey.attr( 'id', keyboard.toKeyId(key) );
			elementKey.attr( 'tabindex', -1 ); //TODO check if this is still needed
			elementKey.col( colNum );
			elementKey.row( rowNum );
			elementKey.addClass('key');
			if( colNum === row.length - 1 ) {
				elementKey.addClass( 'key-last' );
			}
			elementKey.html( key );
			elementKeyboard.append( elementKey );
		});
	});
	return this;
}; //Keyboard.prototype.generate()

Keyboard.prototype.toKeyId = function( key ) {
	var keyId;
	if( key.length === 1 ) {
		keyId = key.charCodeAt();
	}
	else {
		keyId = key.toLowerCase();
	}
	return 'key-' + keyId;
}; //Keyboard.prototype.toKeyId

Keyboard.prototype.addEventHandlers = function( elementKey, coords ) {
	var keyboard = this, elementProfile;
	this.elementProfile.on( 'keydown keyup', function(evt) {
		switch( evt.keyCode ) {
			case 13:
			case 37:
			case 38:
			case 39:
			case 40:
				keyboard.keyCurrent.trigger( evt.type, [evt.keyCode] );
				break;
			case 8: //backspace
				// FDD 3.6.2.2 For backspace key, when the dialog is displayed before any profile was created: goes back to the Portal/App Store
				// Otherwise: closes the dialog without performing any changes.
				if( typeof(Galapago.profile) === 'undefined' ) {
					console.debug( 'TODO go back to portal');
				}
				else { //simulate selecting the 'Done' key
					var keyDone = keyboard.elementKeyboard.find( '#key-done' );
					keyboard.selectKey( keyDone );
					keyboard.keySelected.hide();
					keyboard.container.hide();
				}
			default:
				// @jmjpro: typing in the input box for regular character keys
				// should simulate selection of the coresponding key on the virtual keyboard
				var keyMatchingInput = keyboard.elementKeyboard.find( '#key-' + evt.keyCode );
				keyMatchingInput.trigger( evt.type, [13] );
				break;
		}
		return false;
	});
	this.elementKeyboard.children('li.key').off( 'mouseover' );
	this.elementKeyboard.children('li.key').on( 'mouseover', function() {
		keyboard.hilightKey( $(this), coords );
		return false;
	});
	this.elementKeyboard.children('li.key').off( 'keydown' );
	this.elementKeyboard.children('li.key').on( 'keydown', function(evt, keyCode) {
		var neighbor;
		keyCode = evt.keyCode || keyCode;
		switch( keyCode ) {
			case 13: // enter
				keyboard.selectKey( $(this) );
				keyboard.handleSelect( $(this) );
				break;
			case 37: // left arrow
				neighbor = keyboard.getNeighborLeft( $(this) );
				keyboard.hilightKey( neighbor );
				break;
			case 38: // up arrow
				neighbor = keyboard.getNeighborUp( $(this) );
				keyboard.hilightKey( neighbor );
				break;
			case 39: // right arrow
				neighbor = keyboard.getNeighborRight( $(this) );
				keyboard.hilightKey( neighbor );
				break;
			case 40: // down arrow
				neighbor = keyboard.getNeighborDown( $(this) );
				keyboard.hilightKey( neighbor );
				break;
			default:
				return true;
		}
		return false;
	});

	this.elementKeyboard.children('li.key').off( 'keyup' );
	this.elementKeyboard.children('li.key').on( 'keyup', function(evt, keyCode) {
		keyCode = evt.keyCode || keyCode;
		switch( keyCode ) {
			case 13: // enter
				keyboard.keySelected.hide();
				break;
		}
		return false;
	});

	this.elementKeyboard.children('li.key').off( 'mousedown' );
	this.elementKeyboard.children('li.key').on( 'mousedown', function() {
		keyboard.selectKey( $(this) );
		return false;
	});

	this.elementKeyboard.children('li.key').off( 'mouseup' );
	this.elementKeyboard.children('li.key').on( 'mouseup', function() {
		keyboard.keySelected.hide();
		keyboard.hilightKey( $(this), coords );
		keyboard.handleSelect( $(this) );
		return false;
	});

	return this;
}; //Keyboard.prototype.addEventHandlers()

Keyboard.prototype.getElementByCoords = function( coords ) {
	var col, row, key;
	col = coords[0];
	row = coords[1];
	key = Keyboard.KEY_LAYOUT[row][col];
	return $( '#' + this.toKeyId(key) );
}; //Keyboard.prototype.handleKeyboardNav()

Keyboard.prototype.getNeighborLeft = function( element ) {
	var coords = [], neighborCoords = [], col, row;
	col = element.col();
	row = element.row();
	coords[0] = col;
	coords[1] = row;
	if( col === 0 ) { //wrap around
		col = Keyboard.KEY_LAYOUT[row].length - 1;
		neighborCoords = [col, row];
	}
	else {
		neighborCoords = MatrixUtil.getNeighborCoordinates( coords, [-1, 0] );
	}
	return this.getElementByCoords(neighborCoords);
}; //Keyboard.prototype.getNeighborLeft()

Keyboard.prototype.getNeighborUp = function( element ) {
	var coords = [], neighborCoords = [], col, row;
	col = element.col();
	row = element.row();
	coords[0] = col;
	coords[1] = row;
	neighborCoords = this.getSpecialNeighborCoords( coords, 'up' );
	if( typeof neighborCoords === 'undefined' ) {
		neighborCoords = MatrixUtil.getNeighborCoordinates( coords, [0, -1] );
	}
	return this.getElementByCoords(neighborCoords);
}; //Keyboard.prototype.getNeighborUp()

Keyboard.prototype.getNeighborRight = function( element ) {
	var coords = [], neighborCoords = [], col, row;
	col = element.col();
	row = element.row();
	coords[0] = col;
	coords[1] = row;
	if( col + 1 === Keyboard.KEY_LAYOUT[row].length ) { // wrap around
		neighborCoords = [0, row];
	}
	else {
		neighborCoords = MatrixUtil.getNeighborCoordinates( coords, [1, 0] );
	}
	return this.getElementByCoords(neighborCoords);
}; //Keyboard.prototype.getNeighborRight()

Keyboard.prototype.getNeighborDown = function( element ) {
	var coords = [], neighborCoords = [], col, row;
	col = element.col();
	row = element.row();
	coords[0] = col;
	coords[1] = row;
	neighborCoords = this.getSpecialNeighborCoords( coords, 'down' );
	if( typeof neighborCoords === 'undefined' ) {
		neighborCoords = MatrixUtil.getNeighborCoordinates( coords, [0, 1] );
	}
	return this.getElementByCoords(neighborCoords);
}; //Keyboard.prototype.v()

Keyboard.prototype.handleSelect = function( elementKey ) {
	var textToAppend, rawKeyId, currentText;
	elementKey = elementKey || this.cellCurrent.elementKey;
	rawKeyId = elementKey.attr('id').slice( 'key-'.length );
	currentText = this.elementProfile.val();
	if( currentText.length < Keyboard.MAX_PROFILE_LENGTH ) {
		if( isNumber(rawKeyId) ) {
			textToAppend = elementKey.text();
		}
		else if( rawKeyId === 'space' ) {
			textToAppend = ' ';
		}
		else {
			this.handleSpecialKey( rawKeyId );
		}
	}
	else {
		this.handleSpecialKey( rawKeyId );
	}
	if( textToAppend ) {
		this.elementProfile.val( this.elementProfile.val() + textToAppend );
	}
	return this;
}; //Keyboard.prototype.handleSelect()

Keyboard.prototype.handleSpecialKey = function( rawKeyId ) {
	var currentText;
	currentText = this.elementProfile.val();
	switch( rawKeyId ) {
		case 'reset':
			this.elementProfile.val( '' );
			break;
		case 'delete':
			this.elementProfile.val( currentText.slice(0, -1) );
			break;
		case 'done':
			if( this.elementProfile.val().length > 0 ) {
				Galapago.profile = this.elementProfile.val();
				console.debug( 'profile created: "' +  Galapago.profile + '"');
				this.container.hide();
				$( '#hello' ).html( i18n.t("Screen Main Menu.Hello", { profile: Galapago.profile }) );
			}
			break;
	}
	return this;
}; //Keyboard.prototype.handleSpecialKey()

Keyboard.prototype.toString = function() {
	var keyboard, stringRep = '';
	keyboard = this;
	keyboard.elementKeyboard.find( 'li.key').each( function() {
		var rawId = $(this).attr('id').slice(4);
		stringRep += '{key: ';
		if( isNumber( rawId) ) {
			stringRep += String.fromCharCode( rawId );
		}
		else {
			stringRep += rawId;
		}
		stringRep += ', ';
		stringRep += 'col: ' + $(this).col() + ', ';
		stringRep += 'row: ' + $(this).col() + '}, ';
	});
	return stringRep;
}; //Keyboard.prototype.toString()

;(function($){
	// `this` refers to the current Zepto collection.
	// When possible, return the Zepto collection to allow chaining.

	$.extend($.fn, {
		col: function(num) {
			if( typeof(num) === 'undefined' || num === null) {
				//return this.data('col'); //zepto says that number values are converted but that doesn't seem to be the case
				return parseInt( this.data('col'), 10 );
			}
			else if( isNumber(num) ) {
				//this.data('col', '' + num); //I think there's a zepto bug causing this to fail
				this.attr('data-col', '' + num);
				return this;
			}
			else {
				console.error( 'The optional argument for col() must be a number');
			}
		}
	});

	$.extend($.fn, {
		row: function(num) {
			if( typeof(num) === 'undefined' || num === null) {
				//return this.data('row'); //zepto says that number values are converted but that doesn't seem to be the case
				return parseInt( this.data('row'), 10 );
			}
			else if( isNumber(num) ) {
				//this.data('row', '' + num); //I think there's a zepto bug causing this to fail
				this.attr('data-row', '' + num);
				return this;
			}
			else {
				console.error( 'The optional argument for row() must be a number');
			}
		}
	});
})(Zepto);

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}