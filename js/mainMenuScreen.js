MainMenuScreen.GAL_PREFIX = 'main-menu/';
MainMenuScreen.DIALOG_PREFIX = 'background/';

MainMenuScreen.IMAGE_MAP = {
	"#screen-main-menu" : "main-menu.jpg",
	"#button-change-player" : "button-change-player-regular.png",
	"#button-timed" : "button-timed-regular.png",
	"#button-relaxed" : "button-relaxed-regular.png",
	"#button-how-to-play" : "button-options-regular.png",
	"#button-top-scores" : "button-options-regular.png",
	"#button-set-language" : "button-options-regular.png",
	"#button-quit" : "button-options-regular.png"
};

MainMenuScreen.HILIGHT_IMAGE_MAP = {
	"button-change-player-regular.png" : "change-player-selected.png",
	"button-options-regular.png" : "button-options-selected.png",
	"button-relaxed-regular.png" : "button-relaxed-selected.png",
	"button-timed-regular.png" : "button-timed-selected.png"
};

/* navigation after IFA exhibition
MainMenuScreen.BUTTON_NAV_MAP = {
	"button-change-player" : { "DOWN" : "button-timed" },
	"button-timed" : { "UP" : "button-change-player", "RIGHT" : "button-relaxed", "DOWN" : "button-how-to-play" },
	"button-relaxed" : { "UP" : "button-change-player", "LEFT" : "button-timed", "DOWN" : "button-top-scores" },
	"button-how-to-play" : { "UP" : "button-timed", "RIGHT" : "button-top-scores", "DOWN" : "button-set-language" },
	"button-top-scores" : { "UP" : "button-relaxed", "LEFT" : "button-how-to-play", "DOWN" : "button-quit" },
	"button-set-language" : { "UP" : "button-how-to-play", "RIGHT" : "button-quit" },
	"button-quit" : { "UP" : "button-top-scores", "LEFT" : "button-set-language" }
};
*/
MainMenuScreen.BUTTON_NAV_MAP = {
	//"button-change-player" : { "DOWN" : "button-timed" },
	//"button-timed" : { "RIGHT" : "button-relaxed", "DOWN" : "button-how-to-play" },
 	"button-relaxed" : { /*"LEFT" : "button-timed",*/ "DOWN" : "button-quit" },
	"button-how-to-play" : { "UP" : "button-relaxed", "RIGHT" : "button-quit" },
	"button-quit" : { "UP" : "button-relaxed", "LEFT" : "button-how-to-play" }
};

function MainMenuScreen() {}

MainMenuScreen.init = function(callingScreenId, callingObject) {
	var mainMenuScreen = new MainMenuScreen();
	mainMenuScreen.mainMenuDOM = $('#screen-main-menu');
	mainMenuScreen.callingScreen = callingScreenId ? $('#' + callingScreenId) : null;
	mainMenuScreen.callingObject = callingObject ? callingObject : null;
	/*
	if( callingScreenId == 'screen-loading') {
		mainMenuScreen.registerImageLoadEvents();
	}
	else {
		mainMenuScreen.setInitialNavItem();
	}
	*/
	mainMenuScreen.setImages();
	mainMenuScreen.setInitialNavItem();
	mainMenuScreen.show();

	mainMenuScreen.windowKeyHandler= window.onkeydown;
	mainMenuScreen.addMouseListener();
}; //MainMenuScreen.init()

MainMenuScreen.prototype.addMouseListener = function(){
	var mainMenuScreen = this;

	_.each( _.keys(MainMenuScreen.BUTTON_NAV_MAP), function( buttonId ) {
		mainMenuScreen.registerOnClickEvent(buttonId);
		mainMenuScreen.registerMouseOverEvent(buttonId);
	});

} //MainMenuScreen.prototype.addMouseListener()

MainMenuScreen.prototype.registerOnClickEvent = function(id){
	var mainMenuScreen = this;
	$('#'+id)[0].onclick = function (evt){
				mainMenuScreen.setNavItem($('#'+id));
				mainMenuScreen.selectHandler();
	}
}

MainMenuScreen.prototype.registerMouseOverEvent = function(id){
	var mainMenuScreen = this;
	$('#'+id)[0].onmouseover = function (evt){
				mainMenuScreen.setNavItem($('#'+id));
				evt.preventDefault();
				evt.stopPropagation();
	}
}

MainMenuScreen.prototype.setInitialNavItem = function(){
	this.currentNavItem = null;
	this.setNavItem(this.getNavItem(null, this.callingScreen));
	console.debug( 'mainMenuScreen.currentNavItem: ' + this.currentNavItem );
}; //MainMenuScreen.prototype.setInitialNavItem()

MainMenuScreen.prototype.setImages = function() {
	var mainMenuScreen, galFilePath, galPrefix, image;
	mainMenuScreen = this;
	_.each( _.keys(MainMenuScreen.IMAGE_MAP), function(selector) {
		galPrefix = selector === '#screen-main-menu' ? 'background/' : MainMenuScreen.GAL_PREFIX;
		galFilePath = galPrefix + MainMenuScreen.IMAGE_MAP[selector];
		image = LoadingScreen.gal.get(galFilePath);
		if( image ) {
			$(selector).css( 'background-image','url(' + image.src + ')');
		}
	});
}; //MainMenuScreen.prototype.setImages()

MainMenuScreen.prototype.selectHandler = function() {
	var navItem, isTimedMode, level;
	navItem = this.currentNavItem;
	console.debug( navItem[0].id + ' selected' );
	switch( navItem[0].id ) {
		case 'button-change-player' :
			break;
		case 'button-timed' :
			this.hide();
			isTimedMode = true;
			if( this.callingObject instanceof Level ) {
				Galapago.isTimedMode = isTimedMode;
				level = this.callingObject;
				LevelMap.show(level);
				//level.showLevelMap(level);
			}			else {
				Galapago.init(isTimedMode);
			}
			break;
		case 'button-relaxed' :
			this.hide();
			isTimedMode = false;
			if( this.callingObject instanceof Level ) {
				Galapago.isTimedMode = isTimedMode;
				level = this.callingObject;
				LevelMap.show(level);
				//level.showLevelMap(level);
			}
			else {
				Galapago.init(isTimedMode);
			}
			new DialogHelp('main-menu-screen', this, 'dialog-help', TGH5.Reporting.Page.Help);
			break;
		case 'button-top-scores' :
			this.unregisterEventHandlers();
			window.dialog = new DialogMenu('main-menu-screen', this, 'dialog-leaderboards', TGH5.Reporting.Page.Leaderboards);
			break;
		case 'button-set-language' :
			var dropDownElement, display;
			dropDownElement = $('#screen-main-menu .galapago-drop-down');
			display = dropDownElement.css('display') === 'none' ? 'block' : 'none';
			dropDownElement.css('display', display);
			//TODO add event handlers here to change the language with left and right arrows, and enter to select the language
			break;
		case 'button-quit' :
			this.unregisterEventHandlers();
			$('#dialog-quit').css('background-image','url(' + LoadingScreen.gal.get(MainMenuScreen.DIALOG_PREFIX+'dialog-regular-no-title.png').src + ')');
			new DialogMenu('main-menu-screen', this, 'dialog-quit');
			break;
	}
}; //MainMenuScreen.prototype.selectHandler()

MainMenuScreen.prototype.show = function() {
	this.callingObject && this.callingObject.unregisterEventHandlers();	
	this.registerEventHandlers();
	this.mainMenuDOM.show();
	this.callingScreen && this.callingScreen.hide();
	//sdkApi.reportPageView(TGH5.Reporting.Page.MainMenu);
}; //MainMenuScreen.prototype.show()

MainMenuScreen.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.mainMenuDOM.hide();
	/*
	if( this.callingObject.registerEventHandlers ){
		this.callingObject.registerEventHandlers();
	}
	else {
		window.onkeydown = this.windowKeyHandler;
	}
	this.callingScreen.show();
	*/
}; //MainMenuScreen.prototype.hide()

MainMenuScreen.prototype.quit = function() {
	this.hide();
	sdkApi.exit();
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
			case 'screen-loading' :
				navItem = $('#button-relaxed');
				break;
			case 'screen-map' :
				navItem = $('#button-relaxed');
				break;
			case 'screen-game' :
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
	navItem.css( 'background-image', 'url(' + LoadingScreen.gal.get(galFilePath).src + ')' );
};

MainMenuScreen.prototype.addHilight = function(navItem) {
	var galFilePath, galHilightFilePath, hilightedImage;
	galFilePath = MainMenuScreen.IMAGE_MAP[navItem.selector];
	galHilightFilePath = MainMenuScreen.GAL_PREFIX + MainMenuScreen.HILIGHT_IMAGE_MAP[galFilePath];
	hilightedImage = LoadingScreen.gal.get(galHilightFilePath);
	if( hilightedImage ) {
		navItem.css( 'background-image', 'url(' + hilightedImage.src + ')' );
	}
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
		case 8: // back/backspace key
			mainMenuScreen.quit();
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
