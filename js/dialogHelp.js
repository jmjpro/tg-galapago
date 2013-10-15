/* begin DialogHelp.SELECT_HANDLERS[] */
DialogHelp.SELECT_HANDLERS = [];
DialogHelp.SCROLL_DIV_PAGE_HEIGHT = 314; //needs to match height on help-text-scroll <div>
DialogHelp.SELECT_HANDLERS['dialog-help'] = function(dialogHelp) {
	var optionId, scrollDiv;
	optionId = dialogHelp.currentNavItem[0].id;
	switch( optionId ) {
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
	this.windowKeyHandler= window.onkeydown;
	this.dialogMenuDOM = $('#' + this.dialogId);
	this.setDialogBackgroundImage();
	this.scrollDiv = $('#help-text-scroll');
	this.currentPage=1;
	this.dialogNav = this.dialogMenuDOM.find('ul');
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
	this.maxPage = Math.ceil(this.scrollDiv[0].scrollHeight /  DialogHelp.SCROLL_DIV_PAGE_HEIGHT);
	this.selectHandler = DialogHelp.SELECT_HANDLERS[this.dialogId];
	this.callback = null;
	if( sdkReportingPage && typeof sdkApi !== 'undefined' ) { 
		//sdkApi.reportPageView(TGH5.Reporting.Screen.Help);
	}
	this.scrollDiv[0].scrollTop=0;
	this.updateScrollDivPages();
	this.scrollDiv[0].focus();
	this.setArrow( 'down', true);
	this.setArrow( 'up', false);
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
			else {
				console.error( 'unable to find background image ' + galBackgroundPath );
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
}; //DialogHelp.prototype.hide()

DialogHelp.prototype.setNavItem = function(item) {
	this.currentNavItem.removeClass(this.hilightClass); // remove hilight from old item
	this.currentNavItem.css('background-image','url(' + LoadingScreen.gal.get(DialogMenu.DIALOG_PREFIX+this.regularImageName+'.png').src + ')');
	this.currentNavItem = item;
	this.currentNavItem.addClass(this.hilightClass); // add hilight to new item
	this.currentNavItem.css('background-image','url(' + LoadingScreen.gal.get(DialogMenu.DIALOG_PREFIX+this.hilightImageName+'.png').src + ')');

}; //DialogHelp.prototype.setNavItem()

DialogHelp.prototype.registerMouseHandlers = function() {
	var dialogHelp = this;
	dialogHelp.dialogNav.children().each( function() {
		$(this).on( 'mouseover', function() {
			dialogHelp.setNavItem( $(this) );
		});
		$(this).on( 'click', function() {
			dialogHelp.currentNavItem = $(this);
			dialogHelp.selectHandler( dialogHelp );
		});	
	});
	$( '#dialog-help-up' ).on( 'click', function() {
		dialogHelp.handleUpArrow();
	});
	$( '#dialog-help-down' ).on( 'click', function() {
		dialogHelp.handleDownArrow();
	});
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
			evt.stopPropagation();
			evt.preventDefault();
			dialogHelp.handleUpArrow();
			break;
		case 40: // down arrow
			evt.stopPropagation();
			evt.preventDefault();
			dialogHelp.handleDownArrow();
			break;
		case 8: // backspace
			evt.stopPropagation();
			evt.preventDefault();
			dialogHelp.hide();
			break;
		}
	};

	dialogHelp.scrollDiv.on( 'scroll', function(evt) {
		dialogHelp.updateScrollDivPages();
	});
}; //DialogHelp.prototype.registerEventHandlers()

DialogHelp.prototype.handleUpArrow = function() {
	if( this.currentPage === 1 ) {
		return this;
	}
	this.currentPage--;
	this.setArrow('down', true);
	if( this.currentPage >= 1 ) {
		//if(this.scrollDiv[0].scrollBy){
			this.scrollDiv[0].scrollTop = (this.currentPage -1) * DialogHelp.SCROLL_DIV_PAGE_HEIGHT;
		//}
	}
	if( this.currentPage === 1 ) {
		this.setArrow('up', false);
	}
	else {
		this.setArrow('up', true);
	}
	return this;
}; //DialogHelp.prototype.handleUpArrow()

DialogHelp.prototype.handleDownArrow = function() {
	if( this.currentPage === this.maxPage ) {
		return this;
	}
	this.currentPage++;
	this.setArrow('up', true);
	if( this.currentPage <= this.maxPage ) {
		//if(this.scrollDiv[0].scrollBy){
			this.scrollDiv[0].scrollTop = (this.currentPage -1) * DialogHelp.SCROLL_DIV_PAGE_HEIGHT;
		//}
	}
	if( this.currentPage === this.maxPage ) {
		this.setArrow('down', false);
	}
	else {
		this.setArrow('down', true);
	}
	return this;
}; //DialogHelp.prototype.handleDownArrow()

DialogHelp.prototype.unregisterEventHandlers = function() {
	window.onkeydown = null;
	$('div.help-text-scroll').off( 'scroll');
	this.dialogNav.children().each( function() {
		$(this).off( 'mouseover' );
		$(this).off( 'click' );
	});
	$( '#dialog-help-up' ).off( 'click' );
	$( '#dialog-help-down' ).off( 'click' );
}; //DialogHelp.prototype.unregisterEventHandlers()


DialogHelp.prototype.updateScrollDivPages = function() {
	var scrollDiv, currentPage, pageCount;
	scrollDiv = this.scrollDiv[0];
	console.debug( "scrollTop: " + scrollDiv.scrollTop + ", clientHeight: " + scrollDiv.clientHeight + ", scrollHeight: " + scrollDiv.scrollHeight );
	//pageCount = Math.ceil( scrollDiv.scrollHeight / scrollDiv.clientHeight );
	//currentPage = Math.floor( (scrollDiv.scrollTop + scrollDiv.clientHeight ) / scrollDiv.scrollHeight * pageCount );
	$('#current-page').html(Math.ceil(scrollDiv.scrollTop/DialogHelp.SCROLL_DIV_PAGE_HEIGHT)+1);
	$('#page-count').html(this.maxPage);
	if( this.currentPage === 1) {
		$('#version').html(galapagoVersion);
	}
	else {
		$('#version').html('&nbsp');
	}
}; //DialogHelp.prototype.updateScrollDivPages()

DialogHelp.prototype.setArrow = function(direction, isEnabled) {
	var arrowSelector, galResourcePath, imageArrow;
	arrowSelector = '#dialog-help-' + direction;
	galResourcePath = DialogMenu.DIALOG_PREFIX + 'arrow-button-' + direction + '-';
	if( isEnabled ) {
		galResourcePath += 'hilight';
	}
	else {
		galResourcePath += 'disable';
	}
	galResourcePath += '.png';
	imageArrow = LoadingScreen.gal.get(galResourcePath);
	if( imageArrow ) {
		$(arrowSelector)[0].src = imageArrow.src;
	}
	else {
		console.error( 'unable to load arrow ' + galResourcePath);
	}
	return this;
}; //DialogHelp.prototype.setArrow()