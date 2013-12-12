LevelAnimation.CREATURE_DROPPING_INTERVAL=300;
LevelAnimation.BONFIRE_TIME_INTERVAL=2000;
LevelAnimation.BONFIRE_IMAGE_WIDTH=21;
LevelAnimation.BONFIRE_IMAGE_HEIGHT=36;
LevelAnimation.BOMB_TIME_INTERVAL=3500;
LevelAnimation.JUMP_TIME_INTERVAL=10;
LevelAnimation.ROLLOVER_SUFFIX = '-rollover';
LevelAnimation.JUMP_SUFFIX = '-jump';
LevelAnimation.lightningImages = {rightHorizontal:[], leftHorizontal:[], bottomVertical:[], topVertical:[]};
LevelAnimation.bobCervantesAnimation = null;
LevelAnimation.BOMB_COUNT = 4;

//mf = magnificationFactor
LevelAnimation.ANIMATION_CONFIG = [
	{ id: "collage/map-lava-strip.png", frameInterval: "300", initLeft: "643", initTop: "0", mf: "2", isContinuous : "true" },
	{ id: "collage/map-bomb-left-one-strip.png", frameInterval: "200", initLeft: "550", initTop: "130", mf: "2", isContinuous : "false" },
	{ id: "collage/map-bomb-left-two-strip.png", frameInterval: "200", initLeft: "536", initTop: "80", mf: "2", isContinuous : "false" },
	{ id: "collage/map-bomb-mid-strip.png", frameInterval: "200", initLeft: "715", initTop: "162", mf: "2", isContinuous : "false" },
	{ id: "collage/map-bomb-right-strip.png", frameInterval: "200", initLeft: "754", initTop: "142", mf: "2", isContinuous : "false" },
	{ id: "screen-map/next-level-arrow-down.png", frameInterval: "330", initLeft: "", initTop: "", mf: "1", isContinuous : "true" },
	{ id: "screen-map/next-level-arrow-left-down.png", frameInterval: "330", initLeft: "", initTop: "", mf: "1", isContinuous : "true" },
	{ id: "screen-map/next-level-arrow-right-down.png", frameInterval: "330", initLeft: "", initTop: "", mf: "1", isContinuous : "true" },
	{ id: "screen-map/next-level-arrow-left-up.png", frameInterval: "330", initLeft: "", initTop: "", mf: "1", isContinuous : "true" },
	{ id: "screen-map/next-level-arrow-right-up.png", frameInterval: "330", initLeft: "", initTop: "", mf: "1", isContinuous : "true" },
	{ id: "screen-map/next-level-arrow-left.png", frameInterval: "330", initLeft: "", initTop: "", mf: "1", isContinuous : "true" },
	{ id: "screen-map/next-level-arrow-right.png", frameInterval: "330", initLeft: "", initTop: "", mf: "1", isContinuous : "true" },
	{ id: "screen-map/next-level-arrow-up.png", frameInterval: "330", initLeft: "", initTop: "", mf: "1", isContinuous : "true" },
	{ id: "collage/map-start-arrow-strip.png", frameInterval: "100", initLeft: "200", initTop: "265", mf: "1", isContinuous : "true" },
	{ id: "collage/powerup-gained-strip.png", frameInterval: "100", initLeft: "", initTop: "", mf: "1", isContinuous : "false" },
	{ id: "collage/powerup-activated-strip.png", frameInterval: "100", initLeft: "", initTop: "", mf: "1", isContinuous : "false" }
];

LevelAnimation.instance = null;
//LevelAnimation should never be instantiated
function LevelAnimation(){
	if (LevelAnimation.instance) {
        return LevelAnimation.instance;
    }
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
	this.blinkingImages = {};
	this.animationSprites = {};
	this.scoreTallyingAnimation = null;
	LevelAnimation.instance = this;	
}

LevelAnimation.getInstance = function(){
	if(!LevelAnimation.instance){
		new LevelAnimation();
	}
	return LevelAnimation.instance;
};

LevelAnimation.prototype.initBobCervantes = function(layer) {
	var headsBase, canvasBC, bcLeftHeadImageSprites, bcRightHeadImageSprites, bcMouthImageSprites, layerBobCervantes, imgLeftHeadEyes, imgRightHeadEyes, imgRightHeadMouth;
	headsBase = LoadingScreen.gal.get( Galapago.GAME_SCREEN_GAL_PREFIX + "heads-base.png" );
	canvasBC = $('#layer-bob-cervantes');
	canvasBC[0].width = headsBase.width * 2;
	canvasBC[0].height = headsBase.height * 2;
	canvasBC.css( 'background-image', 'url(' + headsBase.src + ')' );
	canvasBC.css( 'background-size', '100%' );
	layerBobCervantes = canvasBC[0].getContext('2d');
	//layer.drawImage(headsBase, 0, 0, headsBase.width, headsBase.height);
	bcLeftHeadImageSprites = ImageCollage.getSprites(Galapago.collageDirectory + "heads-left-eyes-strip.png");
	bcRightHeadImageSprites = ImageCollage.getSprites(Galapago.collageDirectory + "heads-right-eyes-strip.png");
	bcMouthImageSprites = ImageCollage.getSprites(Galapago.collageDirectory + "heads-mouth-strip.png");
	imgLeftHeadEyes = bcLeftHeadImageSprites[0];
	layerBobCervantes.drawImage(imgLeftHeadEyes, 33, 155, imgLeftHeadEyes.width * 1.1, imgLeftHeadEyes.height* 1.1);
	imgRightHeadEyes = bcRightHeadImageSprites[0];
	layerBobCervantes.drawImage(imgRightHeadEyes, 113, 125, imgRightHeadEyes.width* 1.1, imgRightHeadEyes.height* 1.1);		
	imgRightHeadMouth = bcMouthImageSprites[0];
	layerBobCervantes.drawImage(imgRightHeadMouth, 82, 140, imgRightHeadMouth.width* 2, imgRightHeadMouth.height* 2);
	if(LevelAnimation.bobCervantesAnimation){
		return;
	}
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

LevelAnimation.prototype.animateDropping = function(animationQ, deferred, cnt){
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
}; //LevelAnimation.prototype.animateDropping()

LevelAnimation.prototype.animateScore = function(x, y, text, isContinuous, displayScore, scoreElement){
	(new ScoreAnimation(x, y, text)).start(isContinuous);
	if(displayScore){
		//this.stopScoreTallyingAnimation();
		this.scoreTallyingAnimation = new ScoreTallyingAnimation(scoreElement, text);
		this.scoreTallyingAnimation.start();
	}
} //LevelAnimation.prototype.animateScore()

LevelAnimation.prototype.stopScoreTallyingAnimation = function(){
	if(this.scoreTallyingAnimation){
		this.scoreTallyingAnimation.stop();
	}
	this.scoreTallyingAnimation = null;
};

ScoreTallyingAnimation.SCORE_TALLYING_MAX_FRAMES = 50;
ScoreTallyingAnimation.SCORE_TALLYING_MIN_FRAMES = 10;
ScoreTallyingAnimation.SCORE_TALLYING_INTERVAL_MS = 30;
function ScoreTallyingAnimation(scoreElement, score){
	this.interval = null;
	this.currentScore = Number(scoreElement.html());
	this.updatedScore = this.currentScore + Number(score);
	this.scoreElement = scoreElement;
	this.offset = Number(score) / ScoreTallyingAnimation.SCORE_TALLYING_MAX_FRAMES;
}

ScoreTallyingAnimation.prototype.start = function(){
	var scoreTallyingAnimation = this;
	if((this.offset % 10) != 0){
		this.offset = this.offset + 10 - (this.offset % 10) ;
	}
	if(this.offset < ScoreTallyingAnimation.SCORE_TALLYING_MIN_FRAMES){
		this.offset = ScoreTallyingAnimation.SCORE_TALLYING_MIN_FRAMES;
	}
	this.interval = setInterval(function(){
		scoreTallyingAnimation.animate()
	}, ScoreTallyingAnimation.SCORE_TALLYING_INTERVAL_MS);
};

ScoreTallyingAnimation.prototype.stop = function(){
	clearInterval(this.interval);
	this.scoreElement.html(this.updatedScore);
};

ScoreTallyingAnimation.prototype.animate = function(){
	this.currentScore = this.currentScore + this.offset;
	if(this.currentScore >= this.updatedScore){
		this.stop();
	}else{
		this.scoreElement.html(this.currentScore);
	}
};

LevelAnimation.prototype.stopCreatureSelectionAnimation = function(){
	if(this.rolloverAnimation){
		this.rolloverAnimation.stop();
		this.rolloverAnimation = null;
	}
} //LevelAnimation.prototype.stopCreatureSelectionAnimation()

LevelAnimation.prototype.animateCreatureSelection = function(layer, board, markTile){
	var tileActive, imageId, rolloverImageSpriteSheet, tileMarkSprites;
	this.stopCreatureSelectionAnimation();
	tileActive = board.tileActive;
	if(!tileActive.blob){
		return;
	}
	imageId = tileActive.blob.image.id.replace('_1','') + LevelAnimation.ROLLOVER_SUFFIX;
	rolloverImageSpriteSheet = this[imageId];
	function stopCallback(){
		tileActive.drawComplete();
		if(board.tileSelected == tileActive){
			tileActive.setSelectedAsync().then( function() {
				return;
			}).done();
		}
	}
	if(rolloverImageSpriteSheet){
		if(markTile){ 
			tileMarkSprites	= LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'game-tile-mark-strip.png');
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
				layer.clearRect(x +3 , y +3, width -2, height -2);
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
				if((rolloverImageSpriteSheet && imgCnt >= rolloverImageSpriteSheet.length) || (rolloverImageSpriteSheet1 && imgCnt >= rolloverImageSpriteSheet1.length)){
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
}; //LevelAnimation.prototype.animateCreaturesSwap()

LevelAnimation.prototype.animateBonFire = function(parentElementSelector, completedLevelIds, highestCompletedId){
	var levelAnimation = this;
	if(levelAnimation.bonFireAnimation){
		levelAnimation.bonFireAnimation.stop();
	}
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
			var bonFireAnimation = new BonFireAnimation(parentElementSelector, coordinates, bonfireImageSpriteSheet);		
			bonFireAnimation.start();
			levelAnimation.bonFireAnimation = bonFireAnimation;
		}
	}
	animateRandomBornFires();
	this.bonFireParentAnimationInterval = setInterval(animateRandomBornFires, LevelAnimation.BONFIRE_TIME_INTERVAL);
}; //LevelAnimation.prototype.animateBonFire()

LevelAnimation.prototype.animateBombs2 = function(parentElement){
	var that = this;
	if(that.bombAnimation){
		that.bombAnimation.stop();
	}
	function animateBomb( callback ) {
		var randomBombId;
		randomBombId = Math.ceil( Math.random() * LevelAnimation.BOMB_COUNT );
		that.bombAnimation = new BombAnimation2(that, randomBombId, parentElement);
		that.bombAnimation.start(callback);
	} //function animateBomb()
	animateBomb(animateBomb);
}; //LevelAnimation.prototype.animateBombs()


LevelAnimation.prototype.animateSprites = function(parentElement, galAssetPath, initLeft, initTop, callback){
	var animationSprite, sprites, animationConfig, frameInterval, magnificationFactor, isContinuous;
	this.stopAnimateSprite(galAssetPath);
	animationConfig = _.find( LevelAnimation.ANIMATION_CONFIG, {'id' : galAssetPath} );
	if( animationConfig ) {
		sprites = LoadingScreen.gal.getSprites(galAssetPath);
		if( sprites ) {
			frameInterval = animationConfig.frameInterval;			
			initLeft = initLeft ? initLeft : animationConfig.initLeft;
			initTop = initTop ? initTop : animationConfig.initTop;
			magnificationFactor = animationConfig.mf;
			isContinuous = ( animationConfig.isContinuous === 'true' );
			animationSprite = new AnimationSprites(parentElement, galAssetPath, sprites, frameInterval, initLeft, initTop, magnificationFactor, callback);
			if( animationSprite ) {
				animationSprite.start(isContinuous);
			}
		}
		else {
			console.error( 'unable to load image ' + galAssetPath );
		}
	}
	else {
		console.error( 'unable to find animationConfig for ' + galAssetPath );
	}
	this.animationSprites[galAssetPath] = animationSprite;
	return;
}; //LevelAnimation.prototype.animateSprites()

LevelAnimation.prototype.stopAnimateSprite = function(galAssetPath){
	var animationSprite = this.animationSprites[galAssetPath];
	if(animationSprite){
		animationSprite.stop();
	}
	this.animationSprites[galAssetPath] = null;
}; //LevelAnimation.prototype.stopAnimateSprite()

LevelAnimation.prototype.animateBlink = function(parentElement, galAssetPath, initLeft, initTop, callback){
	var blinkingImage, image, animationConfig, frameInterval, magnificationFactor, isContinuous;
	this.stopBlinkingImage(galAssetPath);
	animationConfig = _.find( LevelAnimation.ANIMATION_CONFIG, {'id' : galAssetPath} );
	if( animationConfig ) {
		image = LoadingScreen.gal.get(galAssetPath);
		if( image ) {
			frameInterval = animationConfig.frameInterval;			
			initLeft = initLeft ? initLeft : animationConfig.initLeft;
			initTop = initTop ? initTop : animationConfig.initTop;
			magnificationFactor = animationConfig.mf;
			isContinuous = ( animationConfig.isContinuous === 'true' );
			blinkingImage = new BlinkingImage(parentElement, image, frameInterval, initLeft, initTop, magnificationFactor, callback);
			if( blinkingImage ) {
				blinkingImage.start(isContinuous);
			}
		}
		else {
			console.error( 'unable to load image ' + galAssetPath );
		}
	}
	else {
		console.error( 'unable to find animationConfig for ' + galAssetPath );
	}
	this.blinkingImages[galAssetPath] = blinkingImage;
	return;
}; //LevelAnimation.prototype.animateSprites()

LevelAnimation.prototype.stopBlinkingImage = function(galAssetPath){
	var blinkingImage = this.blinkingImages[galAssetPath];
	if(blinkingImage){
		blinkingImage.stop();
	}
	this.blinkingImages[galAssetPath] = null;
} //LevelAnimation.prototype.stopAnimateSprite()

LevelAnimation.prototype.animatePowerAchieved = function(parentElement ,coordinates){
	var levelAnimation, powerAchievedAnimation, sprites, spriteFrame;
	levelAnimation = this;
	sprites = LoadingScreen.gal.getSprites("collage/powerup-gained-strip.png"); 
	powerAchievedAnimation = new AnimationSprites(parentElement, null, sprites, 100, coordinates[0], coordinates[1], 1.5);
	if(!levelAnimation.powerAchievedAnimationList){
		levelAnimation.powerAchievedAnimationList = new Array();
	}
	levelAnimation.powerAchievedAnimationList.push(powerAchievedAnimation);
	powerAchievedAnimation.start(true);
	/*spriteFrame = new Image();
	spriteFrame.style.position = 'absolute';
	spriteFrame.style.display = 'block';
	$('#screen-game').append(spriteFrame);
	powerAchievedAnimation = new GameStartArrowAnimation(coordinates, powerAchievedImageSpriteSheet,spriteFrame,layer,animatePowerAchieved);
	function animatePowerAchieved(){
		powerAchievedAnimation.start();
		if(!levelAnimation.powerAchievedAnimation){
			levelAnimation.powerAchievedAnimation = new Array();
		}
		levelAnimation.powerAchievedAnimation.push(powerAchievedAnimation);
	}
	animatePowerAchieved();*/
	return  powerAchievedAnimation;
	
}

LevelAnimation.prototype.stopPowerAchieved = function(powerAchievedAnimation){
	if(this.powerAchievedAnimationList && powerAchievedAnimation){
		var index = this.powerAchievedAnimationList.indexOf(powerAchievedAnimation)
		this.powerAchievedAnimationList[index].stop();
		//this.powerAchievedAnimation[index] = null;
		this.powerAchievedAnimationList.splice( index, 1 );
	}
}

LevelAnimation.prototype.stopAllPowerAchieved = function(){
	if(this.powerAchievedAnimationList){
			for (var i=0; i < this.powerAchievedAnimationList.length; i++){
				this.powerAchievedAnimationList[i].stop();
			}
		this.powerAchievedAnimationList = new Array();
	}
}
////
LevelAnimation.prototype.animatePowerActivated = function(parentElement ,coordinates){
	var levelAnimation, sprites;
	levelAnimation = this;
	sprites = LoadingScreen.gal.getSprites("collage/powerup-activated-strip.png");
	levelAnimation.powerActivatedAnimation = new AnimationSprites(parentElement, null, sprites, 100, coordinates[0], coordinates[1], 1.5);
	levelAnimation.powerActivatedAnimation .start(true);
}

LevelAnimation.prototype.stopPowerActivated = function(){
	if(this.powerActivatedAnimation){
			this.powerActivatedAnimation.stop();
			this.powerActivatedAnimation=null;
	}
}

LevelAnimation.prototype.animateNextLevelArrows = function(parentElement, arrowsInfo){
	var that, animationImage, assetPath, initLeft, initTop;
	that = this;
	_.each( arrowsInfo, function( arrowInfo ) {
		assetPath = arrowInfo.assetPath;
		initLeft = arrowInfo.xCoord;
		initTop = arrowInfo.yCoord;
		that.animateBlink( parentElement, assetPath, initLeft, initTop );
	});
}; //LevelAnimation.prototype.animateNextLevelArrows()

LevelAnimation.prototype.animateMakeMatch = function(layer, initialTile, swapTile){
	var galAssetPath, rolloverImageSpriteSheet, sprite, spriteRotated, imgCnt, validArray = true, imageArray = [];
	galAssetPath = Galapago.collageDirectory + "game-hint-strip.png";
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
	var starsAnimation = new StarsAnimation(x, y, blobCollection.blobCollection[imageId].x - Board.GRID_LEFT, BlobCollection.COLLECTION_Y - Board.GRID_TOP , LoadingScreen.gal.getSprites( Galapago.collageDirectory + 'cocoon-removed-strip.png' ));
	starsAnimation.start();	
}

LevelAnimation.prototype.animateLightning = function(matchingTilesSet) {
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
		lightningAnimation = new LightningAnimation(y , horizontal);
	}else{
		lightningAnimation = new LightningAnimation(x , horizontal);
	}
	lightningAnimation.start();	
}

LevelAnimation.prototype.animateSparkles = function(x, y){
	var sparklesAnimation = new SparklesAnimation(x, y, LoadingScreen.gal.getSprites( Galapago.collageDirectory + 'sparkle-strip.png' ));
	sparklesAnimation.start();
};

LevelAnimation.prototype.animateBoardBuild = function(creatureLayer, board, callback){
	var boardBuildAnimation = new BoardBuildAnimation(creatureLayer, board, callback);
	boardBuildAnimation.start();
};

LevelAnimation.DANGER_BAR_SPRITE_INTERVAL = 1000;
LevelAnimation.prototype.animateDangerBar = function(parentElement, left, top) {
	var sprites;
	if(this.dangerBarAnimation){
		this.dangerBarAnimation.stop();
	}
	sprites = LoadingScreen.gal.getSprites("screen-game/danger-bar-fill-strip.png");
	this.dangerBarAnimation = new AnimationSprites(parentElement, null, sprites, LevelAnimation.DANGER_BAR_SPRITE_INTERVAL, left, top, 2);
	this.dangerBarAnimation.start(true);
};

LevelAnimation.prototype.animateDangerBarWarning = function(parentElement, left, top) {
	var sprites;
	if(this.dangerBarWarningAnimation){
		return;
	}
	sprites = LoadingScreen.gal.getSprites("screen-game/danger-bar-warning-strip.png");
	this.dangerBarWarningAnimation = new AnimationSprites(parentElement, null, sprites, LevelAnimation.DANGER_BAR_SPRITE_INTERVAL, left, top, 1);
	this.dangerBarWarningAnimation.start(true);
};

LevelAnimation.DANGER_BAR_MARK_TILE_INTERVAL = 150;
LevelAnimation.DANGER_BAR_EMPTIED_ANI_RUN_TIME = 3000;
LevelAnimation.prototype.animateDangerBarEmptied = function(parentElement, tiles, callback) {
	var sprites, dangerBarEmptiedAnimations, dangerBarEmptiedAnimation, left, top;
	dangerBarEmptiedAnimations = [];
	sprites = LoadingScreen.gal.getSprites("collage/game-tile-mark-strip.png");
	_.each(tiles, function(tile){
		left = Board.GRID_LEFT - 5 + tile.getXCoord();
		top = Board.GRID_TOP - 5 + tile.getYCoord();
		dangerBarEmptiedAnimation = new AnimationSprites(parentElement, null, sprites, LevelAnimation.DANGER_BAR_MARK_TILE_INTERVAL, left, top, 2);
		dangerBarEmptiedAnimations.push(dangerBarEmptiedAnimation);
		dangerBarEmptiedAnimation.start(true);
	});
	setTimeout(function(){
		_.each(dangerBarEmptiedAnimations, function(dangerBarEmptiedAnimation){
			dangerBarEmptiedAnimation.stop();
		})
		callback();
	},LevelAnimation.DANGER_BAR_EMPTIED_ANI_RUN_TIME);
};

LevelAnimation.prototype.stopDangerBarAnimations = function() {
	if(this.dangerBarAnimation){
		this.dangerBarAnimation.stop();
		this.dangerBarWarning = null;
	}
	if(this.dangerBarWarningAnimation){
		this.dangerBarWarningAnimation.stop();
		this.dangerBarWarningAnimation = null;
	}
}

LevelAnimation.prototype.stopAllAnimations = function(){
	for(key in this.animationSprites){
		if(this.animationSprites[key]){
			this.animationSprites[key].stop();
		}
	}
	for(key in this.blinkingImages){
		if(this.blinkingImages[key]){
			this.blinkingImages[key].stop();
		}
	}
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
	
	this.stopAllPowerAchieved();
	
	if(this.dangerBarAnimation){
		this.dangerBarAnimation.stop();
		this.dangerBarAnimation = null;
	}
	if(this.dangerBarWarningAnimation){
		this.dangerBarWarningAnimation.stop();
		this.dangerBarWarningAnimation = null;
	}
};

/*
LevelAnimation.prototype.findAnimationSpritesBySpriteSheetId = function(spriteSheetId){
	return _.find(this.animationSprites, function(animationSprites) {
		if( animationSprites.spriteSheetId === spriteSheetId ) {
			return animationSprites;
		}
	});
}; //LevelAnimation.findAnimationSpritesBySpriteSheetId()
*/

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

/* end class LevelAnimation */

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
function BonFireAnimation(parentElementSelector, coordinates, bonfireImageSprites){
	this.bonfireImageSprites = bonfireImageSprites;
	this.interval = null;
	this.bonfireSpriteId = 0;
	this.coordinates = coordinates;
	this.animatedDivs = [];
	this.parentElementSelector = parentElementSelector;
}

BonFireAnimation.prototype.start = function(){
	var animationDiv;
	this.bonfireSpriteId = 0;
	var bonFireAnimation = this;
	_.each(this.coordinates, function(coordinate){
		animationDiv = new AnimationDiv(LevelMap.LEFT + coordinate[0], coordinate[1], bonFireAnimation.bonfireImageSprites[0].width, bonFireAnimation.bonfireImageSprites[0].height, bonFireAnimation.parentElementSelector);
		bonFireAnimation.animatedDivs.push(animationDiv);
	});
	this.interval = setInterval(function(){
		bonFireAnimation.animate();}, 
		BonFireAnimation.ROLLOVER_TIME_INTERVAL);
};

BonFireAnimation.prototype.stop = function(){
	clearInterval(this.interval);
	var bonFireAnimation = this;
	_.each(this.animatedDivs, function(animatedDiv){
		animatedDiv.destroy();
	});
};

BonFireAnimation.prototype.animate = function(){
	var image = this.bonfireImageSprites[this.bonfireSpriteId];
	var bonFireAnimation = this;
	_.each(this.animatedDivs, function(animatedDiv){
		animatedDiv.addBackground(image);
	});
	this.bonfireSpriteId++;
	this.bonfireSpriteId = this.bonfireSpriteId % this.bonfireImageSprites.length;
};

//begin class BombAnimation2
function BombAnimation2(levelAnimation, bombId, parentElement){
	this.levelAnimation = levelAnimation;
	this.bombId = bombId;
	this.parentElement = parentElement;
	this.animationImage = null;
} //BombAnimation2 constructor

BombAnimation2.prototype.start = function(callback){
	switch( this.bombId ) {
		case 1:
			this.animationImage = this.levelAnimation.animateSprites(this.parentElement, Galapago.collageDirectory + 'map-bomb-left-one-strip.png', null, null, callback);
			break;
		case 2:
			this.animationImage = this.levelAnimation.animateSprites(this.parentElement, Galapago.collageDirectory + 'map-bomb-left-two-strip.png', null, null, callback);
			break;
		case 3:
			this.animationImage = this.levelAnimation.animateSprites(this.parentElement, Galapago.collageDirectory + 'map-bomb-mid-strip.png', null, null, callback);
			break;
		case 4:
			this.animationImage = this.levelAnimation.animateSprites(this.parentElement, Galapago.collageDirectory + 'map-bomb-right-strip.png', null, null, callback);
			break;
	}
}; //BombAnimation2.prototype.start()

BombAnimation2.prototype.stop = function(){
	if( this.interval ) {
		clearInterval( this.interval );
		this.animationImage.stop();
	}
}; //BombAnimation2.prototype.stop()
//end class BombAnimation2

GameStartArrowAnimation.ROLLOVER_TIME_INTERVAL=100;
function GameStartArrowAnimation(coordinates, sprites, spriteFrame, layer ,callback){
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
// end class GameStartArrowAnimation

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
	this.initialTile.drawComplete();
	this.swapTile.drawComplete();
	clearInterval(this.interval);
};

MakeMatchAnimation.prototype.animate = function(){
	this.initialTile.drawComplete();
	this.swapTile.drawComplete();
	var image = this.imageArray[this.rolloverSpriteId];
	this.layer.drawImage(image, this.x, this.y, image.naturalWidth * 2, image.naturalHeight * 2);
	this.rolloverSpriteId++;
	this.rolloverSpriteId = this.rolloverSpriteId % this.imageArray.length;
};

BoardBuildAnimation.ROLLOVER_TIME_INTERVAL=100;
BoardBuildAnimation.HEIGHT_OFFSET = 15;
function BoardBuildAnimation(layer, board, callback){
	this.layer = layer;
	this.board = board;
	this.tileMatrix = board.creatureTileMatrix;
	this.noOfRows = 1;
	this.width = Board.TILE_WIDTH;
	this.height = Board.TILE_HEIGHT;
	this.callback = callback;
}

BoardBuildAnimation.prototype.start = function(){
	var boardBuildAnimation = this;
	this.interval = setInterval(function(){
		//boardBuildAnimation.layer.canvas.height = LoadingScreen.STAGE_HEIGHT;
		boardBuildAnimation.animate()}, 
		BoardBuildAnimation.ROLLOVER_TIME_INTERVAL);
};

BoardBuildAnimation.prototype.animate = function(){
	var col, row, tile, rowsToDisplay, complete, x, y, tileToBeReplaced, point, goldTile;
	for(col = 0; col < this.tileMatrix.length; col++){
		if(this.noOfRows > this.tileMatrix[col].length){
			rowsToDisplay = this.tileMatrix[col].length;
		}else{
			rowsToDisplay = this.noOfRows;
		}
		for(row = 0; row < rowsToDisplay;row++){
			tile = this.tileMatrix[col][row];
			if(tile){
				y = LoadingScreen.STAGE_HEIGHT - BoardBuildAnimation.HEIGHT_OFFSET - (this.height * (this.noOfRows - row));
				if(y < tile.getYCoord()){
					complete = true;
					break;
				}
				x = tile.getXCoord();
				point = [];
				point[0] = tile.coordinates[0];
				point[1] = Tile.getRow(y + this.height);
				tileToBeReplaced = this.board.getCreatureTileFromPoint(point);
				if(!tileToBeReplaced){
					this.layer.clearRect( x, y +  this.height , this.width, this.height );	
				}
				else if( tileToBeReplaced && !tileToBeReplaced.isCollectionKeyCreature() ) {
					goldTile = this.board.getGoldTile(tileToBeReplaced);
					Tile.draw(x, y + this.height, goldTile, null, this.board, false);
				}

				point[1] = Tile.getRow(y);
				tileToBeReplaced = this.board.getCreatureTileFromPoint(point);
				goldTile = null;
				if(tileToBeReplaced){
					goldTile = this.board.getGoldTile(tileToBeReplaced);
				}
				if( !(tileToBeReplaced && tileToBeReplaced.isCollectionKeyCreature()) ) {
					if( tile.blob && !tile.isCollectionKeyCreature() ) {
						Tile.draw(x, y, goldTile, tile.blob.image, this.board, false);
					}else{
						Tile.draw(x, y, goldTile, null, this.board, false);
					}
				}
			}
		}
		if(complete){
			break;
		}
	}
	if(complete){
		//this.layer.canvas.height = Board.GRID_HEIGHT;
		//this.layer.clearRect( 0, 0, Board.GRID_WIDTH, Board.GRID_HEIGHT );
		for(col = 0; col < this.tileMatrix.length; col++){
			for(row = 0; row < this.tileMatrix[col].length; row++){
				tile = this.tileMatrix[col][row];
				if(tile && tile.blob){
					tile.drawComplete();
				}else if(tile){
					tile.drawComplete(false, true);
				}else{
					this.layer.clearRect( Tile.getXCoord(col), Tile.getYCoord(row) , this.width, this.height );	
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

ScoreAnimation.ROLLOVER_TIME_INTERVAL=200;
ScoreAnimation.MAX_FRAMES = 10;
function ScoreAnimation(x, y, text){
	this.div = null;
	this.interval = null;
	this.x = x;
	this.y = y;
	this.text = text;
	this.frameCount = 1;
}

ScoreAnimation.prototype.start = function(isContinuous){
	this.div = new AnimationDiv(this.x, this.y, 26, 26);
	var scoreAnimation = this;
	this.interval = setInterval(function() {
		scoreAnimation.animate(isContinuous);
	}, ScoreAnimation.ROLLOVER_TIME_INTERVAL);
};

ScoreAnimation.prototype.stop = function(){
	if(this.interval){
		this.div.destroy();
		clearInterval(this.interval);
	}
};

ScoreAnimation.prototype.animate = function(isContinuous){
	this.div.move(this.x + Board.GRID_LEFT, this.y + Board.GRID_TOP);
	this.div.addText(this.text);
	this.y = this.y - 40;
	this.frameCount++;
	if((!isContinuous && this.frameCount > ScoreAnimation.MAX_FRAMES) || (this.y + Board.GRID_TOP) < 0){
		this.stop();
	}
};

LightningAnimation.ROLLOVER_TIME_INTERVAL=100;
function LightningAnimation(coordinate, horizontal){
	this.coordinate = coordinate;
	this.horizontal = horizontal;
	this.spriteId = 0;
	this.div1 = null;
	this.div2 = null;
}

LightningAnimation.prototype.start = function(){
	if(this.interval){
		this.stop();
	}
	var imgWidth, imgHeight, xCoord, yCoord, lightningAnimation = this;
	imgWidth = 2 * LevelAnimation.lightningImages.rightHorizontal[0].naturalWidth;
	imgHeight = 2 * LevelAnimation.lightningImages.rightHorizontal[0].naturalHeight;
	if(this.horizontal){
		yCoord = Board.GRID_TOP + (this.coordinate + (Board.TILE_HEIGHT / 2)) - (imgHeight/2) ;
		xCoord = (Board.GRID_LEFT + (Board.GRID_WIDTH) / 2) - imgWidth;
		this.div1 = new AnimationDiv(xCoord, yCoord, imgWidth , imgHeight);
		this.div2 = new AnimationDiv(xCoord + imgWidth, yCoord, imgWidth, imgHeight);
	}else{
		xCoord = Board.GRID_LEFT + (this.coordinate + (Board.TILE_WIDTH / 2)) - (imgHeight/2) ;
		yCoord = (Board.GRID_TOP + (Board.GRID_HEIGHT) / 2) - imgWidth;
		this.div1 = new AnimationDiv(xCoord, yCoord, imgHeight, imgWidth);
		this.div2 = new AnimationDiv(xCoord, yCoord + imgWidth, imgHeight, imgWidth);
	}
	this.interval = setInterval(function() {
		lightningAnimation.animate();
	}, LightningAnimation.ROLLOVER_TIME_INTERVAL);
};

LightningAnimation.prototype.stop = function(){
	if(this.interval){
		this.div1.destroy();
		this.div2.destroy();
		clearInterval(this.interval);
	}
};

LightningAnimation.prototype.animate = function(){
	var image;
	if(this.horizontal){
		if(this.spriteId < LevelAnimation.lightningSprites.length){ 
			image = LevelAnimation.lightningImages.leftHorizontal[this.spriteId];
			if( image ) {
				this.div1.addBackground(image);
			}
			else {
				console.error( 'no left horizontal lightning image');
			}
			image = LevelAnimation.lightningImages.rightHorizontal[this.spriteId];
			if( image ) {
				this.div2.addBackground(image);
			}
			else {
				console.error( 'no right horizontal lightning image');
			}
			this.spriteId++;
		}else{
			this.stop();
		}
	}else{
		if(this.spriteId != LevelAnimation.lightningSprites.length){ 
			image = LevelAnimation.lightningImages.topVertical[this.spriteId];
			if( image ) {
				this.div1.addBackground(image);
			}
			else {
				console.error( 'no top vertical lightning image');
			}
			image = LevelAnimation.lightningImages.bottomVertical[this.spriteId];
			this.spriteId++;
			if( image ) {
				this.div2.addBackground(image);
			}
			else {
				console.error( 'no bottom vertical lightning image');
			}
		}else{
			this.stop();
		}
	}
};

function AnimationDiv(left, top, width, height, parentElementSelector){
	this.div = $('<div>');
	if(parentElementSelector){
		$(parentElementSelector).append(this.div);
	}else{
		$(document.body).append(this.div);
	}
	this.div.css('position', 'absolute');
	this.div.css('top', top + 'px');
	this.div.css('left', left + 'px');  
    this.div.css('width', width + 'px');
	this.div.css('height', height + 'px');
	this.div.css('z-index', '1000');
	this.div.css('background-size','100%'); 
	this.div.css('font-family', 'JungleFever');
	this.div.css('font-size', '26px');
	this.div.css('color', 'rgba(255,255,255, 100)');
}

AnimationDiv.prototype.move = function(left, top){
	this.div.css('top', top + 'px');
	this.div.css('left', left + 'px');  
}

AnimationDiv.prototype.addBackground = function(image){
	this.div.css('background-image', "url('"+image.src+"')");
}

AnimationDiv.prototype.addText = function(text){
	this.div.html(text);
}

AnimationDiv.prototype.destroy = function(){
	if( this.div ) {
		this.div.remove();
		this.div = null;
	}
} //AnimationDiv.prototype.destroy()

/*
	begin class AnimationSprites
	assumes an array of sprites of equal dimensions
*/
function AnimationSprites(parentElementSelector, spriteSheetId, sprites, frameInterval, initLeft, initTop, magnificationFactor, callback) {
	var spritesMagnified;
	this.parentElementSelector = parentElementSelector;
	this.spriteSheetId = spriteSheetId;
	this.sprites = sprites;
	this.frameInterval = frameInterval;
	this.initLeft = initLeft;
	this.initTop = initTop;
	this.spriteId = 0;
	if(magnificationFactor){
		this.magnificationFactor = magnificationFactor;
	}else{
		this.magnificationFactor = 1;
	}
	this.currentSprite = this.initSprite();
	this.callback = callback;
} //AnimationSprites constructor

AnimationSprites.prototype.initSprite = function() {
	var sprite;
	sprite = this.sprites[this.spriteId];
	this.currentSprite = new Image(); 
	this.currentSprite.src = sprite.src;
	this.currentSprite.width = sprite.naturalWidth * this.magnificationFactor;
	this.currentSprite.height = sprite.naturalHeight * this.magnificationFactor;
	this.currentSprite.style.position = 'absolute';
	this.currentSprite.style.left = this.initLeft + 'px';
	this.currentSprite.style.top = this.initTop + 'px';
	$(this.parentElementSelector).append(this.currentSprite);
	return this.currentSprite;
}; //AnimationSprites.prototype.initSprite()

AnimationSprites.prototype.destroy = function(){
	if(this.currentSprite){
		//this.currentSprite.remove();
		this.currentSprite.parentNode.removeChild(this.currentSprite);
	}
	this.currentSprite = null;
	return this;
}; //AnimationSprites.prototype.destroy

AnimationSprites.prototype.start = function(isContinuous){
	var that = this;
	if(that.interval){
		that.stop();
	}
	that.interval = setInterval(function() {
		that.animate(isContinuous);
	}, that.frameInterval);
	return this;
}; //AnimationSprites.prototype.start()

AnimationSprites.prototype.stop = function(){
	if(this.interval) {
		this.destroy();
		clearInterval(this.interval);
	}
	return this;
}; //AnimationSprites.prototype.stop()

AnimationSprites.prototype.animate = function(isContinuous){
	var nextSprite;
	nextSprite = this.sprites[this.spriteId];
	this.currentSprite.src = nextSprite.src;
	this.currentSprite.id = nextSprite.id;
	this.spriteId++;
	if(this.spriteId >= this.sprites.length){
		if( isContinuous ) {
			this.spriteId = 0; 	// cycle back to first frame to repeat animation
		}
		else {
			this.stop();
			if( this.callback ) {
				this.callback(this.callback);
			}
		}
	}
	return this;
}; //AnimationSprites.prototype.animate()

AnimationSprites.prototype.animateAndMove = function(moveInterval, moveLeft, moveTop){
	return this;
}; //AnimationSprites.prototype.animateAndMove()
// end class AnimationSprites


/* end class AnimationSprites */

function BlinkingImage(parentElement, image, frameInterval, initLeft, initTop, magnificationFactor, callback) {
	var imageMagnified;
	this.parentElement = parentElement;
	if( magnificationFactor ) {
		this.image = CanvasUtil.magnifyImage( image, magnificationFactor );
	}
	else {
		this.image = image;
	}
	this.frameInterval = frameInterval;
	this.initLeft = initLeft;
	this.initTop = initTop;
	this.image.style.position = 'absolute';
	this.image.style.display = 'block';
	this.image.style.left = this.initLeft + 'px';
	this.image.style.top = this.initTop + 'px';
	$(this.parentElement).append(this.image);
	this.callback = callback;
} //BlinkingImage constructor

BlinkingImage.prototype.destroy = function(url){
	if(this.image){
		this.image.parentNode.removeChild(this.image);
	}
	this.image = null;
	return this;
}; //BlinkingImage.prototype.destroy

//begin class BlinkingImage
BlinkingImage.prototype.start = function(isContinuous){
	var that = this;
	if(that.interval){
		that.stop();
	}
	that.interval = setInterval(function() {
		that.animate(isContinuous);
	}, that.frameInterval);
	return this;
}; //BlinkingImage.prototype.start()

BlinkingImage.prototype.stop = function(){
	if(this.interval) {
		this.destroy();
		clearInterval(this.interval);
	}
	return this;
}; //BlinkingImage.prototype.stop()

BlinkingImage.prototype.animate = function(isContinuous){
	var isDisplayed;
	isDisplayed = this.image.style.display === 'block';
	if( isDisplayed ) {
		this.image.style.display = 'none';
	}
	else {
		this.image.style.display = 'block';
	}
	return this;
}; //BlinkingImage.prototype.animate()
//end class BlinkingImage