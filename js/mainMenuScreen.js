MainMenuScreen.GAL_PREFIX = 'main-menu/';

MainMenuScreen.IMAGE_MAP = {
	/*"#screen-main-menu" : "main_menu_background.jpg",*/
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

MainMenuScreen.init = function(callingScreenId, callingObject) {
	var mainMenuScreen = new MainMenuScreen();
	mainMenuScreen.mainMenuDOM = $('#screen-main-menu');
	mainMenuScreen.callingScreen = callingScreenId ? $('#' + callingScreenId) : null;
	mainMenuScreen.callingObject = callingObject ? callingObject : null;
	mainMenuScreen.imageArray = mainMenuScreen.getImages();
	mainMenuScreen.setInitialNavItem();
	mainMenuScreen.show();

	mainMenuScreen.windowKeyHandler= window.onkeydown;
	mainMenuScreen.addMouseListener();
}; //MainMenuScreen.init()

MainMenuScreen.prototype.addMouseListener = function(){
	var mainMenuScreen = this;

	$('#button-timed')[0].onclick = function (evt){ 
										mainMenuScreen.setNavItem($('#button-timed')); 
										mainMenuScreen.selectHandler();
										evt.preventDefault();evt.stopPropagation();
									}
	$('#button-relaxed')[0].onclick = function (evt){ 
										mainMenuScreen.setNavItem($('#button-relaxed')); 
										mainMenuScreen.selectHandler();
										evt.preventDefault();evt.stopPropagation();
									}				
	$('#button-how-to-play')[0].onclick = function (evt){ 
											mainMenuScreen.setNavItem($('#button-how-to-play')); 
											mainMenuScreen.selectHandler();
											evt.preventDefault();evt.stopPropagation();
										}
	/* jj: disabled until after IFA exhibition
	$('#button-top-scores')[0].onclick = function (evt){ 
												mainMenuScreen.setNavItem($('#button-top-scores')); 
												mainMenuScreen.selectHandler();
												evt.preventDefault();evt.stopPropagation();
											}
	$('#button-set-language')[0].onclick = function (evt){ 
													mainMenuScreen.setNavItem($('#button-set-language')); 
													mainMenuScreen.selectHandler();
													evt.preventDefault();evt.stopPropagation();
												}
	*/
	$('#button-quit')[0].onclick = function (evt){ 
													mainMenuScreen.setNavItem($('#button-quit')); 
													mainMenuScreen.selectHandler();
													evt.preventDefault();evt.stopPropagation();
												}
	this.registerMouseOverEvent('button-timed');
	this.registerMouseOverEvent('button-relaxed');
	this.registerMouseOverEvent('button-how-to-play');
	/* jj: disabled until after IFA event
	this.registerMouseOverEvent('button-top-scores');
	this.registerMouseOverEvent('button-set-language');
	*/
	this.registerMouseOverEvent('button-quit');
} //MainMenuScreen.prototype.addMouseListener()

MainMenuScreen.prototype.registerMouseOverEvent = function(id){
	var mainMenuScreen = this;
	$('#'+id)[0].onmouseover = function (evt){
				mainMenuScreen.setNavItem($('#'+id));
	}
}

/*
MainMenuScreen.prototype.registerImageLoadEvents = function(){
	var mainMenuScreen = this;
	LoadingScreen.gal.onLoaded('mainMenuScreen', function(result) {
		if (result.success) {
			mainMenuScreen.setImages();
			mainMenuScreen.setInitialNavItem();
		}
	});
}; //MainMenuScreen.prototype.registerImageLoadEvents()
*/
MainMenuScreen.prototype.setInitialNavItem = function(){
	this.currentNavItem = null;
	this.setNavItem(this.getNavItem(null, this.callingScreen));
	console.debug( 'mainMenuScreen.currentNavItem: ' + this.currentNavItem );
}; //MainMenuScreen.prototype.setInitialNavItem()

MainMenuScreen.prototype.getImages = function() {
	var mainMenuScreen, imageCollage, image, imageArray, imageBackground;
	mainMenuScreen = this;
	imageCollage = ImageCollage.loadByName('main_menu_static.png');
	imageArray = imageCollage.getImages();
	imageBackground = LoadingScreen.gal.get(MainMenuScreen.GAL_PREFIX + 'main_menu_background.jpg');
	$('#screen-main-menu').css('background-image','url(' + imageBackground.src + ')');
	_.each( _.keys(MainMenuScreen.IMAGE_MAP), function(selector) {
		console.debug( selector );
		image = _.find( imageArray, {'id' : MainMenuScreen.IMAGE_MAP[selector] });
		$(selector).css('background-image','url(' + image.src + ')');
	});
	return imageArray;
}; //MainMenuScreen.prototype.getImages()

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
			break;
		case 'button-how-to-play' :
			this.unregisterEventHandlers();
			window.dialog = new DialogHelp('main-menu-screen', this, 'dialog-help', 'button-medium-hilight', TGH5.Reporting.Page.Help);
			break;
		case 'button-top-scores' :
			this.unregisterEventHandlers();
			window.dialog = new DialogMenu('main-menu-screen', this, 'dialog-leaderboards', 'button-big-hilight', TGH5.Reporting.Page.Leaderboards);
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
			window.dialog = new DialogMenu('main-menu-screen', this, 'dialog-quit', 'button-huge-hilight');
			break;
	}
}; //MainMenuScreen.prototype.selectHandler()

MainMenuScreen.prototype.show = function() {
	this.callingObject && this.callingObject.unregisterEventHandlers();	
	this.registerEventHandlers();
	this.mainMenuDOM.show();
	this.callingScreen && this.callingScreen.hide();
	sdkApi.reportPageView(TGH5.Reporting.Page.MainMenu);
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
				navItem = $('#button-timed');
				break;
			case 'screen-map' :
				navItem = $('#button-timed');
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
	var id, image;
	id = MainMenuScreen.IMAGE_MAP[navItem.selector];
	image = _.find( this.imageArray, {'id' : id} );
	navItem.css( 'background-image', 'url(' + image.src + ')' );
};

MainMenuScreen.prototype.addHilight = function(navItem) {
	var id, galHilightFilePath, image;
	id = MainMenuScreen.IMAGE_MAP[navItem.selector];
	idHilight = MainMenuScreen.HILIGHT_IMAGE_MAP[id];
	image = _.find( this.imageArray, {'id' : idHilight} );
	navItem.css( 'background-image', 'url(' + image.src + ')' );
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