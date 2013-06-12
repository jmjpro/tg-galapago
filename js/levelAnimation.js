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
			levelAnimation[imageId] = new SpriteSheet(image, LevelAnimation.ROLLOVER_SPRITE_MATRIX);
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