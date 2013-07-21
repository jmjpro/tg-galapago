MainMenuScreen.GAL_PREFIX = 'main-menu/';

MainMenuScreen.IMAGE_MAP = {
	"#main-menu-screen" : "main_menu_background.jpg",
	"#button-change-player" : "main_menu_button_change_player_regular.png",
	"#button-timed" : "main_menu_button_timed_regular.png",
	"#button-relaxed" : "main_menu_button_relaxed_regular.png",
	"#button-how-to-play" : "main_menu_button_options_regular.png",
	"#button-top-scores" : "main_menu_button_options_regular.png",
	"#button-set-language" : "main_menu_button_options_regular.png",
	"#button-quit" : "main_menu_button_options_regular.png",
};

MainMenuScreen.HILIGHT_IMAGE_MAP = {
	"main_menu_button_change_player_regular.png" : "main_menu_button_change_player_selected.png",
	"main_menu_button_options_regular.png" : "main_menu_button_options_selected.png",
	"main_menu_button_relaxed_regular.png" : "main_menu_button_relaxed_selected.png",
	"main_menu_button_timed_regular.png" : "main_menu_button_timed_selected.png"
};

MainMenuScreen.BUTTON_NAV_MAP = {
	"button-change-player" : { "DOWN" : "button-timed" },
	"button-timed" : { "UP" : "button-change-player", "RIGHT" : "button-relaxed", "DOWN" : "button-how-to-play" },
	"button-relaxed" : { "UP" : "button-change-player", "LEFT" : "button-timed", "DOWN" : "button-top-scores" },
	"button-how-to-play" : { "UP" : "button-timed", "RIGHT" : "button-top-scores", "DOWN" : "button-set-language" },
	"button-top-scores" : { "UP" : "button-relaxed", "LEFT" : "button-how-to-play", "DOWN" : "button-quit" },
	"button-set-language" : { "UP" : "button-how-to-play", "RIGHT" : "button-quit" },
	"button-quit" : { "UP" : "button-top-scores", "LEFT" : "button-set-language" }
};

function MainMenuScreen() {}

MainMenuScreen.init = function(callingScreenId, callingClass) {
	var mainMenuScreen = new MainMenuScreen();
	mainMenuScreen.mainMenuDOM = $('#main-menu-screen');
	mainMenuScreen.callingScreen = callingScreenId ? $('#' + callingScreenId) : null;
	mainMenuScreen.callingClass = callingClass ? callingClass : null;
	mainMenuScreen.gal = new GameAssetLoader('js/loadingScreen.manifest');
	mainMenuScreen.registerImageLoadEvents();
	mainMenuScreen.gal.init(function() {
		mainMenuScreen.gal.download('mainMenuScreen');
		mainMenuScreen.show();
	});

	mainMenuScreen.windowKeyHandler= window.onkeydown;
}; //MainMenuScreen.init()

MainMenuScreen.prototype.registerImageLoadEvents = function(){
	var mainMenuScreen = this;
	mainMenuScreen.gal.onLoaded('mainMenuScreen', function(result) {
		if (result.success) {
			mainMenuScreen.setImages();
			mainMenuScreen.currentNavItem = null;
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem(null, mainMenuScreen.callingScreen));
		}
	});
}; //MainMenuScreen.prototype.registerImageLoadEvents()

MainMenuScreen.prototype.setImages = function() {
	var mainMenuScreen, galFilePath;
	mainMenuScreen = this;
	_.each( _.keys(MainMenuScreen.IMAGE_MAP), function(selector) {
		galFilePath = MainMenuScreen.GAL_PREFIX + MainMenuScreen.IMAGE_MAP[selector];
		//$(selector).css('background-image','url(' + mainMenuScreen.gal.getAsDataUrl(galFilePath) + ')');
		$(selector).css('background-image','url(' + mainMenuScreen.gal.get(galFilePath).src + ')');
		//$(selector)[0].style.backgroundImage = 'url(' + mainMenuScreen.gal.get(galFilePath).src + ')';
	});
}; //MainMenuScreen.prototype.setImages()

MainMenuScreen.prototype.selectHandler = function() {
	var navItem, isTimedMode;
	navItem = this.currentNavItem;
	console.debug( navItem[0].id + ' selected' );
	switch( navItem[0].id ) {
		case 'button-change-player' :
			break;
		case 'button-timed' :
			this.hide();
			isTimedMode = true;
			Galapago.init(isTimedMode);
			break;
		case 'button-relaxed' :
			this.hide();
			isTimedMode = false;
			Galapago.init(isTimedMode);
			break;
		case 'button-how-to-play' :
			this.unregisterEventHandlers();
			new DialogMenu('main-menu-screen', this, 'dialog-help', 'button-medium-hilight', TGH5.Reporting.Page.Help, updateScrollDivPages);
			break;
		case 'button-top-scores' :
			this.unregisterEventHandlers();
			new DialogMenu('main-menu-screen', this, 'dialog-leaderboards', 'button-big-hilight', TGH5.Reporting.Page.Leaderboards);
			break;
		case 'button-set-language' :
			var dropDownElement, display;
			dropDownElement = $('#main-menu-screen .galapago-drop-down');
			display = dropDownElement.css('display') === 'none' ? 'block' : 'none';
			dropDownElement.css('display', display);
			//TODO add event handlers here to change the language with left and right arrows, and enter to select the language
			break;
		case 'button-quit' :
			this.unregisterEventHandlers();
			new DialogMenu('main-menu-screen', this, 'dialog-quit', 'button-huge-hilight');
			break;
	}
}; //MainMenuScreen.prototype.selectHandler()

MainMenuScreen.prototype.registerEventHandlersLanguage = function() {
	;
} //MainMenuScreen.prototype.registerEventHandlersLanguage()

MainMenuScreen.prototype.show = function() {
	this.callingClass && this.callingClass.unregisterEventHandlers();	
	this.registerEventHandlers();
	this.mainMenuDOM.css('display', 'block');
	this.callingScreen && this.callingScreen.hide();
	sdkApi.reportPageView(TGH5.Reporting.Page.MainMenu);
}; //MainMenuScreen.prototype.show()

MainMenuScreen.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.mainMenuDOM.css('display', 'none');
	/*
	if( this.callingClass.registerEventHandlers ){
		this.callingClass.registerEventHandlers();
	}
	else {
		window.onkeydown = this.windowKeyHandler;
	}
	this.callingScreen.show();
	*/
}; //MainMenuScreen.prototype.show()

MainMenuScreen.prototype.isFirstTimeShown = function() {
	//TODO load from localStorage
	return false;
}; //MainMenuScreen.prototype.isFirstTimeShown()

MainMenuScreen.prototype.getLastSelectedMode = function() {
	//TODO read from local storage
	return '#button-timed';
}; //MainMenuScreen.prototype.getLastSelectedMode()

MainMenuScreen.prototype.getNavItem = function(direction, callingScreen) {
	var navItem, currentElementId, nextElementId;
	if( this.isFirstTimeShown() ) {
		navItem = $('#button-timed');
	}
	else if( callingScreen ) {
		switch( callingScreen[0].id ) {
			case 'canvas-main' :
				navItem = $('#button-timed');
				break;
			case 'game-screen' :
				navItem = $(this.getLastSelectedMode());
				break;
			default :
				//TODO do we need this? won't it show automatically?
				//navItem = this.lastFocusedButton();
				break;
		}
	}
	else if ( direction ) {
		currentElementId = this.currentNavItem[0].id;
		nextElementId = MainMenuScreen.BUTTON_NAV_MAP[currentElementId][direction];
		if( nextElementId ) {
			navItem = $('#' + nextElementId);
		}
	}
	else {
		navItem = $('#button-timed');
	}
	return navItem;
}; //MainMenuScreen.prototype.getNavItem()

MainMenuScreen.prototype.setNavItem = function(item) {
	if( item ) {
		if( this.currentNavItem ) {
			this.removeHilight(this.currentNavItem);
		}
		this.currentNavItem = item;
		this.addHilight(this.currentNavItem);
	}
}; //MainMenuScreen.prototype.setNavItem()

MainMenuScreen.prototype.removeHilight = function(navItem) {
	var galFilePath;
	galFilePath = MainMenuScreen.GAL_PREFIX + MainMenuScreen.IMAGE_MAP[navItem.selector];
	//navItem.css( 'background-image', 'url(' + this.gal.getAsDataUrl(galFilePath) + ')' );
	navItem.css( 'background-image', 'url(' + this.gal.get(galFilePath).src + ')' );
};

MainMenuScreen.prototype.addHilight = function(navItem) {
	var galFilePath, galHilightFilePath;
	galFilePath = MainMenuScreen.IMAGE_MAP[navItem.selector];
	galHilightFilePath = MainMenuScreen.GAL_PREFIX + MainMenuScreen.HILIGHT_IMAGE_MAP[galFilePath];
	//navItem.css( 'background-image', 'url(' + this.gal.getAsDataUrl(galHilightFilePath) + ')' );
	navItem.css( 'background-image', 'url(' + this.gal.get(galHilightFilePath).src + ')' );
	//navItem[0].style.backgroundImage = 'url(' + this.gal.get(galHilightFilePath).src + ')';
};

MainMenuScreen.prototype.registerEventHandlers = function() {
	var mainMenuScreen;
	mainMenuScreen = this;
	window.onkeydown = function(evt) {
		console.debug(mainMenuScreen.currentNavItem[0].id + ' hilighted');
		switch( evt.keyCode ) {
		case 13: // enter
			mainMenuScreen.selectHandler();
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 37: // left arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('LEFT'));
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 38: // up arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('UP'));
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 39: // right arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('RIGHT'));
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 40: // down arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('DOWN'));
			evt.stopPropagation();
			evt.preventDefault();
			break;
		}
	};

	//TODO mouse support
	/*
	$('img.nav-button').on( 'click', function(evt) {
		
	});
	*/
}; //MainMenuScreen.prototype.registerEventHandlers()

MainMenuScreen.prototype.unregisterEventHandlers = function() {
	window.onkeydown = null;
}; //MainMenuScreen.prototype.unregisterEventHandlers()