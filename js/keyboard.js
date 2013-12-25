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
Keyboard.CURSOR_BLINK_INTERVAL_MS = 900;

function Keyboard() {
}

Keyboard.prototype.init = function(dialogObject) {
	this.container = dialogObject;
	this.parentElement = $( '#screen-dialog-container' ).find( '#' + dialogObject.dialogId );
	this.elementKeyboardBackground = this.parentElement.find( '#keyboard-background' );
	this.elementKeyboard = this.parentElement.find( '#keyboard' );
	this.elementProfile = this.parentElement.find( '#profile' );
	this.elementProfileName = this.elementProfile.find( '#profile-name' );
	this.keyHilighted = this.parentElement.find( '#key-hilight' );
	this.keyHilighted.hide();
	this.keySelected = this.parentElement.find( '#key-selected' );
	this.keySelected.hide();
	this.elementKeyboard.empty();
	this.elementProfileName.empty();
	this.generate( this.elementKeyboard );
	this.initBoundaryImages();
	this.cellCurrent = { 'elementKey' : this.elementKeyboard.find( '#' + this.toKeyId('A') ), 'coords' : [0, 0] };
	this.hilightKey( this.cellCurrent.elementKey, this.cellCurrent.coords );
	this.show();
	window.setInterval( Keyboard.prototype.cursorAnimation, Keyboard.CURSOR_BLINK_INTERVAL_MS );
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
}; //Keyboard.prototype.show()

Keyboard.prototype.hilightKey = function( elementKey, coords ) {
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

	this.cellCurrent.elementKey = elementKey;
	this.cellCurrent.coords = coords;
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
	var imageSelect;
	switch( elementKey.attr('id') ) {
		case 'key-space':
			imageSelect = this.getBoundaryImage( 'dialog/keypad-active-space.png' );
			break;		
		case 'key-reset':
			imageSelect = this.getBoundaryImage( 'dialog/keypad-active-reset.png' );
			break;
		case 'key-done':
			imageSelect = this.getBoundaryImage( 'dialog/keypad-active-done.png' );
			break;		
		case 'key-delete':
			imageSelect = this.getBoundaryImage( 'dialog/keypad-active-delete.png' );
			break;		
		default:
			imageSelect = this.getBoundaryImage( 'dialog/keypad-active-key.png' );
			break;
	}
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
	$.each( Keyboard.KEY_LAYOUT, function(rowNum, row) {
		$.each( row, function(colNum, key) {
			elementKey = $( '<li>' );
			elementKey.attr( 'id', keyboard.toKeyId(key) );
			elementKey.addClass('key');
			if( colNum === row.length - 1 ) {
				elementKey.addClass( 'key-last' );
			}
			elementKey.html( key );
			keyboard.addEventHandlers( elementKey, [colNum, rowNum] );
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
	var keyboard = this;
	elementKey.off( 'mouseover' );
	elementKey.on( 'mouseover', function() {
		keyboard.hilightKey( $(this), coords );
		return false;
	});
	this.parentElement.off( 'keydown' );
	this.parentElement.on( 'keydown', function(evt) {
		switch( evt.keyCode ) {
			case 13: // enter
				keyboard.selectKey( keyboard.cellCurrent.elementKey );
				keyboard.handleSelect();
				break;
			case 37: // left arrow
				keyboard.handleLeftArrow( keyboard.cellCurrent );
				break;
			case 38: // up arrow
				keyboard.handleUpArrow( keyboard.cellCurrent );
				break;
			case 39: // right arrow
				keyboard.handleRightArrow( keyboard.cellCurrent );
				break;
			case 40: // down arrow
				keyboard.handleDownArrow( keyboard.cellCurrent );
				break;
			default:
				return true;
		}
		return false;
	});

	this.parentElement.off( 'keyup' );
	this.parentElement.on( 'keyup', function(evt) {
		switch( evt.keyCode ) {
			case 13: // enter
				keyboard.keySelected.hide();
				break;
		}
		return false;
	});

	elementKey.off( 'mousedown' );
	elementKey.on( 'mousedown', function() {
		keyboard.selectKey( keyboard.cellCurrent.elementKey );
		return false;
	});

	elementKey.off( 'mouseup' );
	elementKey.on( 'mouseup', function() {
		keyboard.keySelected.hide();
		keyboard.hilightKey( $(this), coords );
		keyboard.handleSelect( $(this) );
		return false;
	});

	return this;
}; //Keyboard.prototype.addEventHandlers()

Keyboard.prototype.getCellByCoords = function( coords ) {
	var col, row, key, cell = {};
	col = coords[0];
	row = coords[1];
	key = Keyboard.KEY_LAYOUT[row][col];
	cell.elementKey = $( '#' + this.toKeyId(key) );
	cell.coords = coords;
	return cell;
}; //Keyboard.prototype.handleKeyboardNav()

Keyboard.prototype.handleLeftArrow = function( cellCurrent ) {
	var neighborCoords, colCurrent, rowCurrent;
	colCurrent = cellCurrent.coords[0];
	rowCurrent = cellCurrent.coords[1];
	if( colCurrent === 0 ) { //wrap around
		colCurrent = Keyboard.KEY_LAYOUT[rowCurrent].length - 1;
		neighborCoords = [colCurrent, rowCurrent];
	}
	else {
		neighborCoords = MatrixUtil.getNeighborCoordinates( cellCurrent.coords, [-1, 0] );
	}
	this.cellCurrent = this.getCellByCoords(neighborCoords);
	this.hilightKey( this.cellCurrent.elementKey, this.cellCurrent.coords );
	return this;
}; //Keyboard.prototype.handleLeftArrow()

Keyboard.prototype.handleUpArrow = function( cellCurrent ) {
	var neighborCoords = this.getSpecialNeighborCoords( cellCurrent.coords, 'up' );
	if( typeof neighborCoords === 'undefined' ) {
		neighborCoords = MatrixUtil.getNeighborCoordinates( cellCurrent.coords, [0, -1] );
	}
	this.cellCurrent = this.getCellByCoords(neighborCoords);
	this.hilightKey( this.cellCurrent.elementKey, this.cellCurrent.coords );
	return this;
}; //Keyboard.prototype.handleUpArrow()

Keyboard.prototype.handleRightArrow = function( cellCurrent ) {
	var neighborCoords, colCurrent, rowCurrent;
	colCurrent = cellCurrent.coords[0];
	rowCurrent = cellCurrent.coords[1];
	if( colCurrent + 1 === Keyboard.KEY_LAYOUT[rowCurrent].length ) { // wrap around
		neighborCoords = [0, rowCurrent];
	}
	else {
		neighborCoords = MatrixUtil.getNeighborCoordinates( cellCurrent.coords, [1, 0] );
	}	
	this.cellCurrent = this.getCellByCoords(neighborCoords);
	this.hilightKey( this.cellCurrent.elementKey, this.cellCurrent.coords );
	return this;
}; //Keyboard.prototype.handleRightArrow()

Keyboard.prototype.handleDownArrow = function( cellCurrent ) {
	var neighborCoords = this.getSpecialNeighborCoords( cellCurrent.coords, 'down' );
	if( typeof neighborCoords === 'undefined' ) {
		neighborCoords = MatrixUtil.getNeighborCoordinates( cellCurrent.coords, [0, 1] );
	}
	this.cellCurrent = this.getCellByCoords(neighborCoords);
	this.hilightKey( this.cellCurrent.elementKey, this.cellCurrent.coords );
	return this;
}; //Keyboard.prototype.handleDownArrow()

Keyboard.prototype.handleSelect = function( elementKey ) {
	var textToAppend, keyId, currentText;
	elementKey = elementKey || this.cellCurrent.elementKey;
	keyId = elementKey.attr('id');
	currentText = this.elementProfileName.text();
	if( currentText.length < Keyboard.MAX_PROFILE_LENGTH ) { // - 1 for | blinking cursor
		if( /key-\d{1,4}$/.test(keyId) ) { // @jmjpro regular key with pattern 'key-' followed by 1 to 4 digits for ascii code
			textToAppend = elementKey.text();
		}
		else if( keyId === 'key-space' ) {
			textToAppend = ' ';
		}
		else {
			this.handleSpecialKey( keyId );
		}
	}
	else {
		this.handleSpecialKey( keyId );
	}
	if( textToAppend ) {
		this.elementProfileName.append( textToAppend );
	}
	return this;
}; //Keyboard.prototype.handleSelect()

Keyboard.prototype.handleSpecialKey = function( keyId ) {
	var currentText = this.elementProfileName.text();
	switch( keyId ) {
		case 'key-reset':
			this.elementProfileName.empty();
			break;
		case 'key-delete':
			this.elementProfileName.text( currentText.slice(0, -1) );
			break;
		case 'key-done':
			if( this.elementProfileName.text().length > 0 ) {
				Galapago.profile = this.elementProfileName.text();
				console.debug( 'profile created: "' +  Galapago.profile + '"');
				this.container.hide();
			}
			break;
	}
	return this;
}; //Keyboard.prototype.handleSpecialKey()

// fade (from opacity 1) to opacity 0, then fade back to 1
Keyboard.prototype.cursorAnimation = function() {
	var cursorDomElement = $( '#keypad-cursor' );
	cursorDomElement.animate( {opacity: 0}, 'slow', 'ease', function() {
		cursorDomElement.animate({opacity: 1}, 'slow', 'ease');
	});
	return this;
}; //Keyboard.prototype.cursorAnimation()