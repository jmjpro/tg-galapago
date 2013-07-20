MapScreen.WIDTH = 1280;
MapScreen.HEIGHT = 670;

function MapScreen() {
	var mapNav;
	mapNav = $('#map-nav');
	this.currentNavItem = mapNav.children('li:nth-child(1)');
}

MapScreen.prototype.setNavItem = function(item) {
	var cursor;
	cursor = '<img class="cursor" src="res/img/map-screen/button_cursor_map.png"/>';
	// remove cursor from old item
	this.unsetNavItem();
	this.currentNavItem = item;
	// add cursor to new item
	this.currentNavItem.append(cursor);
}; //MapScreen.prototype.setNavItem()

MapScreen.prototype.unsetNavItem = function() {
	this.currentNavItem.children('img:nth-child(2)').remove();
}

MapScreen.prototype.handleNavButtonSelect = function(navItem) {
	var mapScreen, itemId, levelMap;
	itemId = navItem.children('img:nth-child(1)')[0].id;
	levelMap = Galapago.levelMap;
	//console.log(itemId);
	this.unsetNavItem();
	switch( itemId ) {
		case 'menu-map' :
			console.log( 'selected menu map button');
			levelMap.cleanupAnimationAndSound();
			MainMenuScreen.init('canvas-main', this);
			break;
		case 'play-map' :
			levelMap.handleKeyboardSelect();
			//console.log( 'selected play map button');
			break;
		case 'quit-map' :
			//var dialogQuit = new DialogQuit();
			new DialogMenu('layer-power-up', this, 'dialog-quit', 'button-huge-hilight');
			break;
		case 'reset-map' :
			//console.log( 'selected reset map button');
			new DialogMenu('layer-map-other-animation', LevelMap, 'dialog-reset-game', 'button-medium-hilight');

			break;
		case 'start-next-map' :
			levelMap.setHotspotLevel(LevelMap.getNextLevel());
			levelMap.handleKeyboardSelect();
			console.log( 'selected start map button');
			break;
	}
}; //MapScreen.prototype.handleNavButtonSelect()

MapScreen.prototype.registerEventHandlers = function() {
	var mapScreen, mapNav;
	mapScreen = this;
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
			Galapago.levelMap.registerEventHandlers();
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
		}
	};

	$('img.nav-button').on( 'click', function(evt) {
		mapScreen.setNavItem(mapNav.children().find('img#' + evt.target.id).parent('li'));
		mapScreen.handleNavButtonSelect(mapScreen.currentNavItem);
	});
}; //MapScreen.prototype.registerEventHandlers()

MapScreen.prototype.unregisterEventHandlers = function() {
	window.onkeydown = null;
}; //MapScreen.prototype.unregisterEventHandlers()
