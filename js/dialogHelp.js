/* begin DialogHelp.SELECT_HANDLERS[] */
DialogHelp.SELECT_HANDLERS = [];
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
	this.dialogHelpDOM = $('#' + this.dialogId);
	this.setDialogBackgroundImage();
	this.scrollDiv = $('#help-text-scroll');
	this.currentPage = 1;
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
	this.maxPage = $("[id^=help-text-scroll-page]").length; 	
	this.selectHandler = DialogHelp.SELECT_HANDLERS[this.dialogId];
	this.callback = null;
	if( sdkReportingPage && typeof sdkApi !== 'undefined' ) { 
		//sdkApi.reportPageView(TGH5.Reporting.Screen.Help);
	}
	this.scrollDiv[0].scrollTop=0;
	this.updateScrollDivPages();
	this.scrollDiv[0].focus();
	this.setArrow( 'down', false);
	this.setArrow( 'up', false);
	this.showCurrentPage();
} //function DialogHelp()

DialogHelp.prototype.showCurrentPage = function(){
	$("[id^=help-text-scroll-page]").hide();
	$("#help-text-scroll-page" + this.currentPage).show()[0].scrollIntoView();
}

DialogHelp.prototype.setDialogBackgroundImage = function() {
	var dialogSpec, backgroundFileName, galBackgroundPath, backgroundImage;
	dialogSpec = _.find( DialogMenu.BACKGROUNDS_AND_BUTTONS, {'id' : this.dialogId} );
	if( dialogSpec ) {
		backgroundFileName = dialogSpec.background;
		if( backgroundFileName ) {
			galBackgroundPath = 'background/' + backgroundFileName;
			backgroundImage = LoadingScreen.gal.get(galBackgroundPath);
			if( backgroundImage ) {
				this.dialogHelpDOM.css( 'background-image', 'url(' + backgroundImage.src + ')');
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
	this.dialogHelpDOM.show();
	this.dialogHelpDOM.focus();
	this.eventBarrier = GameUtil.addEventBarrier(this.dialogId);
	this.callingScreen.addClass('transparent');
}; //DialogHelp.prototype.show()

DialogHelp.prototype.hide = function() {
	this.dialogHelpDOM.hide();
	this.setNavItem(this.initialNavItem);
	GameUtil.removeEventBarrier(this.eventBarrier);
	this.callingScreen.removeClass('transparent');
	if(this.callingObject.onDialogClose){
		this.callingObject.onDialogClose()
	}
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
	var dialogNavChildren = $('#' + this.dialogId + ' ul li'); 
	dialogNavChildren.off( 'mouseover');
	dialogNavChildren.on( 'mouseover', function() {
		dialogHelp.setNavItem( $(this) );
	});
	dialogNavChildren.off( 'click');
	dialogNavChildren.on( 'click', function() {
		dialogHelp.currentNavItem = $(this);
		dialogHelp.selectHandler( dialogHelp );
	});
	$( '#dialog-help-up' ).off( 'click');
	$( '#dialog-help-up' ).on( 'click', function() {
		dialogHelp.handleUpArrow();
	});
	$( '#dialog-help-up' ).off( 'mouseover');
	$( '#dialog-help-up' ).on( 'mouseover', function() {
		if( dialogHelp.currentPage > 1 ) {
			dialogHelp.setArrow( 'up', true );
		}
	});
	$( '#dialog-help-up' ).off( 'mouseout');
	$( '#dialog-help-up' ).on( 'mouseout', function() {
		dialogHelp.setArrow( 'up', false );
	});

	$( '#dialog-help-down' ).off( 'click' );
	$( '#dialog-help-down' ).on( 'click', function() {
		dialogHelp.handleDownArrow();
	});
	$( '#dialog-help-down' ).off( 'mouseover');
	$( '#dialog-help-down' ).on( 'mouseover', function() {
		if( dialogHelp.currentPage < dialogHelp.maxPage ) {
			dialogHelp.setArrow( 'down', true );
		}
	});
	$( '#dialog-help-down' ).off( 'mouseout');
	$( '#dialog-help-down' ).on( 'mouseout', function() {
		dialogHelp.setArrow( 'down', false );
	});
} //DialogHelp.prototype.registerMouseHandlers()

DialogHelp.prototype.registerEventHandlers = function() {
	var dialogHelp, lastIndex, lastItemSelector, firstItemSelector, keyCount;
	dialogHelp = this;
	lastIndex = dialogHelp.dialogNav.children().length;
	lastItemSelector = '*:nth-child(' + lastIndex + ')';
	firstItemSelector = '*:nth-child(1)';
	keyCount = 0;
	this.dialogHelpDOM.off('keydown');
	this.dialogHelpDOM.on('keydown', function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			dialogHelp.selectHandler(dialogHelp);
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 38: // up arrow			
			evt.stopPropagation();
			evt.preventDefault();
			if (keyCount === 0) {
                dialogHelp.handleUpArrow();
            }
            keyCount++;		
			break;
		case 40: // down arrow
			evt.stopPropagation();
			evt.preventDefault();
			if (keyCount === 0) {
				dialogHelp.handleDownArrow();
			}
			keyCount++;
			break;
		case 8: // backspace
			evt.stopPropagation();
			evt.preventDefault();
			dialogHelp.hide();
			break;
		}
	});
	this.dialogHelpDOM.off('keyup');
	this.dialogHelpDOM.on('keyup', function(evt) {
		switch( evt.keyCode ) {
		case 38: // up arrow
			evt.stopPropagation();
			evt.preventDefault();
			dialogHelp.setArrow('up', false);
			keyCount = 0;
			break;
		case 40: // down arrow
			evt.stopPropagation();
			evt.preventDefault();
			dialogHelp.setArrow('down', false);
			keyCount = 0;
			break;
		}
	});
}; //DialogHelp.prototype.registerEventHandlers()

DialogHelp.prototype.handleUpArrow = function() {
	if( this.currentPage > 1 ) {
		this.currentPage--;
		this.setArrow( 'down', false );
		this.showCurrentPage();
		this.updateScrollDivPages();
		if( this.currentPage === 1 ) {
			this.setArrow( 'up', false );
		}
		else {
			this.setArrow( 'up', true );
		}
	}
	return this;
}; //DialogHelp.prototype.handleUpArrow()

DialogHelp.prototype.handleDownArrow = function() {
	if( this.currentPage < this.maxPage ) {
		this.currentPage++;
		this.setArrow( 'up', false );
		this.showCurrentPage();
		this.updateScrollDivPages();
		if( this.currentPage === this.maxPage ) {
			this.setArrow( 'down', false );
		}
		else {
			this.setArrow( 'down', true );
		}
	}
	return this;
}; //DialogHelp.prototype.handleDownArrow()

DialogHelp.prototype.updateScrollDivPages = function() {
	var scrollDiv, currentPage, pageCount;
	scrollDiv = this.scrollDiv[0];
	$('#current-page').html(this.currentPage);
	$('#page-count').html(this.maxPage);
	if( this.currentPage === 1) {
		$('#version').html(galapagoVersion);
	}
	else {
		$('#version').html('&nbsp');
	}
}; //DialogHelp.prototype.updateScrollDivPages()

DialogHelp.prototype.setArrow = function(direction, isHilight) {
	var arrowSelector, galResourcePath, imageArrow;
	arrowSelector = '#dialog-help-' + direction;
	galResourcePath = DialogMenu.DIALOG_PREFIX + 'arrow-button-' + direction + '-';
	if( isHilight ) {
		galResourcePath += 'hilight';
	}
	else if( (direction === 'up' && this.currentPage > 1) || (direction === 'down' && this.currentPage < this.maxPage) ) {
		galResourcePath += 'active';
	}
	else {
		galResourcePath += 'disable';
	}
	galResourcePath += '.png';
	imageArrow = LoadingScreen.gal.get(galResourcePath);
	if( imageArrow ) {
		//$(arrowSelector).css( 'background-image', 'url(' + imageArrow.src + ')' );
		$(arrowSelector)[0].src = imageArrow.src;
	}
	else {
		console.error( 'unable to load arrow ' + galResourcePath);
	}
	return this;
}; //DialogHelp.prototype.setArrow()

DialogHelp.prototype.setArrowOld = function(direction, isEnabled) {
	var arrowSelector, galResourcePath, imageArrow;
	arrowSelector = '#dialog-help-' + direction;
	galResourcePath = DialogMenu.DIALOG_PREFIX + 'arrow-button-' + direction + '-';
	if( isEnabled ) {
		galResourcePath += 'active';
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
}; //DialogHelp.prototype.setArrowOld()

DialogHelp.prototype.hilightArrow = function( direction ) {
	var arrowSelector, galResourcePath, imageArrow;
	if( (direction === 'up' && this.currentPage < this.maxPage) || (direction === 'down' && this.currentPage > 1) ) {
		arrowSelector = '#dialog-help-' + direction;
		galResourcePath = DialogMenu.DIALOG_PREFIX + 'arrow-button-' + direction + '-hilight.png';
		imageArrow = LoadingScreen.gal.get(galResourcePath);
		if( imageArrow ) {
			$(arrowSelector)[0].src = imageArrow.src;
		}
		else {
			console.error( 'unable to load arrow ' + galResourcePath);
		}
	}
	return this;
}; //DialogHelp.prototype.hilightArrow()