MapScreen.NAV_BUTTON_IDS = ['button-play-map', 'button-start-map', 'button-reset-map', 'button-menu-map', 'button-quit-map' ];
MapScreen.GAL_PREFIX = 'screen-map/';
MapScreen.IMAGE_CACHE_DISPLAY_TIMEOUT = 1200;

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
	//levelMap = Galapago.levelMap;
	console.log('itemId:' + itemId);
	this.unsetNavItem();
	switch( itemId ) {
		case 'button-play-map' :
			//console.log( 'selected play map button');
			this.handleKeyboardSelect();
			break;
		case 'button-start-map' :
			//console.log( 'selected start map button');
			this.setHotspotLevel(LevelMap.getNextLevel());
			this.handleKeyboardSelect();
			break;
		case 'button-reset-map' :
			//console.log( 'selected reset map button');
			//levelMap.levelAnimation.stopAllAnimations();
			window.dialog = new DialogMenu('layer-map-other-animation', this, 'dialog-reset-game');
			break;
		case 'button-menu-map' :
			//console.log( 'selected menu map button');
			//this.toMainMenuScreen(levelMap);
			window.dialog = new DialogMenu('screen-game', this, 'dialog-game-menu', null, DialogMenu.loadImages(['arrow-left','arrow-right']));
			//MainMenuScreen.show();
			break;
		case 'button-quit-map' :
			//levelMap.levelAnimation.stopAllAnimations();
			window.dialog = new DialogMenu('layer-power-up', this, 'dialog-quit');
			break;
	}
}; //MapScreen.prototype.handleNavButtonSelect()

MapScreen.prototype.onDialogClose = function(evt) {
	Galapago.mapScreen.focusMap( Galapago.levelMap );
};

MapScreen.prototype.registerEventHandlers = function() {
	var mapScreen, mapNav, levelMap;
	mapScreen = this;
	levelMap = Galapago.levelMap;
	mapNav = $('#map-nav');
	mapNav.off('keydown');
	mapNav.on('keydown', function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			mapScreen.handleNavButtonSelect(mapScreen.currentNavItem);
			break;
		case 37: // left arrow
			if( mapScreen.currentNavItem.index() > 0 ) {
				mapScreen.setNavItem(mapScreen.currentNavItem.prev());
			}
			break;
		case 38: // up arrow
			mapScreen.focusMap( levelMap );
			break;
		case 39: // right arrow
			if( mapScreen.currentNavItem.index() < mapNav.children().length - 1 ) {
				mapScreen.setNavItem(mapScreen.currentNavItem.next());
			}
			break;
		case 40: // down arrow
			mapScreen.setNavItem(mapNav.children('li:nth-child(1)'));
			break;
		case 8: // back/backspace key
			mapScreen.unsetNavItem();
			mapScreen.toMainMenuScreen(levelMap);
			break;
		}
		return false;
	});
}; //MapScreen.prototype.registerEventHandlers()

MapScreen.prototype.addMouseListener = function(){
	var mapScreen = this;
	$('ul#map-nav li').off('mouseover');
	$('ul#map-nav li').on( 'mouseover', function(evt){
		var levelMap = Galapago.levelMap;
		levelMap.stopStartArrowAnimation();	
		levelMap.drawHotspot(levelMap.hotspotLevel.mapHotspotRegion, true);
		mapScreen.setNavItem( $(this) );
		$('ul#map-nav').focus();
		return false;
	});
	
	$('ul#map-nav li').off('mouseout');
	$('ul#map-nav li').on('mouseout', function(evt){
		mapScreen.focusMap(Galapago.levelMap);
		return false;
	});

	$('ul#map-nav li').off( 'click' );
	$('ul#map-nav li').on( 'click', function(evt) {
		mapScreen.setNavItem( $(this) );
		mapScreen.handleNavButtonSelect(mapScreen.currentNavItem);
		return false;
	});
}

MapScreen.prototype.focusMap = function(levelMap) {
	this.currentNavItem.css( 'background-image','');
	levelMap.drawHotspot(levelMap.hotspotLevel.mapHotspotRegion);
	levelMap.canvas.focus();
	levelMap.animateStartArrowIfNeeded();
	//levelMap.startAnimations();
}; //MapScreen.prototype.focusMap()

MapScreen.prototype.toMainMenuScreen = function(levelMap) {
	MainMenuScreen.init('screen-map', levelMap, function() {
		levelMap.cleanup();
	});
}; //MapScreen.prototype.toMainMenuScreen()