LevelAnimation.CREATURE_DROPPING_INTERVAL=300;
LevelAnimation.BONFIRE_TIME_INTERVAL=2000;
LevelAnimation.BONFIRE_IMAGE_WIDTH=21;
LevelAnimation.BONFIRE_IMAGE_HEIGHT=36;
LevelAnimation.LIGHTNING_IMAGE_WIDTH=984;
LevelAnimation.LIGHTNING_IMAGE_HEIGHT=115;
LevelAnimation.BOMB_TIME_INTERVAL=3500;
LevelAnimation.JUMP_TIME_INTERVAL=10;
LevelAnimation.ROLLOVER_SUFFIX = '-rollover';
LevelAnimation.JUMP_SUFFIX = '-jump';
LevelAnimation.LEVEL_1_CENTER = [200, 265];
LevelAnimation.lightningImages = {rightHorizontal:[], leftHorizontal:[], bottomVertical:[], topVertical:[]};
LevelAnimation.bobCervantesAnimation = null;
	
function LevelAnimation(layer){
	this.collageDirectory = Galapago.collageDirectory;
	this.rolloverAnimation = null;
	this.bonFireAnimation = null;
	this.bonFireParentAnimationInterval = null;
	this.bombAnimation = null;
	this.bombParentAnimationInterval = null;
	this.gameStartArrowAnimation = null;
	this.nextLevelArrowAnimatios = null;
	this.makeMatchAnimation = null;
	this.sparklesAnimation = null;
	this.initLightning();
}

LevelAnimation.prototype.initBobCervantes = function(layer) {
	if(LevelAnimation.bobCervantesAnimation){
		return;
	}
	var headsBase, canvasBC, bcLeftHeadImageSprites, bcRightHeadImageSprites, bcMouthImageSprites, layerBobCervantes, imgLeftHeadEyes, imgRightHeadEyes, imgRightHeadMouth;
	headsBase = LoadingScreen.gal.get( Galapago.GAME_SCREEN_GAL_PREFIX + "heads-base.png" );
	headsBase = CanvasUtil.magnifyImage( headsBase, 2 );
	canvasBC = $('#layer-bob-cervantes');
	canvasBC[0].width = headsBase.width;
	canvasBC[0].height = headsBase.height;
	canvasBC.css( 'background-image', 'url(' + headsBase.src + ')' );
	layerBobCervantes = canvasBC[0].getContext('2d');
	//layer.drawImage(headsBase, 0, 0, headsBase.width, headsBase.height);
	bcLeftHeadImageSprites = ImageCollage.getSprites(this.collageDirectory + "heads-left-eyes-strip.png");
	bcRightHeadImageSprites = ImageCollage.getSprites(this.collageDirectory + "heads-right-eyes-strip.png");
	bcMouthImageSprites = ImageCollage.getSprites(this.collageDirectory + "heads-mouth-strip.png");
	imgLeftHeadEyes = bcLeftHeadImageSprites[0];
	layerBobCervantes.drawImage(imgLeftHeadEyes, 33, 155, imgLeftHeadEyes.width * 1.1, imgLeftHeadEyes.height* 1.1);
	imgRightHeadEyes = bcRightHeadImageSprites[0];
	layerBobCervantes.drawImage(imgRightHeadEyes, 113, 125, imgRightHeadEyes.width* 1.1, imgRightHeadEyes.height* 1.1);		
	imgRightHeadMouth = bcMouthImageSprites[0];
	layerBobCervantes.drawImage(imgRightHeadMouth, 82, 140, imgRightHeadMouth.width* 2, imgRightHeadMouth.height* 2);
	LevelAnimation.bobCervantesAnimation = new BobCervantesAnimation(layerBobCervantes, bcLeftHeadImageSprites, bcRightHeadImageSprites, bcMouthImageSprites);
}

LevelAnimation.prototype.animateBobCervantes = function(imageArray) {
	LevelAnimation.bobCervantesAnimation.start();
}

LevelAnimation.prototype.stopBobCervantes = function(imageArray) {
	LevelAnimation.bobCervantesAnimation.stop();
}

LevelAnimation.prototype.initImages = function(bgTheme, creatureTypes){
	var path, galPath, creatureTypeIt, image, creatureImagePaths, creatureType;
	path = "creatures/" + bgTheme + "/" ;
	for( creatureTypeIt = 0; creatureTypeIt < creatureTypes.length; creatureTypeIt++ ) {
		creatureType = creatureTypes[creatureTypeIt];
		
		galPath = path + creatureType + LevelAnimation.ROLLOVER_SUFFIX + '-strip' + Level.BLOB_IMAGE_EXTENSION;
		this[creatureType + LevelAnimation.ROLLOVER_SUFFIX] = ImageCollage.getSprites( galPath );
		
		galPath = path + creatureType + LevelAnimation.JUMP_SUFFIX + '-strip' + Level.BLOB_IMAGE_EXTENSION;
		this[creatureType + LevelAnimation.JUMP_SUFFIX] = ImageCollage.getSprites( galPath );
	}
	//console.debug('creatureImagePaths: ' + creatureImagePaths);
	return creatureImagePaths;
};

LevelAnimation.prototype.animateDroppingCreatures = function(animationQ){
	var deferred;
	deferred = Q.defer();
	if(animationQ.length){
		this.animateDropping(animationQ, deferred);
	}else{
		deferred.resolve();
	}
	return deferred.promise;
};

LevelAnimation.prototype.animateDropping= function(animationQ, deferred, cnt){
	var levelAnimation = this;
	if(cnt == animationQ.length){
		deferred.resolve();
	}else{
		if(!cnt){
			cnt = 0;
		} 
		Galapago.delay(LevelAnimation.CREATURE_DROPPING_INTERVAL).done(function(){
			var ele = animationQ[cnt];
			if(ele instanceof Array){
				_.each(ele,function(draw){
					draw();
				});
			}else{
				ele();
			}

			levelAnimation.animateDropping(animationQ, deferred, ++cnt);
		});
	}	
};

LevelAnimation.prototype.animateCreatureSelection = function(layer, board, markTile){
	var tileActive, imageId, rolloverImageSpriteSheet, tileMarkSprites;
	if(this.rolloverAnimation){
		this.rolloverAnimation.stop();
		this.rolloverAnimation = null;
	}
	tileActive = board.tileActive;
	if(!tileActive.blob){
		return;
	}
	imageId = tileActive.blob.image.id.replace('_1','') + LevelAnimation.ROLLOVER_SUFFIX;
	rolloverImageSpriteSheet = this[imageId];
	function stopCallback(){
		layer.clearRect(tileActive.getXCoord(), tileActive.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT);
		layer.drawImage(tileActive.blob.image, tileActive.getXCoord(),tileActive.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT);
		if(board.tileSelected == tileActive){
			tileActive.setSelectedAsync().then( function() {
				return;
			}).done();
		}
	}
	if(rolloverImageSpriteSheet){
		if(markTile){ 
			tileMarkSprites	= LoadingScreen.gal.getSprites(this.collageDirectory + 'game-tile-mark-strip.png');
		}
		this.rolloverAnimation = new RolloverAnimation(layer, tileActive, rolloverImageSpriteSheet, stopCallback, tileMarkSprites);
		this.rolloverAnimation.start();
	}
}; //LevelAnimation.prototype.animateCreatureSelection()

LevelAnimation.prototype.animateCreaturesSwap = function(layer, board, tile, tilePrev, callback){
	var startedAnimation = false;
	if(this.rolloverAnimation){
		this.rolloverAnimation.stop();
		this.rolloverAnimation = null;
	}
		var tileDown, tileUp, tileUpSelected, tileUpDegreesToRotate, tileDownDegreesToRotate, width, height;			
		if(tilePrev.coordinates[1] > tile.coordinates[1]){
			tileDown = tilePrev;
			tileUp = tile;
			tileUpSelected = false;
			tileUpDegreesToRotate = CanvasUtil.UP_DIRECTION_DEGREE;
			width=46; 
			height=92;
		}
		if(tilePrev.coordinates[1] < tile.coordinates[1]){
			tileDown = tile;
			tileUp = tilePrev;
			tileUpSelected = true;
			tileUpDegreesToRotate = CanvasUtil.UP_DIRECTION_DEGREE;
			width=46; 
			height=92;
		}
		if(tilePrev.coordinates[0] > tile.coordinates[0]){
			tileDown = tilePrev;
			tileUp = tile;
			tileUpSelected = false;
			tileUpDegreesToRotate = CanvasUtil.LEFT_DIRECTION_DEGREE;
			tileDownDegreesToRotate = CanvasUtil.RIGHT_DIRECTION_DEGREE;
			width=92; 
			height=46;
		}
		if(tilePrev.coordinates[0] < tile.coordinates[0]){
			tileDown = tile;
			tileUp = tilePrev;
			tileUpSelected = true;
			tileUpDegreesToRotate = CanvasUtil.LEFT_DIRECTION_DEGREE;
			tileDownDegreesToRotate = CanvasUtil.RIGHT_DIRECTION_DEGREE;
			width=92; 
			height=46;
		}
		var imageId = tileDown.blob.image.id.replace('_1','') + LevelAnimation.JUMP_SUFFIX;
		var rolloverImageSpriteSheet = this[imageId];
		imageId = tileUp.blob.image.id.replace('_1','') + LevelAnimation.JUMP_SUFFIX;
		var rolloverImageSpriteSheet1 = this[imageId];
		var x = tileUp.getXCoord();
		var y = tileUp.getYCoord();
		if(rolloverImageSpriteSheet || rolloverImageSpriteSheet1){
			var imageArray = [];
			var imageArray1 = [];
			var imgCnt = 0;
			var image;
			if(rolloverImageSpriteSheet){
				imageArray = CanvasUtil.rotateImages( rolloverImageSpriteSheet, tileDownDegreesToRotate );
				//image = rolloverImageSpriteSheet.getSpriteNew([imgCnt * 2, 0], tileDownDegreesToRotate);
				//imageArray.push(image);
			}
			if(rolloverImageSpriteSheet1){
				imageArray1 = CanvasUtil.rotateImages( rolloverImageSpriteSheet1, tileUpDegreesToRotate );
				//image = rolloverImageSpriteSheet1.getSpriteNew([imgCnt * 2, 0], tileUpDegreesToRotate);
				//imageArray1.push(image);
			}
			imgCnt = 0;
			var interval = setInterval(function(){
				var image1;
				if(rolloverImageSpriteSheet){
					image = imageArray[imgCnt];
				}
				if(rolloverImageSpriteSheet1){
					image1 = imageArray1[imgCnt];
				}
				layer.clearRect(x, y, width, height);
				if(tileUpSelected){
					if(image && image.naturalWidth){
						layer.drawImage(image, x, y);
					}
					if(image1 && image1.width){
						layer.drawImage(image1, x, y);
					}
				}
				else{
					if(image1 && image1.width){
						layer.drawImage(image1, x, y);
					}
					if(image && image.naturalWidth){
						layer.drawImage(image, x, y);
					}	
				}
				imgCnt++;
				if(imgCnt >= rolloverImageSpriteSheet.length){
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
	function animateRandomBornFires(){
		var coordinates = [];

		var bonfireImageSpriteSheet = LoadingScreen.gal.getSprites(MapScreen.GAL_PREFIX + 'bonfire-strip.png');
		var animatedLevels = [];
		var parallelAnimation = Math.ceil( Math.random() * completedLevelIds.length);
		for (var i = 0; i < parallelAnimation; i++) {
			var randomLevelId;
			do{
				randomLevelId = Math.ceil( Math.random() * highestCompletedId);
			}while(_.contains(animatedLevels, randomLevelId) || !_.contains(completedLevelIds, randomLevelId));
			animatedLevels.push(randomLevelId);
		}
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
	}
	animateRandomBornFires();
	this.bonFireParentAnimationInterval = setInterval(animateRandomBornFires, LevelAnimation.BONFIRE_TIME_INTERVAL);
}; //LevelAnimation.prototype.animateBonFire()

LevelAnimation.prototype.animateBombs = function(layer){
	var levelAnimation = this;
	function animateBomb(callback){
		var randomBombId = Math.ceil( Math.random() * 4);
		var coordinates, image, bombImageSpriteSheet;
		switch( randomBombId ) {
			case 1:
				bombImageSpriteSheet = LoadingScreen.gal.getSprites(MapScreen.GAL_PREFIX + 'bomb-left-one-strip.png');
				coordinates = [556, 305 - bombImageSpriteSheet[0].height];
				break;
			case 2:
				bombImageSpriteSheet = LoadingScreen.gal.getSprites(MapScreen.GAL_PREFIX + 'bomb-left-two-strip.png');
				coordinates = [546, 295 - bombImageSpriteSheet[0].height];
				break;
			case 3:
				bombImageSpriteSheet = LoadingScreen.gal.getSprites(MapScreen.GAL_PREFIX + 'bomb-mid-strip.png');
				coordinates = [715, 386 - bombImageSpriteSheet[0].height];
				break;
			case 4:
				bombImageSpriteSheet = LoadingScreen.gal.getSprites(MapScreen.GAL_PREFIX + 'bomb-right-strip.png');				
				coordinates = [744 , 295 - bombImageSpriteSheet[0].height];
				break;
		} //switch( randomBombId ) {
		if(levelAnimation.bombAnimation){
			levelAnimation.bombAnimation.stop();
		}
		var bombAnimation = new BombAnimation(coordinates, bombImageSpriteSheet,layer,callback);		
		bombAnimation.start();
		levelAnimation.bombAnimation = bombAnimation;
	} //function animateBomb(callback)()
	animateBomb(animateBomb);
}; //LevelAnimation.prototype.animateBombs()

LevelAnimation.prototype.animateGameStartArrow = function(layer){
	var levelAnimation = this;
	function animateGameStartArrow(){
		var coordinates, sprites, galAssetPath;
		galAssetPath = levelAnimation.collageDirectory + 'map-start-arrow-strip.png';
		sprites = LoadingScreen.gal.getSprites( galAssetPath );
		coordinates = LevelAnimation.LEVEL_1_CENTER;
		if(levelAnimation.gameStartArrowAnimation){
			levelAnimation.gameStartArrowAnimation.stop();
		}
		var gameStartArrowAnimation = new GameStartArrowAnimation( coordinates, sprites, layer, animateGameStartArrow );
		gameStartArrowAnimation.start();
		levelAnimation.gameStartArrowAnimation = gameStartArrowAnimation;
	}
	animateGameStartArrow();
};

LevelAnimation.prototype.stopGameStartArrow = function(){
	if(this.gameStartArrowAnimation){
		this.gameStartArrowAnimation.stop();
		this.gameStartArrowAnimation = null;
	}
};

/////
LevelAnimation.prototype.animatePowerAchieved = function(layer ,coordinates){
	var levelAnimation = this;
	var powerAchievedAnimation;
	var   powerAchievedImageSpriteSheet = LoadingScreen.gal.getSprites("collage/powerup-gained-strip.png"); 
	powerAchievedAnimation = new GameStartArrowAnimation(coordinates, powerAchievedImageSpriteSheet,layer,animatePowerAchieved);	
	function animatePowerAchieved(){
		powerAchievedAnimation.start();
		if(!levelAnimation.powerAchievedAnimation){
			levelAnimation.powerAchievedAnimation = new Array();
		}
		levelAnimation.powerAchievedAnimation.push(powerAchievedAnimation);
	}
	animatePowerAchieved();
	return  powerAchievedAnimation;
	
}

LevelAnimation.prototype.stopPowerAchieved = function(powerAchievedAnimation){
	if(this.powerAchievedAnimation){
			var index = this.powerAchievedAnimation.indexOf(powerAchievedAnimation)
			this.powerAchievedAnimation[index].stop();
			//this.powerAchievedAnimation[index] = null;
			this.powerAchievedAnimation.splice( index, 1 );
	}
}

LevelAnimation.prototype.stopAllPowerAchieved = function(){
	if(this.powerAchievedAnimation){
			for (var i=0; i < this.powerAchievedAnimation.length; i++){
				this.powerAchievedAnimation[i].stop();
			}
	}
}
////
LevelAnimation.prototype.animatePowerActivated = function(layer ,coordinates){
	var levelAnimation = this;
	var powerActivatedAnimation;
	var  powerActivatedImageSpriteSheet = LoadingScreen.gal.getSprites("collage/powerup-activated-strip.png");
	powerActivatedAnimation = new GameStartArrowAnimation(coordinates, powerActivatedImageSpriteSheet,layer,animatePowerActivated);	
	function animatePowerActivated(){
		powerActivatedAnimation.start();
		levelAnimation.powerActivatedAnimation = powerActivatedAnimation;
	}
	animatePowerActivated();
}

LevelAnimation.prototype.stopPowerActivated = function(){
	if(this.powerActivatedAnimation){
			this.powerActivatedAnimation.stop();
			this.powerActivatedAnimation=null;
	}
}

LevelAnimation.prototype.animateNextLevelArrows = function(layer, arrowInfo, arrowDirection){
	var nextLevelArrowAnimation = new NextLevelArrowAnimation(layer, arrowInfo);
	this.nextLevelArrowAnimation = nextLevelArrowAnimation;
	nextLevelArrowAnimation.start();
};

LevelAnimation.prototype.stopNextLevelArrows = function(){
	if(this.nextLevelArrowAnimation){
		this.nextLevelArrowAnimation.stop();
		this.nextLevelArrowAnimation = null;
	}
};

LevelAnimation.prototype.animateMakeMatch = function(layer, initialTile, swapTile){
	var galAssetPath, rolloverImageSpriteSheet, sprite, spriteRotated, imgCnt, validArray = true, imageArray = [];
	galAssetPath = this.collageDirectory + "game-hint-strip.png";
	var rolloverImageSpriteSheet = ImageCollage.getSprites( galAssetPath );
	if( !rolloverImageSpriteSheet ) {
		console.error( 'unable to load image ' + galAssetPath);
	}
	var tile,degreesToRotate;			
	if(initialTile.coordinates[1] > swapTile.coordinates[1]){
		tile = swapTile;
		degreesToRotate = CanvasUtil.LEFT_DIRECTION_DEGREE;
	}
	if(initialTile.coordinates[1] < swapTile.coordinates[1]){
		tile = initialTile;
		degreesToRotate = CanvasUtil.LEFT_DIRECTION_DEGREE;
	}
	if(initialTile.coordinates[0] > swapTile.coordinates[0]){
		tile = swapTile;
	}
	if(initialTile.coordinates[0] < swapTile.coordinates[0]){
		tile = initialTile;
	}
	if(degreesToRotate){
		if(!this.makeMatchVerticalSpritesArray){
			for(imgCnt = 0; imgCnt < rolloverImageSpriteSheet.length; imgCnt++){
				sprite = rolloverImageSpriteSheet[imgCnt];
				spriteRotated = CanvasUtil.rotateImage( sprite, degreesToRotate );
				if(!spriteRotated.naturalHeight){
					validArray = false;
				}
				imageArray.push(spriteRotated);
			}
			if(validArray){
				this.makeMatchVerticalSpritesArray = imageArray;
			}
		}else{
			imageArray = this.makeMatchVerticalSpritesArray;
		}	 
	}else{
		if(!this.makeMatchHorizontalSpritesArray){
			for(imgCnt = 0; imgCnt < rolloverImageSpriteSheet.length; imgCnt++){
				sprite = rolloverImageSpriteSheet[imgCnt];
				if(!sprite.naturalHeight){
					validArray = false;
				}
				imageArray.push(sprite);
			}
			if(validArray){
				this.makeMatchHorizontalSpritesArray = imageArray;
			}
		}else{
			imageArray = this.makeMatchHorizontalSpritesArray;
		}	 
	}
	var makeMatchAnimation = new MakeMatchAnimation(layer, initialTile, swapTile, imageArray, tile.getXCoord(), tile.getYCoord(), degreesToRotate);
	this.makeMatchAnimation = makeMatchAnimation;
	makeMatchAnimation.start();
}; //LevelAnimation.prototype.animateMakeMatch()


LevelAnimation.prototype.stopMakeMatchAnimation = function(){
	if(this.makeMatchAnimation){
		this.makeMatchAnimation.stop();
		this.makeMatchAnimation = null;
	}
};

LevelAnimation.prototype.initLightning = function() {
	var sprite, x;
	if(!LevelAnimation.lightningImages.rightHorizontal.length){
		LevelAnimation.lightningSprites = ImageCollage.getSprites('collage/game-lightning-strip.png');
		for(x = 0; x < LevelAnimation.lightningSprites.length; x++){
			sprite = LevelAnimation.lightningSprites[x];
			LevelAnimation.lightningImages.rightHorizontal.push(sprite);
			LevelAnimation.makeLightningFunction(sprite);
		}
	}
}

LevelAnimation.makeLightningFunction = function(sprite) {
		LevelAnimation.lightningImages.bottomVertical = LevelAnimation.lightningImages.bottomVertical.concat( CanvasUtil.rotateImages([sprite], 90) );
		LevelAnimation.lightningImages.leftHorizontal = LevelAnimation.lightningImages.leftHorizontal.concat( CanvasUtil.rotateImages([sprite], 180) );
		LevelAnimation.lightningImages.topVertical = LevelAnimation.lightningImages.topVertical.concat( CanvasUtil.rotateImages([sprite], 270) );
}

LevelAnimation.prototype.animateStars = function(x, y, imageId, blobCollection) {
	var starsAnimation = new StarsAnimation(x, y, blobCollection.blobCollection[imageId].x - Board.GRID_LEFT, BlobCollection.COLLECTION_Y - Board.GRID_TOP , LoadingScreen.gal.getSprites( this.collageDirectory + 'cocoon-removed-strip.png' ));
	starsAnimation.start();	
}

LevelAnimation.prototype.animateLightning = function(layer, matchingTilesSet) {
	var x, y, previousTile, lightningAnimation, horizontal = true;
	_.each(matchingTilesSet, function(tile){
		x = tile.getXCoord();
		y = tile.getYCoord();
		if(previousTile && previousTile.coordinates[0] == tile.coordinates[0]){
			horizontal = false;
		}
		previousTile = tile;
	});
	if(horizontal){
		lightningAnimation = new LightningAnimation(layer, y , horizontal);
	}else{
		lightningAnimation = new LightningAnimation(layer, x , horizontal);
	}
	lightningAnimation.start();	
}

LevelAnimation.prototype.animateSparkles = function(x, y){
	var sparklesAnimation = new SparklesAnimation(x, y, LoadingScreen.gal.getSprites( this.collageDirectory + 'sparkle-strip.png' ));
	sparklesAnimation.start();
};

LevelAnimation.prototype.animateBoardBuild = function(creatureLayer, animationLayer, tileMatrix, callback){
	var boardBuildAnimation = new BoardBuildAnimation(creatureLayer, animationLayer, tileMatrix, callback);
	boardBuildAnimation.start();
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
	if(this.bombParentAnimationInterval){
		clearInterval(this.bombParentAnimationInterval);
	}
	if(this.bombAnimation){
		this.bombAnimation.stop();
		this.bombAnimation = null;
	}
	if(this.gameStartArrowAnimation){
		this.gameStartArrowAnimation.stop();
		this.gameStartArrowAnimation = null;
	}

	if(this.nextLevelArrowAnimation){
		this.nextLevelArrowAnimation.stop();
		this.nextLevelArrowAnimation = null;
	}
	if(this.makeMatchAnimation){
		this.makeMatchAnimation.stop();
		this.makeMatchAnimation = null;
	}
	if(LevelAnimation.bobCervantesAnimation){
		LevelAnimation.bobCervantesAnimation.stop();
	}
	if(this.powerActivatedAnimation){
		this.powerActivatedAnimation.stop();
		this.powerActivatedAnimation = null;
	}
};

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
};

RolloverAnimation.ROLLOVER_TIME_INTERVAL=330;
function RolloverAnimation(layer, tileActive, rolloverImageSpriteSheet, stopCallback, tileMarkSprites){
	this.layer = layer;
	this.rolloverImageSpriteSheet = rolloverImageSpriteSheet;
	this.interval = null;
	this.rolloverSpriteId = 0;
	this.tileActive = tileActive;
	this.stopCallback = stopCallback;
	this.tileMarkSprites = tileMarkSprites;
	this.tileMarkSpriteId = 0;
}

RolloverAnimation.prototype.start = function(){
	this.rolloverSpriteId = 0;
	var rolloverAnimation = this;
	this.interval = setInterval(function() {
		rolloverAnimation.animate(rolloverAnimation);
	}, RolloverAnimation.ROLLOVER_TIME_INTERVAL);
};

RolloverAnimation.prototype.stop = function(){
	clearInterval(this.interval);
	this.stopCallback();
};

RolloverAnimation.prototype.animate = function(){
	var image;
	if( this.rolloverImageSpriteSheet ) {
		image = this.rolloverImageSpriteSheet[this.rolloverSpriteId];
		//image = this.rolloverImageSpriteSheet.getSprite([this.rolloverSpriteId, 0]);
		if( image ) {
			this.layer.drawImage(image, this.tileActive.getXCoord(), this.tileActive.getYCoord());
			//this.layer.putImageData(image, this.tileActive.getXCoord(), this.tileActive.getYCoord());
			this.rolloverSpriteId++;
			//this.rolloverSpriteId += 2; //jj: testing a skip of the even sprites for performance reasons
			this.rolloverSpriteId = this.rolloverSpriteId % this.rolloverImageSpriteSheet.length;
			if(this.tileMarkSprites){
				image = this.tileMarkSprites[this.tileMarkSpriteId];
				if( image ) {
					this.layer.drawImage(image, this.tileActive.getXCoord(), this.tileActive.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT);
					this.tileMarkSpriteId++;
					this.tileMarkSpriteId = this.tileMarkSpriteId % this.tileMarkSprites.length;				
				}
				else {
					console.error( 'unable to load tile mark animation' );
				}
			}
		}
		else {
			console.error( 'unable to load rollover sprite ' + this.rolloverSpriteId );
		}
	}
	else {
		console.error( 'unable to rollover image sprite sheet' );
	}
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
		bonFireAnimation.animate();}, 
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
	var image = this.bonfireImageSpriteSheet[this.bonfireSpriteId];
	var bonFireAnimation = this;
	_.each(this.coordinates, function(coordinate){
		bonFireAnimation.layer.drawImage(image, coordinate[0], coordinate[1]);
	});
	this.bonfireSpriteId++;
	this.bonfireSpriteId = this.bonfireSpriteId % this.bonfireImageSpriteSheet.length;
};

BombAnimation.ROLLOVER_TIME_INTERVAL=100;
function BombAnimation(coordinates, bombImageSpriteSheet, layer, callback){
	this.bombImageSpriteSheet = bombImageSpriteSheet;
	this.interval = null;
	this.bombSpriteId = 0;
	this.coordinates = coordinates;
	this.layer = layer;
	this.callback = callback;
}

BombAnimation.prototype.start = function(){
	this.bombSpriteId = 0;
	var bombAnimation = this;
	this.interval = setInterval(function(){
		bombAnimation.animate();}, 
		BombAnimation.ROLLOVER_TIME_INTERVAL);
};

BombAnimation.prototype.stop = function(){
	if(this.interval){
		clearInterval(this.interval);
		var bombAnimation = this;
		bombAnimation.layer.clearRect(this.coordinates[0], this.coordinates[1], this.imageWidth, this.imageHeight);
	}
};

BombAnimation.prototype.animate = function(){
	//var image = this.bombImageSpriteSheet.getSprite([this.bombSpriteId, 0]);
	var image = this.bombImageSpriteSheet[this.bombSpriteId];
	image = CanvasUtil.magnifyImage( image, 2 );
	this.imageHeight = image.naturalHeight;
	this.imageWidth = image.naturalWidth;
	this.layer.clearRect(this.coordinates[0], this.coordinates[1], this.imageWidth, this.imageHeight);
	this.layer.drawImage(image, this.coordinates[0], this.coordinates[1] , this.imageWidth, this.imageHeight);
	this.bombSpriteId++;
	if(this.bombSpriteId >= this.bombImageSpriteSheet.length-1){
		this.callback(this.callback);
	}
};

//

GameStartArrowAnimation.ROLLOVER_TIME_INTERVAL=100;
function GameStartArrowAnimation(coordinates, sprites, layer ,callback){
	//this.imageSpriteSheet = imageSpriteSheet;
	this.sprites = sprites;
	this.interval = null;
	this.spriteId = 0;
	this.coordinates = coordinates;
	this.layer = layer;
	this.callback = callback;
	this.imageWidth = 0;
	this.imageHeight = 0;
}

GameStartArrowAnimation.prototype.start = function(){
	var animation;
	animation = this;
	this.spriteId = 0;
	this.interval = setInterval(function(){
		animation.animate();},
		GameStartArrowAnimation.ROLLOVER_TIME_INTERVAL);
};

GameStartArrowAnimation.prototype.stop = function(){
	if(this.interval){
		clearInterval(this.interval);
		var animation = this;
		animation.layer.clearRect(this.coordinates[0], this.coordinates[1], this.imageWidth, this.imageHeight);
	}
};

GameStartArrowAnimation.prototype.animate = function(){
	var image;
	//image = this.imageSpriteSheet.getSprite([spriteId, 0]);
	image = this.sprites[this.spriteId];
	this.imageWidth = image.naturalWidth;
	this.imageHeight = image.naturalHeight;
	//this.layer.putImageData(image, this.coordinates[0], this.coordinates[1]);
	this.layer.clearRect(this.coordinates[0], this.coordinates[1], this.imageWidth, this.imageHeight);
	this.layer.drawImage( image, this.coordinates[0], this.coordinates[1]);
	this.spriteId++;
	if(this.spriteId >= this.sprites.length-1){
		this.spriteId=0;
	}
};

NextLevelArrowAnimation.ROLLOVER_TIME_INTERVAL=330;
function NextLevelArrowAnimation(layer, arrowsInfo){
	this.layer = layer;
	this.arrowsInfo = arrowsInfo;
	this.interval = null;
	this.rolloverSpriteId = 0;
}

NextLevelArrowAnimation.prototype.start = function(){
	this.rolloverSpriteId = 0;
	var rolloverAnimation = this;
	this.interval = setInterval(function(){
		rolloverAnimation.animate(rolloverAnimation);},
		RolloverAnimation.ROLLOVER_TIME_INTERVAL);
};

NextLevelArrowAnimation.prototype.stop = function(){
	clearInterval(this.interval);
	var nextLevelArrowAnimation = this;
	var arrowsInfo = nextLevelArrowAnimation.arrowsInfo;
	_.each(arrowsInfo, function(arrowInfo){
		nextLevelArrowAnimation.layer.clearRect(arrowInfo.xCoord, arrowInfo.yCoord, arrowInfo.image.naturalWidth, arrowInfo.image.naturalHeight);	
	});
};

NextLevelArrowAnimation.prototype.animate = function(){
	var nextLevelArrowAnimation = this;
	var arrowsInfo = nextLevelArrowAnimation.arrowsInfo;
	_.each(arrowsInfo, function(arrowInfo){
		if(nextLevelArrowAnimation.rolloverSpriteId == 1){
			nextLevelArrowAnimation.layer.clearRect(arrowInfo.xCoord, arrowInfo.yCoord, arrowInfo.image.naturalWidth, arrowInfo.image.naturalHeight);	
		}else{
			nextLevelArrowAnimation.layer.drawImage(arrowInfo.image, arrowInfo.xCoord, arrowInfo.yCoord);
		}
	});
	this.rolloverSpriteId++;
	this.rolloverSpriteId = this.rolloverSpriteId % 2;
};

MakeMatchAnimation.ROLLOVER_TIME_INTERVAL=100;
function MakeMatchAnimation(layer, initialTile, swapTile, imageArray, x, y, degreesToRotate){
	this.layer = layer;
	this.initialTile = initialTile;
	this.swapTile = swapTile;
	this.rolloverSpriteId = 0;
	this.imageArray = imageArray;
	this.x = x;
	this.y = y;
	this.degreesToRotate = degreesToRotate;
}

MakeMatchAnimation.prototype.start = function(){
	this.rolloverSpriteId = 0;
	var makeMatchAnimation = this;
	this.interval = setInterval(function(){
		makeMatchAnimation.animate();}, 
		MakeMatchAnimation.ROLLOVER_TIME_INTERVAL);
};

MakeMatchAnimation.prototype.stop = function(){
	this.layer.clearRect(this.initialTile.getXCoord(), this.initialTile.getYCoord(),Board.TILE_WIDTH, Board.TILE_HEIGHT);
	this.layer.drawImage(this.initialTile.blob.image, this.initialTile.getXCoord(),this.initialTile.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT);
	this.layer.clearRect(this.swapTile.getXCoord(), this.swapTile.getYCoord(),Board.TILE_WIDTH, Board.TILE_HEIGHT);
	this.layer.drawImage(this.swapTile.blob.image, this.swapTile.getXCoord(),this.swapTile.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT);
	clearInterval(this.interval);
};

MakeMatchAnimation.prototype.animate = function(){
	this.layer.clearRect(this.initialTile.getXCoord(), this.initialTile.getYCoord(),Board.TILE_WIDTH, Board.TILE_HEIGHT);
	this.layer.drawImage(this.initialTile.blob.image, this.initialTile.getXCoord(),this.initialTile.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT);
	this.layer.clearRect(this.swapTile.getXCoord(), this.swapTile.getYCoord(),Board.TILE_WIDTH, Board.TILE_HEIGHT);
	this.layer.drawImage(this.swapTile.blob.image, this.swapTile.getXCoord(),this.swapTile.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT);	
	var image = this.imageArray[this.rolloverSpriteId];
	this.layer.drawImage(image, this.x, this.y, image.naturalWidth * 2, image.naturalHeight * 2);
	this.rolloverSpriteId++;
	this.rolloverSpriteId = this.rolloverSpriteId % this.imageArray.length;
};

BoardBuildAnimation.ROLLOVER_TIME_INTERVAL=100;
BoardBuildAnimation.HEIGHT_OFFSET = 15;
function BoardBuildAnimation(creatureLayer, layer, tileMatrix, callback){
	this.creatureLayer = creatureLayer;
	this.layer = layer;
	this.tileMatrix = tileMatrix;
	this.noOfRows = 1;
	this.width = Board.TILE_WIDTH;
	this.height = Board.TILE_HEIGHT;
	this.callback = callback;
}

BoardBuildAnimation.prototype.start = function(){
	var boardBuildAnimation = this;
	this.interval = setInterval(function(){
		boardBuildAnimation.animate()}, 
		BoardBuildAnimation.ROLLOVER_TIME_INTERVAL);
};

BoardBuildAnimation.prototype.animate = function(){
	var col, row, tile, rowsToDisplay, complete;
	for(col = 0; col < this.tileMatrix.length; col++){
		if(this.noOfRows > this.tileMatrix[col].length){
			rowsToDisplay = this.tileMatrix[col].length;
		}else{
			rowsToDisplay = this.noOfRows;
		}
		for(row = 0; row < rowsToDisplay;row++){
			tile = this.tileMatrix[col][row];
			if(tile && tile.blob){
				y = LoadingScreen.STAGE_HEIGHT - BoardBuildAnimation.HEIGHT_OFFSET - (this.height * (this.noOfRows - row));
				if(y < tile.getYCoord()){
					complete = true;
					break;
				}
				this.layer.clearRect( tile.getXCoord(), y +  this.height , this.width, this.height );
				this.layer.drawImage(tile.blob.image, tile.getXCoord(), y, this.width, this.height);
			}
		}
		if(complete){
			break;
		}
	}
	if(complete){
		this.layer.clearRect( 0, 0, Board.GRID_WIDTH, Board.GRID_HEIGHT );
		for(col = 0; col < this.tileMatrix.length; col++){
			for(row = 0; row < this.tileMatrix[col].length; row++){
				tile = this.tileMatrix[col][row];
				if(tile && tile.blob){
					this.creatureLayer.drawImage(tile.blob.image, tile.getXCoord(), tile.getYCoord(), this.width, this.height);
				}
			}
		}
		clearInterval(this.interval);
		this.callback();
	}
	this.noOfRows++;
};

BobCervantesAnimation.ROLLOVER_TIME_INTERVAL=200;
function BobCervantesAnimation(layer, bcLeftHeadImageArray, bcRightHeadImageArray, bcMouthImageArray){
	this.layer = layer;
	this.interval = null;
	this.eyeRolloverSpriteId = 0;
	this.mouthRolloverSpriteId = 0;
	this.bcLeftHeadImageArray = bcLeftHeadImageArray;
	this.bcRightHeadImageArray = bcRightHeadImageArray;
	this.bcMouthImageArray= bcMouthImageArray;
}

BobCervantesAnimation.prototype.start = function(){
	if(this.interval){
		this.stop();
	}
	var bobCervantesAnimation = this;
	this.interval = setInterval(function() {
		bobCervantesAnimation.animate();
	}, BobCervantesAnimation.ROLLOVER_TIME_INTERVAL);
};

BobCervantesAnimation.prototype.stop = function(){
	if(this.interval){
		var image = this.bcLeftHeadImageArray[0];
		this.layer.clearRect(0, 0, this.layer.canvas.width, this.layer.canvas.height);
		this.layer.drawImage(image, 33, 155, image.naturalWidth * 1.1, image.naturalHeight * 1.1);
		image = this.bcRightHeadImageArray[0];
		this.layer.drawImage(image, 113, 125, image.naturalWidth * 1.1, image.naturalHeight * 1.1);
		image = this.bcMouthImageArray[0];
		this.layer.drawImage(image, 82, 140, image.naturalWidth * 2 , image.naturalHeight * 2);
		clearInterval(this.interval);
	}
};

BobCervantesAnimation.prototype.animate = function(){
	var image = this.bcLeftHeadImageArray[this.eyeRolloverSpriteId];
	this.layer.clearRect(0, 0, this.layer.canvas.width, this.layer.canvas.height);
	this.layer.drawImage(image, 33, 155, image.naturalWidth * 1.1, image.naturalHeight * 1.1);
	image = this.bcRightHeadImageArray[this.eyeRolloverSpriteId];
	this.layer.drawImage(image, 113, 125, image.naturalWidth * 1.1, image.naturalHeight * 1.1);
	image = this.bcMouthImageArray[this.mouthRolloverSpriteId];
	this.layer.drawImage(image, 82, 140, image.naturalWidth * 2 , image.naturalHeight * 2);
	this.eyeRolloverSpriteId++;
	this.eyeRolloverSpriteId = this.eyeRolloverSpriteId % this.bcRightHeadImageArray.length;
	this.mouthRolloverSpriteId++;
	this.mouthRolloverSpriteId = this.mouthRolloverSpriteId % this.bcMouthImageArray.length;
};

SparklesAnimation.ROLLOVER_TIME_INTERVAL=100;
function SparklesAnimation(x, y, sprites){
	this.div = null;
	this.interval = null;
	this.x = x;
	this.y = y;
	this.spriteId = 0;
	this.sprites = sprites;
}

SparklesAnimation.prototype.start = function(){
	if(this.interval){
		this.stop();
	}
	this.x = this.x + (Board.TILE_WIDTH);
	this.y = this.y + (Board.TILE_HEIGHT);
	this.x = this.x - (this.sprites[0].width);
	this.y = this.y - (this.sprites[0].height);
	this.div = new AnimationDiv(this.x + Board.GRID_LEFT, this.y + Board.GRID_TOP, this.sprites[0].width * 2, this.sprites[0].height*2);
	var sparklesAnimation = this;
	this.interval = setInterval(function() {
		sparklesAnimation.animate();
	}, SparklesAnimation.ROLLOVER_TIME_INTERVAL);
	
};

SparklesAnimation.prototype.stop = function(){
	if(this.interval){
		this.div.destroy();
		clearInterval(this.interval);
	}
};

SparklesAnimation.prototype.animate = function(){
	var image = this.sprites[this.spriteId];
	this.div.addBackground(image);
	this.spriteId++;
	if(this.spriteId == this.sprites.length){
		this.stop();
	}
};

StarsAnimation.ROLLOVER_TIME_INTERVAL=200;
function StarsAnimation(x, y, destinationX, destinationY, sprites){
	this.div = null;
	this.interval = null;
	this.x = x;
	this.y = y;
	this.verticalOffset = 0;
	this.horizontalOffset = 0;
	this.spriteId = 0;
	this.destinationX = destinationX;
	this.destinationY = destinationY;
	this.sprites = sprites;
}

StarsAnimation.prototype.start = function(){
	if(this.interval){
		this.stop();
	}
	
	this.horizontalOffset = (this.destinationX - this.x) / (this.sprites.length);
	this.verticalOffset = (this.destinationY - this.y) / (this.sprites.length - 1);
	this.div = new AnimationDiv(-1, -1, this.sprites[0].width * 2, this.sprites[0].height*2);
	var starsAnimation = this;
	this.interval = setInterval(function() {
		starsAnimation.animate();
	}, StarsAnimation.ROLLOVER_TIME_INTERVAL);
};

StarsAnimation.prototype.stop = function(){
	if(this.interval){
		this.div.destroy();
		clearInterval(this.interval);
	}
};

StarsAnimation.prototype.animate = function(){
	var image = this.sprites[this.spriteId];
	this.x = this.x + this.horizontalOffset;
	this.y = this.y + this.verticalOffset;
	this.div.move(this.x + Board.GRID_LEFT, this.y + Board.GRID_TOP);
	this.div.addBackground(image);
	this.spriteId++;
	if(this.spriteId == this.sprites.length){
		this.stop();
	}
};

LightningAnimation.ROLLOVER_TIME_INTERVAL=100;
function LightningAnimation(layer, coordinate, horizontal){
	this.layer = layer;
	this.coordinate = coordinate;
	this.horizontal = horizontal;
	this.rolloverSpriteId = 0;
}

LightningAnimation.prototype.start = function(){
	if(this.interval){
		this.stop();
	}
	var lightningAnimation = this;
	if(this.horizontal){
		this.coordinate = (this.coordinate + Board.TILE_HEIGHT / 2) - (LevelAnimation.LIGHTNING_IMAGE_HEIGHT/2) ;
		this.coordinate = Board.GRID_TOP - this.layer.canvas.offsetTop + this.coordinate;
	}else{
		this.coordinate = (this.coordinate + Board.TILE_WIDTH / 2) - (LevelAnimation.LIGHTNING_IMAGE_HEIGHT/2) ;
		this.coordinate =  Board.GRID_LEFT - this.layer.canvas.offsetLeft  + this.coordinate;
	}
	this.interval = setInterval(function() {
		lightningAnimation.animate();
	}, LightningAnimation.ROLLOVER_TIME_INTERVAL);
};

LightningAnimation.prototype.stop = function(){
	if(this.interval){
		clearInterval(this.interval);
	}
};

LightningAnimation.prototype.animate = function(){
	var image;
	if(this.horizontal){
		if(this.rolloverSpriteId < LevelAnimation.lightningSprites.length){ 
			image = LevelAnimation.lightningImages.leftHorizontal[this.rolloverSpriteId];
			if( image ) {
			this.layer.clearRect(0, this.coordinate, 4*image.naturalWidth, 2*image.naturalHeight);
			this.layer.drawImage(image, 0, this.coordinate, 2*image.naturalWidth, 2*image.naturalHeight);
			}
			else {
				console.error( 'no left horizontal lightning image');
			}
			image = LevelAnimation.lightningImages.rightHorizontal[this.rolloverSpriteId];
			this.rolloverSpriteId++;
			if( image ) {
				this.layer.drawImage(image, 2*image.naturalWidth , this.coordinate, 2*image.naturalWidth, 2*image.naturalHeight);
			}
			else {
				console.error( 'no right horizontal lightning image');
			}
		}else{
			this.rolloverSpriteId--;
			image = LevelAnimation.lightningImages.leftHorizontal[this.rolloverSpriteId];;
			if( image ) {
				this.layer.clearRect(0, this.coordinate, 4 * image.naturalWidth, 2*image.naturalHeight);
			}
			else {
				console.error( 'no left horizontal lightning image');
			}
			this.stop();
		}
	}else{
		if(this.rolloverSpriteId != LevelAnimation.lightningSprites.length){ 
			image = LevelAnimation.lightningImages.topVertical[this.rolloverSpriteId];
			if( image ) {
				this.layer.clearRect(this.coordinate, 0, 2 * image.naturalWidth, 4 * image.naturalHeight);
				this.layer.drawImage(image, this.coordinate, 0, 2 * image.naturalWidth, 2 * image.naturalHeight);
			}
			else {
				console.error( 'no top vertical lightning image');
			}
			image = LevelAnimation.lightningImages.bottomVertical[this.rolloverSpriteId];
			this.rolloverSpriteId++;
			if( image ) {
				this.layer.drawImage(image, this.coordinate, 2* image.naturalHeight, 2 * image.naturalWidth, 2 * image.naturalHeight);
			}
			else {
				console.error( 'no bottom vertical lightning image');
			}
		}else{
			this.rolloverSpriteId--;
			image = LevelAnimation.lightningImages.topVertical[this.rolloverSpriteId];;
			if( image ) {
				this.layer.clearRect(this.coordinate, 0, 2 * image.naturalWidth, 4 * image.naturalHeight);
			}
			else {
				console.error( 'no top vertical lightning image');
			}
			this.stop();
		}
	}
	
};

function AnimationDiv(left, top, width, height){
	this.div = $('<div>');
	$(document.body).append(this.div);
	this.div.css('position', 'absolute');
	this.div.css('top', top + 'px');
	this.div.css('left', left + 'px');  
    this.div.css('width', width + 'px');
	this.div.css('height', height + 'px');
	this.div.css('z-index', '1000');
	this.div.css('background-size','100%'); 
}

AnimationDiv.prototype.move = function(left, top){
	this.div.css('top', top + 'px');
	this.div.css('left', left + 'px');  
}

AnimationDiv.prototype.addBackground = function(image){
	this.div.css('background-image', "url('"+image.src+"')");
}

AnimationDiv.prototype.destroy = function(url){
	this.div.remove();
}
