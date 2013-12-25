DialogLeaderboard.HILIGHT_DELAY = 100;

function DialogLeaderboard(callingObject, mode) {
	this.callingScreenId = 'screen-main-menu';
	this.dialogId = 'dialog-leaderboard';
	this.sdkReportingPage = TGH5.Reporting.Screen.Leaderboards;
	this.mode = mode;
	DialogMenu.call( this, this.callingScreenId, callingObject, this.dialogId, this.sdkReportingPage );
}

DialogLeaderboard.prototype = new DialogMenu();

DialogLeaderboard.prototype.show = function() {
	var 
	  captionBgImageGalPath
	, captionBgImage
	, captionDOM
	, topScoreMap = [];
	
	topScoreMap = this.generateTopScores();
	this.displayTopScores( topScoreMap );

	captionBgImageGalPath = 'dialog/button-regular.png';
	captionBgImage = LoadingScreen.gal.get( captionBgImageGalPath );
	if( captionBgImage ) {
		captionDOM.css( 'background-image','url(' + captionBgImage.src + ')' );
	}
	else {
		console.debug( 'unable to load GAL image ' + captionBgImageGalPath );
	}

	captionDOM = $( '.leaderboard-caption' );

	this.setArrow( 'left', false );
	this.setArrow( 'right', false );

	//call show() method on parent class
	DialogMenu.prototype.show.call( this );

}; //DialogLeaderboard.prototype.show()

DialogLeaderboard.prototype.setArrow = function( direction, isHilight ) {
	var arrowSelector, galResourcePath, imageArrow, imageArray = [];
	arrowSelector = '#dialog-leaderboard .' + direction;
	galResourcePath = DialogMenu.DIALOG_PREFIX + 'arrow-button-up-';
	if( isHilight ) {
		galResourcePath += 'hilight';
	}
	else if( (direction === 'left' && this.mode === Galapago.MODE_RELAXED) || (direction === 'right' && this.mode === Galapago.MODE_TIMED) ) {
		galResourcePath += 'active';
	}
	else {
		galResourcePath += 'disable';
	}
	galResourcePath += '.png';
	imageArrow = LoadingScreen.gal.get(galResourcePath);
	if( imageArrow ) {
		if( direction === 'left' ) {
			imageArray = CanvasUtil.rotateImages( [imageArrow], 270 );
		}
		else {
			imageArray = CanvasUtil.rotateImages( [imageArrow], 90 );
		}
		if( imageArray.length === 1 ) {
			$(arrowSelector)[0].src = imageArray[0].src;
		}
	}
	else {
		console.error( 'unable to load arrow ' + galResourcePath);
	}
	return this;
}; //DialogLeaderboard.prototype.setArrow()

DialogLeaderboard.prototype.registerEventHandlers = function() {
	var dialogLeaderboard, lastIndex, lastItemSelector, firstItemSelector, keyCount;
	dialogLeaderboard = this;
	keyCount = 0;
	this.dialogMenuDOM.off('keydown');
	this.dialogMenuDOM.on('keydown', function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			dialogLeaderboard.selectHandler( dialogLeaderboard );
			break;
		case 37: // left arrow
			if (keyCount === 0) {
				if( dialogLeaderboard.mode === Galapago.MODE_RELAXED ) {
					dialogLeaderboard.setArrow( 'left', true );
				}
				window.setTimeout( function() {
					dialogLeaderboard.handleArrowSelect( Galapago.MODE_TIMED );
				}, DialogLeaderboard.HILIGHT_DELAY);
			}
			keyCount++;
			break;
		case 39: // right arrow
			if (keyCount === 0) {
				if( dialogLeaderboard.mode === Galapago.MODE_TIMED ) {
					dialogLeaderboard.setArrow( 'right', true );
				}
				window.setTimeout( function() {
                	dialogLeaderboard.handleArrowSelect( Galapago.MODE_RELAXED );
                }, DialogLeaderboard.HILIGHT_DELAY);

            }
            keyCount++;
			break;
		case 8: // backspace
			dialogLeaderboard.hide();
			break;
		}
		return false;
	});
	this.dialogMenuDOM.off('keyup');
	this.dialogMenuDOM.on('keyup', function(evt) {
		switch( evt.keyCode ) {
		case 37: // left arrow
			dialogLeaderboard.setArrow('left', false);
			keyCount = 0;
			break;
		case 39: // right arrow
			dialogLeaderboard.setArrow('right', false);
			keyCount = 0;
			break;
		return false;
		}
	});
	this.registerMouseHandlers();
}; //DialogLeaderboard.prototype.registerEventHandlers()

DialogLeaderboard.prototype.registerMouseHandlers = function() {
	var menuButtonSize = this.dialogNav.children().length;
	var dialogLeaderboard = this;
	var dialogNavChildren = dialogMenuDOM = $('#' + this.dialogId + ' ul li');
	dialogNavChildren.off('mouseover');
	dialogNavChildren.on('mouseover', function(){
		dialogLeaderboard.setNavItem($('#'+this.id));
		return false;
	});
	dialogNavChildren.off('click');
	dialogNavChildren.on('click', function(){
		dialogLeaderboard.currentNavItem[0]=this;
		dialogLeaderboard.selectHandler(dialogLeaderboard);
		return false;
	});

	$( '.left' ).off( 'mouseover');
	$( '.left' ).on( 'mouseover', function() {
		if( dialogLeaderboard.mode === Galapago.MODE_RELAXED ) {
			dialogLeaderboard.setArrow( 'left', true );
		}
		return false;
	});
	$( '.left' ).off( 'mouseout');
	$( '.left' ).on( 'mouseout', function() {
		dialogLeaderboard.setArrow( 'left', false );
		return false;
	});
	$('.left').off('click');
	$('.left').on('click', function() {
		dialogLeaderboard.handleArrowSelect( Galapago.MODE_TIMED );
		return false;
	});

	$( '.right' ).off( 'mouseover');
	$( '.right' ).on( 'mouseover', function() {
		if( dialogLeaderboard.mode === Galapago.MODE_TIMED ) {
			dialogLeaderboard.setArrow( 'right', true );
		}
		return false;
	});
	$( '.right' ).off( 'mouseout');
	$( '.right' ).on( 'mouseout', function() {
		dialogLeaderboard.setArrow( 'right', false );
		return false;
	});
	$('.right').off('click');
	$('.right').on('click', function() {
		dialogLeaderboard.handleArrowSelect( Galapago.MODE_RELAXED );
		return false;
	});

} //DialogLeaderboard.prototype.registerMouseHandlers()

DialogLeaderboard.prototype.handleArrowSelect = function(mode) {
	if( this.mode !== mode ) {
		this.mode = mode;
		topScoreMap = this.generateTopScores();
		this.displayTopScores( topScoreMap );
		if( mode === Galapago.MODE_TIMED ) {
			this.setArrow( 'left', false );
			this.setArrow( 'right', false );
		}
		else {
			this.setArrow( 'left', false );
			this.setArrow( 'right', false );
		}
		//TODO use i18next context instead
		this.dialogMenuDOM.find( '.leaderboard-caption' ).toggle();
	}
	return this; //chainable
}; //v.prototype.handleArrowSelect()

DialogLeaderboard.prototype.generateTopScores = function() {
	var keyString, keyPattern, keys, key, keyName, profile, topScore, topScoreMap = [];
	keyString = '(' + this.mode + ')' + '(\\w+)' + '(.totalScore)';
	keyPattern = new RegExp( keyString );
	keys = store.getKeys();
	for( key in keys ) {
		keyName = keys[key];
		if( keyPattern.test( keyName ) ) {
			profile = keyName.replace( keyPattern, '$2' );
			topScore = store.getItem( keyName );
			/*TODO why didn't the _.sortBy work with this syntax?
			topScoreMap[profile] = topScore;*/
			topScoreMap.push( { 'profile' : profile, 'topScore' : topScore } );
		}
	}

	topScoreMap = topScoreMap.sort( function compare(o1, o2) {
		if( o1.topScore < o2.topScore ) return 1;
		if( o1.topScore > o2.topScore ) return -1;
		return 0;
	});

	return topScoreMap;
}; //DialogLeaderboard.prototype.generateTopScores()

DialogLeaderboard.prototype.displayTopScores = function(topScoreMap) {
	var
	  tableRow
	, row = 1
	, leaderboardBody = $( '#leaderboard>tbody' );

	_.each( topScoreMap, function(entry) {
		//console.log( entry.profile + ': ' + entry.topScore );
		tableRow = leaderboardBody.children( '*:nth-child(' + row + ')' );
		tableRow.children( '.lb-col2' ).html( entry.profile );
		tableRow.children( '.lb-col3' ).html( addCommas(entry.topScore) );
		row++;
	});

	// clear out subsequent rows in case mode changes
	while( row <= Galapago.MAX_PROFILES ) {
		tableRow = leaderboardBody.children( '*:nth-child(' + row + ')' );
		tableRow.children( '.lb-col2' ).html( '&nbsp;' );
		tableRow.children( '.lb-col3' ).html( '&nbsp;' );
		row++;
	}
}; //DialogLeaderboard.prototype.displayTopScores()