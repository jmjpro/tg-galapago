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
	"button-timed" : { "RIGHT" : "button-relaxed", "DOWN" : "button-how-to-play" },
 	"button-relaxed" : { "LEFT" : "button-timed", "DOWN" : "button-quit" },
	"button-how-to-play" : { "UP" : "button-timed", "RIGHT" : "button-quit" },
	"button-quit" : { "UP" : "button-relaxed", "LEFT" : "button-how-to-play" }
};

function MainMenuScreen() {}

MainMenuScreen.init = function(callingScreenId, callingObject, onDialogOpenedCallBack) {
	var mainMenuScreen = new MainMenuScreen();
	mainMenuScreen.mainMenuDOM = $('#screen-main-menu');
	mainMenuScreen.callingScreen = callingScreenId ? $('#' + callingScreenId) : null;
	mainMenuScreen.callingObject = callingObject ? callingObject : null;
	LoadingScreen.gal.onLoaded('bg-main-menu', function(result) {
		if (result.success) {
			mainMenuScreen.mainMenuOnScreenCache = new OnScreenCache(
				[
					LoadingScreen.gal.get('background/main-menu.jpg'),
					LoadingScreen.gal.getSprites('collage/main-menu-1.png'),
					LoadingScreen.gal.getSprites('collage/main-menu-2.png')
				], function () {
					mainMenuScreen.setImages();
					mainMenuScreen.setInitialNavItem();
					mainMenuScreen.show();

					mainMenuScreen.addMouseListener();
					if (typeof onDialogOpenedCallBack !== 'undefined') {
						onDialogOpenedCallBack();
					}
				},
				700
			);
		}
	});
	LoadingScreen.gal.download('bg-main-menu');
}; //MainMenuScreen.init()

MainMenuScreen.prototype.addMouseListener = function(){
	var mainMenuScreen = this;
	mainMenuScreen.registerOnClickEvent();
	mainMenuScreen.registerMouseOverEvent();
} //MainMenuScreen.prototype.addMouseListener()

MainMenuScreen.prototype.registerOnClickEvent = function(){
	var mainMenuScreen = this;
	$('[class^=main-menu]').off('click');
	$('[class^=main-menu]').on('click', function (evt){
		mainMenuScreen.setNavItem($('#'+ this.id));
		mainMenuScreen.handleSelect();
		return false;
	});
}

MainMenuScreen.prototype.registerMouseOverEvent = function(){
	var mainMenuScreen = this;
	$('[class^=main-menu]').off('mouseover');
	$('[class^=main-menu]').on('mouseover', function (evt){
		mainMenuScreen.setNavItem($('#'+ this.id));
		return false;
	});
}

MainMenuScreen.prototype.setInitialNavItem = function(){
	this.currentNavItem = null;
	this.setNavItem(this.getNavItem(null, this.callingScreen));
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

MainMenuScreen.prototype.handleSelect = function() {
	var navItem, isTimedMode, level, hide;

	hide = (function(that) {
	    return function() {
			that.hide();
		}
	})(this);

	navItem = this.currentNavItem;
	console.debug( navItem[0].id + ' selected' );
	store.setItem( 'mainMenuScreenLastSelectedOption', navItem[0].id );
	switch( navItem[0].id ) {
		case 'button-change-player' :
			break;
		case 'button-timed' :
			isTimedMode = true;
			//store.setItem( 'mainMenuScreenLastSelectedMode', navItem[0].id );
			if (this.callingObject instanceof Level) {
				Galapago.isTimedMode = isTimedMode;
				level = this.callingObject;
				LevelMap.show(level, hide);
				//level.showLevelMap(level);
			} else {
				Galapago.init(isTimedMode, hide);
			}
			break;
		case 'button-relaxed' :
			isTimedMode = false;
			//store.setItem( 'mainMenuScreenLastSelectedMode', navItem[0].id );
			if( this.callingObject instanceof Level ) {
				Galapago.isTimedMode = isTimedMode;
				level = this.callingObject;
				LevelMap.show(level, hide);
				//level.showLevelMap(level);
			}
			else {
				Galapago.init(isTimedMode, hide);
			}
			break;
		case 'button-how-to-play' :
			new DialogHelp('main-menu-screen', this);
			break;
		case 'button-top-scores' :
			window.dialog = new DialogMenu('main-menu-screen', this, 'dialog-leaderboards', TGH5.Reporting.Screen.Leaderboards);
			break;
		case 'button-set-language' :
			var dropDownElement, display;
			dropDownElement = $('#screen-main-menu .galapago-drop-down');
			display = dropDownElement.css('display') === 'none' ? 'block' : 'none';
			dropDownElement.css('display', display);
			//TODO add event handlers here to change the language with left and right arrows, and enter to select the language
			break;
		case 'button-quit' :
			window.dialog = new DialogMenu('main-menu-screen', this, 'dialog-quit');
			break;
	}
}; //MainMenuScreen.prototype.handleSelect()

MainMenuScreen.prototype.onDialogClose = function() {
	this.mainMenuDOM.focus();
};

MainMenuScreen.prototype.show = function() {
	this.registerEventHandlers();
	this.mainMenuDOM.show();
	this.mainMenuDOM.focus();
	this.callingScreen && this.callingScreen.hide();
	//sdkApi && sdkApi.reportPageView(TGH5.Reporting.Screen.MainMenu);
}; //MainMenuScreen.prototype.show()

MainMenuScreen.prototype.hide = function() {
	this.mainMenuOnScreenCache.destroy();
	this.mainMenuDOM.hide();

	// TODO: IGOR: MainMenuScreen: cleanup
	_.each( _.keys(MainMenuScreen.IMAGE_MAP), function(selector) {
		$(selector).css( 'background-image','');
	});

	LoadingScreen.gal.unload('bg-main-menu');
}; //MainMenuScreen.prototype.hide()

MainMenuScreen.prototype.quit = function() {
	this.hide();
	sdkApi && sdkApi.exit();
}; //MainMenuScreen.prototype.show()

MainMenuScreen.prototype.getNavItem = function(direction, callingScreen) {
	var navItem, currentElementId, nextElementId;
	if( callingScreen && callingScreen.length > 0 && callingScreen[0].id ) {
		if( callingScreen[0].id === 'screen-loading' ) {
			navItem = $( '#button-timed' );
		}
		else {
			navItem = $( '#' + store.getItem( 'mainMenuScreenLastSelectedOption' ) );
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
	var galFilePath, regularImage;
	galFilePath = MainMenuScreen.GAL_PREFIX + MainMenuScreen.IMAGE_MAP[navItem.selector];
	regularImage = LoadingScreen.gal.get(galFilePath);
	if( regularImage ) {
		navItem.css( 'background-image', 'url(' + regularImage.src + ')' );
	}
	else {
		console.error( 'unable to swap to regular image ' + galFilePath );
	}
};

MainMenuScreen.prototype.addHilight = function(navItem) {
	var galFilePath, galHilightFilePath, hilightedImage;
	galFilePath = MainMenuScreen.IMAGE_MAP[navItem.selector];
	galHilightFilePath = MainMenuScreen.GAL_PREFIX + MainMenuScreen.HILIGHT_IMAGE_MAP[galFilePath];
	hilightedImage = LoadingScreen.gal.get(galHilightFilePath);
	if( hilightedImage ) {
		navItem.css( 'background-image', 'url(' + hilightedImage.src + ')' );
	}
	else {
		console.error( 'unable to swap to hilight image ' + galHilightFilePath );
	}
};

MainMenuScreen.prototype.registerEventHandlers = function() {
	var mainMenuScreen;
	mainMenuScreen = this;
	mainMenuScreen.mainMenuDOM.off('keydown');
	mainMenuScreen.mainMenuDOM.on('keydown', function(evt) {
		console.debug(mainMenuScreen.currentNavItem[0].id + ' hilighted');
		switch( evt.keyCode ) {
		case 13: // enter
			mainMenuScreen.handleSelect();
			//return false;
			break;
		case 37: // left arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('LEFT'));
			break;
		case 38: // up arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('UP'));
			break;
		case 39: // right arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('RIGHT'));
			break;
		case 40: // down arrow
			mainMenuScreen.setNavItem(mainMenuScreen.getNavItem('DOWN'));
			break;
		case 8: // back/backspace key
			mainMenuScreen.quit();
			break;
		}
		return false;
	});
}; //MainMenuScreen.prototype.registerEventHandlers()
