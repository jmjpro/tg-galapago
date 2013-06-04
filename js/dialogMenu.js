function DialogMenu(mainId, menuId) {
	this.main = document.getElementById(mainId);
	this.menu = document.getElementById(menuId);
}

DialogMenu.prototype.show = function() {
	this.main.className = 'transparent';
	this.menu.style.visibility = 'visible';
};

DialogMenu.prototype.hide = function(menuId) {
	this.main.className = '';
	this.menu.style.visibility = 'hidden';
}