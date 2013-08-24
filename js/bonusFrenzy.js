BonusFrenzy.LEFT = 325;
BonusFrenzy.X_MIN = 0;
BonusFrenzy.X_MAX = 748;
BonusFrenzy.Y_MIN = 6;
BonusFrenzy.Y_MAX = 523;
BonusFrenzy.Y_OFFSET = 100;
BonusFrenzy.FRENZY_COLOR_ACTIVE = 'red';
BonusFrenzy.START_MOVING_DELAY_MS = 800;



function BonusFrenzy(board) {
	var rows, cols;
	this.board = board;	
	this.layer = board.bonusFrenzyLayer;
	rows = board.level.levelConfig.blobPositions.length;

	BonusFrenzy.Y_MAX = BonusFrenzy.Y_MIN + ((rows-1)* Board.TILE_HEIGHT) + (2*Board.TILE_HEIGHT);
	cols = board.level.levelConfig.blobPositions[0].length;
	BonusFrenzy.X_MAX = BonusFrenzy.X_MIN + ((cols-1)* Board.TILE_WIDTH);

	this.randomCreatureMap = null;
	this.score = 0;
	this.tile_hilight = LoadingScreen.gal.get('screen-game/tile-selected.png');
	
	this.drawBoard(board);
	this.registerEvents();
	this.startMoving();
}

BonusFrenzy.prototype.getScore = function () {
	return this.score;
};

BonusFrenzy.prototype.registerEvents = function () {
	window.onkeydown= null;
	window.onclick = null;
	window.onmousemove = null;
	var bonusFrenzy = this;
	this.currentX = this.board.tileActive.getXCoord() ;
	this.currentY = this.board.tileActive.getYCoord() + BonusFrenzy.Y_OFFSET;
	this.board.tileActive.eraseHilight();
	//bonusFrenzy.board.creatureLayer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
	window.onclick = function(evt){
		bonusFrenzy.handleMouseClickEvent(evt);
	}
	window.onkeydown = function(evt) {
		console.debug('key pressed ' + evt.keyCode);
		switch( evt.keyCode ) {
			case 37: // left arrow
				bonusFrenzy.handleLeftArrow();
				evt.preventDefault();
				break;
			case 38: // up arrow
				bonusFrenzy.handleUpArrow();
				evt.preventDefault();
				break;
			case 39: // right arrow
				bonusFrenzy.handleRightArrow();
				evt.preventDefault();
				break;
			case 40: // down arrow
				bonusFrenzy.handleDownArrow();
				evt.preventDefault();
				break;			
			default:
		}
	};
}; //BonusFrenzy.prototype.registerEvents()


BonusFrenzy.prototype.handleMouseClickEvent = function(evt) {
		var bonusFrenzy = this;
		var	x = evt.pageX ;//- this.offsetLeft;
		var y = evt.pageY ;
		console.log(BonusFrenzy.X_MAX+ " " + BonusFrenzy.Y_MAX);
		if(x >BonusFrenzy.LEFT && x< (BonusFrenzy.LEFT+BonusFrenzy.X_MAX) && y> BonusFrenzy.Y_MIN && y< (BonusFrenzy.Y_MAX )){
			var correctionX = -4; // don't know the reason
			var correctionY = +6;
			this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
			this.currentX = (x -(x % Board.TILE_WIDTH))/ Board.TILE_WIDTH * Board.TILE_WIDTH - BonusFrenzy.LEFT +correctionX;
			this.currentY = (y -(y % Board.TILE_HEIGHT))/ Board.TILE_HEIGHT * Board.TILE_HEIGHT +correctionY;
			console.log('this.currentX : '+this.currentX +" this.currentY "+this.currentY);
			this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );		
			this.checkForCreatureCatch(this.currentX , this.currentY );
		}
		//if(x>currentX && x< (currentX +Board.TILE_WIDTH) && y> BonusFrenzy.Y_MIN && y< (currentY+ Board.TILE_HEIGHT )){
				
					
	
		//}		
}

BonusFrenzy.prototype.handleLeftArrow = function () {	
    this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
    if(this.currentX - Board.TILE_WIDTH >= BonusFrenzy.X_MIN){
		this.currentX = this.currentX - Board.TILE_WIDTH;
	}
	this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.checkForCreatureCatch(this.currentX , this.currentY );
};

BonusFrenzy.prototype.handleUpArrow = function () {
    this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
    if(this.currentY - Board.TILE_HEIGHT >= BonusFrenzy.Y_MIN){
		this.currentY = this.currentY - Board.TILE_HEIGHT;
	}
	this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.checkForCreatureCatch(this.currentX , this.currentY );
};

BonusFrenzy.prototype.handleRightArrow = function () {
    this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
    if(this.currentX + Board.TILE_WIDTH <= BonusFrenzy.X_MAX){
		this.currentX = this.currentX + Board.TILE_WIDTH;
	}
	this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.checkForCreatureCatch(this.currentX , this.currentY );
};

BonusFrenzy.prototype.handleDownArrow = function () {
    this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
    if(this.currentY + Board.TILE_HEIGHT <= BonusFrenzy.Y_MAX){
		this.currentY = this.currentY + Board.TILE_HEIGHT;
	}
	this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.checkForCreatureCatch(this.currentX , this.currentY );
};

BonusFrenzy.prototype.checkForCreatureCatch = function (x , y) {
	for (var key in this.randomCreatureMap){
		var tile = this.randomCreatureMap[key];
		//console.log(tile.xCoord +" "+ x + " "+ tile.yCoord +"  "+ (y-BonusFrenzy.Y_OFFSET))
		if(tile.xCoord == x && tile.yCoord == (y-BonusFrenzy.Y_OFFSET)){
			this.layer.clearRect(x, y, Board.TILE_WIDTH, Board.TILE_HEIGHT);
			this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
			delete this.randomCreatureMap[key];
			this.score++;
		}
	}
};

BonusFrenzy.prototype.sizeOfRandomCreatureMap = function () {
  var len = 0;
    for (var k in this.randomCreatureMap)
      len++;
  return len;
};

BonusFrenzy.prototype.drawBoard = function(){
	var creaturemap = [];
	var layer = this.layer;
	var i =0;
	while( i <30 ){ //TODO: create a constant from this "magic" number
		var randomTileId = Math.ceil( Math.random() * 99); //TODO: will this work properly for a 13x11 board?
		var row = randomTileId % 10;
		var col= (randomTileId - (row)) / 10;
		var tile ;
		if(typeof this.board.creatureTileMatrix[col] !== 'undefined' && typeof this.board.creatureTileMatrix[col][row] != 'undefined'){
			tile = this.board.creatureTileMatrix[col][row];
		}
		if(tile && typeof creaturemap[col+"_"+row] === 'undefined'){
			creaturemap[col+"_"+row] = tile ;
			i++;
		}
	}
	this.randomCreatureMap = creaturemap;
	_.each(this.board.creatureTileMatrix, function(columnArray){
		_.each(columnArray, function(tile){
			if(tile){
				var col = tile.coordinates[0];
				var row = tile.coordinates[1];
				if(creaturemap[col+"_"+row] == undefined){
					tile.clear();
				}else{
			
					layer.drawImage(tile.blob.image, tile.getXCoord(), tile.getYCoord()+100, Board.TILE_WIDTH, Board.TILE_HEIGHT);
				}
			}
		});
	});
}; //BonusFrenzy.prototype.drawBoard()


BonusFrenzy.prototype.startMoving = function(){
	//var creatureLayer = this.board.creatureLayer;
	var bonusFrenzy = this;
	var layer = this.layer;
	function fly(){
	    layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
		layer.drawImage( bonusFrenzy.tile_hilight, bonusFrenzy.currentX, bonusFrenzy.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
		for (var key in  bonusFrenzy.randomCreatureMap){
			var tile =  bonusFrenzy.randomCreatureMap[key];
			if(tile.yCoord == undefined){
				tile.xCoord = tile.getXCoord();
				tile.yCoord =  tile.getYCoord()- Board.TILE_HEIGHT;
			}else{
				tile.yCoord =  tile.yCoord - Board.TILE_HEIGHT;
			}
			if(tile.yCoord < -BonusFrenzy.Y_OFFSET){
				delete bonusFrenzy.randomCreatureMap[key];
				continue;
			}
			layer.drawImage(tile.blob.image, tile.getXCoord(), tile.yCoord + BonusFrenzy.Y_OFFSET, Board.TILE_WIDTH, Board.TILE_HEIGHT);
		}
		
		if(bonusFrenzy.sizeOfRandomCreatureMap()==0){
	         window.clearInterval(bonusFrenzy.intervalHandle);
			 window.onkeydown= null;
			 window.onclick = null;
			 console.log('score : '+bonusFrenzy.score);
			 //bonusFrenzy.board.level.won()
			 bonusFrenzy.board.setComplete();
	     }
	} //function fly()

	this.intervalHandle = window.setInterval( fly , BonusFrenzy.START_MOVING_DELAY_MS );
} //BonusFrenzy.prototype.startMoving()