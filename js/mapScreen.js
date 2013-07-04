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
	this.currentNavItem.children('img:nth-child(2)').remove();
	this.currentNavItem = item;
	// add cursor to new item
	this.currentNavItem.append(cursor);
}; //MapScreen.prototype.setNavItem()

MapScreen.prototype.handleNavButtonSelect = function(navItem) {
	var itemId;
	itemId = navItem.children('img:nth-child(1)')[0].id;
	//console.log(itemId);
	switch( itemId ) {
		case 'menu-map' :
			console.log( 'selected menu map button');
			break;
		case 'play-map' :
			console.log( 'selected play map button');
			break;
		case 'quit-map' :
			console.log( 'selected quit map button');
			break;
		case 'reset-map' :
			console.log( 'selected reset map button');
			break;
		case 'start-map' :
			console.log( 'selected start map button');
			break;
	}
}; //MapScreen.prototype.handleNavButtonSelect()

MapScreen.prototype.registerEventHandlers = function() {
	var mapScreen, mapNav;
	mapScreen = this;
	mapNav = $('#map-nav');
	mapNav.onkeydown = function(evt) {
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
		case 48: //numeric 0
			mapScreen.unregisterEventHandlers();
			Galapago.levelMap.display();
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
