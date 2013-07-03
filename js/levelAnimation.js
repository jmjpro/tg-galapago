LevelAnimation.BONFIRE_TIME_INTERVAL=2000;
LevelAnimation.BONFIRE_IMAGE_WIDTH=21;
LevelAnimation.BONFIRE_IMAGE_HEIGHT=36;
LevelAnimation.JUMP_TIME_INTERVAL=10;
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

LevelAnimation.BONFIRE_SPRITE_MATRIX = [[
 {cell: [0, 0], id: '1'}, 
 {cell: [21, 0], id: '2'}, 
 {cell: [42, 0], id: '3'}, 
 {cell: [63, 0], id: '4'}, 
 {cell: [84, 0], id: '5'}, 
 {cell: [105, 0], id: '6'}, 
 {cell: [126, 0], id: '7'}, 
 {cell: [147, 0], id: '8'}, 
 {cell: [168, 0], id: '9'}, 
 {cell: [189, 0], id: '10'},
 {cell: [210, 0], id: '11'}, 
 {cell: [231, 0], id: '12'}, 
 {cell: [252, 0], id: '13'}, 
 {cell: [273, 0], id: '14'}, 
 {cell: [294, 0], id: '15'}, 
 {cell: [315, 0], id: '16'}
 ]];

function LevelAnimation(layer){
	this.rolloverAnimation = null;
	this.bonFireAnimation = null;
	this.bonFireParentAnimationInterval = null;
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
	if(this.rolloverAnimation){
		this.rolloverAnimation.stop();
		this.rolloverAnimation = null;
	}
	var tileActive = board.tileActive;
	if(!tileActive.blob){
		return;
	}
	var imageId = tileActive.blob.image.id + '_rollover';
	var rolloverImageSpriteSheet = this[imageId];
	if(rolloverImageSpriteSheet){
		this.rolloverAnimation = new RolloverAnimation(layer, board, tileActive, rolloverImageSpriteSheet);
		this.rolloverAnimation.start();
	}
};

LevelAnimation.prototype.animateCreaturesSwap = function(layer, board, tile, tilePrev, callback){
	var startedAnimation = false;
	if(this.rolloverAnimation){
		this.rolloverAnimation.stop();
		this.rolloverAnimation = null;
	}
		var tileDown, tileUp, tileUpSelected, tileUpDegreesToRotate, tileDownDegreesToRotate;
		if(tilePrev.coordinates[1] > tile.coordinates[1]){
			tileDown = tilePrev;
			tileUp = tile;
			tileUpSelected = false;
			tileUpDegreesToRotate = CanvasUtil.UP_DIRECTION_DEGREE;
		}
		if(tilePrev.coordinates[1] < tile.coordinates[1]){
			tileDown = tile;
			tileUp = tilePrev;
			tileUpSelected = true;
			tileUpDegreesToRotate = CanvasUtil.UP_DIRECTION_DEGREE;
		}
		if(tilePrev.coordinates[0] > tile.coordinates[0]){
			tileDown = tilePrev;
			tileUp = tile;
			tileUpSelected = false;
			tileUpDegreesToRotate = CanvasUtil.LEFT_DIRECTION_DEGREE;
			tileDownDegreesToRotate = CanvasUtil.RIGHT_DIRECTION_DEGREE;
		}
		if(tilePrev.coordinates[0] < tile.coordinates[0]){
			tileDown = tile;
			tileUp = tilePrev;
			tileUpSelected = true;
			tileUpDegreesToRotate = CanvasUtil.LEFT_DIRECTION_DEGREE;
			tileDownDegreesToRotate = CanvasUtil.RIGHT_DIRECTION_DEGREE;
		}
		var imageId = tileDown.blob.image.id + '_jumps';
		var rolloverImageSpriteSheet = this[imageId];
		imageId = tileUp.blob.image.id + '_jumps';
		var rolloverImageSpriteSheet1 = this[imageId];
		var x = tileUp.getXCoord();
		var y = tileUp.getYCoord();
		if(rolloverImageSpriteSheet || rolloverImageSpriteSheet1){
			var width, height;
			var imageArray = [];
			var imageArray1 = [];
			var imgCnt = 0;
			for(imgCnt = 0;imgCnt < LevelAnimation.JUMP_SPRITE_MATRIX[0].length/2; imgCnt++){
				if(rolloverImageSpriteSheet){
					var image = rolloverImageSpriteSheet.getSpriteNew([imgCnt * 2, 0], tileDownDegreesToRotate);
					imageArray.push(image);
					width = image.width;
					height = image.height;
				}
				if(rolloverImageSpriteSheet1){
					var image = rolloverImageSpriteSheet1.getSpriteNew([imgCnt * 2, 0], tileUpDegreesToRotate);
					imageArray1.push(image);
					width = image.width;
					height = image.height;
				}	
			}
			imgCnt = 0;
			var interval = setInterval(function(){
				var image, image1;
				if(rolloverImageSpriteSheet){
					image = imageArray[imgCnt];
				}
				if(rolloverImageSpriteSheet1){
					image1 = imageArray1[imgCnt];
				}
				layer.clearRect(x, y, width, height);
				if(tileUpSelected){
					if(image){
						layer.drawImage(image, x, y);
					}
					if(image1){
						layer.drawImage(image1, x, y);
					}
				}
				else{
					if(image1){
						layer.drawImage(image1, x, y);
					}
					if(image){
						layer.drawImage(image, x, y);
					}	
				}
				imgCnt++;
				if(imgCnt == LevelAnimation.JUMP_SPRITE_MATRIX[0].length / 2){
					clearInterval(interval);
					//board.animateSwapCreaturesAsync( tile, tilePrev );
					callback();
				}
			}, LevelAnimation.JUMP_TIME_INTERVAL);
			startedAnimation = true;
		}
		if(!startedAnimation){
			callback();
		}
};

LevelAnimation.prototype.animateBonFire = function(completedLevelIds, highestCompletedId, layer){
	var levelAnimation = this;
	this.bonFireParentAnimationInterval = setInterval(function(){
		var coordinates = [];
		var bonfireImageSpriteSheet = new SpriteSheet(ScreenLoader.gal.get("map-screen/strip_bonfire.png"), LevelAnimation.BONFIRE_SPRITE_MATRIX); 
		var animatedLevels = [];
		var parallelAnimation = Math.ceil( Math.random() * completedLevelIds.length);
		for (var i = 0; i < parallelAnimation; i++) {
			var randomLevelId;
			do{
				randomLevelId = Math.ceil( Math.random() * highestCompletedId);
			}while(_.contains(animatedLevels, randomLevelId) || !_.contains(completedLevelIds, randomLevelId))
			animatedLevels.push(randomLevelId);
		};
		_.each(animatedLevels, function(animatedLevel){
			var level = Level.findById(animatedLevel);
			var centroid = LevelAnimation.getMapHotspotRegionCentroid(level.mapHotspotRegion);
			var x = centroid[0] - Math.ceil(LevelAnimation.BONFIRE_IMAGE_WIDTH / 3);
			var y = centroid[1] - Math.ceil(LevelAnimation.BONFIRE_IMAGE_HEIGHT / 1.4);
			coordinates.push([x, y]);
		});
		if(coordinates.length){
			if(levelAnimation.bonFireAnimation){
				levelAnimation.bonFireAnimation.stop();
			}
			var bonFireAnimation = new BonFireAnimation(coordinates, bonfireImageSpriteSheet, layer);		
			bonFireAnimation.start();
			levelAnimation.bonFireAnimation = bonFireAnimation;
		}
	}, LevelAnimation.BONFIRE_TIME_INTERVAL=2000);
}

LevelAnimation.prototype.stopAllAnimations = function(){
	if(this.rolloverAnimation){
		this.rolloverAnimation.stop();
		this.rolloverAnimation = null;
	}
	if(this.bonFireParentAnimationInterval){
		clearInterval(this.bonFireParentAnimationInterval);
	}
	if(this.bonFireAnimation){
		this.bonFireAnimation.stop();
		this.bonFireAnimation = null;
	}
}

LevelAnimation.getMapHotspotRegionCentroid = function(hotspotPointsArray){
	var minx =100000, miny=100000, maxx=0, maxy=0, x, y;
	_.each(hotspotPointsArray, function(hotspotPoint){
		minx = Math.min(minx, hotspotPoint[0]);
		maxx = Math.max(maxx, hotspotPoint[0]);
		miny = Math.min(miny, hotspotPoint[1]);
		maxy = Math.max(maxy, hotspotPoint[1]);
	});
	x = minx + Math.floor((maxx - minx) / 2);
	y = miny + Math.floor((maxy - miny) / 2);
	return [x,y];	
}

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

BonFireAnimation.ROLLOVER_TIME_INTERVAL=330;
function BonFireAnimation(coordinates, bonfireImageSpriteSheet, layer){
	this.bonfireImageSpriteSheet = bonfireImageSpriteSheet;
	this.interval = null;
	this.bonfireSpriteId = 0;
	this.coordinates = coordinates;
	this.layer = layer;
}

BonFireAnimation.prototype.start = function(){
	this.bonfireSpriteId = 0;
	var bonFireAnimation = this;
	this.interval = setInterval(function(){
		bonFireAnimation.animate()}, 
		BonFireAnimation.ROLLOVER_TIME_INTERVAL);
};

BonFireAnimation.prototype.stop = function(){
	clearInterval(this.interval);
	var bonFireAnimation = this;
	_.each(this.coordinates, function(coordinate){
		bonFireAnimation.layer.clearRect(coordinate[0], coordinate[1], LevelAnimation.BONFIRE_IMAGE_WIDTH,LevelAnimation.BONFIRE_IMAGE_HEIGHT);
	});
};

BonFireAnimation.prototype.animate = function(){
	var image = this.bonfireImageSpriteSheet.getSprite([this.bonfireSpriteId, 0]);
	var bonFireAnimation = this;
	_.each(this.coordinates, function(coordinate){
		bonFireAnimation.layer.putImageData(image, coordinate[0], coordinate[1]);
	});
	this.bonfireSpriteId++;
	this.bonfireSpriteId = this.bonfireSpriteId % LevelAnimation.BONFIRE_SPRITE_MATRIX[0].length;
};

