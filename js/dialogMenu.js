DialogMenu.BACKGROUNDS_AND_BUTTONS = [
	{"id" : "dialog-quit", "size": "regular-no-title", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-game-menu", "size": "regular", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-profile-create", "size": "regular-no-title", "button-class" : "keypad-cursor-letter"},
	{"id" : "dialog-game-over", "size": "small", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-time-out", "size": "regular", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-you-won", "size": "regular", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-leaderboard", "size": "large", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-level-won", "size": "regular", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-loading", "size": "small-no-title", "button-class" : ""},
	{"id" : "dialog-new-game", "size": "regular-no-title", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-game-options", "size": "regular-no-title", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-profile-delete", "size": "regular", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-profile-create-init", "size": "regular", "button-class" : ""},
	{"id" : "dialog-profile-list", "size": "regular-no-title", "button-class" : "button-huge-hilight"},
	{"id" : "dialog-reset-game", "size": "regular", "button-class" : "button-medium-hilight"},
	{"id" : "dialog-help", "size": "large", "button-class" : "button-medium-hilight"}
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
			if(dialogMenu.callingObject instanceof Board){
				board.hotspot = null;
				board.display();
				if(board.level.dangerBar){
					board.level.dangerBar.resume();
				}
				board.reshuffleService.start();
				board.powerUp.timerResume();
			}else if(dialogMenu.callingObject instanceof MapScreen){
				Galapago.mapScreen.focusMap( Galapago.levelMap );
			}
			break;
		case 'option-main-menu' :
			that = this;
			this.hide();
			if(dialogMenu.callingObject instanceof Board){
				board.level.quit();
				// TODO: IGOR not fixed - strange behaviour
				MainMenuScreen.init('screen-game', board.level, function() {
					if (that !== null) {
						that = null;
					}
				});
			}else if(dialogMenu.callingObject instanceof MapScreen){
					dialogMenu.callingObject.toMainMenuScreen(Galapago.levelMap);
			}
			break;
		case 'option-new-game' :
			//this.hide();
			new DialogMenu(this.dialogId, this, 'dialog-new-game');
			break;
		case 'option-how-to-play' :
			//this.hide();
			new DialogHelp(this.dialogId, this);
			break;
		/*case 'option-options' :
			this.hide();
			board.display();
			break;*/
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
DialogMenu.SELECT_HANDLERS['dialog-leaderboard'] = function(dialogLeaderboard) {
	this.hide();
	return this; //chainable
};
DialogMenu.SELECT_HANDLERS['dialog-time-out'] = function(dialogMenu) {
	var level, that;
	that = this;
	level = dialogMenu.callingObject.level;
	// show main menu screen FDD 4.8.8.1
	board = dialogMenu.callingObject;
	MainMenuScreen.init('screen-game', board.level, function() {
		if (that !== null) {
			that.hide();
			that = null;
		}
	});	
	/*
	LevelMap.show(level, function() {
		if(that !== null) {
			that.hide();
			level.cleanup();
			that = null;
		}
	});
	*/
};
DialogMenu.SELECT_HANDLERS['dialog-new-game'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'new-game-option-yes' :
			console.log("starting new game");
			//TODO init board (with Galapago.init?)
			if( Galapago.level.board ) {
				board = Galapago.level.board;				
			}
			else {
				Galapago.init();
			}
		    this.hide();
		    this.callingScreen.hide();
		    Galapago.eraseScores(Galapago.profile);
			//Galapago.mapScreen.focusMap( Galapago.levelMap );
			LevelMap.show( LevelMap.getNextLevel(), function() {
				if( Galapago.level ) {
					Galapago.level.cleanup();
				}
			});
			break;
		case 'new-game-option-no' :
			this.hide();
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
/*
DialogMenu.SELECT_HANDLERS['dialog-profile-create-init'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-profile-create-init-close' :
			this.hide();
			break;
	}
};*/
DialogMenu.SELECT_HANDLERS['dialog-profile-list'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-save' :
			this.hide();
			break;
	}
};
DialogMenu.SELECT_HANDLERS['dialog-reset-game'] = function(dialogMenu) {
	var optionId, levelMap;
	optionId = dialogMenu.currentNavItem[0].id;
	dialogMenu.callingObject.hotspotLevel;
	levelMap = Galapago.levelMap;
	 
	switch( optionId ) {
		case 'reset-game-option-no' :
			this.hide();
			Galapago.mapScreen.focusMap( levelMap );
			break;
		case 'reset-game-option-yes' :
			console.log("reset game");
			LevelMap.reset();
			Galapago.levelMap.cleanup();
			LevelMap.show(Level.findById(1));
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
	this.hilightImageName = "button-hilight";
	this.buttonImageName = "button-regular";
	if( dialogId ) {
		this.hilightClass = DialogMenu.getButtonClass( dialogId );
		this.setDialogSize();

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
		galBgImagePath = DialogMenu.DIALOG_PREFIX + this.hilightImageName + '.png';
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

		//TODO: ideally we should subclass DialogMenu with a DialogLevelWon class and move this logic there
		if( this.dialogId === 'dialog-level-won' ) {
			this.animateScores();
		}

		this.selectHandler = DialogMenu.SELECT_HANDLERS[dialogId];
		this.callback = null;
		if( sdkApi && sdkReportingPage ) {
			//sdkApi.reportPageView(sdkReportingPage);
		}
		if( callback ) {
			this.callback = callback;
			this.callback.call();
		}
	}
} //function DialogMenu()

DialogMenu.prototype.setDialogSize = function() {
	var size, dialogSpec, backgroundFileName, galBackgroundPath, backgroundImage;
	dialogSpec = _.find( DialogMenu.BACKGROUNDS_AND_BUTTONS, {'id' : this.dialogId} );
	if( dialogSpec ) {
		size = dialogSpec.size;
		this.dialogMenuDOM.addClass( 'dialog-' + size );
		backgroundFileName = 'dialog-' + size + '.png';
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
}; //DialogMenu.prototype.setDialogSize()

DialogMenu.prototype.show = function() {
	/*
	if( this.callingObject.unregisterEventHandlers ) {
		this.callingObject.unregisterEventHandlers();
	}*/
	this.registerEventHandlers();
	this.eventBarrier = ScreenUtil.addEventBarrier(this.dialogId);
	this.callingScreen.addClass( 'transparent' );
	$( '#screen-dialog-container' ).css( 'z-index', 9999 );
	this.dialogMenuDOM.show();
	this.dialogMenuDOM.focus();
	console.debug( 'element ' + document.activeElement.id + ' has focus' );
}; //DialogMenu.prototype.show()

DialogMenu.prototype.hide = function() {
	this.dialogMenuDOM.hide();
	$( '#screen-dialog-container' ).css( 'z-index', -9999 );
	this.setNavItem(this.initialNavItem);
	if(this.callingObject instanceof Board){
		this.callingObject.reshuffleService.start();
		this.callingObject.powerUp.timerResume();
	}
	if(this.callingObject && this.callingObject.onDialogClose){
		this.callingObject.onDialogClose();
	}
	ScreenUtil.removeEventBarrier(this.eventBarrier);
	this.callingScreen.removeClass('transparent');
	this.callingScreen.focus();
	console.debug( 'element ' + document.activeElement.id + ' has focus' );
}; //DialogMenu.prototype.hide()

DialogMenu.prototype.onDialogClose = function() {
	if( this.dialogId === 'dialog-game-menu' ) {
		this.eventBarrier = ScreenUtil.addEventBarrier(this.dialogId);
		this.callingScreen.addClass('transparent');
		$( '#' + this.dialogId ).focus();
		this.setNavItem( $( '#option-continue-playing' ) );
	}
}; //DialogMenu.prototype.onDialogClose()

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
		//console.debug( 'DialogMenu.prototype.registerEventHandlers keydown ' + evt.keyCode );
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
	var board, that = this;
	board = this.callingObject;
	sdkApi && sdkApi.requestModalAd("inGame").done(function(){
		MainMenuScreen.init('screen-game', board.level, function() {
			if (that !== null) {
				that.hide();
				that = null;
			}
		});
		/*
		LevelMap.show(level, function() {
			if(that !== null) {
				that.hide();
				level.cleanup();
				that = null;
			}
		});
		*/
	});
	//show map screen;
};

DialogMenu.getButtonClass = function(dialogId) {
	var dialogDescriptor;
	dialogDescriptor = _.find( DialogMenu.BACKGROUNDS_AND_BUTTONS, {'id' : dialogId} );
	return dialogDescriptor['button-class'];
}; //DialogMenu.getButtonClass()

DialogMenu.loadImages = function(imageIds){
	_.each(imageIds, function(imageId){
		var imgElementID = '#' + imageId;
		$(imgElementID)[0].src = LoadingScreen.gal.get(DialogMenu.IMAGE_PATH_PREFIX + imageId + '.png').src;
	});
};

DialogMenu.prototype.animateScores = function() {
	var board, scoreElement;

	board = this.callingObject;	

	function scoreAnimation(){
		var scoreElementsToAnimate;
		scoreElementsToAnimate = [
			{ scoreElementId: 'level-score', text: board.score },
			{ scoreElementId: 'bonus-points', text: board.bonusFrenzyPoints },
			{ scoreElementId: 'time-bonus', text: board.timeBonus },
			{ scoreElementId: 'total-level-score', text: board.totalLevelScore }
		];
		// total-score starts with previous total score so we only advance the odometer with any difference in the total score (FDD 4.8.5.1)
		if( board.totalScore > board.previousTotalScore ) {
			scoreElementsToAnimate.push( { scoreElementId: 'total-score', text: board.totalScore - board.previousTotalScore } );
		}
		_.each( scoreElementsToAnimate, function( scoreElementRecord ) {
			board.level.levelAnimation.stopScoreTallyingAnimation();
			scoreElement = $( '#' + scoreElementRecord.scoreElementId );
			(new ScoreTallyingAnimation(scoreElement, scoreElementRecord.text)).start();
		});
	}

	if( board.putInAnimationQ ){
		board.animationQ.push(scoreAnimation);
	}
	else{
		scoreAnimation();
	}
};
