/* begin DialogMenu.SELECT_HANDLERS[] */
DialogMenu.SELECT_HANDLERS = [];
DialogMenu.SELECT_HANDLERS['dialog-profile-create'] = function(dialogMenu) {
	Galapago.profile = $('#dialog-profile-create').find('.profile-name')[0].value;
	this.hide();
};
DialogMenu.SELECT_HANDLERS['dialog-quit'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-yes' :
			this.hide();
			if(dialogMenu.callingClass instanceof Board){
				dialogMenu.callingClass.level.quit();
			}else{
				Galapago.levelMap.quit();
			}
			break;
		case 'option-no' :
			if(dialogMenu.callingClass instanceof Board &&
			   dialogMenu.callingClass.level.dangerBar){
				dialogMenu.callingClass.level.dangerBar.resume();
			}
			this.hide();
			break;
	};
};
DialogMenu.SELECT_HANDLERS['dialog-game-menu'] = function(dialogMenu) {
	var optionId, board, mainCanvasId;
	optionId = dialogMenu.currentNavItem[0].id;
	board = dialogMenu.callingClass;
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
			break;
		case 'option-main-menu' :
			this.hide();
			board.level.quit();
			break;
		case 'option-new-game' :
			this.hide();
			new DialogMenu(mainCanvasId, board, 'dialog-new-game', 'button-huge-hilight');
			break;
		case 'option-how-to-play' :
			this.hide();
			board.displayMenuButton(false);
			board.hotspot = null;
			//dialogMenu.callingClass.display();
			new DialogMenu(mainCanvasId, board, 'dialog-help', 'button-medium-hilight', TGH5.Reporting.Page.Help, updateScrollDivPages);
			break;
		case 'option-options' :
			this.hide();
			board.displayMenuButton(false);
			board.hotspot = null;
			board.display();
			break;
	};
};
DialogMenu.SELECT_HANDLERS['dialog-level-won'] = function(dialogMenu) {
	var navItem = dialogMenu.currentNavItem;
	this.hide();
	dialogMenu.callingClass.level.cleanup();
	dialogMenu.callingClass.level.won();
	//show map screen;
};
DialogMenu.SELECT_HANDLERS['dialog-game-over'] = function(dialogMenu) {
	var navItem = dialogMenu.currentNavItem;
	this.hide();
	dialogMenu.callingClass.level.cleanup();
	sdkApi.requestModalAd("inGame").done(function(){
		dialogMenu.callingClass.level.showLevelMap();
	});
    
	
	//show map screen;
};
DialogMenu.SELECT_HANDLERS['dialog-leaderboards'] = function(dialogMenu) {
	var navItem = dialogMenu.currentNavItem;
	this.hide();
	//show map screen;
};
DialogMenu.SELECT_HANDLERS['dialog-time-out'] = function(dialogMenu) {
	var navItem = dialogMenu.currentNavItem;
	this.hide();
	dialogMenu.callingClass.level.cleanup();
    sdkApi.requestModalAd("inGame").done(function(){
		dialogMenu.callingClass.level.showLevelMap();
	});
	//show map screen;
};
DialogMenu.SELECT_HANDLERS['dialog-you-won'] = function(dialogMenu) {
	var navItem = dialogMenu.currentNavItem;
	this.hide();
	dialogMenu.callingClass.level.won();
	//show map screen;
};
DialogMenu.SELECT_HANDLERS['dialog-new-game'] = function(dialogMenu) {
	var optionId, board, mode;
	optionId = dialogMenu.currentNavItem[0].id;
	board = dialogMenu.callingClass;
	switch( optionId ) {
		case 'option-yes' :
			console.log("starting new game");
			this.hide();
			board.level.cleanup();
			mode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
			localStorage.removeItem( mode + Galapago.profile + "level" + board.level.id + "restore" );
			Galapago.setLevel(board.level.id);
			break;
		case 'option-no' :
			this.hide();
			board.displayMenuButton(false);
			board.hotspot = null;
			board.display();
			break;
	};
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
	};
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
	};
};
DialogMenu.SELECT_HANDLERS['dialog-profile-create-init'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-close' :
			this.hide();
			break;
	};
};
DialogMenu.SELECT_HANDLERS['dialog-profile-list'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-save' :
			this.hide();
			break;
	};
};
DialogMenu.SELECT_HANDLERS['dialog-reset-game'] = function(dialogMenu) {
	var optionId = dialogMenu.currentNavItem[0].id;
	switch( optionId ) {
		case 'option-no' :
			Galapago.levelMap.cleanup();
			Galapago.init(Galapago.gameMode);
			this.hide();
			break;
		case 'option-yes' :
			console.log("reset game");
			LevelMap.reset();
			Galapago.levelMap.cleanup();
			Galapago.init(Galapago.gameMode);
			this.hide();
			break;
	};
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
	};
};
/* end DialogMenu.SELECT_HANDLERS[] */

function DialogMenu(callingScreenId, callingClass, dialogId, hilightClass, sdkReportingPage, callback) {
	this.callingScreen = $('#' + callingScreenId);
	this.callingClass = callingClass;
	this.windowKeyHandler= window.onkeydown;
	this.dialogMenuDOM = $('#' + dialogId);
	this.dialogNav = this.dialogMenuDOM.find('ul');
	this.hilightClass = hilightClass;
	this.currentNavItem = this.dialogNav.find('.' + this.hilightClass);
	this.initialNavItem = this.currentNavItem;
	this.registerEventHandlers();
	this.show();
	this.selectHandler = DialogMenu.SELECT_HANDLERS[dialogId];
	this.callback = null;
	if( sdkReportingPage ) { 
		sdkApi.reportPageView(sdkReportingPage);
	}
	if( callback ) {
		this.callback = callback;
		this.callback.call();
	}
} //function DialogMenu()

DialogMenu.prototype.show = function() {
	this.dialogMenuDOM.css('display', 'block');
	this.callingScreen.addClass('transparent');
}; //DialogMenu.prototype.show()

DialogMenu.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.dialogMenuDOM.css('display', 'none');
	this.setNavItem(this.initialNavItem);
	if(this.callingClass.registerEventHandlers){
	  this.callingClass.registerEventHandlers();
	}else{
	  window.onkeydown = this.windowKeyHandler;
	}
	this.callingScreen.removeClass('transparent');
}; //DialogMenu.prototype.show()

DialogMenu.prototype.setNavItem = function(item) {
	this.currentNavItem.removeClass(this.hilightClass); // remove hilight from old item
	this.currentNavItem = item;
	this.currentNavItem.addClass(this.hilightClass); // add hilight to new item
}; //DialogMenu.prototype.setNavItem()

DialogMenu.prototype.registerEventHandlers = function() {
	var dialogMenu, lastIndex, lastItemSelector, firstItemSelector;
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
		}
	};

	/*
	$('img.nav-button').on( 'click', function(evt) {
		
	});
	*/
}; //DialogMenu.prototype.registerEventHandlers()

DialogMenu.prototype.unregisterEventHandlers = function() {
	window.onkeydown = null;
}; //MapScreen.prototype.unregisterEventHandlers()