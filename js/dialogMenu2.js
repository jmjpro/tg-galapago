function DialogMenu(callingScreenId, callingClass, menuId, hilightClass, selectHandler) {
	this.callingScreen = $('#' + callingScreenId);
	this.callingClass = callingClass;
	this.dialogMenuDOM = $('#' + menuId);
	this.dialogNav = this.dialogMenuDOM.find('ul');
	this.hilightClass = hilightClass;
	this.currentNavItem = this.dialogNav.find('.' + this.hilightClass);
	this.registerEventHandlers();
	this.show();
	this.selectHandler = selectHandler;
} //function DialogMenu()

DialogMenu.prototype.show = function() {
	this.dialogMenuDOM.css('display', 'block');
	this.callingScreen.addClass('transparent');
}; //DialogMenu.prototype.show()

DialogMenu.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.dialogMenuDOM.css('display', 'none');
	this.callingClass.call('registerEventHandlers');
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
			dialogMenu.selectHandler(dialogMenu.currentNavItem);
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
