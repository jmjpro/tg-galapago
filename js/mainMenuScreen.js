MainMenuScreen.BUTTON_NAV_MAP = {
	"button-change-player" : { "DOWN" : "button-timed" },
	"button-timed" : { "UP" : "button-change-player", "RIGHT" : "button-relaxed", "DOWN" : "button-how-to-play" },
	"button-relaxed" : { "UP" : "button-change-player", "LEFT" : "button-timed", "DOWN" : "button-how-to-play" },
	"button-how-to-play" : { "UP" : "button-timed" }
};

MainMenuScreen.HILIGHT_IMAGE_MAP = {
	"main_menu_button_change_player_regular.png" : "main_menu_button_change_player_selected.png",
	"main_menu_button_options_regular.png" : "main_menu_button_options_selected.png",
	"main_menu_button_relaxed_regular.png" : "main_menu_button_relaxed_selected.png",
	"main_menu_button_timed_regular.png" : "main_menu_button_timed_selected.png"
};

MainMenuScreen.HILIGHT_CLASS = '-hilight';

function MainMenuScreen() {}

MainMenuScreen.init = function(callingScreenId, callingClass) {
	var mainMenuScreen = new MainMenuScreen();
	mainMenuScreen.gal = new GameAssetLoader('js/loadingScreen.manifest');
	mainMenuScreen.registerImageLoadEvents();
	mainMenuScreen.gal.init(function() {
		mainMenuScreen.gal.download('mainMenuScreen');
	});

	mainMenuScreen.callingScreen = $('#' + callingScreenId);
	mainMenuScreen.mainMenuDOM = $('#main-menu-screen');
	mainMenuScreen.callingClass = callingClass;
	mainMenuScreen.windowKeyHandler= window.onkeydown;
	mainMenuScreen.currentNavItem = mainMenuScreen.getNavItem(null, callingScreenId);
	mainMenuScreen.registerEventHandlers();
}; //MainMenuScreen.init()

MainMenuScreen.prototype.registerImageLoadEvents = function(){
	var mainMenuScreen = this;
	mainMenuScreen.gal.onLoaded('mainMenuScreen', function(result) {
		if (result.success) {
			mainMenuScreen.setImages();
		}
	});
}; //MainMenuScreen.prototype.registerImageLoadEvents()

MainMenuScreen.prototype.setImages = function() {
	var imgButtonChangePlayer = this.gal.get('main-menu/main_menu_button_change_player_regular.png');
	var imgButtonTimed = this.gal.get('main-menu/main_menu_button_timed_regular.png');
	var imgButtonRelaxed = this.gal.get('main-menu/main_menu_button_relaxed_regular.png');
	$('#button-change-player').css('background-image','url(' + CanvasUtil.getBase64Image(imgButtonChangePlayer) + ')');
	$('#button-timed').css('background-image','url(' + CanvasUtil.getBase64Image(imgButtonTimed) + ')');
	$('#button-relaxed').css('background-image','url(' + CanvasUtil.getBase64Image(imgButtonRelaxed) + ')');
}; //MainMenuScreen.prototype.setImages()

MainMenuScreen.prototype.selectHandler = function() {
	var navItem;
	navItem = this.currentNavItem;
	console.debug( navItem[0].id );
	switch( navItem[0].id ) {
		case 'button-change-player' :			
			break;
		case 'button-timed' :			
			break;
		case 'button-relaxed' :			
			break;
		case 'button-how-to-play' :			
			break;
		case 'button-top-scores' :			
			break;
		case 'button-set-language' :			
			break;
		case 'button-quit' :			
			break;
	}
}; //MainMenuScreen.prototype.selectHandler()

MainMenuScreen.prototype.show = function() {
	this.mainMenuDOM.css('display', 'block');
	this.callingScreen.hide();
}; //MainMenuScreen.prototype.show()

MainMenuScreen.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.mainMenuDOM.css('display', 'none');
	if( this.callingClass.registerEventHandlers ){
		this.callingClass.registerEventHandlers();
	}
	else {
		window.onkeydown = this.windowKeyHandler;
	}
	this.callingScreen.show();
}; //MainMenuScreen.prototype.show()

MainMenuScreen.prototype.isFirstTimeShownInSession = function() {
	//TODO load from localStorage
	return true;
}; //MainMenuScreen.prototype.isFirstTimeShownInSession()

MainMenuScreen.prototype.getNavItem = function(direction, callingScreenId) {
	var navItem;
	if( this.isFirstTimeShownInSession() ) {
		navItem = $('#button-timed');
	}
	else if( callingScreenId ) {
		switch( callingScreenId ) {
			case 'game-screen' :
				navItem = this.getLastSelectedMode();
				break;
			default :
				//TODO do we need this? won't it show automatically?
				//navItem = this.lastFocusedButton();
				break;
		}
	}
	else {
		navItem = MainMenuScreen.BUTTON_NAV_MAP.currentNavItem.direction;
	}
	return navItem;
}; //MainMenuScreen.prototype.getNavItem()

MainMenuScreen.prototype.setNavItem = function(item) {
	var hilightClass;
	hilightClass = this.getHilightClass(this.currentNavItem);
	this.currentNavItem.removeClass( hilightClass );
	this.currentNavItem = item;
	hilightClass = this.getHilightClass(this.currentNavItem);
	this.currentNavItem.addClass( hilightClass );
}; //MainMenuScreen.prototype.setNavItem()

MainMenuScreen.prototype.getHilightImage = function(navItem) {
	var parts, fileName;
	parts = navItem[0].src;
	fileName = parts[parts.length - 1];
	return MainMenuScreen.HILIGHT_IMAGE_MAP.fileName;
};

MainMenuScreen.prototype.getHilightClass = function(navItem) {
	var hilightClass;
	if( navItem.hasClass('main-menu-button') ) {
		hilightClass = 'main-menu-button' + MainMenuScreen.HILIGHT_CLASS;
	}
	else {
		hilightClass = navItem[0].id + MainMenuScreen.HILIGHT_CLASS;
	}
	return hilightClass;
}; //MainMenuScreen.prototype.getHilightClass()

MainMenuScreen.prototype.getLastSelectedMode = function() {
	//TODO read from local storage
	return 'button-timed';
}; //MainMenuScreen.prototype.getLastSelectedMode()

MainMenuScreen.prototype.registerEventHandlers = function() {
	var mainMenuScreen;
	mainMenuScreen = this;
	window.onkeydown = function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			mainMenuScreen.selectHandler();
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 38: // up arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('UP'));
			console.debug(mainMenuScreen.currentNavItem[0]);
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 39: // right arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('RIGHT'));
			console.debug(mainMenuScreen.currentNavItem[0]);
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 40: // down arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('DOWN'));
			console.debug(mainMenuScreen.currentNavItem[0]);
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 38: // up arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('LEFT'));
			console.debug(mainMenuScreen.currentNavItem[0]);
			evt.stopPropagation();
			evt.preventDefault();
			break;
		}
	};

	/*
	$('img.nav-button').on( 'click', function(evt) {
		
	});
	*/
}; //MainMenuScreen.prototype.registerEventHandlers()

MainMenuScreen.prototype.unregisterEventHandlers = function() {
	window.onkeydown = null;
}; //MainMenuScreen.prototype.unregisterEventHandlers()