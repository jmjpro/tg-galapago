LevelAnimation.JUMP_TIME_INTERVAL=50;
LevelAnimation.ROLLOVER_SPRITE_MATRIX = [[
 {cell: [0, 0], id: '1'}, 
 {cell: [46, 0], id: '2'}, 
 {cell: [92, 0], id: '3'}, 
 {cell: [138, 0], id: '4'}, 
 {cell: [184, 0], id: '5'}, 
 {cell: [230, 0], id: '6'}, 
 {cell: [276, 0], id: '7'}, 
 {cell: [322, 0], id: '8'}, 
 {cell: [368, 0], id: '9'}, 
 {cell: [414, 0], id: '10'}
 ]];

LevelAnimation.JUMP_SPRITE_MATRIX = [[
 {cell: [23, 0], id: '1'}, 
 {cell: [69, 0], id: '2'}, 
 {cell: [115, 0], id: '3'}, 
 {cell: [161, 0], id: '4'}, 
 {cell: [207, 0], id: '5'}, 
 {cell: [253, 0], id: '6'},
 {cell: [299, 0], id: '7'}, 
 {cell: [345, 0], id: '8'}, 
 {cell: [391, 0], id: '9'}, 
 {cell: [437, 0], id: '10'}, 
 {cell: [483, 0], id: '11'}, 
 {cell: [529, 0], id: '12'}, 
 {cell: [576, 0], id: '13'}, 
 {cell: [621, 0], id: '14'},
 {cell: [667, 0], id: '15'}, 
 {cell: [713, 0], id: '16'}, 
 {cell: [759, 0], id: '17'}, 
 {cell: [805, 0], id: '18'}, 
 {cell: [851, 0], id: '19'}, 
 {cell: [897, 0], id: '20'},
 {cell: [943, 0], id: '21'}, 
 {cell: [989, 0], id: '22'}, 
 {cell: [1035, 0], id: '23'}, 
 {cell: [1081, 0], id: '24'}, 
 {cell: [1127, 0], id: '25'}, 
 {cell: [1173, 0], id: '26'}, 
 {cell: [1219, 0], id: '27'}, 
 {cell: [1265, 0], id: '28'}
 ]];

function LevelAnimation(layer){
	this.rolloverAnimation = null;
}

LevelAnimation.buildImagePaths = function(bgTheme, creatureTypes){
	var creatureTypeIt, creatureImagePathIt, creatureImagePath, creatureImagePaths, creatureType;
	creatureImagePaths = [];
	creatureImagePathIt = 0;
	for( creatureTypeIt = 0; creatureTypeIt < creatureTypes.length; creatureTypeIt++ ) {
			creatureType = creatureTypes[creatureTypeIt];
			creatureImagePath = Level.CREATURE_PATH + bgTheme + '/' + creatureType + '_1_rollover.' + Level.BLOB_IMAGE_EXTENSION;
			creatureImagePaths[creatureImagePathIt] = creatureImagePath;
			creatureImagePathIt++;
			creatureImagePath = Level.CREATURE_PATH + bgTheme + '/' + creatureType + '_1_jumps.' + Level.BLOB_IMAGE_EXTENSION;
			creatureImagePaths[creatureImagePathIt] = creatureImagePath;
			creatureImagePathIt++;
	}
	//console.debug('creatureImagePaths: ' + creatureImagePaths);
	return creatureImagePaths;
};


LevelAnimation.prototype.initImages = function(imageArray) {
	var levelAnimation;
	var imageId;
	levelAnimation = this;

	_.each(imageArray, function(image) {
		if(image.width > 0){
			imageId = image.id;
			if(imageId.indexOf('_rollover') > 0){
				levelAnimation[imageId] = new SpriteSheet(image, LevelAnimation.ROLLOVER_SPRITE_MATRIX);
			}
			if(imageId.indexOf('_jumps') > 0){
				levelAnimation[imageId] = new SpriteSheet(image, LevelAnimation.JUMP_SPRITE_MATRIX);
			}
		}
	});
};

LevelAnimation.prototype.animateCreatureSelection = function(layer, board){
	var tileActive = board.tileActive;
	var imageId = tileActive.blob.image.id + '_rollover';
	if(this.rolloverAnimation){
		this.rolloverAnimation.stop();
		this.rolloverAnimation = null;
	}
	var rolloverImageSpriteSheet = this[imageId];
	if(rolloverImageSpriteSheet){
		this.rolloverAnimation = new RolloverAnimation(layer, board, tileActive, rolloverImageSpriteSheet);
		this.rolloverAnimation.start();
	}
};

LevelAnimation.prototype.animateCreaturesSwap = function(layer, board, tile, tilePrev){
	if(tilePrev.coordinates[1] > tile.coordinates[1]){
		var imageId = tilePrev.blob.image.id + '_jumps';
		var rolloverImageSpriteSheet = this[imageId];
		var x = tile.getXCoord();
		var y = tile.getYCoord();
		if(rolloverImageSpriteSheet){
			var imgCnt = 0
			var interval = setInterval(function(){
				var image = rolloverImageSpriteSheet.getSprite([imgCnt * 2, 0]);
				layer.putImageData(image, x, y);
				imgCnt++;
				if(imgCnt * 2 == LevelAnimation.JUMP_SPRITE_MATRIX[0].length){
					clearInterval(interval);
					//board.animateSwapCreaturesAsync( tile, tilePrev );
				}
			}, LevelAnimation.JUMP_TIME_INTERVAL);
			return true;
		}
	}
	return false;
};


RolloverAnimation.ROLLOVER_TIME_INTERVAL=330;
function RolloverAnimation(layer, board, tile, rolloverImageSpriteSheet){
	this.rolloverImageSpriteSheet = rolloverImageSpriteSheet;
	this.interval = null;
	this.rolloverSpriteId = 0;
	this.layer = layer;
	this.board = board;
	this.tile = tile;
}

RolloverAnimation.prototype.start = function(){
	this.rolloverSpriteId = 0;
	var rolloverAnimation = this;
	this.interval = setInterval(function(){
		rolloverAnimation.animate(rolloverAnimation)}, 
		RolloverAnimation.ROLLOVER_TIME_INTERVAL);
};

RolloverAnimation.prototype.stop = function(){
	clearInterval(this.interval);
	this.layer.drawImage(this.tile.blob.image, this.tile.getXCoord(), this.tile.getYCoord(), Tile.getWidth(), Tile.getHeight());
	if(this.board.tileSelected == this.tile){
		this.tile.setSelectedAsync().then( function() {
			return;
		}).done();
	}
};

RolloverAnimation.prototype.animate = function(rolloverAnimation){
	var image = this.rolloverImageSpriteSheet.getSprite([this.rolloverSpriteId, 0]);
	this.layer.putImageData(image, this.tile.getXCoord(), this.tile.getYCoord());
	this.rolloverSpriteId++;
	this.rolloverSpriteId = this.rolloverSpriteId % LevelAnimation.ROLLOVER_SPRITE_MATRIX[0].length;
};