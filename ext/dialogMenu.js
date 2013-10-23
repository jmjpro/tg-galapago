DialogMenu.BACKGROUNDS_AND_BUTTONS = [
	{"id" : "dialog-quit", "background" : "dialog-regular-no-title.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-game-menu", "background" : "dialog-regular.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-profile-create", "background" : "dialog-regular-no-title.png", "button-class" : "keypad-cursor-letter"},
	{"id" : "dialog-game-over", "background" : "dialog-small.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-time-out", "background" : "dialog-regular.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-you-won", "background" : "dialog-regular.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-leaderboards", "background" : "dialog-large.png", "button-class" : "button-big-hilight"},
	{"id" : "dialog-level-won", "background" : "dialog-regular.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-loading", "background" : "dialog-small-no-title.png", "button-class" : ""},
	{"id" : "dialog-new-game", "background" : "dialog-regular-no-title.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-game-options", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-profile-delete", "background" : "dialog-regular.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-profile-create-init", "background" : "dialog-regular-no-title.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-profile-list", "background" : "dialog-regular-no-title.png", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-reset-game", "background" : "dialog-regular.png", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-help", "background" : "dialog-large.png", "button-class" : "button-medium-hilight"}
];
DialogMenu.IMAGE_PATH_PREFIX = 'main-menu/';
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
	var optionId, board, mainCanvasId, that;
	optionId = dialogMenu.currentNavItem[0].id;
	board = dialogMenu.callingObject;
	mainCanvasId = dialogMenu.callingScreen[0].id;
	console.debug(optionId);
	switch( optionId ) {
		case 'option-continue-playing' :
			this.hide();
			board.hotspot = null;
			board.display();
			if(board.level.dangerBar){
				board.level.dangerBar.resume();
			}
			board.reshuffleService.start();
			board.powerUp.timerResume();
			break;
		case 'option-main-menu' :
			that = this;
			this.hide();
			board.level.quit();
			// TODO: IGOR not fixed - strange behaviour
			MainMenuScreen.init('screen-game', board.level, function() {
				if (that !== null) {
					that = null;
				}
			});
			break;
		case 'option-new-game' :
			this.hide();
			new DialogMenu(mainCanvasId, board, 'dialog-new-game');
			break;
		case 'option-how-to-play' :
			this.hide();
			new DialogHelp(mainCanvasId, board);
			break;
		case 'option-options' :
			this.hide();
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
	var level, that;
	that = this;
	level = dialogMenu.callingObject.level;
	LevelMap.show(level, function() {
		if(that !== null) {
			that.hide();
			level.cleanup();
			that = null;
		}
	});
   /* sdkApi && sdkApi.requestModalAd("inGame").done(function(){
		LevelMap.show(level, function() {
			if(that !== null) {
				that.hide();
				level.cleanup();
				that = null;
			}
		});
		//level.showLevelMap();
	});*/
	//show map screen;
};
DialogMenu.SELECT_HANDLERS['dialog-new-game'] = function(dialogMenu) {
	var optionId, board, mode;
	optionId = dialogMenu.currentNavItem[0].id;
	board = dialogMenu.callingObject;
	switch( optionId ) {
		case 'new-game-option-yes' :
			console.log("starting new game");
			//this.hide();
			board.level.cleanup();
			mode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
			store.removeItem( mode + Galapago.profile + "level" + board.level.id + "restore" );


			var that = this;
			Galapago.setLevel(board.level.id, function() {
				if(that !== null) {
					that.callingObject = null;
					that.hide();
					that = null;
				}
			});
			break;
		case 'new-game-option-no' :
			this.hide();
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
			this.hide();
			Galapago.mapScreen.focusMap( Galapago.levelMap );
			break;
		case 'reset-game-option-yes' :
			console.log("reset game");
			LevelMap.reset();
			levelMap.cleanup();
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
			callingObject.powerUp.timerPause();
	}

	this.dialogId = dialogId;
	this.dialogMenuDOM = $('#' + dialogId);
	this.dialogNav = this.dialogMenuDOM.find('ul');
	this.hilightClass = DialogMenu.getButtonClass( dialogId );
	this.hilightImageName = "button-hilight";
	this.buttonImageName = "button-regular";

	this.setDialogBackgroundImage();

	menuButtonSize = this.dialogNav.children().length;
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
	this.eventBarrierDiv = null;
	this.show();
	this.selectHandler = DialogMenu.SELECT_HANDLERS[dialogId];
	this.callback = null;
	if( sdkApi && sdkReportingPage ) {
		//sdkApi.reportPageView(sdkReportingPage);
	}
	if( callback ) {
		this.callback = callback;
		this.callback.call();
	}
} //function DialogMenu()

DialogMenu.prototype.setDialogBackgroundImage = function() {
	var dialogSpec, backgroundFileName, galBackgroundPath, backgroundImage;
	dialogSpec = _.find( DialogMenu.BACKGROUNDS_AND_BUTTONS, {'id' : this.dialogId} );
	if( dialogSpec ) {
		backgroundFileName = dialogSpec.background;
		if( backgroundFileName ) {
			galBackgroundPath = 'background/' + backgroundFileName;
			backgroundImage = LoadingScreen.gal.get(galBackgroundPath);
			if( backgroundImage ) {
				this.dialogMenuDOM.css( 'background-image', 'url(' + backgroundImage.src + ')');
			}
		}
	}
	else {
		console.error( 'unable to find dialog spec for ' + this.dialogId );
	}
	return this;
}; //DialogMenu.prototype.setDialogBackgroundImage()

DialogMenu.prototype.show = function() {
	this.registerEventHandlers();
	this.dialogMenuDOM.show();
	this.dialogMenuDOM.focus();
	this.eventBarrier = GameUtil.addEventBarrier(this.dialogId);
	this.callingScreen.addClass('transparent');
}; //DialogMenu.prototype.show()

DialogMenu.prototype.hide = function() {
	this.dialogMenuDOM.hide();
	this.setNavItem(this.initialNavItem);
	if(this.callingObject instanceof Board){
		this.callingObject.reshuffleService.start();
		this.callingObject.powerUp.timerResume();
	}
	if(this.callingObject && this.callingObject.onDialogClose){
		this.callingObject.onDialogClose();
	}
	GameUtil.removeEventBarrier(this.eventBarrier);
	this.callingScreen.removeClass('transparent');
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

	//code specific to dialog-game-menu TODO refactor DialogMenuGame as subclass of DialogMenu
	if( this.dialogId === 'dialog-game-menu' ) {
		if( this.currentNavItem[0].id === 'option-game-tip' ) {
			$( '.game-option-arrow' ).css( 'display', 'inline-block' );
		}
		else {
			$( '.game-option-arrow' ).css( 'display', 'none' );
		}
	}
}; //DialogMenu.prototype.setNavItem()

DialogMenu.prototype.registerMouseHandlers = function() {
	var menuButtonSize = this.dialogNav.children().length;
	var dialogMenu = this;
	var dialogNavChildren = dialogMenuDOM = $('#' + this.dialogId + ' ul li');
	dialogNavChildren.off('mouseover');
	dialogNavChildren.on('mouseover', function(){
		dialogMenu.setNavItem($('#'+this.id));
		return false;
	});
	dialogNavChildren.off('click');
	dialogNavChildren.on('click', function(){
		dialogMenu.currentNavItem[0]=this;
		dialogMenu.selectHandler(dialogMenu);
		return false;
	});
	switch(this.dialogId){
		case 'dialog-game-menu' :
			function handleMouseClick(){
				dialogMenu.handleGameMenuLeftRightNavigation();
				return false;
			}
			$('#arrow-left').off('click');
			$('#arrow-left').on('click', handleMouseClick);
			$('#arrow-right').off('click');
			$('#arrow-right').on('click', handleMouseClick);
			break;
	}
} //DialogMenu.prototype.registerMouseHandlers()

DialogMenu.prototype.registerEventHandlers = function() {
	var dialogMenu, lastIndex, lastItemSelector, firstItemSelector, board;
	dialogMenu = this;
	lastIndex = dialogMenu.dialogNav.children().length;
	lastItemSelector = '*:nth-child(' + lastIndex + ')';
	firstItemSelector = '*:nth-child(1)';
	this.dialogMenuDOM.off('keydown');
	this.dialogMenuDOM.on('keydown', function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			dialogMenu.selectHandler(dialogMenu);
			break;
		case 37: // left arrow
			switch ( dialogMenu.dialogId ) {
				case 'dialog-game-menu':
					dialogMenu.handleGameMenuLeftRightNavigation();
				break;
			}
			break;
		case 38: // up arrow
			if( dialogMenu.currentNavItem.index() > 0 ) {
				dialogMenu.setNavItem(dialogMenu.currentNavItem.prev('li'));
				//console.debug(dialogMenu.currentNavItem[0]);
			}
			else { //loop back to last item
				dialogMenu.setNavItem(dialogMenu.dialogNav.children(lastItemSelector));
			}
			break;
		case 39: // right arrow
			switch ( dialogMenu.dialogId ) {
				case 'dialog-game-menu':
					dialogMenu.handleGameMenuLeftRightNavigation();
				break;
			}
			break;
		case 40: // down arrow
			if( dialogMenu.currentNavItem.index() < lastIndex - 1 ) {
				dialogMenu.setNavItem(dialogMenu.currentNavItem.next('li'));
				//console.debug(dialogMenu.currentNavItem[0]);
			}
			else { //loop back to first item
				dialogMenu.setNavItem(dialogMenu.dialogNav.children(firstItemSelector));
			}
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
				case 'dialog-game-menu':
					dialogMenu.hide();
					board = dialogMenu.callingObject;
					board.display();
					if(board.level.dangerBar){
						board.level.dangerBar.resume();
					}
					board.reshuffleService.start();			
					board.powerUp.timerResume();	
					break;
				case 'dialog-reset-game':
					Galapago.levelMap.cleanup();
					LevelMap.show(dialogMenu.callingObject.hotspotLevel);
					dialogMenu.hide();				
					break;
				case 'dialog-time-out':
					dialogMenu.selectHandler(dialogMenu);
					break;					
			}
			break;
		} //switch()
		return false;
	}); //this.dialogMenuDOM.on('keydown', function(evt) {
	this.registerMouseHandlers();
}; //DialogMenu.prototype.registerEventHandlers()

DialogMenu.prototype.handleGameMenuLeftRightNavigation = function() {
	var timedMode, gameTipsSelectionEle;
	switch(this.currentNavItem[0].id) {
		case 'option-game-tip':
			gameTipsSelectionEle = $('#gameTipsSelection')[0];
			if(gameTipsSelectionEle.innerHTML === 'On'){
				gameTipsSelectionEle.innerHTML = 'Off';
			}else{
				gameTipsSelectionEle.innerHTML = 'On';
			}
			timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
			store.setItem( timedMode + Galapago.profile + "gameTipsSelection", gameTipsSelectionEle.innerHTML);
		break;
	}
};

DialogMenu.prototype.dialogNewGameOptionNo = function(board) {
	this.hide();
	new DialogMenu('screen-game', board, 'dialog-game-menu');
}; //DialogMenu.prototype.dialogNewGameOptionNo()

DialogMenu.prototype.dialogQuitOptionNo = function() {
	this.hide();
	if( this.callingObject instanceof Board ){
		if(this.callingObject.level.dangerBar){
			this.callingObject.level.dangerBar.resume();
		}
		this.callingObject.reshuffleService.start();
		this.callingObject.powerUp.timerResume();
		//this.callingObject.displayQuitButton(true);
	}
	else if( this.callingObject instanceof MapScreen ) {
		Galapago.mapScreen.focusMap( Galapago.levelMap );
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
	var level, that = this;
	level = this.callingObject.level;
	sdkApi && sdkApi.requestModalAd("inGame").done(function(){
		LevelMap.show(level, function() {
			if(that !== null) {
				that.hide();
				level.cleanup();
				that = null;
			}
		});
	});
	//show map screen;
};

DialogMenu.getButtonClass = function(dialogId) {
	var dialogDescriptor;
	dialogDescriptor = _.find( DialogMenu.BACKGROUNDS_AND_BUTTONS, {'id' : dialogId} )
	return dialogDescriptor['button-class'];
}; //DialogMenu.getButtonClass()

DialogMenu.loadImages = function(imageIds){
	_.each(imageIds, function(imageId){
		var imgElementID = '#' + imageId;
		$(imgElementID)[0].src = LoadingScreen.gal.get(DialogMenu.IMAGE_PATH_PREFIX + imageId + '.png').src;
	});
};
