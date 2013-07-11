
BonusFrenzy.X_MIN = 325;
BonusFrenzy.X_MAX = 748;
BonusFrenzy.Y_MIN = 6;
BonusFrenzy.Y_MAX = 523;
BonusFrenzy.FRENZY_COLOR_ACTIVE = 'red';
BonusFrenzy.BORDER_WIDTH = 2;

function BonusFrenzy(board) {
this.board = board;
var rows = board.level.levelConfig.blobPositions.length;
BonusFrenzy.Y_MAX = BonusFrenzy.Y_MIN + ((rows-1)* Tile.getHeight()) + (2*Tile.getHeight());
var cols = board.level.levelConfig.blobPositions[0].length;
BonusFrenzy.X_MAX = BonusFrenzy.X_MIN + ((cols-1)* Tile.getWidth());
this.randomCreatureMap = null;
this.score = 0;
this.drawBoard(board);
this.registerEvents();
this.startMoving();
}
BonusFrenzy.prototype.getScore = function () {
	return this.score;
}

BonusFrenzy.prototype.registerEvents = function () {
window.onkeydown= null;
var bonusFrenzy = this;
this.currentX = this.board.tileActive.getXCoord();
this.currentY = this.board.tileActive.getYCoord();
this.board.creatureLayer.clearRect(this.currentX -2, this.currentY-2, Tile.getWidth() +4 , Tile.getHeight()+4);
//this.board.tileActive.setInactiveAsync();
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
}

BonusFrenzy.prototype.handleLeftArrow = function () {
    this.board.creatureLayer.clearRect(this.currentX -2, this.currentY-2, Tile.getWidth() +4 , Tile.getHeight()+4);
    if(this.currentX - 47 >= BonusFrenzy.X_MIN){
	 this.currentX = this.currentX - 47;
	}
	this.board.creatureLayer.lineWidth = BonusFrenzy.BORDER_WIDTH;
	this.board.creatureLayer.strokeStyle = BonusFrenzy.FRENZY_COLOR_ACTIVE;
	this.board.creatureLayer.strokeRect(this.currentX, this.currentY,Tile.getWidth(), Tile.getHeight());	
	this.checkForCreatureCatch(this.currentX , this.currentY );
}

BonusFrenzy.prototype.handleUpArrow = function () {
    this.board.creatureLayer.clearRect(this.currentX -2, this.currentY-2, Tile.getWidth() +4 , Tile.getHeight()+4);
    if(this.currentY - 47 >= BonusFrenzy.Y_MIN){
	 this.currentY = this.currentY - 47;
	}
	this.board.creatureLayer.lineWidth = BonusFrenzy.BORDER_WIDTH;
	this.board.creatureLayer.strokeStyle = BonusFrenzy.FRENZY_COLOR_ACTIVE;
	this.board.creatureLayer.strokeRect(this.currentX, this.currentY, Tile.getWidth(), Tile.getHeight());	
	this.checkForCreatureCatch(this.currentX , this.currentY );
}

BonusFrenzy.prototype.handleRightArrow = function () {
    this.board.creatureLayer.clearRect(this.currentX -2, this.currentY-2, Tile.getWidth() +4 , Tile.getHeight()+4);
    if(this.currentX + 47 <= BonusFrenzy.X_MAX){
	 this.currentX = this.currentX + 47;
	}
	this.board.creatureLayer.lineWidth = BonusFrenzy.BORDER_WIDTH;
	this.board.creatureLayer.strokeStyle = BonusFrenzy.FRENZY_COLOR_ACTIVE;
	this.board.creatureLayer.strokeRect(this.currentX, this.currentY, Tile.getWidth(), Tile.getHeight());	
	this.checkForCreatureCatch(this.currentX , this.currentY );
}

BonusFrenzy.prototype.handleDownArrow = function () {
    this.board.creatureLayer.clearRect(this.currentX -2, this.currentY-2, Tile.getWidth() +4 , Tile.getHeight()+4);
    if(this.currentY + 47 <= BonusFrenzy.Y_MAX){
	 this.currentY = this.currentY + 47;
	}
	this.board.creatureLayer.lineWidth = BonusFrenzy.BORDER_WIDTH;
	this.board.creatureLayer.strokeStyle = BonusFrenzy.FRENZY_COLOR_ACTIVE;
	this.board.creatureLayer.strokeRect(this.currentX, this.currentY , Tile.getWidth(), Tile.getHeight());	
	this.checkForCreatureCatch(this.currentX , this.currentY );
}

BonusFrenzy.prototype.checkForCreatureCatch = function (x , y) {
	for (var key in  this.randomCreatureMap){
		 var tile =  this.randomCreatureMap[key];
		 if(tile.xCoord == x && tile.yCoord == y){
		    this.board.creatureLayer.clearRect(x, y, Tile.getWidth(), Tile.getHeight());
		    delete this.randomCreatureMap[key];
			this.score++;
		 }
	}
}


BonusFrenzy.prototype.sizeOfRandomCreatureMap = function () {
  var len = 0;
    for (var k in this.randomCreatureMap)
      len++;
  return len;
}

BonusFrenzy.prototype.drawBoard = function(){
var creaturemap = new Array();
var i =0;
while( i <30 ){
var randomTileId = Math.ceil( Math.random() * 99);
var row= randomTileId %10;
var col= (randomTileId - (row)) /10;
var tile ;
if(this.board.creatureTileMatrix[col] != undefined && this.board.creatureTileMatrix[col][row] != undefined){
 tile = this.board.creatureTileMatrix[col][row];
}
if(tile && creaturemap[col+"_"+row] == undefined){
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
       }
      }
    });
  });

}


BonusFrenzy.prototype.startMoving = function(){
var creatureLayer = this.board.creatureLayer;
var bonusFrenzy = this;
function fly(){
    creatureLayer.clearRect(0, 0, creatureLayer.canvas.width, creatureLayer.canvas.height);
	for (var key in  bonusFrenzy.randomCreatureMap){
	 var tile =  bonusFrenzy.randomCreatureMap[key];
	 if(tile.yCoord == undefined){
		 tile.xCoord = tile.getXCoord();
         tile.yCoord =  tile.getYCoord()- Tile.getHeight();
     }else{
         tile.yCoord =  tile.yCoord - Tile.getHeight();
     }
	 if(tile.yCoord < 0){
          delete bonusFrenzy.randomCreatureMap[key];
		  continue;
     }
	 creatureLayer.drawImage(tile.blob.image, tile.getXCoord(), tile.yCoord, Tile.getWidth(), Tile.getHeight());
	}
	
	if(bonusFrenzy.sizeOfRandomCreatureMap()==0){
         window.clearInterval(bonusFrenzy.intervalHandle);
		 console.log('score : '+bonusFrenzy.score);
		 //bonusFrenzy.board.level.won()
		 bonusFrenzy.board.setComplete();
     }
}

 this.intervalHandle = window.setInterval(fly ,800 );
}

