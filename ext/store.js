window.store = new Store();

function Store(){
}

Store.prototype.localStoreSupport = function() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};

Store.prototype.setItem = function(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else {
        var expires = "";
    }
    if( this.localStoreSupport() ) {
        localStorage.setItem(name, value);
    }
    else {
        document.cookie = name+"="+value+expires+"; path=/";
    }
};

Store.prototype.getItem = function(name) {
    if( this.localStoreSupport() ) {
        return localStorage.getItem(name);
    }
    else {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
};

Store.prototype.getKeys = function(name) {
	var keys = [];
    if( this.localStoreSupport() ) {
        for (var i = 0; i < localStorage.length; i++){
			keys.push(localStorage.key(i));
		}
    }
    else {
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            var eqIndex = c.indexOf("=");
            if (eqIndex > -1){ 
            	keys.push(c.substring(0, eqIndex));
            }
        }
    }
    return keys;
};
 
Store.prototype.removeItem = function(name) {
    if( this.localStoreSupport() ) {
        localStorage.removeItem(name);
    }
    else {
        this.setItem(name,"",-1);
    }
};

Store.prototype.clear = function(){
	if( this.localStoreSupport() ) {
        localStorage.clear();
    }
    else {
    	var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            var eqIndex = c.indexOf("=");
            if (eqIndex > -1){ 
            	this.setItem(c.substring(0, eqIndex), "", -1);
            }
        }
    }	
};