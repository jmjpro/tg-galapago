function DialogMenu(mainId, menuId) {
	this.main = document.getElementById(mainId);
	this.menu = document.getElementById(menuId);
}

DialogMenu.prototype.show = function(board) {
    this.windowKeyHandler= window.onkeydown;
	window.onkeydown=null;
    this.board=board;
	this.menu.style.visibility = 'visible';
	this.registerEvents();
	//this.menu.focus();
	//alert($('#game-menu'));
	this.currentSelection=0;
	this.setSelected(this.currentSelection);
	//$("#game-menu").focus();
};

DialogMenu.prototype.registerEvents=function(){
   var dialog = this;
   window.onkeydown = function(e) {
		switch(e.keyCode) { 
			// User pressed "up" arrow
			case 38:
				dialog.navigate('up');
			    break;
			// User pressed "down" arrow
			case 40:
				dialog.navigate('down');
			    break;
			// User pressed "enter"
			case 13:
			      window.onkeydown = dialog.windowKeyHandler;
				  $("#gmenu ul li a").eq(dialog.currentSelection).click();
			      break;
		}
	};
		for(var i = 0; i < $("#gmenu ul li a").size(); i++) {
		$("#gmenu ul li a").eq(i).data("number", i);
	}
}

DialogMenu.prototype.navigate =function (direction) {
	// Check if any of the menu items is selected
	if($("#gmenu ul li .itemhover").size() == 0) {
		this.currentSelection = -1;
	}
	
	if(direction == 'up' && this.currentSelection != -1) {
		if(this.currentSelection != 0) {
			this.currentSelection--;
		}
	} else if (direction == 'down') {
		if(this.currentSelection != $("#gmenu ul li").size() -1) {
			this.currentSelection++;
		}
	}
	this.setSelected(this.currentSelection);
}

DialogMenu.prototype.setSelected =function (menuitem) {
	$("#gmenu ul li a").removeClass("itemhover");
	$("#gmenu ul li a").eq(menuitem).addClass("itemhover");
	//this.currentAnchor = $("#gmenu ul li a").eq(menuitem);
	//alert(currentUrl);
}

DialogMenu.prototype.hide = function(showCreatureBoard) {
	//this.main.className = '';
	this.menu.style.visibility = 'hidden';
	//this.board.handleTileSelect(this.board.tileActive);
	//this.board.displayMenuButton(false);
	if(showCreatureBoard){
	 this.board.displayMenuButton(false);
	 this.board.hotspot = null;
	 this.board.display();
	}
	//alert(this.board.tileActive);
	
}

DialogMenu.prototype.showMapScreen = function() {
   this.hide(false);
   // document.getElementById('layer-background').style.zIndex=100000;
  /* layers = $('.game-layer');
	_.each( layers, function(layer) {
		layer.width = 0;
		layer.height = 0;
	});*/
	//this.board.level.layerBackground.clearRect( 0, 0, ScreenLoader.STAGE_WIDTH, ScreenLoader.STAGE_HEIGHT);
	$('#' + Galapago.LAYER_MAP)[0].style.zIndex = 7;
	$('#' + Galapago.LAYER_MAP)[0].focus();
	//Galapago.levelMap.display();
	//window.onkeydown=null;
	Galapago.levelMap = new LevelMap(this.board.level);
	
	
	
}