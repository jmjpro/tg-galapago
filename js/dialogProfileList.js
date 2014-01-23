function DialogProfileList( callingObject, callingScreenId, mode ) {
	this.dialogId = 'dialog-profile-list';
	this.mode = mode;
	DialogMenu.call( this, callingObject, callingScreenId, this.dialogId );
	this.activeProfile = null; // we set this in getSavedProfiles();
}

DialogProfileList.prototype = new DialogMenu();

DialogProfileList.prototype.show = function() {
	var that = this, savedProfiles = [];
	var isActiveProfile, checkboxVImageGalPath, checkboxVDisabledImageGalPath, checkboxDeleteImageGalPath, checkboxDeleteDisabledImageGalPath;
	var checkboxV_Elem, checkboxDelete_Elem;
	checkboxVImageGalPath = 'dialog/checkbox-v.png';
	checkboxVDisabledImageGalPath = 'dialog/checkbox-v-disabled.png';
	checkboxDeleteImageGalPath = 'dialog/checkbox-delete.png';
	checkboxDeleteDisabledImageGalPath = 'dialog/checkbox-delete-disabled.png';

	savedProfiles = this.getSavedProfiles();

	$( '#' + this.dialogId ).find( '#profile-list > li' ).each( function( idx, profileRow ) {
		isActiveProfile = (that.activeProfile === savedProfiles[idx]) ? true : false;
		checkboxV_Elem = $( profileRow ).find( '.checkbox-v' );
		checkboxDelete_Elem = $( profileRow ).find( '.checkbox-delete' );
		profileElem = $( profileRow ).find( 'span' );
		if( savedProfiles[idx] ) {
			profileElem.text( savedProfiles[idx] );
			if( isActiveProfile ) {
				LoadingScreen.gal.setBG( checkboxV_Elem[0], checkboxVDisabledImageGalPath );
				profileElem.addClass( 'gal-profile-active' );
			}
			else {
				LoadingScreen.gal.setBG( checkboxV_Elem[0], checkboxVImageGalPath );
			}
			LoadingScreen.gal.setBG( checkboxDelete_Elem[0], checkboxDeleteImageGalPath );
		}
		else {
			LoadingScreen.gal.setBG( checkboxV_Elem[0], checkboxVDisabledImageGalPath );
			LoadingScreen.gal.setBG( checkboxDelete_Elem[0], checkboxDeleteDisabledImageGalPath );
		}
	});
	//call show() method on parent class
	DialogMenu.prototype.show.call( this );

}; //DialogLeaderboard.prototype.show()

DialogProfileList.prototype.getSavedProfiles = function() {
	var profilePrefix, keyString, keyPattern, keys, key, keyName, profile, savedProfiles = [];
	profilePrefix = 'Galapago.profile.';
	//keyString = profilePrefix + '(\\w+)';
	//keyPattern = new RegExp( keyString );
	keys = store.getKeys();
	for( key in keys ) {
		keyName = keys[key];
		if( keyName.startsWith( profilePrefix ) ) {
			profile = keyName.slice(profilePrefix.length);
			savedProfiles.push( profile );
			if( store.getItem(keyName) === 'active' ) {
				this.activeProfile = profile;
			}
		}
	}
	return savedProfiles;
} // DialogProfileList.prototype.getSavedProfiles()

DialogProfileList.prototype.registerEventHandlers = function() {
	this.registerMouseHandlers();
}; //DialogProfileList.prototype.registerEventHandlers()

DialogProfileList.prototype.registerMouseHandlers = function() {

} //DialogProfileList.prototype.registerMouseHandlers()
