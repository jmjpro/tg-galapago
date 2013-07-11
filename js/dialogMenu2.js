DialogMenu.SELECT_HANDLERS = [];
DialogMenu.SELECT_HANDLERS['dialog-quit'] = function(dialogMenu) {
	var navItem = dialogMenu.currentNavItem;
	switch( navItem[0].id ) {
		case 'option-yes' :
			this.hide();
			Galapago.levelMap.quit();
			break;
		case 'option-no' :
			this.hide();
			break;
	};
};
DialogMenu.SELECT_HANDLERS['dialog-game-menu'] = function(dialogMenu) {
	var navItem = dialogMenu.currentNavItem;
	switch( navItem[0].id ) {
		case 'option-continue-playing' :
			this.hide();
			dialogMenu.callingClass.displayMenuButton(false);
			dialogMenu.callingClass.hotspot = null;
			dialogMenu.callingClass.display();
			break;
		case 'option-main-menu' :
			this.hide();
			dialogMenu.callingClass.level.quit();
			console.debug('option-main-menu');
			break;
		case 'option-new-game' :
			this.hide();
			dialogMenu.callingClass.displayMenuButton(false);
			dialogMenu.callingClass.hotspot = null;
			dialogMenu.callingClass.display();
			console.debug('option-new-game');
			break;
		case 'option-how-to-play' :
			this.hide();
			dialogMenu.callingClass.displayMenuButton(false);
			dialogMenu.callingClass.hotspot = null;
			dialogMenu.callingClass.display();
			console.debug('option-how-to-play');
			break;
		case 'option-options' :
			this.hide();
			dialogMenu.callingClass.displayMenuButton(false);
			dialogMenu.callingClass.hotspot = null;
			dialogMenu.callingClass.display();
			console.debug('option-options');
			break;
	};
};
DialogMenu.SELECT_HANDLERS['dialog-level-won'] = function(dialogMenu) {
	var navItem = dialogMenu.currentNavItem;
	this.hide();
	//show map screen;
};

function DialogMenu(callingScreenId, callingClass, dialogId, hilightClass, selectHandler) {
	this.callingScreen = $('#' + callingScreenId);
	this.callingClass = callingClass;
	this.windowKeyHandler= window.onkeydown;
	this.dialogMenuDOM = $('#' + dialogId);
	this.dialogNav = this.dialogMenuDOM.find('ul');
	this.hilightClass = hilightClass;
	this.currentNavItem = this.dialogNav.find('.' + this.hilightClass);
	this.registerEventHandlers();
	this.show();
	this.selectHandler = DialogMenu.SELECT_HANDLERS[dialogId];
} //function DialogMenu()

DialogMenu.prototype.show = function() {
	this.dialogMenuDOM.css('display', 'block');
	this.callingScreen.addClass('transparent');
}; //DialogMenu.prototype.show()

DialogMenu.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.dialogMenuDOM.css('display', 'none');
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
	var dialogMenu;
	dialogMenu = this;
	window.onkeydown = function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			dialogMenu.selectHandler(dialogMenu);
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 38: // up arrow
			if( dialogMenu.currentNavItem.index() > 0 ) {
				dialogMenu.setNavItem(dialogMenu.currentNavItem.prev());
			}
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 40: // down arrow
			if( dialogMenu.currentNavItem.index() < dialogMenu.dialogNav.children().length - 1 ) {
				dialogMenu.setNavItem(dialogMenu.currentNavItem.next());
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