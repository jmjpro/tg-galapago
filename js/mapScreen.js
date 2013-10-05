MapScreen.NAV_BUTTON_IDS = ['button-play-map', 'button-start-map', 'button-reset-map', 'button-menu-map', 'button-quit-map' ];
MapScreen.GAL_PREFIX = 'screen-map/';

function MapScreen() {
	var mapNav, galFilePathCursor;
	this.setImages();
	mapNav = $('#map-nav');
	this.currentNavItem = mapNav.children('li:nth-child(1)');
	galFilePathCursor = MapScreen.GAL_PREFIX + 'button-cursor.png';
	this.cursor = LoadingScreen.gal.get(galFilePathCursor);
	this.addMouseListener();
}

MapScreen.prototype.setImages = function() {
	var galFilePath, imageBackground;
	_.each( MapScreen.NAV_BUTTON_IDS, function( navButtonId ) {
		galFilePath =  MapScreen.GAL_PREFIX + 'button-regular.png';
		console.debug( '#' + navButtonId + " : " + galFilePath);
		imageBackground = LoadingScreen.gal.get(galFilePath);
		if( imageBackground ) {
			$('#' + navButtonId).css( 'background-image','url(' + imageBackground.src + ')');
		}
		else {
			console.error( 'unable to load ' + galFilePath);
		}
	});
}

MapScreen.prototype.setNavItem = function(item) {
	// remove cursor from old item
	this.unsetNavItem();
	this.currentNavItem = item;
	// add cursor to new item
	this.currentNavItem.css( 'background-image','url(' + this.cursor.src + ')');
	//html(this.cursor);
}; //MapScreen.prototype.setNavItem()

MapScreen.prototype.unsetNavItem = function() {
	if(this.currentNavItem){
		this.currentNavItem.css( 'background-image','');
	}
}

MapScreen.prototype.handleNavButtonSelect = function(navItem) {
	var itemId, levelMap;
	itemId = navItem.find('div.nav-button')[0].id;
	levelMap = Galapago.levelMap;
	console.log('itemId:' + itemId);
	this.unsetNavItem();
	switch( itemId ) {
		case 'button-play-map' :
			//console.log( 'selected play map button');
			levelMap.handleKeyboardSelect();
			break;
		case 'button-start-map' :
			//console.log( 'selected start map button');
			levelMap.setHotspotLevel(LevelMap.getNextLevel());
			levelMap.handleKeyboardSelect();
			break;
		case 'button-reset-map' :
			//console.log( 'selected reset map button');
			window.dialog = new DialogMenu('layer-map-other-animation', levelMap, 'dialog-reset-game');
			break;
		case 'button-menu-map' :
			//console.log( 'selected menu map button');
			this.toMainMenuScreen(levelMap);
			//MainMenuScreen.show();
			break;
		case 'button-quit-map' :
			window.dialog = new DialogMenu('layer-power-up', this, 'dialog-quit');
			break;
	}
}; //MapScreen.prototype.handleNavButtonSelect()

MapScreen.prototype.registerEventHandlers = function() {
	var mapScreen, mapNav, levelMap;
	mapScreen = this;
	levelMap = Galapago.levelMap;
	mapNav = $('#map-nav');
	//mapNav.onkeydown = function(evt) {
	window.onkeydown = function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			mapScreen.handleNavButtonSelect(mapScreen.currentNavItem);
			evt.stopPropagation();
			break;
		case 37: // left arrow
			if( mapScreen.currentNavItem.index() > 0 ) {
				mapScreen.setNavItem(mapScreen.currentNavItem.prev());
			}
			evt.preventDefault();
			break;
		case 38: // up arrow
			mapScreen.focusMap( levelMap );
			evt.preventDefault();
			break;
		case 39: // right arrow
			if( mapScreen.currentNavItem.index() < mapNav.children().length - 1 ) {
				mapScreen.setNavItem(mapScreen.currentNavItem.next());
			}
			evt.preventDefault();
			break;
		case 40: // down arrow
			mapScreen.setNavItem(mapNav.children('li:nth-child(1)'));
			evt.preventDefault();
			break;
		case 8: // back/backspace key
			evt.stopPropagation();
			evt.preventDefault();
			mapScreen.unsetNavItem();
			mapScreen.toMainMenuScreen(levelMap);
			break;
		}
	};

	$('img.nav-button').on( 'click', function(evt) {
		mapScreen.setNavItem(mapNav.children().find('img#' + evt.target.id).parent('li'));
		mapScreen.handleNavButtonSelect(mapScreen.currentNavItem);
	});
}; //MapScreen.prototype.registerEventHandlers()

MapScreen.prototype.addMouseListener = function(){
	var mapScreen = this;
	mapNav = $('#map-nav');
	_.each(mapNav.children('li'), function( element ) {
		element.onmouseover = function(evt){
			var levelMap = Galapago.levelMap;
			levelMap.unregisterEventHandlers();
			levelMap.stopStartArrowAnimation();	
			levelMap.drawHotspot(levelMap.hotspotLevel.mapHotspotRegion, true);
			mapScreen.registerEventHandlers();
			mapScreen.setNavItem( $(this) );
			evt.preventDefault();
			evt.stopPropagation();
		}
		
		element.onmouseout = function(evt){
			mapScreen.focusMap(Galapago.levelMap);
		}
	
	});
}

MapScreen.prototype.focusMap = function(levelMap) {
	this.currentNavItem.css( 'background-image','');
	this.unregisterEventHandlers();
	levelMap.drawHotspot(levelMap.hotspotLevel.mapHotspotRegion);
	levelMap.animateStartArrowIfNeeded();
	levelMap.registerEventHandlers();
}; //MapScreen.prototype.focusMap()

MapScreen.prototype.toMainMenuScreen = function(levelMap) {
	MainMenuScreen.init('screen-map', levelMap, function() {
		levelMap.cleanup();
	});
}; //MapScreen.prototype.toMainMenuScreen()

MapScreen.prototype.unregisterEventHandlers = function() {
	window.onkeydown = null;
}; //MapScreen.prototype.unregisterEventHandlers()
