/* begin DialogHelp.SELECT_HANDLERS[] */
DialogHelp.SELECT_HANDLERS = [];
DialogHelp.SELECT_HANDLERS['dialog-help'] = function(dialogHelp) {
	var optionId, scrollDiv;
	optionId = dialogHelp.currentNavItem[0].id;
	scrollDiv = $('#help-text-scroll')[0];
	switch( optionId ) {
		case 'option-scroll' :
			//scrollDiv.scrollTop += scrollDiv.clientHeight;
			//dialogHelp.callback.call();
			this.scrollDiv[0].scrollByPages(1);
			break;
		case 'option-help-close' :
			this.hide();
			break;
	}
};
/* end DialogHelp.SELECT_HANDLERS[] */

function DialogHelp(callingScreenId, callingObject, dialogId, sdkReportingPage, callback) {
	this.callingScreen = $('#' + callingScreenId);
	this.callingObject = callingObject;
	this.mouseClickHandler = window.onclick;
	this.mouseMoveHandler = window.onmousemove;
	window.onclick =null;
	window.onmousemove = null;
	this.windowKeyHandler= window.onkeydown;
	this.dialogHelpDOM = $('#' + dialogId);
	this.scrollDiv = $('#help-text-scroll');
	this.dialogNav = this.dialogHelpDOM.find('ul');
	this.hilightClass = "button-medium-hilight";
	this.hilightImageName = "button-hilight";
	this.regularImageName = "button-regular";
	var menuButtonSize = this.dialogNav.children().length;
	for(var i =0 ; i< menuButtonSize ; i++){
		var liElement = (this.dialogNav.children()[i]);
		$('#'+liElement.id).css('background-image','url(' + LoadingScreen.gal.get(DialogMenu.DIALOG_PREFIX+this.regularImageName+'.png').src + ')');
	}
	this.currentNavItem = this.dialogNav.find('.' + this.hilightClass);
	this.currentNavItem.css('background-image','url(' + LoadingScreen.gal.get(DialogMenu.DIALOG_PREFIX+this.hilightImageName+'.png').src + ')');

	this.initialNavItem = this.currentNavItem;
	this.registerEventHandlers();
	this.registerMouseHandlers();
	this.show();
	this.selectHandler = DialogHelp.SELECT_HANDLERS[dialogId];
	this.callback = null;
	if( sdkReportingPage && typeof sdkApi !== 'undefined' ) { 
		//sdkApi.reportPageView(sdkReportingPage);
	}
	this.updateScrollDivPages();
	/*
	if( callback ) {
		this.callback = callback;
		this.callback.call();
	}
	*/
} //function DialogHelp()

DialogHelp.prototype.show = function() {
	this.dialogHelpDOM.show();
	this.callingScreen.addClass('transparent');
}; //DialogHelp.prototype.show()

DialogHelp.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.dialogHelpDOM.hide();
	this.setNavItem(this.initialNavItem);
	if(this.callingObject.registerEventHandlers){
		this.callingObject.registerEventHandlers();
	}else{
		window.onkeydown = this.windowKeyHandler;
	}
	this.callingScreen.removeClass('transparent');
	window.onclick =this.mouseClickHandler; 
	window.onmousemove = this.mouseMoveHandler;
}; //DialogHelp.prototype.hide()

DialogHelp.prototype.setNavItem = function(item) {
	this.currentNavItem.removeClass(this.hilightClass); // remove hilight from old item
	this.currentNavItem.css('background-image','url(' + LoadingScreen.gal.get(DialogMenu.DIALOG_PREFIX+this.regularImageName+'.png').src + ')');
	this.currentNavItem = item;
	this.currentNavItem.addClass(this.hilightClass); // add hilight to new item
	this.currentNavItem.css('background-image','url(' + LoadingScreen.gal.get(DialogMenu.DIALOG_PREFIX+this.hilightImageName+'.png').src + ')');

}; //DialogHelp.prototype.setNavItem()

DialogHelp.prototype.registerMouseHandlers = function() {
	var menuButtonSize = this.dialogNav.children().length;
	var dialogHelp = this;
	for(var i =0 ; i< menuButtonSize ; i++){
		var liElement = (dialogHelp.dialogNav.children()[i]);
		liElement.onmousemove = function(){
			dialogHelp.setNavItem($('#'+this.id));
		}
		liElement.onclick = function(){
			dialogHelp.currentNavItem[0]=this;
			dialogHelp.selectHandler(dialogHelp);
		}
		
	}
} //DialogHelp.prototype.registerMouseHandlers()

DialogHelp.prototype.registerEventHandlers = function() {
	var dialogHelp, lastIndex, lastItemSelector, firstItemSelector;
	dialogHelp = this;
	lastIndex = dialogHelp.dialogNav.children().length;
	lastItemSelector = '*:nth-child(' + lastIndex + ')';
	firstItemSelector = '*:nth-child(1)';
	window.onkeydown = function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			dialogHelp.selectHandler(dialogHelp);
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 38: // up arrow
			if( dialogHelp.currentNavItem.index() > 0 ) {
				dialogHelp.setNavItem(dialogHelp.currentNavItem.prev('li'));
				console.debug(dialogHelp.currentNavItem[0]);
			}
			else { //loop back to last item
				dialogHelp.setNavItem(dialogHelp.dialogNav.children(lastItemSelector));
			}
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 40: // down arrow
			if( dialogHelp.currentNavItem.index() < lastIndex - 1 ) {
				dialogHelp.setNavItem(dialogHelp.currentNavItem.next('li'));
				console.debug(dialogHelp.currentNavItem[0]);
			}
			else { //loop back to first item
				dialogHelp.setNavItem(dialogHelp.dialogNav.children(firstItemSelector));
			}
			evt.stopPropagation();
			evt.preventDefault();
			break;
		}
	};

	dialogHelp.scrollDiv.on( 'scroll', function(evt) {
		dialogHelp.updateScrollDivPages();
	});
}; //DialogHelp.prototype.registerEventHandlers()

DialogHelp.prototype.unregisterEventHandlers = function() {
	var menuButtonSize, dialogHelp, i, liElement;
	window.onkeydown = null;
	$('div.help-text-scroll').off( 'scroll');
	menuButtonSize = this.dialogNav.children().length;
	dialogHelp = this;
	for(i =0 ; i< menuButtonSize ; i++){
		liElement = (dialogHelp.dialogNav.children()[i]);
		liElement.onmousemove =null;
		liElement.onclick = null;
	}
}; //DialogHelp.prototype.unregisterEventHandlers()


DialogHelp.prototype.updateScrollDivPages = function() {
	var scrollDiv, currentPage, pageCount;
	scrollDiv = this.scrollDiv[0];
	console.debug( "scrollTop: " + scrollDiv.scrollTop + ", clientHeight: " + scrollDiv.clientHeight + ", scrollHeight: " + scrollDiv.scrollHeight );
	if( scrollDiv.scrollTop + scrollDiv.clientHeight >= scrollDiv.scrollHeight ) { //on last page
		this.setNavItem( $( this.dialogHelpDOM.selector + ' #option-close' ) );
	}
	else {
		this.setNavItem( $( this.dialogHelpDOM.selector + ' #option-scroll' ) );
	}
	pageCount = Math.ceil( scrollDiv.scrollHeight / scrollDiv.clientHeight );
	currentPage = Math.floor( (scrollDiv.scrollTop + scrollDiv.clientHeight) / scrollDiv.scrollHeight * pageCount );
	$('#current-page').html(currentPage);
	$('#page-count').html(pageCount);
	if( currentPage === 1) {
		$('#version').html(galapagoVersion);
	}
	else {
		$('#version').html('&nbsp');
	}
};