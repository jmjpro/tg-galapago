DialogProfileList.PROFILE_PREFIX = 'Galapago.profile.';
DialogProfileList.checkboxVImageGalPath = 'dialog/checkbox-v.png';
DialogProfileList.checkboxVDisabledImageGalPath = 'dialog/checkbox-v-disabled.png';
DialogProfileList.checkboxDeleteImageGalPath = 'dialog/checkbox-delete.png';
DialogProfileList.checkboxDeleteDisabledImageGalPath = 'dialog/checkbox-delete-disabled.png';


function DialogProfileList( callingObject, callingScreenId, mode ) {
	this.dialogId = 'dialog-profile-list';
	this.mode = mode;
	this.activeProfileName = null; // we set this in getSavedProfiles();
	this.elActiveProfile = null;
	this.elProfileList = $( '#' + this.dialogId ).find( '#profile-list > li' );
	// super constructor
	this.dialogMenu = DialogMenu.call( this, callingObject, callingScreenId, this.dialogId );
}

// inherit from DialogMenu
DialogProfileList.prototype = new DialogMenu();

DialogProfileList.prototype.show = function() {
	var that = this;

	that.onUpdate();
	that.registerEventHandlers();
	//call show() method on parent class
	DialogMenu.prototype.show.call( this );
}; //DialogLeaderboard.prototype.show()

DialogProfileList.prototype.registerEventHandlers = function() {
	this.registerKeyboardHandlers();
	this.registerMouseHandlers();	
}; //DialogProfileList.prototype.registerEventHandlers()

DialogProfileList.prototype.registerKeyboardHandlers = function() {
	//TODO implement
}; //DialogProfileList.prototype.registerEventHandlers()

DialogProfileList.prototype.unregisterEventHandlers = function() {
	var that = this;
	that.elProfileList.each( function( idx, profileRow ) {
		
	});
}; //DialogProfileList.prototype.unregisterEventHandlers()

DialogProfileList.prototype.registerMouseHandlers = function() {
	var that = this;
	that.elProfileList.each( function( idx, profileRow ) {
		$(profileRow).find( 'div' ).not( 'profile-disabled' ).on( 'mouseover', function() {
			$( this ).addClass( 'profile-hover' );
		});
		$(profileRow).find( 'div' ).on( 'mouseout', function() {
			$( this ).removeClass( 'profile-hover' );
		});
		// synchronize hover over profile name with hover over checkboxes in the same row
		$(profileRow).find( '.checkbox-v, .checkbox-delete' ).on( 'mouseover', function() {
			$( this ).siblings( '.profile-name' ).addClass( 'profile-hover' );
		});
		$(profileRow).find( '.checkbox-v, .checkbox-delete' ).on( 'mouseout', function() {
			$( this ).siblings( '.profile-name' ).removeClass( 'profile-hover' );
		});
		$(profileRow).find( '.checkbox-v, .profile-name' ).not( 'profile-disabled' ).on( 'click', function() {
			var elProfileName;
			if( $( this ).hasClass( '.checkbox-v' ) ) {
				elProfileName = $( this ).siblings( '.profile-name' );
			}
			else {
				elProfileName = $( this );
			}
			that.setActiveProfile( elProfileName );
		});
		$(profileRow).find( '.checkbox-delete' ).not( 'profile-disabled' ).on( 'click', function() {
			window.dialog = new DialogMenu( this.dialogMenuDOM, this, 'dialog-profile-delete' );
		});
	});
}; //DialogProfileList.prototype.registerMouseHandlers()

DialogProfileList.prototype.setActiveProfile = function( elProfileName ) {
	store.setItem( DialogProfileList.PROFILE_PREFIX + this.activeProfileName, '' );
	store.setItem( DialogProfileList.PROFILE_PREFIX + elProfileName.text(), 'active' );
	this.elActiveProfile.removeClass( 'gal-profile-active' );
	elProfileName.addClass( 'gal-profile-active' );
	this.elActiveProfile.siblings( '.checkbox-delete' ).removeClass( 'profile-disabled' );
	LoadingScreen.gal.setBG( this.elActiveProfile.siblings( '.checkbox-delete' )[0], DialogProfileList.checkboxDeleteImageGalPath );
	elProfileName.siblings( '.checkbox-delete' ).addClass( 'profile-disabled' );
	LoadingScreen.gal.setBG( elProfileName.siblings( '.checkbox-delete' )[0], DialogProfileList.checkboxDeleteDisabledImageGalPath );
	this.elActiveProfile = elProfileName;	
	this.activeProfileName = elProfileName.text();
}; //DialogProfileList.prototype.setActiveProfile()

DialogProfileList.prototype.onUpdate = function() {
	var that = this, savedProfiles = [];
	var isActiveProfile
	var checkboxV_Elem, checkboxDelete_Elem, profileElem;
	
	savedProfiles = that.getSavedProfiles();
	
	that.elProfileList.each( function( idx, profileRow ) {
		isActiveProfile = (that.activeProfileName === savedProfiles[idx]) ? true : false;
		checkboxV_Elem = $( profileRow ).find( '.checkbox-v' );
		checkboxDelete_Elem = $( profileRow ).find( '.checkbox-delete' );
		profileElem = $( profileRow ).find( '.profile-name' );
		if( savedProfiles[idx] ) {
			profileElem.text( savedProfiles[idx] );
		}
		if( isActiveProfile || !savedProfiles[idx] ) {
			LoadingScreen.gal.setBG( checkboxV_Elem[0], DialogProfileList.checkboxVImageGalPath );
			LoadingScreen.gal.setBG( checkboxDelete_Elem[0], DialogProfileList.checkboxDeleteDisabledImageGalPath );
			checkboxDelete_Elem.addClass( 'profile-disabled' );
			if( isActiveProfile ) {
				profileElem.addClass( 'gal-profile-active' );
				that.elActiveProfile = profileElem;
			}
		}
		else {
			LoadingScreen.gal.setBG( checkboxV_Elem[0], DialogProfileList.checkboxVImageGalPath );
			LoadingScreen.gal.setBG( checkboxDelete_Elem[0], DialogProfileList.checkboxDeleteImageGalPath );
		}
		console.debug( savedProfiles[idx] );
	});
} // DialogProfileList.prototype.onUpdate()

DialogProfileList.prototype.getSavedProfiles = function() {
	var keyString, keyPattern, keys, key, keyName, profile, savedProfiles = [];
	keys = store.getKeys();
	for( key in keys ) {
		keyName = keys[key];
		if( keyName.startsWith( DialogProfileList.PROFILE_PREFIX ) ) {
			profile = keyName.slice( DialogProfileList.PROFILE_PREFIX.length );
			savedProfiles.push( profile );
			if( store.getItem(keyName) === 'active' ) {
				this.activeProfileName = profile;
			}
		}
	}
	return savedProfiles;
}; // DialogProfileList.prototype.getSavedProfiles()