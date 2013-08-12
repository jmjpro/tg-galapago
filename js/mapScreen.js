MapScreen.NAV_BUTTON_IDS = ['button_play_map', 'button_start_map', 'button_reset_map', 'button_menu_map', 'button_quit_map' ];
MapScreen.GAL_PREFIX = 'screen-map/';

function MapScreen() {
	var mapNav, galFilePathCursor;
	this.setImages();
	mapNav = $('#map-nav');
	this.currentNavItem = mapNav.children('li:nth-child(1)');
	galFilePathCursor = MapScreen.GAL_PREFIX + 'button_cursor_map.png';
	this.cursor = LoadingScreen.gal.get(galFilePathCursor);
	this.cursor.id = 'map-nav-cursor';
}

MapScreen.prototype.setImages = function() {
	var galFilePath;
	_.each( MapScreen.NAV_BUTTON_IDS, function( navButtonId ) {
		galFilePath = MapScreen.GAL_PREFIX + navButtonId + '.png';
		console.debug( '#' + navButtonId + " : " + galFilePath);
		$('#' + navButtonId).css('background-image','url(' + LoadingScreen.gal.get(galFilePath).src + ')');
	});
}

MapScreen.prototype.setNavItem = function(item) {
	// remove cursor from old item
	this.unsetNavItem();
	this.currentNavItem = item;
	// add cursor to new item
	this.currentNavItem.find('div').html(this.cursor);
}; //MapScreen.prototype.setNavItem()

MapScreen.prototype.unsetNavItem = function() {
	//this.currentNavItem.children('img:nth-child(2)').remove();
	this.currentNavItem.find('div').html('');
}

MapScreen.prototype.handleNavButtonSelect = function(navItem) {
	var mapScreen, itemId, levelMap;
	itemId = navItem.children('div')[0].id;
	levelMap = Galapago.levelMap;
	console.log('itemId:' + itemId);
	this.unsetNavItem();
	switch( itemId ) {
		case 'button_play_map' :
			//console.log( 'selected play map button');
			levelMap.handleKeyboardSelect();
			break;
		case 'button_start_map' :
			//console.log( 'selected start map button');
			levelMap.setHotspotLevel(LevelMap.getNextLevel());
			levelMap.handleKeyboardSelect();
			break;
		case 'button_reset_map' :
			//console.log( 'selected reset map button');
			window.dialog = new DialogMenu('layer-map-other-animation', levelMap, 'dialog-reset-game', 'button-medium-hilight');
			break;
		case 'button_menu_map' :
			//console.log( 'selected menu map button');
			mapScreen.toMainMenuScreen(levelMap);
			//MainMenuScreen.show();
			break;
		case 'button_quit_map' :
			window.dialog = new DialogMenu('layer-power-up', this, 'dialog-quit', 'button-huge-hilight');
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
			mapScreen.unsetNavItem();
			mapScreen.unregisterEventHandlers();
			levelMap.drawHotspot(levelMap.hotspotLevel.mapHotspotRegion);
			if(!Level.isComplete('1')){
				levelMap.levelAnimation.animateGameStartArrow(levelMap.otherAnimationLayer);
			}
			levelMap.registerEventHandlers();
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

MapScreen.prototype.toMainMenuScreen = function(levelMap) {
	levelMap.cleanup();
	MainMenuScreen.init('screen-map', levelMap);
}; //MapScreen.prototype.toMainMenuScreen()

MapScreen.prototype.unregisterEventHandlers = function() {
	window.onkeydown = null;
}; //MapScreen.prototype.unregisterEventHandlers()
