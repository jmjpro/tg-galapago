DialogMenu.BACKGROUNDS_AND_BUTTONS = [
	{"id" : "dialog-quit", "background" : "dialog-regular.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-game-menu", "background" : "dialog-regular-no-title.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-profile-create", "background" : "dialog-regular-no-title.png", "button-class" : "keypad-cursor-letter"},
	{"id" : "dialog-game-over", "background" : "dialog-small.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-time-out", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-you-won", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-leaderboards", "background" : "dialog-large.png", "button-class" : "button-big-hilight"},
	{"id" : "dialog-level-won", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-loading", "background" : "dialog-small-no-title.png", "button-class" : ""},
	{"id" : "dialog-new-game", "background" : "dialog-regular.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-game-options", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-profile-delete", "background" : "dialog-regular.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-profile-create-init", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-profile-list", "background" : "dialog-regular-no-title.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-reset-game", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-help", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"}
];
DialogMenu.DIALOG_PREFIX = 'dialog/';
/* begin DialogMenu.SELECT_HANDLERS[] */
DialogMenu.SELECT_HANDLERS = [];
DialogMenu.SELECT_HANDLERS['dialog-profile-create'] = function(dialogMenu) {
	Galapago.profile = $('#dialog-profile-create').find('.profile-name')[0].value;
	this.hide();
};
DialogMenu.SELECT_HANDLERS['dialog-quit'] = function(dialogMenu) {
	var optionId, level, mainMenuScreen, board;
	optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-yes' :
			this.hide();
			if(dialogMenu.callingObject instanceof Board){
				board = dialogMenu.callingObject;
				board.quit();
			}
			else if(dialogMenu.callingObject instanceof MapScreen){
				Galapago.levelMap.quit();
			}
			else if(dialogMenu.callingObject instanceof MainMenuScreen){
				mainMenuScreen = dialogMenu.callingObject;
				mainMenuScreen.quit();
			}
			else {
				console.error( dialogMenu.callingObject + ' quit option not recognized');
			}
			break;
		case 'option-no' :
			dialogMenu.dialogQuitOptionNo();
			break;
	}
};

DialogMenu.SELECT_HANDLERS['dialog-game-menu'] = function(dialogMenu) {
	var optionId, board, mainCanvasId, bgImage;
	optionId = dialogMenu.currentNavItem[0].id;
	board = dialogMenu.callingObject;
	mainCanvasId = dialogMenu.callingScreen[0].id;
	console.debug(optionId);
	switch( optionId ) {
		case 'option-continue-playing' :
			this.hide();
			board.displayMenuButton(false);
			board.hotspot = null;
			board.display();
			if(board.level.dangerBar){
				board.level.dangerBar.resume();
			}
			board.reshuffleService.start();
			break;
		case 'option-main-menu' :
			this.hide();
			board.level.quit();
			MainMenuScreen.init('screen-game', board.level);
			break;
		case 'option-new-game' :
			this.hide();
			bgImage = LoadingScreen.gal.get(MainMenuScreen.DIALOG_PREFIX+'dialog-regular-no-title.png');
			if( bgImage ) {
				$('#dialog-new-game').css('background-image','url(' + bgImage.src + ')');
			}			
			new DialogMenu(mainCanvasId, board, 'dialog-new-game');
			break;
		case 'option-how-to-play' :
			this.hide();
			board.displayMenuButton(false);
			board.hotspot = null;
			bgImage = LoadingScreen.gal.get(MainMenuScreen.DIALOG_PREFIX+'dialog-regular.png');
			if( bgImage ) {
				$('#dialog-help').css('background-image','url(' + bgImage.src + ')');				
			}
			new DialogHelp(mainCanvasId, board, 'dialog-help',TGH5.Reporting.Page.Help);
			break;
		case 'option-options' :
			this.hide();
			board.displayMenuButton(false);
			board.hotspot = null;
			board.display();
			break;
	}
};
DialogMenu.SELECT_HANDLERS['dialog-level-won'] = function(dialogMenu) {
	dialogMenu.dialogLevelWonSelect();
};
DialogMenu.SELECT_HANDLERS['dialog-you-won'] = function(dialogMenu) {
	dialogMenu.dialogLevelWonSelect();
};
DialogMenu.SELECT_HANDLERS['dialog-game-over'] = function(dialogMenu) {
	dialogMenu.dialogGameOverSelect();
};
DialogMenu.SELECT_HANDLERS['dialog-leaderboards'] = function(dialogMenu) {
	this.hide();
	//show map screen;
};
DialogMenu.SELECT_HANDLERS['dialog-time-out'] = function(dialogMenu) {
	var level;
	level = dialogMenu.callingObject.level;
	this.hide();
	level.cleanup();
    sdkApi.requestModalAd("inGame").done(function(){
		LevelMap.show(level);
		//level.showLevelMap();
	});
	//show map screen;
};
DialogMenu.SELECT_HANDLERS['dialog-new-game'] = function(dialogMenu) {
	var optionId, board, mode;
	optionId = dialogMenu.currentNavItem[0].id;
	board = dialogMenu.callingObject;
	switch( optionId ) {
		case 'new-game-option-yes' :
			console.log("starting new game");
			this.hide();
			board.level.cleanup();
			mode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
			localStorage.removeItem( mode + Galapago.profile + "level" + board.level.id + "restore" );
			Galapago.setLevel(board.level.id);
			break;
		case 'new-game-option-no' :
			this.hide();
			board.displayMenuButton(false);
			board.hotspot = null;
			board.display();
			break;
	}
};

DialogMenu.SELECT_HANDLERS['dialog-game-options'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-confirm' :
			this.hide();
			console.log("changed game options to ...");
			break;
		case 'option-cancel' :
			this.hide();
			break;
	}
};
DialogMenu.SELECT_HANDLERS['dialog-profile-delete'] = function(dialogMenu) {
	var optionId, profile;
	optionId = dialogMenu.currentNavItem[0].id;
	profile = '';
	switch( optionId ) {
		case 'option-yes' :
			console.log( 'deleting profile ' + profile );
			this.hide();
			//delete profile from local storage			
			break;
		case 'option-no' :
			this.hide();
			break;
	}
};
DialogMenu.SELECT_HANDLERS['dialog-profile-create-init'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-close' :
			this.hide();
			break;
	}
};
DialogMenu.SELECT_HANDLERS['dialog-profile-list'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-save' :
			this.hide();
			break;
	}
};
DialogMenu.SELECT_HANDLERS['dialog-reset-game'] = function(dialogMenu) {
	var optionId, level;
	optionId = dialogMenu.currentNavItem[0].id;
	level = dialogMenu.callingObject.hotspotLevel;
	 
	switch( optionId ) {
		case 'reset-game-option-no' :
			Galapago.levelMap.cleanup();
			//Galapago.init(Galapago.gameMode);
			LevelMap.show(level);
			//level.showLevelMap(level);
			this.hide();
			break;
		case 'reset-game-option-yes' :
			console.log("reset game");
			LevelMap.reset();
			Galapago.levelMap.cleanup();
			//Galapago.init(Galapago.gameMode);
			LevelMap.show(Level.findById(1));
			//level.showLevelMap(Level.findById(1));
			this.hide();
			break;
	}
};
DialogMenu.SELECT_HANDLERS['dialog-help'] = function(dialogMenu) {
	var optionId, scrollDiv;
	optionId = dialogMenu.currentNavItem[0].id;
	scrollDiv = $('#help-text-scroll')[0];
	switch( optionId ) {
		case 'option-scroll' :
			scrollDiv.scrollTop += scrollDiv.clientHeight;
			dialogMenu.callback.call();
			if( scrollDiv.scrollTop + scrollDiv.clientHeight >= scrollDiv.scrollHeight ) { //on last page
				//dialogMenu.setNavItem( $('#option-close') );
				dialogMenu.currentNavItem.next();
			}
			break;
		case 'option-close' :
			this.hide();
			break;
	}
};
/* end DialogMenu.SELECT_HANDLERS[] */

function DialogMenu(callingScreenId, callingObject, dialogId, sdkReportingPage, callback) {
	var menuButtonSize, liElement, galBgImagePath, bgImage;
	this.callingScreen = $('#' + callingScreenId);
	this.callingObject = callingObject;
	if(callingObject instanceof Board){
			callingObject.level.bubbleTip.hideBubbleTip()
			callingObject.reshuffleService.stop();
	}
	this.mouseClickHandler = window.onclick;
	this.mouseMoveHandler = window.onmousemove;
	window.onclick =null; window.onmousemove = null;
	this.windowKeyHandler= window.onkeydown;
	this.dialogId = dialogId;
	this.dialogMenuDOM = $('#' + dialogId);
	this.dialogNav = this.dialogMenuDOM.find('ul');
	this.hilightClass = DialogMenu.getButtonClass( dialogId );
	this.hilightImageName = "button-hilight";
	this.buttonImageName = "button-regular";
	var menuButtonSize = this.dialogNav.children().length;
	for(var i =0 ; i< menuButtonSize ; i++){
		var liElement = (this.dialogNav.children()[i]);
		galBgImagePath = DialogMenu.DIALOG_PREFIX + this.buttonImageName+'.png';
		bgImage = LoadingScreen.gal.get(galBgImagePath);
		if( bgImage ) {
			$('#'+liElement.id).css('background-image','url(' + bgImage.src + ')');
		}
		else {
			console.error( 'unable to find image ' + galBgImagePath);
		}
	}
	this.currentNavItem = this.dialogNav.find('.' + this.hilightClass);
	galBgImagePath = DialogMenu.DIALOG_PREFIX+ this.hilightImageName+'.png';
	bgImage = LoadingScreen.gal.get(galBgImagePath);
	if( bgImage ) {
		this.currentNavItem.css('background-image','url(' + bgImage.src + ')');
	}
	else {
		console.error( 'unable to find image ' + galBgImagePath);
	}

	this.initialNavItem = this.currentNavItem;
	this.registerEventHandlers();
	this.registerMouseHandlers();
	this.show();
	this.selectHandler = DialogMenu.SELECT_HANDLERS[dialogId];
	this.callback = null;
	if( sdkReportingPage && typeof sdkApi !== 'undefined' ) { 
		//sdkApi.reportPageView(sdkReportingPage);
	}
	if( callback ) {
		this.callback = callback;
		this.callback.call();
	}
} //function DialogMenu()

DialogMenu.prototype.show = function() {
	this.dialogMenuDOM.show();
	this.callingScreen.addClass('transparent');
}; //DialogMenu.prototype.show()

DialogMenu.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.dialogMenuDOM.hide();
	this.setNavItem(this.initialNavItem);
	if(this.callingObject instanceof Board){
			this.callingObject.reshuffleService.start();
	}
	if(this.callingObject.registerEventHandlers){
		this.callingObject.registerEventHandlers();
	}else{
		window.onkeydown = this.windowKeyHandler;
	}
	this.callingScreen.removeClass('transparent');
	window.onclick =this.mouseClickHandler; 
	window.onmousemove = this.mouseMoveHandler;
}; //DialogMenu.prototype.hide()

DialogMenu.prototype.setNavItem = function(item) {
	this.currentNavItem.removeClass(this.hilightClass); // remove hilight from old item
	bgImage = LoadingScreen.gal.get(DialogMenu.DIALOG_PREFIX+this.buttonImageName+'.png');
	if( bgImage ) {
		this.currentNavItem.css('background-image','url(' + bgImage.src + ')');
	}
	this.currentNavItem = item;
	this.currentNavItem.addClass(this.hilightClass); // add hilight to new item
	bgImage = LoadingScreen.gal.get(DialogMenu.DIALOG_PREFIX+this.hilightImageName+'.png');
	if( bgImage ) {
		this.currentNavItem.css('background-image','url(' + bgImage.src + ')');
	}
}; //DialogMenu.prototype.setNavItem()

DialogMenu.prototype.registerMouseHandlers = function() {
	var menuButtonSize = this.dialogNav.children().length;
	var dialogMenu = this;
	for(var i =0 ; i< menuButtonSize ; i++){
		var liElement = (dialogMenu.dialogNav.children()[i]);
		liElement.onmousemove = function(){
			dialogMenu.setNavItem($('#'+this.id));
		}
		liElement.onclick = function(){
			dialogMenu.currentNavItem[0]=this;
			dialogMenu.selectHandler(dialogMenu);
		}
		
	}
} //DialogMenu.prototype.registerMouseHandlers()

DialogMenu.prototype.registerEventHandlers = function() {
	var dialogMenu, lastIndex, lastItemSelector, firstItemSelector, board;
	dialogMenu = this;
	lastIndex = dialogMenu.dialogNav.children().length;
	lastItemSelector = '*:nth-child(' + lastIndex + ')';
	firstItemSelector = '*:nth-child(1)';
	window.onkeydown = function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			dialogMenu.selectHandler(dialogMenu);
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 38: // up arrow
			if( dialogMenu.currentNavItem.index() > 0 ) {
				dialogMenu.setNavItem(dialogMenu.currentNavItem.prev('li'));
				console.debug(dialogMenu.currentNavItem[0]);
			}
			else { //loop back to last item
				dialogMenu.setNavItem(dialogMenu.dialogNav.children(lastItemSelector));
			}
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 40: // down arrow
			if( dialogMenu.currentNavItem.index() < lastIndex - 1 ) {
				dialogMenu.setNavItem(dialogMenu.currentNavItem.next('li'));
				console.debug(dialogMenu.currentNavItem[0]);
			}
			else { //loop back to first item
				dialogMenu.setNavItem(dialogMenu.dialogNav.children(firstItemSelector));
			}
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 8: // back/backspace key
			switch ( dialogMenu.dialogId ) {
				case 'dialog-new-game':
					board = dialogMenu.callingObject;
					dialogMenu.dialogNewGameOptionNo(board);
					break;
				case 'dialog-quit':
					dialogMenu.dialogQuitOptionNo();
					break;
				case 'dialog-level-won':
					dialogMenu.dialogLevelWonSelect();
					break;
				case 'dialog-you-won':
					dialogMenu.dialogLevelWonSelect();
					break;
				case 'dialog-game-over':
					dialogMenu.dialogGameOverSelect();
					break;
			}
			evt.stopPropagation();
			evt.preventDefault();		
			break;
		}
	};

	/*
	$('img.nav-button').on( 'click', function(evt) {
		
	});
	*/
}; //DialogMenu.prototype.registerEventHandlers()

DialogMenu.prototype.dialogNewGameOptionNo = function(board) {
	this.hide();
	board.displayMenuButton(false);
	board.hotspot = null;
	board.display();
}; //DialogMenu.prototype.dialogNewGameOptionNo()

DialogMenu.prototype.dialogQuitOptionNo = function() {
	this.hide();
	if(this.callingObject instanceof Board){
		if(this.callingObject.level.dangerBar){
			this.callingObject.level.dangerBar.resume();
		}
		this.callingObject.reshuffleService.start();
	}
}; //DialogMenu.prototype.dialogQuitOptionNo()

DialogMenu.prototype.dialogLevelWonSelect = function() {
	var level;
	level = this.callingObject.level;
	this.hide();
	level.won();
	//show map screen;
}; //DialogMenu.prototype.dialogLevelWonSelect()

DialogMenu.prototype.dialogGameOverSelect = function() {
	var level;
	level = this.callingObject.level;
	this.hide();
	level.cleanup();
	sdkApi.requestModalAd("inGame").done(function(){
		LevelMap.show(level);
	});
	//show map screen;
};

DialogMenu.prototype.unregisterEventHandlers = function() {
	var menuButtonSize, dialogMenu, i, liElement;
	window.onkeydown = null;
	menuButtonSize = this.dialogNav.children().length;
	dialogMenu = this;
	for(i =0 ; i< menuButtonSize ; i++){
		liElement = (dialogMenu.dialogNav.children()[i]);
		liElement.onmousemove =null;
		liElement.onclick = null;
	}
}; //MapScreen.prototype.unregisterEventHandlers()

/* initialize the backgrounds for all the dialog boxes */
DialogMenu.setBackgrounds = function() {
	var dialogId, bgImageId, galImagePath, bgImage;
	_.each( DialogMenu.BACKGROUNDS_AND_BUTTONS, function( dialogDescriptor ) {
		dialogId = dialogDescriptor.id;
		bgImageId = dialogDescriptor.background;
		galImagePath = Galapago.BACKGROUND_GAL_PREFIX + bgImageId;
		bgImage = LoadingScreen.gal.get( galImagePath );
		if( bgImage ) {
			$( '#' + dialogId ).css( 'background-image', 'url(' + bgImage.src + ')' );
		}
		else {
			console.error( "unable to find image " + galImagePath);
		}
	});
};

DialogMenu.getButtonClass = function(dialogId) {
	var dialogDescriptor;
	dialogDescriptor = _.find( DialogMenu.BACKGROUNDS_AND_BUTTONS, {'id' : dialogId} )
	return dialogDescriptor['button-class'];
}; //DialogMenu.getButtonClass()