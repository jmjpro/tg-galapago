/* begin DialogHelp.SELECT_HANDLERS[] */
DialogHelp.SELECT_HANDLERS = [];
DialogHelp.MAX_PAGE =7;
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

function DialogHelp(callingScreenId, callingObject, sdkReportingPage, callback) {
	this.callingScreen = $('#' + callingScreenId);
	this.callingObject = callingObject;
	this.dialogId = 'dialog-help';
	this.mouseClickHandler = window.onclick;
	this.mouseMoveHandler = window.onmousemove;
	window.onclick =null;
	window.onmousemove = null;
	this.windowKeyHandler= window.onkeydown;
	this.dialogMenuDOM = $('#' + this.dialogId);
	this.setDialogBackgroundImage();
	this.scrollDiv = $('#help-text-scroll');
	this.currentPage=1;
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
	this.selectHandler = DialogHelp.SELECT_HANDLERS[this.dialogId];
	this.callback = null;
	if( sdkReportingPage && typeof sdkApi !== 'undefined' ) { 
		//sdkApi.reportPageView(TGH5.Reporting.Screen.Help);
	}
	this.scrollDiv[0].scrollTop=0;
	this.updateScrollDivPages();
	this.scrollDiv[0].focus();
	/*
	if( callback ) {
		this.callback = callback;
		this.callback.call();
	}
	*/
} //function DialogHelp()

DialogHelp.prototype.setDialogBackgroundImage = function() {
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
}; //DialogHelp.prototype.setDialogBackgroundImage()

DialogHelp.prototype.show = function() {
	this.dialogMenuDOM.show();
	this.callingScreen.addClass('transparent');
}; //DialogHelp.prototype.show()

DialogHelp.prototype.hide = function() {
	this.unregisterEventHandlers();
	this.dialogMenuDOM.hide();
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
			/*if( dialogHelp.currentNavItem.index() > 0 ) {
				dialogHelp.setNavItem(dialogHelp.currentNavItem.prev('li'));
				console.debug(dialogHelp.currentNavItem[0]);
			}
			else { //loop back to last item
				dialogHelp.setNavItem(dialogHelp.dialogNav.children(lastItemSelector));
			}
			evt.stopPropagation();
			evt.preventDefault();*/
				if(dialogHelp.currentPage != 1){
					if(dialogHelp.scrollDiv[0].scrollByPages){
						dialogHelp.scrollDiv[0].scrollByPages(-1);
					}
					dialogHelp.currentPage = dialogHelp.currentPage - 1;
				}else{
					dialogHelp.currentPage=DialogHelp.MAX_PAGE;
					if(dialogHelp.scrollDiv[0].scrollByPages){
						dialogHelp.scrollDiv[0].scrollByPages( DialogHelp.MAX_PAGE);
					}
				}
			break;
		case 40: // down arrow
				if(dialogHelp.currentPage < DialogHelp.MAX_PAGE){
					if(dialogHelp.scrollDiv[0].scrollByPages){
						dialogHelp.scrollDiv[0].scrollByPages(1);
					}
					dialogHelp.currentPage = dialogHelp.currentPage + 1;
				}else{
					dialogHelp.currentPage=1;
					if(dialogHelp.scrollDiv[0].scrollByPages){
						dialogHelp.scrollDiv[0].scrollByPages(-1* DialogHelp.MAX_PAGE);
					}
				}
			/*if( dialogHelp.currentNavItem.index() < lastIndex - 1 ) {
				dialogHelp.setNavItem(dialogHelp.currentNavItem.next('li'));
				console.debug(dialogHelp.currentNavItem[0]);
			}
			else { //loop back to first item
				dialogHelp.setNavItem(dialogHelp.dialogNav.children(firstItemSelector));
			}
			evt.stopPropagation();
			evt.preventDefault();*/
			break;
		case 8: // backspace
			dialogHelp.hide();
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
	//pageCount = Math.ceil( scrollDiv.scrollHeight / scrollDiv.clientHeight );
	//currentPage = Math.floor( (scrollDiv.scrollTop + scrollDiv.clientHeight ) / scrollDiv.scrollHeight * pageCount );
	$('#current-page').html(Math.ceil(scrollDiv.scrollTop/262)+1);
	$('#page-count').html(DialogHelp.MAX_PAGE);
	//if( currentPage === 1) {
		$('#version').html(galapagoVersion);
	//}
	//else {
	//	$('#version').html('&nbsp');
	//}
};