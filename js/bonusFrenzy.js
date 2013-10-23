BonusFrenzy.LEFT = 325;
BonusFrenzy.X_MIN = 0;
BonusFrenzy.X_MAX = 748;
BonusFrenzy.Y_MIN = 6;
BonusFrenzy.Y_MAX = 523;
BonusFrenzy.Y_OFFSET = 100;
BonusFrenzy.START_MOVING_DELAY_MS = 800;
BonusFrenzy.CREATURE_LAYER_TOP = 100;
BonusFrenzy.CREATURE_SCORE = 50;

function BonusFrenzy(board) {
	var rows, cols;
	this.board = board;	
	this.layer = board.creatureLayer;
	this.layer.canvas.height = Board.GRID_TOP + this.layer.canvas.height;
	$('#' + Level.LAYER_CREATURE).css('top', '0px');
	
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
} //function BonusFrenzy() constructor

BonusFrenzy.prototype.getScore = function () {
	return this.score;
}; //BonusFrenzy.prototype.getScore()

BonusFrenzy.prototype.registerEvents = function () {
	var bonusFrenzy = this;
	this.currentX = this.board.tileActive.getXCoord() ;
	this.currentY = this.board.tileActive.getYCoord() + BonusFrenzy.Y_OFFSET;
	this.board.tileActive.eraseHilight();
	$('#layer-creature').off('click');
	$('#layer-creature').on('click', function(evt){
		bonusFrenzy.handleMouseClickEvent(evt);
		return false;
	});
	$('#layer-creature').off('keydown');
	$('#layer-creature').on('keydown', function(evt) {
		console.debug('key pressed ' + evt.keyCode);
		switch( evt.keyCode ) {
			case 37: // left arrow
				bonusFrenzy.handleLeftArrow();
				break;
			case 38: // up arrow
				bonusFrenzy.handleUpArrow();
				break;
			case 39: // right arrow
				bonusFrenzy.handleRightArrow();
				break;
			case 40: // down arrow
				bonusFrenzy.handleDownArrow();
				break;	
			default:
		}
		return false;
	});
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
} //BonusFrenzy.prototype.handleMouseClickEvent()

BonusFrenzy.prototype.handleLeftArrow = function () {	
    this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
	if(this.currentY>BonusFrenzy.CREATURE_LAYER_TOP){
		var i = Tile.getCol(this.currentX)
		var j = Tile.getRow((this.currentY-BonusFrenzy.CREATURE_LAYER_TOP));
		if(this.board.creatureTileMatrix[i][j]){
			this.layer.drawImage(this.board.level.gameImages.tile_regular, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
		}
	}
    if(this.currentX - Board.TILE_WIDTH >= BonusFrenzy.X_MIN){
		this.currentX = this.currentX - Board.TILE_WIDTH;
	}
	this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.checkForCreatureCatch(this.currentX , this.currentY );
}; //BonusFrenzy.prototype.handleLeftArrow()

BonusFrenzy.prototype.handleUpArrow = function () {
    this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
	if(this.currentY>BonusFrenzy.CREATURE_LAYER_TOP){
		var i = Tile.getCol(this.currentX)
		var j = Tile.getRow((this.currentY-BonusFrenzy.CREATURE_LAYER_TOP));
		if(this.board.creatureTileMatrix[i][j]){
			this.layer.drawImage(this.board.level.gameImages.tile_regular, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
		}	
	}
    if(this.currentY - Board.TILE_HEIGHT >= BonusFrenzy.Y_MIN){
		this.currentY = this.currentY - Board.TILE_HEIGHT;
	}
	this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.checkForCreatureCatch(this.currentX , this.currentY );
}; ////BonusFrenzy.prototype.handleUpArrow()

BonusFrenzy.prototype.handleRightArrow = function () {
    this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
	if(this.currentY>BonusFrenzy.CREATURE_LAYER_TOP){
		var i = Tile.getCol(this.currentX)
		var j = Tile.getRow((this.currentY-BonusFrenzy.CREATURE_LAYER_TOP));
		if(this.board.creatureTileMatrix[i][j]){
			this.layer.drawImage(this.board.level.gameImages.tile_regular, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
		}
	}
    if(this.currentX + Board.TILE_WIDTH <= BonusFrenzy.X_MAX){
		this.currentX = this.currentX + Board.TILE_WIDTH;
	}
	this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.checkForCreatureCatch(this.currentX , this.currentY );
}; //BonusFrenzy.prototype.handleRightArrow()

BonusFrenzy.prototype.handleDownArrow = function () {
    this.layer.clearRect(this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
	if(this.currentY>BonusFrenzy.CREATURE_LAYER_TOP){
		var i = Tile.getCol(this.currentX)
		var j = Tile.getRow((this.currentY-BonusFrenzy.CREATURE_LAYER_TOP));
		if(this.board.creatureTileMatrix[i][j]){
			this.layer.drawImage(this.board.level.gameImages.tile_regular, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
		}
	}
    if(this.currentY + Board.TILE_HEIGHT <= BonusFrenzy.Y_MAX){
		this.currentY = this.currentY + Board.TILE_HEIGHT;
	}
	this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.checkForCreatureCatch(this.currentX , this.currentY );
}; //BonusFrenzy.prototype.handleDownArrow()

BonusFrenzy.prototype.checkForCreatureCatch = function (x , y) {
	for (var key in this.randomCreatureMap){
		var tile = this.randomCreatureMap[key];
		//console.log(tile.xCoord +" "+ x + " "+ tile.yCoord +"  "+ (y-BonusFrenzy.Y_OFFSET))
		if(tile.xCoord == x && tile.yCoord == (y-BonusFrenzy.Y_OFFSET)){
			this.layer.clearRect(x, y, Board.TILE_WIDTH, Board.TILE_HEIGHT);
			this.layer.drawImage(this.board.level.gameImages.tile_regular, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT);
			this.layer.drawImage( this.tile_hilight, this.currentX, this.currentY, Board.TILE_WIDTH, Board.TILE_HEIGHT );
			delete this.randomCreatureMap[key];
			this.score++;
			this.board.level.levelAnimation.animateScore(x, y - Board.GRID_TOP, BonusFrenzy.CREATURE_SCORE, false);
		}
	}
}; //BonusFrenzy.prototype.checkForCreatureCatch()

BonusFrenzy.prototype.sizeOfRandomCreatureMap = function () {
	var len = 0;
	for (var k in this.randomCreatureMap) {
		len++;
	}
	return len;
}; //BonusFrenzy.prototype.sizeOfRandomCreatureMap

BonusFrenzy.prototype.drawBoard = function(){
	var creaturemap = [];
	var layer = this.layer;
	var i =0;
	var board = this.board;
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
					layer.drawImage(board.level.gameImages.tile_regular, tile.getXCoord(), tile.getYCoord()+BonusFrenzy.CREATURE_LAYER_TOP, Board.TILE_WIDTH, Board.TILE_HEIGHT);
				}else{
					layer.drawImage(board.level.gameImages.tile_regular, tile.getXCoord(), tile.getYCoord()+BonusFrenzy.CREATURE_LAYER_TOP, Board.TILE_WIDTH, Board.TILE_HEIGHT);
					layer.drawImage(tile.blob.image, tile.getXCoord(), tile.getYCoord()+BonusFrenzy.CREATURE_LAYER_TOP, Board.TILE_WIDTH, Board.TILE_HEIGHT);
				}
			}
		});
	});
}; //BonusFrenzy.prototype.drawBoard()


BonusFrenzy.prototype.startMoving = function(){
	//var creatureLayer = this.board.creatureLayer;
	
	var bonusFrenzy = this;
	var layer = this.layer;
	var board = this.board;
	function fly(){
	    layer.clearRect(0, 0, layer.canvas.width, BonusFrenzy.CREATURE_LAYER_TOP-1);

		for(var i =0 ; i < board.creatureTileMatrix.length ; i++){
			for (var j =0 ; j < board.creatureTileMatrix[i].length ; j++){
				var tile =  board.creatureTileMatrix[i][j];
				if(tile){
					layer.clearRect(tile.getXCoord(), tile.getYCoord()+BonusFrenzy.CREATURE_LAYER_TOP, Board.TILE_WIDTH, Board.TILE_HEIGHT);
					layer.drawImage(board.level.gameImages.tile_regular, tile.getXCoord(), tile.getYCoord()+BonusFrenzy.CREATURE_LAYER_TOP, Board.TILE_WIDTH, Board.TILE_HEIGHT);
				}else{
					layer.clearRect(Tile.getXCoord(i), Tile.getYCoord(j)+BonusFrenzy.CREATURE_LAYER_TOP, Board.TILE_WIDTH, Board.TILE_HEIGHT);
				}
			}
		}	
		
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
	         clearInterval(bonusFrenzy.intervalHandle);
			 console.log('score : '+bonusFrenzy.score);
			 //bonusFrenzy.board.level.won()
			 bonusFrenzy.board.setComplete();
	     }
	} //function fly()

	this.intervalHandle = setInterval( fly , BonusFrenzy.START_MOVING_DELAY_MS );
} //BonusFrenzy.prototype.startMoving()