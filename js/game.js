/* begin class Galapago */
Galapago.MODE_TIMED = "MODE_TIMED";
Galapago.MODE_RELAXED = "MODE_RELAXED";
Galapago.ACTIVE_TILE_LOGIC_LEVELS = [1, 2, 14, 15, 16, 17, 18, 19];
Galapago.CONFIG_FILE_PATH = 'js/levels.json';
Galapago.CONFIG_FILE_PATH_YA = 'js/levels-ya.json';
Galapago.NUM_LEVELS = 70;
Galapago.GAME_SCREEN_GAL_PREFIX = 'screen-game/';
Galapago.IMAGE_PATH_SUFFIX = '.png';
Galapago.LAYER_MAP = '#screen-map #layer-map';
Galapago.creatureImages = {};
Galapago.gameImageNames = [
	'tile-active',
	'tile-regular',
	'tile-selected',
	'item-collected-mark',
	'bracket-left',
	'bracket-right',
	'button-regular',
	'button-cursor'
];

Galapago.RESOURCE_BUNDLE_BOARD_COMMON = 'board-common';

/* ym: this class shouldn't be instantiated */
function Galapago() {
} //function Galapago()

Galapago.setLevelsFromJson = function (levelsJson) {
	var level;
	_.each( levelsJson.levels, function(levelJson) {
		level = Level.findById(levelJson.id);
		level.levelConfig = levelJson;
		level.name = levelJson.name;
		level.difficulty = levelJson.difficulty;
		level.creatureColors = levelJson.creatureColors;
		level.setBgTheme(levelJson.bgTheme);
		level.bgSubTheme = levelJson.bgSubTheme;
		level.unlocksLevels = levelJson.unlocksLevels;
		level.mapHotspotRegion = levelJson.mapHotspotRegion;
		if( levelJson.neighbors ) {
			if( levelJson.neighbors.north ) {
				level.neighbors.north = Level.findById(levelJson.neighbors.north);
			}
			if( levelJson.neighbors.east ) {
				level.neighbors.east = Level.findById(levelJson.neighbors.east);
			}
			if( levelJson.neighbors.south ) {
				level.neighbors.south = Level.findById(levelJson.neighbors.south);
			}
			if( levelJson.neighbors.west ) {
				level.neighbors.west = Level.findById(levelJson.neighbors.west);
			}
		}
	});
}; //Galapago.setLevelsFromJson()

Galapago.init = function(isTimedMode, onDialogOpenedCallBack) {
	var levelTemp, level, levelIt, timedMode, gameTipsSelection, gameTipsSelectionEle;
	Galapago.collageDirectory = LoadingScreen.gal.manifest.collageDirectory;
	// switch to the second version of this line to enable audio by default
	Galapago.audioPlayer = new AudioPlayer(QueryString.isAudioEnabled === 'true' ? true : false);
	//Galapago.audioPlayer = new AudioPlayer(QueryString.isAudioEnabled === 'false' ? false : true);
	Galapago.mapScreen =new MapScreen();
	Galapago.isTimedMode = isTimedMode;
	Galapago.profile = 'profile';
	Galapago.levels = [];
	timedMode = isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	gameTipsSelection = store.getItem( timedMode + Galapago.profile + "gameTipsSelection" );
	gameTipsSelectionEle = $('#gameTipsSelection')[0];
	if(gameTipsSelection){
		gameTipsSelectionEle.innerHTML = gameTipsSelection;
	}
	console.log( 'Galapago.isTimedMode: ' + Galapago.isTimedMode );
	console.log( 'Galapago.audioPlayer.isEnabled: ' + Galapago.audioPlayer.isEnabled );
	for( levelIt = 0; levelIt < Galapago.NUM_LEVELS; levelIt++ ){
		levelTemp = new Level(levelIt + 1);
		Galapago.levels.push(levelTemp);
	}
	var configFilePath = QueryString.levels === 'ya' ? Galapago.CONFIG_FILE_PATH_YA : Galapago.CONFIG_FILE_PATH;
	console.debug( 'configFilePath: ' + configFilePath );
	Galapago.loadJsonAsync(configFilePath).then(function (data) {
		Galapago.setLevelsFromJson(data);
		level = LevelMap.getNextLevel();
		Galapago.levelMap = new LevelMap(level, onDialogOpenedCallBack);
	}, function (status) {
		console.log('failed to load JSON level config with status ' + status);
	})/*.then(function() {
	})*/.done();
	//level 1 is always unlocked
	Level.findById(1).isUnlocked = true;
}; //Galapago.init()

Galapago.buildGameImagePaths = function() {
	var gameImagePaths;
	gameImagePaths = [];
	_.each( Galapago.gameImageNames, function(imageName) {
		if( imageName.startsWith( 'button-' ) ) {
			gameImagePaths.push(MapScreen.GAL_PREFIX + imageName + Galapago.IMAGE_PATH_SUFFIX);
		}
		else {
		gameImagePaths.push(Galapago.GAME_SCREEN_GAL_PREFIX + imageName + Galapago.IMAGE_PATH_SUFFIX);
		}
	});
	return gameImagePaths;
}; //Galapago.buildGameImagePaths()

Galapago.loadJsonAsync = function(jsonFilePath) {
	var deferred;
	deferred = Q.defer();

	$.ajax({
		type: 'GET',
		url: jsonFilePath,
		dataType: 'json',
		timeout: 3000, //3 second timeout
		success: function(data) {
			deferred.resolve(data);
		},
		error: function(xhr, type) {
			deferred.reject(type);
		}
	});

	return deferred.promise;
	//Galapago.levels = Galapago.levelsFromJson(Level.LEVELS_JSON);
}; //Galapago.loadJsonAsync

Galapago.setLevel = function(levelId, onDialogOpenedCallBack) {
	var theme, subTheme, backgroundBundle, themeBundle, resourceLoadingDialog;
	console.debug( 'entering Galapago.setLevel()' );
	resourceLoadingDialog = new DialogResourceLoading('#screen-game');
	this.level = Level.findById(levelId);
	this.level.levelCompleted = false;
	console.log( 'level id: ' + this.level.id );
	theme = this.level.bgTheme;
	subTheme = this.level.bgSubTheme;
	backgroundBundle = theme + '-' + subTheme;
	themeBundle = theme + '-common';
	console.log( 'backgroundBundle: ' + backgroundBundle );

	LoadingScreen.gal.onLoaded( backgroundBundle, function(result) {
			if (result.success) {
				LoadingScreen.gal.clearOnLoaded( backgroundBundle );
				console.debug( backgroundBundle + ' resource bundle loaded' );
				//LoadingScreen.gal.download(Galapago.RESOURCE_BUNDLE_BOARD_COMMON);
				Galapago.level.levelAnimation = new LevelAnimation();
				Galapago.level.bubbleTip = new BubbleTip(Galapago.level.levelAnimation);
				Galapago.level.display(onDialogOpenedCallBack);
				resourceLoadingDialog.onResourceLoad();
			}
		});

	LoadingScreen.gal.download(backgroundBundle);
	console.debug( 'exiting Galapago.setLevel()' );
};


Galapago.printLevelConfigs = function (levelConfigs) {
	_.each( levelConfigs, function(levelConfig) {
		console.debug( levelConfig.toString() );
	});
};

Galapago.delay = function(delayMs) {
	var deferred;
	deferred = Q.defer();
	
	//this.creatureLayer.draw();
	Q.delay(delayMs).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
};

Galapago.eraseProfile = function(profile) {
	var keyIt;
	var keyList = new  Array();
	var storeKeys = store.getKeys();
	for (var i = 0; i < storeKeys.length; i++) {
		keyIt = storeKeys[i];
		if(keyIt.indexOf(profile)>0){ // reset all the local storage of current Profile only.
			//store.removeItem(keyIt);
			keyList.push(keyIt);
		}
	}
	for (var i = 0; i < keyList.length; i++) {
		store.removeItem(keyList[i]);
	}
};
/* end class Galapago */

LevelMap.LEFT = 150;
LevelMap.WIDTH = 1018;
LevelMap.HEIGHT = 640;
LevelMap.STAR_WIDTH = 36;
LevelMap.MAX_DIFFICULTY = 5;

/* begin class LevelMap */
function LevelMap(level, onDialogOpenedCallBack) {
	this.hotspotLevel = level;
	this.screenDiv = $('#screen-map');
	this.canvas = $(Galapago.LAYER_MAP)[0];
	this.canvas.width = LevelMap.WIDTH;
	this.canvas.height = LevelMap.HEIGHT;
	this.layer = this.canvas.getContext('2d');

	/*
	this.animationCanvas = $('#' + 'layer-map-animation')[0];
	this.otherAnimationCanvas = $('#' + 'layer-map-other-animation')[0];
	this.otherAnimationLayer = this.otherAnimationCanvas.getContext('2d');
	*/
	this.hotspotPointsArray = [];
	this.images = [];
	this.levelCounter = 0;
	//this.setImages(LoadingScreen.mapScreenImageNames);
	this.levelAnimation = new LevelAnimation();
	this.display(onDialogOpenedCallBack);
	this.profile = 'Default';
} //LevelMap constructor

LevelMap.prototype.startAnimations = function() {
	this.animateStartArrowIfNeeded();
	this.drawBlinkingArrows(LevelMap.getHighestLevelCompleted());
	this.levelAnimation.animateSprites(this.screenDiv.selector, Galapago.collageDirectory + 'map-lava-strip.png');
	var completedLevelIds = LevelMap.getLevelsCompleted();
	if (completedLevelIds.length) {
		this.levelAnimation.animateBonFire(this.screenDiv.selector, completedLevelIds, LevelMap.getHighestLevelCompleted().id);
	}
	this.levelAnimation.animateBombs2(this.screenDiv.selector);
};

LevelMap.prototype.display = function(onDialogOpenedCallBack) {
	var that = this;
	that.screenDiv.css('display', 'none');
	that.startAnimations();
	that.drawHotspots();
	LoadingScreen.gal.onLoaded('bg-map-screen', function(result) {
		if (result.success) {
			var galAssetPath, backgroundImage;
			galAssetPath = 'background/map.jpg';
			backgroundImage = LoadingScreen.gal.get( galAssetPath );
			if (backgroundImage) {
				that.screenDiv.css( 'background-image', 'url(' + backgroundImage.src + ')' );
			}
			else {
				console.error( 'unable to load image ' + galAssetPath );
			}

			that.levelMapOnScreenCache = new OnScreenCache(
				[
					LoadingScreen.gal.get('background/map.jpg'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-lava-strip.png') ,
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-bomb-left-one-strip.png'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-bomb-left-two-strip.png'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-bomb-mid-strip.png'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-bomb-right-strip.png'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-start-arrow-strip.png'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'powerup-gained-strip.png'),
					LoadingScreen.gal.getSprites('screen-map/bonfire-strip.png'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-board-buttons.png'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-board-2.png'),
					LoadingScreen.gal.getSprites(Galapago.collageDirectory + 'map-board-1.png')
				],
				function () {
					that.registerEventHandlers();
					that.buildImageMap();

					Galapago.audioPlayer.playVolcanoLoop();

					if (typeof onDialogOpenedCallBack !== 'undefined') {
						onDialogOpenedCallBack();
					}

					that.screenDiv.show();
					that.canvas.focus();
				},
				MapScreen.IMAGE_CACHE_DISPLAY_TIMEOUT
			);
		}
	});
	LoadingScreen.gal.download('bg-map-screen');
}; //LevelMap.prototype.display()

LevelMap.prototype.animateStartArrowIfNeeded = function(){
	if( !Level.isComplete("1") ) {
		this.levelAnimation.animateSprites(this.screenDiv.selector, Galapago.collageDirectory + 'map-start-arrow-strip.png');
	}
}	

LevelMap.prototype.stopStartArrowAnimation = function(){
	this.levelAnimation.stopAnimateSprite(Galapago.collageDirectory + 'map-start-arrow-strip.png');
}

LevelMap.prototype.drawHotspots = function(){
	var levelMap = this;
	_.each(Galapago.levels, function(level){
		if(Level.isComplete(level.id)){
			levelMap.drawHotspot(level.mapHotspotRegion);
			levelMap.drawHotspot(level.mapHotspotRegion, true);
		}
	});
	this.setHotspotLevel(this.hotspotLevel);
};

LevelMap.prototype.drawBlinkingArrows = function(level){
	var levelMap = this;
	var levelId, levelInfo, arrow;
	var nextLevelArrowsInfo = [];
	if(level){
		var unlocksLevelsArrows = level.levelConfig.unlocksLevelsArrows;
		_.each(unlocksLevelsArrows, function(unlockLevelArrow){
			for(levelId in unlockLevelArrow){
				if(!Level.isComplete(levelId)){
					levelInfo = unlockLevelArrow[levelId];
					for(arrow in levelInfo){						
						var assetPath = MapScreen.GAL_PREFIX + 'next-level-arrow-' + arrow + '.png';
						//var img = LoadingScreen.gal.get(MapScreen.GAL_PREFIX + 'next-level-arrow-' + arrow + '.png');
						var coordinates = levelInfo[arrow];
						var x = coordinates[0];
						var y = coordinates[1];
						nextLevelArrowsInfo.push({"assetPath":assetPath,"xCoord":x,"yCoord":y});
						//nextLevelArrowsInfo.push({"image":img,"xCoord":x,"yCoord":y});
					}
				}
			}
		});
	}
	if(nextLevelArrowsInfo.length){
		levelMap.levelAnimation.animateNextLevelArrows(this.screenDiv.selector, nextLevelArrowsInfo);
		//levelMap.levelAnimation.animateNextLevelArrows(levelMap.layer, nextLevelArrowsInfo);
	}
}; //LevelMap.prototype.drawBlinkingArrows()

LevelMap.prototype.updateLevelStatus = function() {
	var text, levelScore, level_stars_silver, level_stars_gold, green_v, level_lock, levelDifficulty;
	level_stars_silver = LoadingScreen.gal.get( MapScreen.GAL_PREFIX + 'level-stars-silver.png');
	level_stars_gold = LoadingScreen.gal.get( MapScreen.GAL_PREFIX + 'level-stars-gold.png');
	green_v = LoadingScreen.gal.get( MapScreen.GAL_PREFIX + 'green-v.png');
	level_lock = LoadingScreen.gal.get( MapScreen.GAL_PREFIX + 'level-lock.png');
	text = i18n.t('levels.'+this.hotspotLevel.id)+ ' ' + this.hotspotLevel.id;
	levelDifficulty = this.hotspotLevel.difficulty;
	$('#map-difficulty-level-gray').css( 'backgroundImage', 'url(' + level_stars_silver.src + ')' );
	$('#map-difficulty-level-gold').css( 'backgroundImage', 'url(' + level_stars_gold.src + ')' );
	$('#map-difficulty-level-gold').css( 'width', LevelMap.STAR_WIDTH * levelDifficulty + 'px' );
	$('#map-level-name').html(text);

	var mode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	levelScore = store.getItem( mode + Galapago.profile + "level" + this.hotspotLevel.id + ".highScore");
	if(levelScore){
		$('#map-level-score-label').html('Score:');
		$('#map-level-score').html(levelScore);
	}
	this.hotspotLevel.isCompleted = Level.isComplete(this.hotspotLevel.id);
	if( this.hotspotLevel.isCompleted ) {
		$('#map-level-complete-indicator')[0].src = green_v.src;
		$('#map-level-complete-indicator')[0].style.visibility = 'visible';
	}
	else if( this.hotspotLevel.isUnlocked ) {
		//$('#map-level-complete-indicator')[0].src = '';
		$('#map-level-complete-indicator')[0].style.visibility = 'hidden';
	}
	else {
		$('#map-level-complete-indicator')[0].src = level_lock.src;
		$('#map-level-complete-indicator')[0].style.visibility = 'visible';
	}
	return this; //chainable
}; //LevelMap.prototype.updateLevelStatus()

LevelMap.prototype.registerEventHandlers = function() {
	var levelMap, x, y, point, mapHotspotRegion, levelIt, level;
	levelMap = this;
	$(Galapago.LAYER_MAP).off( 'mousemove');
	$(Galapago.LAYER_MAP).on( 'mousemove', function(e) {
		x = e.pageX - levelMap.canvas.offsetLeft;
		y = e.pageY - levelMap.canvas.offsetTop;
		point = new Array(2);
		point[0] = x;
		point[1] = y;

		for( levelIt = 0; levelIt < Galapago.levels.length; levelIt++ ) {
			level = Galapago.levels[levelIt];
			mapHotspotRegion = level.mapHotspotRegion;
			if( LevelMap.isPointInPoly(point, mapHotspotRegion) ) {
				if(level.isUnlocked && levelMap.hotspotLevel != level){
					levelMap.setHotspotLevel(level);
				}
				break;
			}
			else {
				//console.debug(MatrixUtil.coordinatesToString(point) + ' is not in mapHotspotRegion for level ' + level.name);
				//levelMap.layer.clearRect( 0, 0, LoadingScreen.STAGE_WIDTH, Galapago.STAGE_HEIGHT);
			}
		}
		e.preventDefault();
		e.stopPropagation();
	}); //onmousemove

	$(Galapago.LAYER_MAP).off('click');
	$(Galapago.LAYER_MAP).on('click', function(evt) {
		levelMap.handleSelect(evt);
		evt.preventDefault();
		evt.stopPropagation();
	}); //onclick
	$(Galapago.LAYER_MAP).off('keydown');
	$(Galapago.LAYER_MAP).on('keydown', function(evt) {
		console.debug('key pressed ' + evt.keyCode);
		Galapago.audioPlayer.playClick();
		switch( evt.keyCode ) {
			case 13: // enter
				levelMap.handleKeyboardSelect();
				evt.stopPropagation();
				break;
			case 37: // left arrow
				levelMap.handleLeftArrow();
				evt.preventDefault();
				evt.stopPropagation();
				break;
			case 38: // up arrow
				levelMap.handleUpArrow();
				evt.preventDefault();
				evt.stopPropagation();
				break;
			case 39: // right arrow
				levelMap.handleRightArrow();
				evt.preventDefault();
				evt.stopPropagation();
				break;
			case 40: // down arrow
				levelMap.handleDownArrow();
				evt.preventDefault();
				evt.stopPropagation();
				break;
			case 8: // back/backspace key
				evt.stopPropagation();
				evt.preventDefault();
				Galapago.mapScreen.toMainMenuScreen(levelMap);
				break;
			case 50: // numeric 2
				Galapago.audioPlayer.disable();
				console.debug( 'Galapago.audioPlayer.isEnabled: ' + Galapago.audioPlayer.isEnabled );
				break;
			case 51: // numeric 3
				Galapago.audioPlayer.enable();
				console.debug( 'Galapago.audioPlayer.isEnabled: ' + Galapago.audioPlayer.isEnabled );
				break;
			default:
		}
	});
}; //LevelMap.prototype.registerEventHandlers

LevelMap.prototype.quit = function() {
	this.cleanup();
	sdkApi.exit();
	return this; //chainable
};

// erase per-level high scores and completed indicators and set hotspot to level 1
LevelMap.prototype.reset = function() {
	store.clear();
	console.debug('reset map');
	return this; //chainable
}; //LevelMap.prototype.reset

LevelMap.prototype.handleSelect = function(evt) {
	var x, y, point, levelIt, level;
	x = evt.pageX - this.canvas.offsetLeft;
	y = evt.pageY - this.canvas.offsetTop;
	point = new Array(2);
	point[0] = x;
	point[1] = y;

	for( levelIt = 0; levelIt < Galapago.levels.length; levelIt++ ) {
		level = Galapago.levels[levelIt];
		if( LevelMap.isPointInPoly(point, level.mapHotspotRegion) ) {
			//levelMap.drawHotspot(mapHotspotRegion);
			
			if( QueryString.cheat || level.isUnlocked ) {
				this.setHotspotLevel(level);
				this.handleKeyboardSelect();
			}
			break;
		}
		else {
			//console.debug(MatrixUtil.coordinatesToString(point) + " didn't click anywhere special ");
		}
	}
}; //LevelMap.prototype.handleSelect()

LevelMap.prototype.handleKeyboardSelect = function() {
	if( QueryString.cheat || this.hotspotLevel.isUnlocked ) {
		var that = this;
		Galapago.setLevel(this.hotspotLevel.id, function() {
			if(that !== null) {
				that.cleanup();
				that = null;
			}
		});
	}
	else {
		console.debug( 'level ' + this.hotspotLevel.id + ' is locked');
	}
}; //LevelMap.prototype.handleKeyboardSelect()

LevelMap.prototype.cleanup = function() {
	this.levelMapOnScreenCache.destroy();
	// TODO: IGOR: LevelMap: added cleanup
	this.screenDiv.css('background-image','');
	this.canvas.width = this.canvas.height = 1;
	LoadingScreen.gal.unload('bg-map-screen');
	this.screenDiv.hide();
	this.cleanupAnimationAndSound()
}; //LevelMap.prototype.cleanup()

LevelMap.prototype.cleanupAnimationAndSound = function() {
	clearInterval(this.handle) ;
	Galapago.audioPlayer.stopLoop();
	this.levelAnimation.stopAllAnimations();
}; //LevelMap.prototype.cleanupAnimationAndSound()

LevelMap.prototype.handleUpArrow = function() {
	if(this.hotspotLevel.neighbors.north && (QueryString.cheat || this.hotspotLevel.neighbors.north.isUnlocked)) {
		this.setHotspotLevel(this.hotspotLevel.neighbors.north);
	}
}; //LevelMap.prototype.handleUpArrow()

LevelMap.prototype.handleRightArrow = function() {
	if(this.hotspotLevel.neighbors.east && (QueryString.cheat || this.hotspotLevel.neighbors.east.isUnlocked)) {
		this.setHotspotLevel(this.hotspotLevel.neighbors.east);
	}
}; //LevelMap.prototype.handleRightArrow()

LevelMap.prototype.handleDownArrow = function() {
	var mapScreen, mapNav, level;
	level = this.hotspotLevel.neighbors.south;
	if( level && level.mapHotspotRegion.length > 2 ) {
		if(this.hotspotLevel.neighbors.south && (QueryString.cheat || this.hotspotLevel.neighbors.south.isUnlocked)) {
			this.setHotspotLevel(level);
		}
	}
	else {
		this.stopStartArrowAnimation();
		this.drawHotspot(this.hotspotLevel.mapHotspotRegion, true);
		$('ul#map-nav').focus();
		mapScreen = Galapago.mapScreen ;
		mapScreen.registerEventHandlers();
		mapNav = $('#map-nav');
		mapScreen.setNavItem(mapNav.children('li:nth-child(1)'));
	}
}; //LevelMap.prototype.handleDownArrow()

LevelMap.prototype.handleLeftArrow = function() {
	if(this.hotspotLevel.neighbors.west && (QueryString.cheat || this.hotspotLevel.neighbors.west.isUnlocked)){
		this.setHotspotLevel(this.hotspotLevel.neighbors.west);
	}
}; //LevelMap.prototype.handleLeftArrow()

LevelMap.prototype.setHotspotLevel = function(level) {
	if( level && level.mapHotspotRegion.length > 2 ) {
		if(this.hotspotLevel){
			this.drawHotspot(this.hotspotLevel.mapHotspotRegion, true);
		}
		this.hotspotLevel = level;
		console.debug("hotspot on level " + this.hotspotLevel.id);
		//this.layer.clearRect( 0, 0, LoadingScreen.STAGE_WIDTH, Galapago.STAGE_HEIGHT);
		console.debug(MatrixUtil.pointsArrayToString(this.hotspotLevel.mapHotspotRegion));
		this.drawHotspot(this.hotspotLevel.mapHotspotRegion);
		this.updateLevelStatus();
	}
}; //LevelMap.prototype.setHotspotLevel()

LevelMap.prototype.drawHotspot = function(hotspotPointsArray, dim) {
	var x, y, layer, pointIt;
	layer = this.layer;
	if(dim){
		layer.globalCompositeOperation = 'destination-out';
		layer.lineWidth = 3;
		layer.beginPath();
		layer.moveTo(hotspotPointsArray[0][0], hotspotPointsArray[0][1]);
		for( pointIt = 1 ; pointIt < hotspotPointsArray.length ; pointIt++ ){
			x = hotspotPointsArray[pointIt][0];
			y = hotspotPointsArray[pointIt][1];
			layer.lineTo( x, y );
			//this.debugDisplayMapCoordinates(x, y);
		}	
		layer.closePath();
		layer.stroke();
		layer.fill();
	}else{
		layer.lineWidth = 5;
		layer.globalCompositeOperation = 'source-over';
		layer.strokeStyle = 'yellow';
		layer.beginPath();
		layer.moveTo(hotspotPointsArray[0][0], hotspotPointsArray[0][1]);
		for( pointIt = 1 ; pointIt < hotspotPointsArray.length ; pointIt++ ){
		x = hotspotPointsArray[pointIt][0];
		y = hotspotPointsArray[pointIt][1];
		layer.lineTo( x, y );
		//this.debugDisplayMapCoordinates(x, y);
		}
		layer.closePath();
		layer.stroke();
	}
}; //LevelMap.prototype.drawHotspot

LevelMap.prototype.debugDisplayMapCoordinates = function(x, y) {
	this.layer.font = '10px Arial';
	this.layer.fillStyle = 'red';
	this.layer.fillText( x + ',' + y, x, y );
}; //LevelMap.prototype.debugDisplayMapCoordinates

LevelMap.show = function(level, onDialogOpenedCallBack){
	Galapago.levelMap = new LevelMap(level, onDialogOpenedCallBack);
	Galapago.levelMap.canvas.focus();
	Galapago.levelMap.registerEventHandlers();
}; //LevelMap.show()

//+ adapted from Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
LevelMap.isPointInPoly = function (pt, poly) {
	for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
		((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1])) &&
		(pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) &&
		(c = !c);
	}
	return c;
}; //LevelMap.isPointInPoly()

LevelMap.mapCellsFromJson = function (mapCellsJson) {
	var mapCells, mapCell, levelIt;
	mapCells = [];
	levelIt = 1;

	_.each( mapCellsJson.mapCells, function(mapCellJson) {
		mapCell = new MapCell(mapCellJson.level, mapCellJson.north, mapCellJson.east, mapCellJson.south, mapCellJson.west);
		mapCells.push(mapCell);
		levelIt++;
	});

	return mapCells;
}; //LevelMap.mapCellsFromJson()

LevelMap.getHighestLevelCompleted = function() {
	var highestLevelCompletedId, keyIt, levelId, matchResult;
	var timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	highestLevelCompletedId = 0;
	var storeKeys = store.getKeys();
	for (var i = 0; i < storeKeys.length; i++) {
		keyIt = storeKeys[i];
		if( matchResult = keyIt.match("^"+timedMode + Galapago.profile+"level(\\d+)\\.completed$") ) {
			levelId = matchResult[1];
			_.each(Level.findById(levelId).unlocksLevels, function( unlockedLevelId ) {
				Level.findById(unlockedLevelId).isUnlocked = true;
			});
			if( parseInt(levelId,10) > highestLevelCompletedId) {
				highestLevelCompletedId = levelId;
			}
	}
	}

	console.debug('highest level completed = ' + highestLevelCompletedId);
	return Level.findById(highestLevelCompletedId);
}; //LevelMap.getHighestLevelCompleted()

LevelMap.getLevelsCompleted = function() {
	var levelsCompleted = [], keyIt, levelId, matchResult;
	var timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	var storeKeys = store.getKeys();
	for (var i = 0; i < storeKeys.length; i++) {
		keyIt = storeKeys[i];
		if( matchResult = keyIt.match("^"+timedMode + Galapago.profile+"level(\\d+)\\.completed$") ) {
			levelId = matchResult[1];
			levelsCompleted.push(parseInt(levelId,10));
	}
	}
	return levelsCompleted;
}; //LevelMap.getHighestLevelCompleted()

// we want to know the level unlocked by the highest level completed;
// when the highest level completed unlocks multiple levels return the minimum of those levels
LevelMap.getNextLevel = function() {
	var highestLevelCompleted, nextLevel, unlockedLevelIds, unlockedLevels, nextLevelId;
	unlockedLevels = [];
	highestLevelCompleted = LevelMap.getHighestLevelCompleted();
	if( typeof highestLevelCompleted === 'undefined' || highestLevelCompleted.id === Galapago.NUM_LEVELS ) {
		nextLevel = Level.findById(1);
	}
	else {
		unlockedLevelIds = highestLevelCompleted.unlocksLevels;
		unlockedLevelIds = _.filter(unlockedLevelIds, function(levelId){
			return !Level.isComplete(levelId);
		});
		if( unlockedLevelIds.length === 0 ) {
			unlockedLevelIds.push(highestLevelCompleted);
		}
		console.debug('unlocked level ids for highest level completed = ' + unlockedLevelIds);
		_.each( unlockedLevelIds, function( id ) {
			unlockedLevels.push( Level.findById(id) );
		});
		nextLevel = _.min(unlockedLevels, function(level) {
			return level.difficulty;
		});
		console.debug('nextLevelId = ' + nextLevel.id);
	}
	return nextLevel;
}; //LevelMap.getNextLevel()

LevelMap.reset = function() {
	Galapago.eraseProfile(Galapago.profile);
}; //LevelMap.reset()

LevelMap.prototype.buildImageMap = function() {
	var that = this;

	var map = document.createElement('map');
	map.id = 'hotspot-imagemap';
	map.name = 'hotspots';
	var areaParts = [];

	for( var levelIt = 0; levelIt < Galapago.levels.length; levelIt++ ) {
		var coordinatesParts = [],
			level = Galapago.levels[levelIt],
			region = level.mapHotspotRegion;

		for(var coordinateIndex = 0; coordinateIndex < region.length; coordinateIndex++) {
			coordinatesParts.push(region[coordinateIndex][0]);
			coordinatesParts.push(region[coordinateIndex][1]);
		}

		areaParts.push('<area id="levelhotspot-' + levelIt + '" coords="' + coordinatesParts.join(",") + '" shape="poly">')
	}
	map.innerHTML = areaParts.join('');

	var img = document.createElement('img');
	img.id = 'hotspot-proxy-image';
	img.setAttribute('style', 'position: fixed; top: 0; left: 150px; width: 1018px; height: 640px; opacity: 0;z-index = -999');
	img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
	img.useMap = "#hotspots";

	map.addEventListener('mouseover', function(e) {
		that.changeHotspot( e, false );
	}, false);

	map.addEventListener('click', function(e) {
		that.changeHotspot( e, true );
	}, false);

	this.screenDiv.append(map);
	this.screenDiv.append(img);
	map.focus();
}; //LevelMap.prototype.buildImageMap()

LevelMap.prototype.changeHotspot = function(e, isSelect) {
	var id, parts, levelNumber, level;
	if(e && e.target && e.target.id) {
		id = e.target.id;
		parts = id.split("-");

		if(parts[0] === 'levelhotspot') {
			levelNumber = parseInt(parts[1]);
			level = Galapago.levels[levelNumber];
			if( level.isUnlocked || QueryString.cheat ){
				this.setHotspotLevel(level);
				if( isSelect ) {
					this.handleKeyboardSelect();
				}
			}
		}
	}
	e.preventDefault();
	e.stopPropagation();
} //LevelMap.prototype.changeHotspot()

/* end class LevelMap */

/* begin class MapCell */
function MapCell(levelId, northId, eastId, southId, westId) {
	this.level = Level.findById(levelId);
	this.north = Level.findById(northId);
	this.east = Level.findById(eastId);
	this.south = Level.findById(southId);
	this.west = Level.findById(westId);
} //MapCell constructor

MapCell.prototype.toString = function() {
	return this.level + '|' + this.north + ',' + this.east + ',' + this.south + ',' + this.west;
};
/* end class MapCell */

/* begin class Level */
Level.BLOB_IMAGE_EXTENSION = '.png';
Level.CREATURE_SPRITE_NUMBERS = ['1', '2', '3'];
Level.LAYER_CREATURE = 'layer-creature';
Level.DIV_HILIGHT = 'div-hilight';
Level.LAYER_SCORE = 'layer-score';
Level.BG_THEME_BEACH_CREATURES = ["blue-crab", "green-turtle", "pink-frog", "red-starfish", "teal-blob", "violet-crab", "yellow-fish"];
Level.BG_THEME_FOREST_CREATURES = ["blue-beetle", "green-butterfly", "pink-lizard", "red-beetle", "teal-bug", "violet-moth", "yellow-frog"];
Level.BG_THEME_CAVE_CREATURES = ["blue-crystal", "green-frog", "pink-spike", "red-beetle", "teal-flyer", "violet-lizard", "yellow-bug"];
Level.SUPER_FRIENDS = ["blue-friend", "green-friend", "pink-friend", "red-friend", "teal-friend", "violet-friend", "yellow-friend"];
Level.COLORS = ["blue", "green", "pink", "red", "teal", "violet", "yellow"];
Level.BLOB_TYPES = ['CREATURE', 'GOLD'];
/*
Level.NAV_LEFT = 119;
Level.NAV_TOP = 520;
Level.NAV_MARGIN_BOTTOM = 10;
Level.MENU_BUTTON_X = 124;
Level.MENU_BUTTON_Y = 600;
*/
Level.SUPER_FRIEND_SUFFIX = '-friend';
Level.powerUpScore =0;
function Level(id) {
	this.id = id;
	this.name = '';
	this.bgTheme = '';
	this.bgSubTheme = '';
	this.unlocksLevels = [];
	this.creatureImages = [];
	this.superFriendImages = [];
	this.creatureTypes = [];
	this.creatureColors = []; //subset of creatureTypes
	//TODO: do we need to store levelConfig?
	this.levelConfig = ''; // original JSON text
	this.goldImages = [];
	this.mapHotspotRegion = [];
	this.dangerBar = null;
	this.gameImages = [];
	this.layerBackground = null;
	this.neighbors = {};
	this.levelAnimation = null;
	this.bubbleTip = null;
	this.isUnlocked = false;
}

Level.prototype.getGold = function() {
	var gold;
	gold = new Gold(LoadingScreen.gal.get(Galapago.GAME_SCREEN_GAL_PREFIX + 'gold/' + 'gold-1.png'));
	return gold;
};

Level.prototype.getCreatureByColorId = function(colorId, creatureSpriteNumber) {
	var creatureType, creatureImage, creature;

	//for lightning tiles, display the teal blob
	if( colorId === 'l') {
		colorId = 't';
	}

	creatureType = _.filter( this.creatureTypes, function(creatureType) {
		return creatureType.startsWith(colorId);
	})[0];

	creatureImage = this.getCreatureImage(creatureType, creatureSpriteNumber);
	creature = new Creature(creatureType, creatureImage);
	return creature;
}; //Level.prototype.getCreatureByColorId

Level.prototype.getSuperFriendByColorId = function(colorId) {
	var sfImage, sf, sfImagePath, sfType;

	sfType = _.filter( Level.SUPER_FRIENDS, function(sfIt) {
		return sfIt.startsWith(colorId);
	})[0];
	sfImage = this.superFriendImages[sfType];
	sf = new SuperFriend(sfImage, sfType.replace(Level.SUPER_FRIEND_SUFFIX,''));
	return sf;
}; //Level.prototype.getCreatureByColorId

Level.prototype.setBgTheme = function(bgTheme) {
	this.bgTheme = bgTheme;
	this.creatureTypes = this.getCreatureTypesByTheme(this.bgTheme);
};

Level.prototype.toString = function() {
	var output;
	output = 'name: ' + this.name + ', ' +
			'bgTheme: ' + this.bgTheme + ', ' +
			'bgSubTheme: ' + this.bgSubTheme + ', ' +
			'creatureTypes: ' + this.creatureTypes + ', ' +
			'board: ' + this.board.toString();
	return output;
};

Level.prototype.initImages = function(imageArray) {
	var level;
	level = this;

	_.each(imageArray, function(image) {
		if(image.id.indexOf('.')!=-1){
			if( image.id.startsWith( MapScreen.GAL_PREFIX ) ) {
				image.id  = image.id.substring( MapScreen.GAL_PREFIX.length, image.id.length - Galapago.IMAGE_PATH_SUFFIX.length );
			}
			else {
			image.id  = image.id.substring( Galapago.GAME_SCREEN_GAL_PREFIX.length, image.id.length - Galapago.IMAGE_PATH_SUFFIX.length );
		}
		}
		level.gameImages[replaceAll( image.id, '-', '_' )] = image;
		
	});
}; //Level.prototype.initImages

Level.prototype.setBoard = function(board) {
	this.board = board;
	board.level = this;
}; //Level.prototype.setBoard()

Level.prototype.buildGoldImagePaths = function() {
	var goldImagePaths;
	goldImagePaths = [];
	goldImagePaths[0] = Galapago.GAME_SCREEN_GAL_PREFIX + 'gold/' + 'gold-1' + Level.BLOB_IMAGE_EXTENSION;
	return goldImagePaths;
}; //Level.prototype.buildGoldImagePaths()

Level.prototype.getCreatureImages = function(bgTheme) {
	if(!(bgTheme  in Galapago.creatureImages)){
		switch( bgTheme ) {
			case 'beach':
				Galapago.creatureImages[bgTheme] = this.loadImageSprites(bgTheme, Level.BG_THEME_BEACH_CREATURES);
				break;
			case 'forest':
				Galapago.creatureImages[bgTheme] = this.loadImageSprites(bgTheme, Level.BG_THEME_FOREST_CREATURES);
				break;
			case 'cave':
				Galapago.creatureImages[bgTheme] = this.loadImageSprites(bgTheme, Level.BG_THEME_CAVE_CREATURES);
		}
		if(!('superFriends'  in Galapago.creatureImages)){
			Galapago.creatureImages['superFriends'] = this.loadSuperFriends();
		}
	}
	return Galapago.creatureImages[bgTheme];
}; //Level.prototype.getCreatureImages()

Level.prototype.loadImageSprites = function(bgTheme, creatureTypes) {
	var images, sprites;
	images={};
	_.each(creatureTypes, function(creatureType){
		sprites  = ImageCollage.getSprites(bgTheme + "/" + creatureType + Level.BLOB_IMAGE_EXTENSION);
		_.each(sprites, function(sprite){
			sprite.id = sprite.id.replace(bgTheme + '/','');
			images[sprite.id] = sprite;
			console.debug( 'loaded sprite ' + sprite.id );
		});
	});	
	return images;
}; //Level.prototype.loadImageSprites()

Level.prototype.loadRolloverSprites = function(bgTheme, creatureTypes) {
	var images, sprites;
	images={};
	_.each(creatureTypes, function(creatureType){
		sprites  = ImageCollage.getSprites(bgTheme + "/" + creatureType + Level.BLOB_IMAGE_EXTENSION);
		_.each(sprites, function(sprite){
			sprite.id = sprite.id.replace(bgTheme + '/','');
			images[sprite.id] = sprite;
			console.debug( 'loaded sprite ' + sprite.id );
		});
	});
	return images;
}; //Level.prototype.loadImageSprites()

Level.prototype.loadSuperFriends = function(creatureSpriteSheet) {
	var images, sprites;
	images={};
	sprites  = ImageCollage.getSprites("collage/superfriends.png");
	_.each(sprites, function(sprite){
		images[sprite.id] = sprite;
	});
	return images;
}; //Level.prototype.loadSuperFriends()

Level.prototype.loadImages = function() {
	var level, goldImagePaths, gameImagePaths, /*levelAnimationImagePaths,*/ levelAnimationImages, image, gameImages;
	level = this;	
	goldImagePaths = level.buildGoldImagePaths();
	gameImagePaths = Galapago.buildGameImagePaths();
	gameImages = [];
	level.creatureImages = level.getCreatureImages(level.bgTheme);
	level.superFriendImages = Galapago.creatureImages['superFriends'];

	_.each( gameImagePaths, function( gameImagePath ) {
		//console.debug( gameImagePath );
		image = LoadingScreen.gal.get( gameImagePath );
		gameImages.push( image );
	});
	level.initImages(gameImages);

	_.each( goldImagePaths, function( goldImagePath ) {
		level.goldImages.push( LoadingScreen.gal.get( goldImagePath ) );
	});

	level.levelAnimation.initImages(level.bgTheme, level.creatureTypes);

}; //Level.prototype.loadImages()

Level.prototype.display = function(onDialogOpenedCallBack) {
	var level, timedMode, themeComplete, resourcePath, backgroundImage, restoreLookupString, restoreLookup;
	console.debug( 'entering Level.prototype.display()');
	level = this;
	level.setBoard(new Board());
	level.board.displayScore();
	$('#screen-game').show();
	console.debug( 'after show #screen-game');
	if( level.levelConfig.blobPositions ) {
		level.loadImages();
		level.board.addPowerups();
		level.board.displayLevelName();
		_.each( Board.NAV_BUTTON_TYPES, function( buttonType ) {
			level.board.displayNavButton( buttonType, false );
		});
		if (Galapago.isTimedMode) {
			level.dangerBar = new DangerBar(level.levelConfig.dangerBarSeconds * 1000, level.levelAnimation);
		}
		themeComplete = this.bgTheme + '-' + this.bgSubTheme,
		resourcePath = 'background/' + themeComplete + '.jpg',
		backgroundImage = LoadingScreen.gal.get(resourcePath);

		if( backgroundImage ) {
			console.debug('setting background to ' + resourcePath);
			this.board.screenDiv.css( 'background-image','url(' + backgroundImage.src + ')' );
		}

		if(typeof onDialogOpenedCallBack !== 'undefined') {
			onDialogOpenedCallBack();
		}
		level.styleCanvas( level.levelConfig.blobPositions );
		level.board.init( level.levelConfig.blobPositions );
		level.board.build( level.levelConfig.blobPositions );
		level.board.buildInitialSwapForTriplet( level.levelConfig.initialSwapForTripletInfo );
		level.board.animationQ = [];
		level.board.displayBlobCollections();
		level.board.animateBoardBuild(function () {
			if (!MatrixUtil.isSameDimensions(level.board.creatureTileMatrix, level.board.goldTileMatrix)) {
				throw new Error('creatureTileMatrix dimensions must match goldTileMatrix dimensions');
			}
			timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
			if (Galapago.isTimedMode) {
				restoreLookupString = store.getItem(timedMode + Galapago.profile + "level" + level.id + "restore");
				dangerBarTimeRemaining = null;
				if(restoreLookupString){
					restoreLookup = JSON.parse(restoreLookupString);
					dangerBarTimeRemaining = restoreLookup['dangerBarTimeRemaining'];
					if(dangerBarTimeRemaining){
						level.dangerBar.timeRemainingMs  = dangerBarTimeRemaining;
						level.dangerBar.start();
					}
				}
			}
			console.debug(level.toString());


			level.board.hilightDiv.show();
			level.board.scoreElement.show();
			level.board.levelNameElement.show();
			level.board.display();
			level.board.setActiveTile();
			store.setItem(timedMode + Galapago.profile + "level" + level.id + ".levelPlayed", "1");
			console.debug('exiting Level.prototype.display()');
			Galapago.level.registerEventHandlers();
			return level; //chainable
		});
	}
	else
	{
		console.debug('exiting Level.prototype.display()');
		return level; //chainable
	}
}; //Level.prototype.display()

Level.prototype.getCreatureTypesByTheme = function(bgTheme) {
	var creatureTypes;
	creatureTypes = [];
	switch( bgTheme ) {
		case 'beach':
			creatureTypes = this.getCreatureSubset(Level.BG_THEME_BEACH_CREATURES);
			break;
		case 'forest':
			creatureTypes = this.getCreatureSubset(Level.BG_THEME_FOREST_CREATURES);
			break;
		case 'cave':
			creatureTypes = this.getCreatureSubset(Level.BG_THEME_CAVE_CREATURES);
			break;
	}
	return creatureTypes;
}; //Level.prototype.getCreatureTypesByTheme()

Level.prototype.won = function(){
	var timedMode, level;
	timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	store.removeItem( timedMode + Galapago.profile + "level" + this.id + "restore" );
	Galapago.audioPlayer.playLevelWon();
    level = this;
	if( sdkApi ) {
		sdkApi.requestModalAd("inGame").done( function() {
			LevelMap.show( LevelMap.getNextLevel(), function() {
				level.cleanup();
			});
		});
	}
	else {
		// TODO: IGOR: Do we need cleanup here?!
		LevelMap.show( LevelMap.getNextLevel(), function() {
			level.cleanup();
		} );
	}
}; //Level.prototype.won()

Level.prototype.quit = function(){
	this.board.saveBoard();
	this.cleanup();
}; //Level.prototype.quit()

Level.prototype.cleanup = function(isBonusFrenzyOn){
	this.unregisterEventHandlers();
	this.board.scoreElement.hide();
	this.board.levelNameElement.hide();
	this.board.hilightDiv.hide();
	if(!isBonusFrenzyOn) {
		this.board.screenDiv.hide();
		$("#screen-game").children("canvas").each(function() {
			this.width = this.height = 1;
		});
	}
	this.bubbleTip.hideBubbleTip();
	if(this.dangerBar){
		this.dangerBar.stop();
	}
    this.board.powerUp.timer.clearInterval();
    if( this.dangerBar ) {
    	this.dangerBar.div.hide();
    	this.dangerBar.divAnimation.hide();
    }
	this.levelAnimation.stopAllAnimations();
	this.board.creatureLayer.clearRect(0, 0, this.board.creatureLayer.canvas.width, this.board.creatureLayer.canvas.height);
	if(this.levelAnimation.powerAchievedAnimation){
		this.levelAnimation.stopAllPowerAchieved();
		this.levelAnimation.powerAchievedAnimation = null;
	}
	this.board.reshuffleService.stop();
	if(!isBonusFrenzyOn) {
		this.board = null;
	}
	Galapago.audioPlayer.stop();
}; //Level.prototype.cleanup()

Level.prototype.getCreatureSubset = function(creatureTypes) {
	var level = this;
	return _.filter( creatureTypes, function(creatureType) {
		return _.contains(level.creatureColors, creatureType[0].toUpperCase());
	});
}; //Level.prototype.getCreatureSubset()

Level.findById = function(id) {
	return Galapago.levels[id - 1];
};

Level.findByName = function(levelName) {
	var level;
	level = _.filter( Galapago.levels, function(level) {
		return level.name === levelName;
	});

	return (level.length === 1) ? level[0] : null;
};

Level.prototype.registerEventHandlers = function() {
	var level, board;
	level = Galapago.level;
	board = level.board;
	document.onclick = function(evt) {
		console.log('x: ' + evt.clientX + ', y:' + evt.clientY);
	};

	$('#layer-creature').off('click');
	$('#layer-creature').on('click', function(evt) {
		board.handleClickOrTap(evt);
	});

	$('#layer-creature').off('click');
	$('#layer-creature').on('tap', function(evt) { 
		board.handleClickOrTap(evt);
	});
	
	$('#layer-creature').off('click');
	$('#layer-creature').on('click', function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		if(board.level.levelCompleted){
			board.setComplete();
			return;
		}
		else {
			board.handleMouseClickEvent(evt);
		}
	});

	$('#layer-creature').off('mouseout');
	$('#layer-creature').on('mouseout', function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		var currrentElement = document.elementFromPoint(evt.pageX, evt.pageY);
		if((!currrentElement || (currrentElement && currrentElement.id != 'div-hilight' && currrentElement.id != 'layer-creature'))){
			board.onBoardOut();
		}
	});

	$('#layer-creature').off('mouseover');
	$('#layer-creature').on('mouseover', function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		board.onBoardIn();
	});	

	this.registerMenuQuitButtonHandlers();
	$('#layer-creature').off('keydown');
	$('#layer-creature').on('keydown', function(evt) {
		board.handleKeyboardEvent(evt);
	});
}; //Level.prototype.registerEventHandlers()

Level.prototype.registerMenuQuitButtonHandlers = function() {
	var level, board, handleMouseOver, idPrefix, buttonId, hilightId;
	level = Galapago.level;
	board = level.board;
	//set up mouseover, mouseout, and mouseclick event handlers for menu and quit buttons
	_.each( Board.NAV_BUTTON_TYPES, function(buttonType) {
		idPrefix = '#screen-game #game-nav-';
		buttonId = idPrefix + 'button-' + buttonType;
		hilightId = idPrefix + 'hilight-' + buttonType;

		handleMouseOver = function(buttonType) {
			board.displayNavButton( buttonType, true );
			board.hotspot = 'hotspot-' + buttonType;
		};

		$( buttonId ).on( 'mouseover', function() {
			handleMouseOver(buttonType)
		});
		$( buttonId ).on( 'mouseout', function(e) {
			board.displayNavButton( buttonType, false );
			board.hotspot = null;
		});
		$( buttonId ).on( 'click', function(e) {
			handleMouseOver(buttonType); //in case another button was hilighted already with keyboard
			board.handleKeyboardSelect();
			e.preventDefault();
			e.stopPropagation();
		});
	});
} //Level.prototype.registerMenuQuitButtonHandlers()

Level.prototype.unregisterEventHandlers = function() {
	var idPrefix, buttonId;
	$('#layer-creature').off('click');
	$('#layer-creature').off('tap');
	$('#layer-creature').off('click');
	$('#layer-creature').off('mouseout');
	$('#layer-creature').off('mouseover');
	$('#layer-creature').off('keydown');
	_.each( Board.NAV_BUTTON_TYPES, function(buttonType) {
		idPrefix = '#screen-game #game-nav-';
		buttonId = idPrefix + 'button-' + buttonType;
		$( buttonId ).off( 'mouseover' );
		$( buttonId ).off( 'mouseout' );
		$( buttonId ).off( 'click' );
	});
}; //Level.prototype.unregisterEventHandlers()

function changeCanvasState(stateName) {
	function c(name) {
		var el = document.getElementById(name);
		if(el) {
			el.width = 1;
			el.height = 1;
			el.style.width = "1px";
			el.style.height = "1px";
		}
		/*if(el && el.parentNode) {
			el.parentNode.removeChild(el);
		}
		el = null;*/
	}

	switch(stateName) {
		case "gameScreen":
			//c("layer-background");
			c("layer-progress-bar");
			//c("layer-background");
			c("layer-map");
			//c("layer-map-other-animation");
			//c("layer-map-animation");
			break;
	}
} //changeCanvasState()

Level.prototype.styleCanvas = function(blobPositions) {
	var canvasCreature, scoreBackgroundGalAssestPath, scoreBackgroundImage, numRows, numCols;
	canvasCreature = this.board.creatureLayer.canvas;

	numRows = blobPositions.length;
	numCols = blobPositions[0].length;
	canvasCreature.width = Board.TILE_WIDTH * numCols;
	canvasCreature.height = Board.TILE_HEIGHT * numRows;
	//canvasCreature.width = Board.GRID_WIDTH;
	//canvasCreature.height = Board.GRID_HEIGHT;
	canvasCreature.style.left = Board.GRID_LEFT + 'px';
	canvasCreature.style.top = Board.GRID_TOP + 'px';

	this.board.scoreElement.css('left', Board.GRID_LEFT + 'px');
	scoreBackgroundGalAssestPath = Galapago.GAME_SCREEN_GAL_PREFIX + 'score-background.png';
	scoreBackgroundImage = LoadingScreen.gal.get( scoreBackgroundGalAssestPath );
	if( scoreBackgroundImage ) {
		this.board.scoreElement.css('background-image', 'url(' + scoreBackgroundImage.src + ')');
	}
	else {
		console.error( 'unable to load score background ' + scoreBackgroundGalAssestPath);
	}

	findAllPixels(document.body);
	var t = LoadingScreen.gal.lookupTable;
	//t['background/main-menu.jpg'] = null;
	//t['background/map.jpg'] = null;
	for(var k in t) {
		if(t.hasOwnProperty(k)) {
			var i = t[k];
			if(i && i.src && i.src.indexOf('data:') < 0) {
				console.log("incorrect image found: " + k + "," + i.id + ", size: " + i.naturalWidth * i.naturalHeight);
			}
		}
	}

	this.board.hilightDiv.css('background-image', 'url('+ this.gameImages.tile_selected.src + ')');

	console.debug('exiting Level.prototype.styleCanvas()');
}; //Level.prototype.styleCanvas()

Level.prototype.getCreatureImage = function(creatureType, spriteNumber) {
	var creatureImageKey = creatureType + '_' + spriteNumber;
	return this.creatureImages[creatureImageKey];
};

Level.prototype.isNew = function() {
	var	timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	var levelPlayed = store.getItem(timedMode+Galapago.profile+"level"+this.id+".levelPlayed");	
	return !levelPlayed;
};

Level.prototype.flashBubbleTip = function(key){
	var level = this;
	level.bubbleTip.showBubbleTip(i18n.t(key));
	Galapago.delay(BubbleTip.DISPLAY_TIME_MS).done(function() {
		level.bubbleTip.clearBubbleTip( i18n.t(key) );
	});
};

Level.isComplete = function(id) {
	var timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	return store.getItem(timedMode + Galapago.profile + "level" + id + ".completed");	
};
/* end class Level */

/*
begin class Board
Board has layer with matrix of Tiles with Creatures
Board has layer with matrix of Tiles with Gold
*/
Board.TILE_WIDTH = 47;
Board.TILE_HEIGHT = 47;
Board.MAX_COLUMNS = 15;
Board.MAX_ROWS = 11;
Board.GRID_LEFT = 325;
Board.GRID_TOP = 100;
Board.GRID_WIDTH = Board.MAX_COLUMNS * Board.TILE_WIDTH;
Board.GRID_HEIGHT = Board.MAX_ROWS * Board.TILE_HEIGHT;
Board.CREATURE_FLYOVER_STEP = 20;
Board.ANGULAR_SPEED = Math.PI * 2;
Board.HOTSPOT_MENU = 'hotspot-menu';
Board.HOTSPOT_POWERUP = 'hotspot-powerup';
Board.HOTSPOT_QUIT = 'hotspot-quit';
Board.HOTSPOT_TILE = 'hotspot-tile';
Board.HOTSPOT_POWERUP_FLIPFLOP = 'hotspot-powerup-flipflop';
Board.HOTSPOT_POWERUP_FIREPOWER = 'hotspot-powerup-firepower';
Board.HOTSPOT_POWERUP_SHUFFLE = 'hotspot-powerup-shuffle';
Board.NAV_BUTTON_TYPES = ['menu', 'quit'];

function Board() {
	this.screenDiv = $('#screen-game');
	this.creatureLayer = $('#' + Level.LAYER_CREATURE)[0].getContext('2d');
	this.hilightDiv = $('#' + Level.DIV_HILIGHT);
	this.scoreElement = $('#current-score');
	this.levelNameElement = $('#level-name');

	this.score = 0;
	this.hotspot = null;

	this.goldTileMatrix = [];

	this.creatureTileMatrix = [];

	// hold the tile last clicked
	this.tileSelected = null;
	this.tileActive = null;

	this.buttonActive = null;
	this.rotateAngle = 0;
	this.creatureYOffset = 0;
	this.blobCollection = new BlobCollection();

	this.creatureCounter = 0;
	this.chainReactionCounter = 0;
	this.scoreEvents = [];
	this.handleTripletsDebugCounter = 0;
	this.level = null;
	this.firstTileCoordinates = null;
	this.collectionModified = false;
	this.powerAchieved = false;
	this.tilesEventProcessor = new TilesEventProcessor(this);
	this.reshuffleService = new ReshuffleService(this);
	this.putInAnimationQ = false;
	this.navigationLock = false;  // for multiple cursor on game screen
	this.animationQ = [];
	this.powerupPointsAchievedInThisSwap = 0;
	this.isBoardBuildAnimationNeeded = true;
} //Board constructor

Board.prototype.handleKeyboardEvent = function(evt){
	var board = this;
	if(board.animationQ.length){
		return;
	}
	if(board.level.levelCompleted){
		board.setComplete();
		return;
	}
	//board.creatureLayer.canvas.onkeydown = function(evt) {
	console.debug('key pressed ' + evt.keyCode);
	switch( evt.keyCode ) {
		case 51:
			if( QueryString.cheat === 'true' ) {
				if(ns && ns.frameWork && ns.frameWork.debug && ns.frameWork.debug.profiler) {
					ns.frameWork.debug.profiler.clear();
				}
			}
			break;
		case 52:
			if( QueryString.cheat === 'true' ) {
				if(ns && ns.frameWork && ns.frameWork.debug && ns.frameWork.debug.profiler) {
					var report = ns.frameWork.debug.profiler.getPreparedReport();
					for(var i = Math.min(20, report.length) - 1; i >= 0; i--) {
						console.log(report[i].id + ": " + report[i].own.total);
					}
				}
			}
			break;
		case 13: // enter
			board.handleKeyboardSelect();
			break;
		case 37: // left arrow
			board.handleLeftArrow();
			evt.preventDefault();
			evt.stopPropagation();
			break;
		case 38: // up arrow
			board.handleUpArrow();
			evt.preventDefault();
			evt.stopPropagation();
			break;
		case 39: // right arrow
			board.handleRightArrow();
			evt.preventDefault();
			evt.stopPropagation();
			break;
		case 40: // down arrow
			board.handleDownArrow();
			evt.preventDefault();
			evt.stopPropagation();
			break;
		case 8: // back/backspace key
			LevelMap.show(level, function() {
			level.quit();
			});
			evt.stopPropagation();
			evt.preventDefault();		
			break;
		//TODO code below here should removed before production
		case 48: // numeric 0
			if( QueryString.cheat === 'true' ) {
				board.setComplete();
			}
			evt.stopPropagation();
			evt.preventDefault();
			break;
		case 49: // numeric 1
			if( QueryString.cheat === 'true' ) {
				board.powerUp.activatePowerUpUsingCheatCode();
			}
			evt.stopPropagation();
			evt.preventDefault();
			//Galapago.setLevel('level_01');
			break;
		case 50: // numeric 2
			//Galapago.setLevel('level_02');
			break;
		case 56: // 8
			if( QueryString.cheat === 'true' ) {
				toggleDebugConsole('top');
			}
			break;
		case 57: // 9
			if( QueryString.cheat === 'true' ) {
				toggleDebugConsole('bottom');
			}
			break;
		default:
	}
}

Board.prototype.registerEventHandlers = function() {
	this.level.registerEventHandlers();
}; //Board.prototype.unregisterEventHandlers()

Board.prototype.unregisterEventHandlers = function() {
	this.level.unregisterEventHandlers();
}; //Board.prototype.unregisterEventHandlers()

Board.prototype.quit = function() {
	this.level.cleanup(false);
	sdkApi.exit();
	return this; //chainable
}; //Board.prototype.quit()

Board.prototype.display = function() {
	this.creatureLayer.canvas.focus();
	this.level.levelAnimation.initBobCervantes(/*this.backgroundLayer*/);
	this.reshuffleService.start();
}; //Board.protoype.display()

Board.prototype.displayBlobCollections = function() {
	this.blobCollection.initImages(this.level.gameImages);
	this.blobCollection.display();
};

Board.prototype.displayLevelName = function() {
	var levelNameElement, levelNameText;
	levelNameElement = this.levelNameElement;
	levelNameText =  i18n.t( 'levels.' + this.level.id ) ;
	levelNameText += ' ' + this.level.id; //TODO for debugging only remove before production!!!
	levelNameElement.html( levelNameText );
}; //Board.protoype.displayLevelName()

Board.prototype.displayNavButton = function(buttonType, isActive) {
	var otherButtonTypes, otherHilightId, prefixId, menuButtonImage, gameButtonCursor, buttonId, hilightId;
	menuButtonImage = this.level.gameImages.button_regular;
	gameButtonCursor = this.level.gameImages.button_cursor;
	prefixId = '#screen-game #game-nav-';
	buttonId = prefixId + 'button-' + buttonType;
	hilightId = prefixId + 'hilight-' + buttonType;
	$( buttonId ).css( 'background-image', 'url(' + menuButtonImage.src + ')' );
	if( isActive ) {
		this.buttonActive = buttonType + 'Button';
		//show hilight for this button and hide hilight from other buttons
		$( hilightId ).css( 'background-image', 'url(' + gameButtonCursor.src + ')' );
		otherButtonTypes = _.without( Board.NAV_BUTTON_TYPES, buttonType );
		_.each( otherButtonTypes, function( buttonType ) {
			otherHilightId = prefixId + 'hilight-' + buttonType;
			$( otherHilightId ).css( 'background-image', '' );
		});
	}
	else {
		this.buttonActive = null;
		$( hilightId ).css( 'background-image', '' );
	}
}; //Board.protoype.displayNavButton()

Board.prototype.addPowerups = function() {
	this.powerUp=new Powerup(this , Level.powerUpScore);
	Level.powerUpScore=0;
};

/* req 4.4.2
As default, the cursor is shown on the top leftmost creature on board. However, on new game once in a session, in levels
1,2 and 14-19, when Bubble Tips are displayed at the start of the level, the cursor appears on the creature that is
animated according to the displayed tip.
*/
Board.prototype.setActiveTile = function(tile) {
	var markTile, tileActive, col, row, key;
	if(tile) {
		tileActive = tile;
	}
	
	else if(!tile &&  _.contains(Galapago.ACTIVE_TILE_LOGIC_LEVELS, this.level.id) && this.initialSwapForTripletInfo) {
		col = this.initialSwapForTripletInfo.tipInfo.initialTile[0];
		row = this.initialSwapForTripletInfo.tipInfo.initialTile[1];
		tileActive = this.creatureTileMatrix[col][row];
		key = 'Game Tips.'+this.initialSwapForTripletInfo.tipInfo.key+' tip1';
		this.level.bubbleTip.showBubbleTip(i18n.t(key));
		this.bubbleInitialTile = this.initialSwapForTripletInfo.tipInfo.initialTile;
		this.initialSwapForTripletInfo.tipInfo.initialTile = 'shown';
		markTile = true;
	}	
	else { //YJ: activate top left tile unless otherwise indicated
		col = this.firstTileCoordinates[0];
		row = this.firstTileCoordinates[1];
		tileActive = this.creatureTileMatrix[col][row];
	}
	this.tileActive = tileActive;
	tileActive.setActiveAsync(markTile).done();
}; //Board.prototype.setActiveTile()

Board.prototype.getTileMatrix = function(blobType) {
	var tileMatrix;
	switch( blobType ) {
		case 'GOLD':
			tileMatrix = this.goldTileMatrix;
			break;
		case 'CREATURE':
			tileMatrix = this.creatureTileMatrix;
			break;
		default:
			tileMatrix = this.creatureTileMatrix;
	}
	return tileMatrix;
}; //Board.prototype.getTileMatrix()

Board.prototype.countGold = function() {
	var rowIt, colIt, goldCount;
	goldCount = 0;
	for( rowIt = 0; rowIt < this.goldTileMatrix.length; rowIt++ ) {
		for( colIt = 0; colIt < this.goldTileMatrix[rowIt].length; colIt++ ) {
			if( this.goldTileMatrix[colIt][rowIt] ) { // not null
				goldCount++;
			}
		}
	}
	return goldCount;
};

Board.prototype.toString = function() {
	var output;
	output = 'creatureTileMatrix: ' + this.creatureTileMatrix + ', ' +
			'goldTileMatrix: ' + this.goldTileMatrix;
	return output;
}; //Board.prototype.toString

Board.prototype.init = function(tilePositions) {
	var board, tileMatrix, colIt, rowIt;
	board = this;
	var left = 0;
	var top =100;

	_.each(Level.BLOB_TYPES, function(blobType) {
		tileMatrix = board.getTileMatrix(blobType);
		for( colIt = 0; colIt < tilePositions[0].length; colIt++ ) {
			tileMatrix.push([]);
			for( rowIt = 0; rowIt < tilePositions.length; rowIt++ ) {
				tileMatrix[colIt].push(null);
			}
		}
	});
}; //Board.prototype.init

Board.prototype.build = function(tilePositions) {
	var timedMode, colIt, rowIt, coordinates, cellId, cellObject, spriteNumber, restoreLookupString, restoreLookup, key, tile;
	console.debug( 'entering Board.prototype.build()' );
	timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
    restoreLookupString = store.getItem( timedMode + Galapago.profile + "level" + this.level.id + "restore" );
	if(restoreLookupString){
		this.isBoardBuildAnimationNeeded = false;
		restoreLookup = JSON.parse(restoreLookupString);
		this.score = restoreLookup['score'];
		this.displayScore();
		var nilCollection = restoreLookup['nilCollection'];
		var image ;
		var id;
		for(key in nilCollection){
			image=null;
			id=null;
			if(nilCollection[key] in this.level.creatureImages){
				id = nilCollection[key];
				image = this.level.creatureImages[id];
			}else if(nilCollection[key] in this.level.superFriendImages){
				id = nilCollection[key];
				image = this.level.superFriendImages[id];
			}else{
				for(var creatureKey in this.level.goldImages){
					id = this.level.goldImages[creatureKey].id;
					if(id == nilCollection[key]){
						image = this.level.goldImages[creatureKey];
						break;
					}
				}
			}
			var blobItem = new BlobItem(image, 0);
			this.blobCollection.blobCollection[id] = blobItem;
		}
	}
	//jj: populate the grid
	for( rowIt = 0; rowIt < tilePositions.length; rowIt++ ) {
		for( colIt = 0; colIt < tilePositions[rowIt].length; colIt++ ) {
			//ym: we don't have to explicitly set cells to null but it simplifies logic later
			this.creatureTileMatrix[colIt][rowIt] = null;
			//ym: we don't have to explicitly set cells to null but it simplifies logic later
			this.goldTileMatrix[colIt][rowIt] = null;
			//ym: row and col are switched here the way from they're used in the rest of the game
			//because tilePositions is loaded by external code
			cellId = tilePositions[rowIt][colIt];
			cellObject = this.parseCell(cellId);
			if(restoreLookup ){
				key = colIt+'_'+rowIt;
				if(cellObject.gold && restoreLookup[key]){
					cellObject = this.parseCell(restoreLookup[key]);
				}else if((cellObject.gold || cellObject.blocking || cellObject.cocoon || cellObject.hasTileOnly || cellObject.superFriend) && !restoreLookup[key]){
					cellObject = this.parseCell('1');
					//this.blobCollection.addBlobItem(tile);
				}else if(restoreLookup[key]){
					cellId = restoreLookup[key];
					cellObject = this.parseCell(cellId); 
				}
			}
			
			coordinates = [colIt, rowIt];
			if( typeof cellObject.gold != 'undefined' ) {
				this.addTile(coordinates, 'GOLD', cellObject.gold);
			}
			if( cellObject.hasCreature ) {
				if(null === this.firstTileCoordinates){
					this.firstTileCoordinates = coordinates;
				}
				spriteNumber = Tile.CREATUREONLY_TILE_SPRITE_NUMBER;
				this.addTile(coordinates, 'CREATURE', null, spriteNumber, null, this.isBoardBuildAnimationNeeded);
			}
			if( cellObject.hasTileOnly ) {
				spriteNumber = Tile.PLAIN_TILE_SPRITE_NUMBER; //no creature
				this.addTile(coordinates, 'CREATURE', null, spriteNumber);
			}
			if( typeof cellObject.blocking != 'undefined' ) {
				spriteNumber = Tile.BLOCKED_TILE_SPRITE_NUMBER;
				tile = this.addTile(coordinates, 'CREATURE', cellObject.blocking, spriteNumber);
				tile.blobConfig = cellId;
				//console.debug('TODO implement add blocking tile at ' + MatrixUtil.coordinatesToString(coordinates) );
			}
			if( typeof cellObject.cocoon != 'undefined' ) {
				spriteNumber = Tile.COCOONED_TILE_SPRITE_NUMBER;
				tile = this.addTile(coordinates, 'CREATURE', cellObject.cocoon, spriteNumber);
				tile.blobConfig = cellId;
			}
			if( typeof cellObject.superFriend != 'undefined' ) {
				tile = this.addTile(coordinates, 'SUPER_FRIEND', cellObject.superFriend);
				//need config to restore later
				tile.blobConfig = cellId;
			}
		}
	}
	console.debug('generated ' + this.creatureCounter + ' creatures to get ' + colIt * rowIt + ' creatures with no triplets');
	console.debug( 'exiting Board.prototype.build()' );
	return;
}; //Board.prototype.build

Board.prototype.buildInitialSwapForTriplet = function(initialSwapForTripletInfo) {
	var board = this;
	if(board.level.id == 1 && board.level.isNew()){
		initialSwapForTripletInfo = MatchFinder.findMatch(board, true);
		if(initialSwapForTripletInfo.tipInfo.initialTile){
			initialSwapForTripletInfo.tipInfo.key = 'Gold';
			board.initialSwapForTripletInfo = initialSwapForTripletInfo;
		}
	}
	if(board.level.isNew() && initialSwapForTripletInfo){
		var coordinates = initialSwapForTripletInfo.coordinates; 
		var colorId = initialSwapForTripletInfo.color;
		_.each(coordinates,function(coordinate){
			var creature = board.level.getCreatureByColorId(colorId, Tile.CREATUREONLY_TILE_SPRITE_NUMBER);
			var tile = board.addTile(coordinate, 'CREATURE', creature, Tile.CREATUREONLY_TILE_SPRITE_NUMBER, null, true);
			board.regenerateMatchingCreatureIfAny(tile, coordinates, true);
		});
		board.initialSwapForTripletInfo = initialSwapForTripletInfo;
	}
};

Board.prototype.parseCell = function(cellId) {
	var cellObject;
	cellObject = [];

	switch( cellId[0] ) {
		case '0':
			//tile background or creature
			break;
		case '1':
			//tile background and creature
			cellObject.hasCreature = true;
			break;
		case '2':
			//tile background only
			cellObject.hasTileOnly = true;
			break;
	}
	if( cellId.length >=2 && cellId[1] === '1' ) {
		cellObject.gold = this.level.getGold();
	}
	//if the third string char contains one of these color ids
	if( cellId.length >=3 && cellId[2].search('[bglprvy]') !== -1 ) {
		cellObject.blocking = this.level.getCreatureByColorId( cellId[2], Level.CREATURE_SPRITE_NUMBERS[1] );
	}
	//if the fourth string char contains one of these color ids
	if( cellId.length >=4 && cellId[3].search('[bglprvy]') !== -1 ) {
		cellObject.cocoon = this.level.getCreatureByColorId( cellId[3], Level.CREATURE_SPRITE_NUMBERS[2] );
	}
	//if the fifth string char contains one of these color ids
	if( cellId.length >=5 && cellId[4].search('[bglprvy]') !== -1 ) {
		cellObject.superFriend = this.level.getSuperFriendByColorId( cellId[4] );
	}
	//TODO yj: clarify requirements for lightning creatures
	return cellObject;
}; //Board.prototype.parseCell

//add a new tile or update the position of an existing tile
//synchronizes coordinate and position information with the tile object
Board.prototype.addTile = function(coordinates, blobType, blob, spriteNumber, tile, skipDraw) {
	var layer, tileMatrix, col, row, x, y, width, height, imageName, previousX, previousY, board, image, goldTile, previousGoldTile;

	tileMatrix = this.getTileMatrix(blobType);
	layer = this.creatureLayer;
	col = coordinates[0];
	row = coordinates[1];
	x = Tile.getXCoord(col);
	y = Tile.getYCoord(row);
	width = Board.TILE_WIDTH;
	height = Board.TILE_HEIGHT;
	board = this;
	if( tile ) {
		imageName = tile.blob.creatureType;
		console.debug( 'moving existing tile ' + imageName + ' to ' + MatrixUtil.coordinatesToString(coordinates));
		previousX = Tile.getXCoord(tile.coordinates[0]);
		previousY = Tile.getYCoord(tile.coordinates[1]);
		previousGoldTile = board.getGoldTile(tile);
		tile.coordinates = coordinates;
		tileMatrix[col][row] = tile;
		image = tile.blob.image;	
		goldTile = board.getGoldTile(tile);
		function drawReplace(){
			Tile.draw(x, y, goldTile, image, board, true) ;
		}
		if(this.putInAnimationQ){
			this.animationQ.push(function(){
				Tile.draw(previousX, previousY, previousGoldTile, null, board, true) ;
				drawReplace();
			});
		}else{
			drawReplace();
		}
	}
	else {
		if( 'CREATURE' === blobType ) {
			tile = new Tile(this, blob, coordinates, spriteNumber);
			if(!blob && spriteNumber === Tile.CREATUREONLY_TILE_SPRITE_NUMBER) {
				tile = this.getNonMatchingCreatureTile(tile);
				blob = tile.blob;
				imageName = tile.blob.creatureType;
			} 
			else if(blob && spriteNumber === Tile.CREATUREONLY_TILE_SPRITE_NUMBER){
				imageName = blob.creatureType;
			}
			else if( spriteNumber === Tile.BLOCKED_TILE_SPRITE_NUMBER || spriteNumber === Tile.COCOONED_TILE_SPRITE_NUMBER ) {
				imageName = blob.creatureType;
				this.blobCollection.addBlobItem(tile);
			}
			tileMatrix[col][row] = tile;
			tile.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
			//layer.drawImage(board.level.gameImages.tile_regular, x, y, width, height);
		}		
		else if( blob.blobType === 'GOLD' || blob.blobType === 'SUPER_FRIEND' ) {
			imageName = blob.blobType;
			tile = new Tile(this, blob, coordinates, spriteNumber);
			tileMatrix[col][row] = tile;
			this.blobCollection.addBlobItem(tile);
			tile.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
		}
		console.debug( 'adding new tile ' + imageName + ' at ' + MatrixUtil.coordinatesToString(coordinates));
		if( blob && blob.image && blob.blobType != 'GOLD') {
			goldTile = board.getGoldTile(tile);
			image = blob.image;
			if(!skipDraw){
				function draw(){
					Tile.draw(x, y, goldTile, blob.image, board);
				}
				if(this.putInAnimationQ && blob.blobType != 'GOLD'){
					this.animationQ.push(draw);
				}else{
					draw();
				}
			}
		}
		if(spriteNumber === Tile.BLOCKED_TILE_SPRITE_NUMBER || (blob && blob.blobType === 'SUPER_FRIEND')){
			this.regenerateMatchingCreatureIfAny(tile, null , this.isBoardBuildAnimationNeeded);
		}	
	}
	return tile; 
}; //Board.prototype.addTile()

Board.prototype.regenerateMatchingCreatureIfAny = function(tile, excludeTileCoords, skipDraw) {
	var layer, tileMatrix, col, row, x, y, width, height, imageName, goldTile, image;
	var fixedTile = tile;
	tileMatrix = this.creatureTileMatrix;
	layer = this.creatureLayer;
	width = Board.TILE_WIDTH;
	height = Board.TILE_HEIGHT;
	var board = this;
	var matchingTilesSets = this.tilesEventProcessor.getMatchingTilesSets(fixedTile);
	_.each(matchingTilesSets, function(matchingTilesSet){
		_.each(matchingTilesSet, function(matchingTile){
			if(fixedTile != matchingTile &&!matchingTile.isBlocked() && !(excludeTileCoords && _.contains(excludeTileCoords, matchingTile.coordinates))){
				var tile = board.getNonMatchingCreatureTile(matchingTile);
				col = tile.coordinates[0];
				row = tile.coordinates[1];
				x = Tile.getXCoord(col);
				y = Tile.getYCoord(row);
				tileMatrix[col][row] = tile;
				goldTile = board.getGoldTile(tile);
				image = tile.blob.image;
				if(!skipDraw){
					function draw(){ 
						Tile.draw(x, y, goldTile, image, board, true);
					}
					if(board.putInAnimationQ){
						board.animationQ.push(draw);
					}else{
						draw();
					}
				}
				return;
			}
		});
	});
}; //Board.prototype.regenerateMatchingCreatureIfAny()

Board.prototype.getNonMatchingCreatureTile = function(tile) {
	//YJ: keep generating new creatures until we find one that doesn't form a triplet with its neighbors
	do {
		this.creatureCounter++;
		var blob = this.randomCreature(this.level.creatureTypes);
		tile = new Tile(this, blob, tile.coordinates, tile.spriteNumber);
	}
	while( this.tilesEventProcessor.getMatchingTilesSets(tile).length > 0 );
	return tile;
}; //Board.prototype.getNonMatchingCreatureTile()

Board.prototype.removeTile = function(tile) {
	var layer, tileMatrix, col, row;

	tileMatrix = this.getTileMatrix(tile.blob.blobType);
	layer = this.creatureLayer;
	console.debug("removing tile " + MatrixUtil.coordinatesToString(tile.coordinates));
	col = tile.coordinates[0];
	row = tile.coordinates[1];
	//tile.canvasImage.destroy();
	if( 'CREATURE' == tile.blob.blobType || 'SUPER_FRIEND' == tile.blob.blobType) {
		tile.spriteNumber = Tile.PLAIN_TILE_SPRITE_NUMBER;
	}
	else {
		tileMatrix[col][row] = null;
	}
	return this; //chainable
}; //Board.prototype.removeTile()

Board.prototype.addTileToLayer = function(tile, layer) {
	//layer.add(tile.canvasImage);
	tile.layer = layer;
	tile.board = this;
	return this; //chainable
}; //Board.prototype.addTileToLayer()



Board.prototype.handleMouseClickEvent = function(evt) {
		var board = this;
		if(board.animationQ.length){
			return;
		}
		var	x = evt.pageX ;//- this.offsetLeft;
		var y = evt.pageY ;
		var found =false;
		//alert("x : "+x +" y :"+y);
		var tileMatrix = board.creatureTileMatrix;
		for (var col = 0 ; col <= tileMatrix.length - 1; col++) {
			for (var row = 0; row <= tileMatrix[col].length - 1; row++) {
				var tile = tileMatrix[col][row];
				if(tile){
					var currentX = tile.getXCoord() + Board.GRID_LEFT;
					var currentY = tile.getYCoord()+ Board.GRID_TOP;
					
					if(x>currentX && x< (currentX +Board.TILE_WIDTH) && y> currentY && y< (currentY+ Board.TILE_HEIGHT )){
						if(board.initialSwapForTripletInfo && board.bubbleInitialTile){					        
							var icol = board.bubbleInitialTile[0];
							var irow = board.bubbleInitialTile[1];
							if(icol != col || irow != row){
								board.initialSwapForTripletInfo=null ;
								board.bubbleInitialTile =null;
								board.level.bubbleTip.clearBubbleTip();							
							}
						}
						console.log("active tile : "+board.tileActive);
						board.tileActive.setInactiveAsync().then(function() {
						console.log("tile : "+tile);
						board.setActiveTile(tile);
						board.handleKeyboardSelect();
						}).done();
						found =true;
						break;
					}
				}
			}
			if(found) {
				break;
		}
	}	
}; //Board.prototype.handleMouseClickEvent()

Board.prototype.handleTriplets = function(tileFocals) {
	var board, dangerBar, tileTriplets, tileSetsToBeRemoved, changedPointsArray;
	board = this;
	dangerBar = board.level.dangerBar;
	board.handleTripletsDebugCounter++;
	changedPointsArray = [];
	tileSetsToBeRemoved = [];
	var tilesMovedEventProcessorResult = this.tilesEventProcessor.tilesMoved(tileFocals);
	tileTriplets = tilesMovedEventProcessorResult.matchingTilesSets;
	if( tileTriplets && tileTriplets.length > 0 ) {
		board.reshuffleService.stop();
		var validMatchWithCollection = false;
		this.powerAchieved = this.powerUp.updatePowerup(tileTriplets.length);
		this.powerupPointsAchievedInThisSwap += tileTriplets.length;
		board.removeTriplets(tileTriplets, tilesMovedEventProcessorResult.scoreEvents);
		tileSetsToBeRemoved = tileSetsToBeRemoved.concat(tileTriplets);
		//pointsArray = tilesMovedEventProcessorResult.affectedPointsArray;
		if(tilesMovedEventProcessorResult.totalMatchedSuperFriendTiles.length > 0 ) {
			Galapago.audioPlayer.playSuperFriendMatch();
			board.blobCollection.removeBlobItems(tilesMovedEventProcessorResult.totalMatchedSuperFriendTiles);
			validMatchWithCollection = true;
			board.collectionModified = true;
		}
		if(tilesMovedEventProcessorResult.totalMatchedCocoonTiles.length > 0 ) {
			Galapago.audioPlayer.playCocoonMatch();
			board.animateStars(tilesMovedEventProcessorResult.totalMatchedCocoonTiles);
			board.blobCollection.removeBlobItems(tilesMovedEventProcessorResult.totalMatchedCocoonTiles);
			board.clearTiles(tilesMovedEventProcessorResult.totalMatchedCocoonTiles);
			//push cocooned tiles to tiles Array for removal and lowering
			tileSetsToBeRemoved.push(tilesMovedEventProcessorResult.totalMatchedCocoonTiles);
			validMatchWithCollection = true;
			board.collectionModified = true;
		}
		if(tilesMovedEventProcessorResult.totalTilesAffectedByLightning.length > 0 ) {
			//board.animateLightningStrikeAsync(tilesMovedEventProcessorResult.totalTilesAffectedByLightning);
			board.clearTiles(tilesMovedEventProcessorResult.totalTilesAffectedByLightning);
			tileSetsToBeRemoved.push(tilesMovedEventProcessorResult.totalTilesAffectedByLightning);
			validMatchWithCollection = true;
			board.collectionModified = true;
		}
		if(tilesMovedEventProcessorResult.totalTilesAffectedBySuperFriend.length > 0 ) {
			console.debug( 'points affected by Super friend ' + Tile.tileArrayToPointsString(tilesMovedEventProcessorResult.totalTilesAffectedBySuperFriend));
			board.clearTiles(tilesMovedEventProcessorResult.totalTilesAffectedBySuperFriend);
			tileSetsToBeRemoved.push(tilesMovedEventProcessorResult.totalTilesAffectedBySuperFriend);
			board.collectionModified = true;
		}
		if(tilesMovedEventProcessorResult.totalMatchedGoldTiles.length > 0 ) {
			board.animateGoldRemovalAsync(tilesMovedEventProcessorResult.totalMatchedGoldTiles);
			board.blobCollection.removeBlobItems(tilesMovedEventProcessorResult.totalMatchedGoldTiles);
			validMatchWithCollection = true;
			board.collectionModified = true;
		}
		if(tilesMovedEventProcessorResult.totalMatchedBlockingTiles.length > 0 ) {
			Galapago.audioPlayer.playGoldOrBlockingMatch();
			board.animateStars(tilesMovedEventProcessorResult.totalMatchedBlockingTiles);
			board.blobCollection.removeBlobItems(tilesMovedEventProcessorResult.totalMatchedBlockingTiles);
			validMatchWithCollection = true;
			board.collectionModified = true;
		}
		if(!validMatchWithCollection){
			Galapago.audioPlayer.playValidMatch(board.chainReactionCounter);
		}
		var verticalPointsSets = Board.getVerticalPointsSets(tileSetsToBeRemoved);
		changedPointsArray  = board.lowerTilesAbove(verticalPointsSets);
		//YM: pointsArray can contain duplicates due to overlapping triplets
		//remove the duplicates
		console.debug( 'pointsArray with possible duplicates ' + MatrixUtil.pointsArrayToString(changedPointsArray) );
		changedPointsArray = ArrayUtil.unique(changedPointsArray);
		console.debug( 'pointsArray with any duplicates removed ' + MatrixUtil.pointsArrayToString(changedPointsArray) );
		if( board.blobCollection.isEmpty() ) {
			if(dangerBar && dangerBar.isRunning() ) {
				dangerBar.stop();
			}
			return tileTriplets;
		}
		this.handleChangedPointsArray(changedPointsArray);		
	}
	return this; //chainable
}; //Board.prototype.handleTriplets()

Board.prototype.animateStars = function(tiles){
	var board = this;
	function draw(){
		_.each(tiles, function(tile){
			board.level.levelAnimation.animateStars(tile.getXCoord(), tile.getYCoord(), tile.blob.image.id, board.blobCollection);
		});
	}
	if(this.putInAnimationQ){
		this.animationQ.push(draw);
	}else{
		draw();
	}
}; //Board.prototype.animateStars()

Board.prototype.handleChangedPointsArray = function(changedPointsArray) {
	var board = this;
	if(changedPointsArray.length){
		var changedTiles = [];
		_.each( changedPointsArray, function( point ) {
			var changedTile = board.creatureTileMatrix[point[0]][point[1]];
			if(changedTile && !changedTile.isPlain()){
				changedTiles.push(changedTile);
			}
		});
		this.handleTriplets(changedTiles);
	}
}; //Board.prototype.handleChangedPointsArray()

Board.getVerticalPointsSets = function(tileSetsToBeRemoved) {
	var verticalPointsSets = [];
	var pointsSets = [];
	_.each(tileSetsToBeRemoved, function(tileSetToBeRemoved){
		_.each(tileSetToBeRemoved, function(tile){
			if(!pointsSets[tile.coordinates[0]]){
				pointsSets[tile.coordinates[0]] = [];
			}
			pointsSets[tile.coordinates[0]][tile.coordinates[1]] = tile.coordinates;
		});
	});

	pointsSets = _.filter(pointsSets, function(pointsSet){
			return pointsSet && pointsSet.length > 0;
	});	
	_.each(pointsSets, function(pointsSet){
		var verticalPointsSet = [];
		var lastTileRow = -1;
		_.each(pointsSet, function(point){
			if(point){
				if(lastTileRow > -1 && ((lastTileRow + 1) != point[1])){
					verticalPointsSets.push(verticalPointsSet);
					verticalPointsSet = [];
				}
				verticalPointsSet.push(point);
				lastTileRow = point[1];
			}
		});	
		verticalPointsSets.push(verticalPointsSet);
	});	
	return verticalPointsSets;
}; //Board.getVerticalPointsSets()


Board.prototype.setComplete = function() {
	var levelHighestScore, timedMode;
	this.level.cleanup(true);
	if(!this.bonusFrenzy){
		this.bonusFrenzy = new BonusFrenzy(this);
	}else{
		$('#level').html(this.score);
		Level.powerUpScore = (Score.BONUS_FRENZY_POWERUP_MULTIPLIER * this.bonusFrenzy.getScore());
		this.score += (Score.BONUS_FRENZY_CREATURE_POINTS * this.bonusFrenzy.getScore()) ;
		if( Galapago.isTimedMode ) {
			var timeleft = this.level.dangerBar.timeRemainingMs;
			$('#time-bonus').html(timeleft/Score.LEVEL_COMPLETE_TIME_BONUS_DIVISOR);
			this.score += (timeleft/Score.LEVEL_COMPLETE_TIME_BONUS_DIVISOR);
		} else {
			$('#row-time-bonus').hide();
		}
		this.displayScore();
		this.level.isCompleted = true;
		timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
		store.setItem( timedMode + Galapago.profile + "level" + this.level.id + ".completed", true );
		levelHighestScore = store.getItem( timedMode + Galapago.profile + "level" + this.level.id + ".highScore");
		var totalScore = store.getItem( timedMode + Galapago.profile + ".totalScore" );
		if(totalScore){
			if(levelHighestScore && (Number(levelHighestScore) < Number(this.score)) ) {
				totalScore=Number(totalScore)+this.score - Number(levelHighestScore);
			}
			else {
				totalScore=Number(totalScore)+this.score;
			}
			store.setItem( timedMode + Galapago.profile + ".totalScore", totalScore );
		}
		else {
			totalScore=this.score;
			store.setItem( timedMode + Galapago.profile + ".totalScore", totalScore );
		}
		if(levelHighestScore && (Number(levelHighestScore) < Number(this.score)) ){
			store.setItem( timedMode + Galapago.profile + "level" + this.level.id + ".highScore", this.score );
		}
		else if(!levelHighestScore){
			store.setItem( timedMode + Galapago.profile + "level" + this.level.id + ".highScore", this.score);
		}
		$('#bonus-frenzy').html( this.bonusFrenzy.getScore() );
		$('#bonus-points').html( Score.BONUS_FRENZY_CREATURE_POINTS * this.bonusFrenzy.getScore() );
		$('#level-score').html( this.score );
		$('#total-score').html( totalScore );
		new DialogMenu('screen-game', this, 'dialog-level-won');
	}
}; //Board.prototype.setComplete()

Board.prototype.handleTileSelect = function(tile) {
	var board, tilePrev, tileCoordinates, dangerBar;
	board = this;
	this.powerupPointsAchievedInThisSwap = 0;
	board.navigationLock = true;
	console.debug("applying navigation lock");
	tilePrev = this.tileSelected;
	if( tile && tilePrev && !(tile === tilePrev) ) {
		tile.setInactiveAsync();
	}
	tileCoordinates = tile.coordinates;
	dangerBar = board.level.dangerBar;
	if(tile && !(tile.isCreatureOnly() || tile.hasSuperFriend()) && !this.powerUp.isFireSelected()){
		//board.sounds['cannot-select'].play();
		Galapago.audioPlayer.playInvalidTileSelect();
		board.navigationLock = false;
		console.debug('reverting navigation lock');
		return;
	}
	
	//YJ: one tile selected; select it and move on
	if( (!this.powerUp.isFireSelected()) && tilePrev === null ) {
		board.tileSelected = tile;
		tile.setSelectedAsync().then( function() {
			board.navigationLock = false;
			console.log('reverting navigation lock in handle tile select 2290');
			return;
		}).done();
	}
	//YJ: two different tiles selected; swap them and look for triplets

	else if((!this.powerUp.isFireSelected()) &&  tile !== tilePrev && (this.adjacent(tile, tilePrev) || this.powerUp.isFlipFlopSelected()) ) {
		if(this.powerUp.isFlipFlopSelected()){
			Galapago.audioPlayer.playFlipFlopSwap();
		}
		if(dangerBar && !dangerBar.isRunning() ) {
			dangerBar.start(); //YJ: RQ 4.4.2
		}
		if(dangerBar){
        dangerBar.pause();
		}
		tile.setSelectedAsync().then(function() {
			board.animateJumpCreaturesAsync(!board.powerUp.isFlipFlopSelected(), tile, tilePrev, function() {
				board.swapCreatures( tile, tilePrev );
				board.animateSwapCreaturesAsync( tile, tilePrev ).then(function() {
					board.handleTripletsDebugCounter = 0;
					board.chainReactionCounter = 0;
					board.scoreEvents = [];
					board.putInAnimationQ = true;
					board.animationQ = [];
					board.handleTriplets([tile, tilePrev]);
					console.log( 'handleTripletsDebugCounter: ' + board.handleTripletsDebugCounter );
					board.powerUp.timerPause();
					board.level.levelAnimation.animateDroppingCreatures(board.animationQ).then(function(){
						if(board.powerupPointsAchievedInThisSwap >= Powerup.MIN_POINTS_FOR_TIP){
							board.powerUp.showTip();
						}
						board.animationQ = [];
						board.putInAnimationQ = false;
						board.powerUp.timerResume();
						if(dangerBar){
							dangerBar.resume();
						}
						if( board.scoreEvents.length > 0 ) {
							board.level.levelAnimation.stopMakeMatchAnimation();
							board.updateScoreAndCollections(tileCoordinates);
							if( ! board.reshuffleService.isStarted ){
								board.reshuffleService.start();
							}
							board.navigationLock = false;
						}
						else if(!board.powerUp.isFlipFlopSelected()) {
							Galapago.audioPlayer.playInvalidSwap();
							// YJ: if no triplet is formed by this move, flip the creatures back to their previous positions
							console.debug( 'no triplet found: undoing last move');
							board.animateJumpCreaturesAsync(true, tilePrev, tile ,function() {
								board.swapCreatures( tile, tilePrev );
								board.animateSwapCreaturesAsync( tile, tilePrev ).then(function() {
									board.setActiveTile(tile);
									board.navigationLock = false;
								}).done();
							}, function(error) {
								console.error(error);
							});
						}
						if(board.powerUp.isFlipFlopSelected()){
							board.setActiveTileByGivenCoordinate(tileCoordinates);
							board.powerUp.powerUsed();
							board.navigationLock = false;
						}
					}, function(error) {
						console.error(error);
					}).done();					
				}, function(error) {
					console.error(error);
				}).done();
			}, function(error) {
				console.error(error);
			});
		}, function(error) {
			console.error(error);
		}).done();
		board.tileSelected = null;
		return;
	}else if(this.powerUp.isFireSelected()){
		this.level.levelAnimation.stopAllAnimations();
		this.reshuffleService.stop();
		Galapago.audioPlayer.playFirePowerUsed();
		this.scoreEvents = [];
		this.score += Score.FIREPOWER_POERUP_USED_POINTS;
		this.updateScore();			
		tile.clear();
		if(dangerBar){ 
			dangerBar.pause();
		}
		var goldTile = this.getGoldTile(tile);
		if(goldTile){
			this.animateGoldRemovalAsync([goldTile]);
			this.blobCollection.removeBlobItems([goldTile]);
		}
		if(tile.isBlocked() || tile.isCocooned()){
			this.blobCollection.removeBlobItems([tile]);
		}
		var tileSet = [[tile]];
		if(tile.hasSuperFriend()){
			this.blobCollection.removeBlobItems([tile]);
			var tilesAffectedBySuperFriend = this.tilesEventProcessor.getTilesAffectedBySuperFriend([tile],[]);
			board.clearTiles(tilesAffectedBySuperFriend);
			tileSet.push(tilesAffectedBySuperFriend);
			var goldTilesAffectedBySuperFriend = this.tilesEventProcessor.getGoldTiles(tilesAffectedBySuperFriend);
			if(goldTilesAffectedBySuperFriend.length){
				this.animateGoldRemovalAsync(goldTilesAffectedBySuperFriend);
				this.blobCollection.removeBlobItems(goldTilesAffectedBySuperFriend);
			}
		}
		var changedPointsArray  = this.lowerTilesAbove(Board.getVerticalPointsSets(tileSet));
		board.handleChangedPointsArray(changedPointsArray);
		if(board.powerupPointsAchievedInThisSwap >= Powerup.MIN_POINTS_FOR_TIP){
			board.powerUp.showTip();
		}
		if(dangerBar){
			dangerBar.resume();
		}
		if( board.scoreEvents.length > 0 ) {
			board.updateScoreAndCollections(tileCoordinates);
		}else if(board.blobCollection.isEmpty()){
			board.level.levelCompleted = true;
			if(board.level.id==1){
				board.level.bubbleTip.showBubbleTip(i18n.t("Game Tips.BonusFrenzy tip"));
			}else{
				board.setComplete();
			}
		}
		this.powerUp.powerUsed();	
		this.saveBoard();
		this.reshuffleService.start();
		board.navigationLock = false;
	}
	// same tile selected; unselect it and move on
	else {
		if((tile === tilePrev) && (this.powerUp.isFlipFlopSelected())){
			board.powerUp.powerSelected = 0;
			board.powerUp.update();
		}
		tilePrev.setUnselected();
		this.tileSelected = null;
		board.navigationLock = false;
		return;
	}
}; //Board.prototype.handleTileSelect

Board.prototype.setActiveTileByGivenCoordinate = function(coordinatesToActivate) {
	this.tileActive = this.getCreatureTilesFromPoints( [coordinatesToActivate] )[0];
	this.tileActive.setActiveAsync().done();
} //Board.prototype.setActiveTileByGivenCoordinate()

Board.prototype.updateScoreAndCollections = function(coordinatesToActivate) {
	var board = this;
	board.updateScore();
	if(board.collectionModified || board.powerAchieved){
		board.saveBoard();
		board.collectionModified = false;
	}
	board.setActiveTileByGivenCoordinate(coordinatesToActivate);
	if( board.blobCollection.isEmpty()){
		board.level.levelCompleted = true;
		if(board.level.id==1){
			board.level.bubbleTip.showBubbleTip(i18n.t('Game Tips.BonusFrenzy tip'));
		}else{
			board.setComplete();
		}		
	}
}; //Board.prototype.updateScoreAndCollections()

Board.prototype.shuffleBoard = function() {
	var tileMatrix = this.creatureTileMatrix;
	var board= this;
	var coordinatesToActivate = board.tileActive.coordinates;
	board.level.levelAnimation.stopAllAnimations();
	board.reshuffleService.stop();	
	var dangerBar= board.level.dangerBar;
	if(dangerBar){
		dangerBar.pause();
	}
	var originalLockedTiles = [];
	var changedPointsArray =[];
	for (var col = tileMatrix.length - 1; col >= 0; col--) {
		for (var row = tileMatrix[col].length - 1; row >= 0; row--) {
			var tile = tileMatrix[col][row];
			if(tile && !tile.isPlain()){
				var coordinates, temp, fallingPoint, fallingPointOther;
				changedPointsArray.push(tile.coordinates);
				fallingPoint = null;
				do{
					var randomIt = Math.floor(Math.random() * ((col * tileMatrix[col].length) + row + 1));
					var newCol = Math.floor(randomIt/tileMatrix[col].length);
					var newRow = randomIt%tileMatrix[col].length;
					temp = tileMatrix[newCol][newRow];
				}while(!temp || temp.isPlain());
				var handled = board.handleLockedTilesForShuffle(tile, temp, changedPointsArray, originalLockedTiles);
				handled = board.handleLockedTilesForShuffle(temp, tile, changedPointsArray, originalLockedTiles) || handled;
				if(!handled){
			    	coordinates = temp.coordinates;
			    	board.addTile(tile.coordinates, null, null, null, temp);
			    	board.addTile(coordinates, null, null, null, tile);
			    }	    
		    }
    	}
    }
    if(originalLockedTiles.length){
    	originalLockedTiles = _.filter(originalLockedTiles, function(tile){
    		var tileAbove = tileMatrix[tile.coordinates[0]][tile.coordinates[1] - 1];
    		if(tileAbove && !tileAbove.isPlain()){
    			return true;
    		}
    		return false;
    	});
    	var otherChangedPointsArray = board.lowerTilesAbove(Board.getVerticalPointsSets([originalLockedTiles]));
    	changedPointsArray = changedPointsArray.concat(otherChangedPointsArray);
    }
    board.handleTripletsDebugCounter = 0;
	board.chainReactionCounter = 0;
	board.scoreEvents = [];
	board.handleChangedPointsArray(ArrayUtil.unique(changedPointsArray));
	if(dangerBar){
		dangerBar.resume();
	}
	if( board.scoreEvents.length > 0 ) {
		board.updateScoreAndCollections(coordinatesToActivate);
	} 
  	var coords = board.tileActive.coordinates; 
  	board.tileActive = board.creatureTileMatrix[coords[0]][coords[1]];
  	board.tileActive.setActiveAsync().done();
  	board.reshuffleService.start();
}; //Board.prototype.shuffleBoard()

Board.prototype.handleLockedTilesForShuffle = function(tile, temp, changedPointsArray, originalLockedTiles) {
	var board = this;
	var fallingPoint = null;
	var coordinates = temp.coordinates;
	if((tile.isBlocked() || tile.isCocooned()) && (!temp.isBlocked() && !temp.isCocooned())){
    	fallingPoint = board.getFallingPoint(tile.coordinates);
    }
    if(fallingPoint && tile.coordinates != fallingPoint){
    	changedPointsArray.push(fallingPoint);
    	board.addTile(fallingPoint, null, null, null, temp);
    	var originalLockedTile = board.addTile(tile.coordinates, 'CREATURE', null, Tile.PLAIN_TILE_SPRITE_NUMBER);
    	originalLockedTile.clear();
    	originalLockedTiles.push(originalLockedTile);
    	board.addTile(coordinates, null, null, null, tile);
    	return true;
   }
   return false;
}; //Board.prototype.handleLockedTilesForShuffle

Board.prototype.dangerBarEmptied = function() {
	var timedMode, tileMatrix, gameboard, tilesRemaining;
	tilesRemaining = [];
	tileMatrix =this.creatureTileMatrix;
	gameboard = this;
	gameboard.level.levelCompleted = true;
	timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	store.removeItem( timedMode + Galapago.profile + "level" + this.level.id + "restore" );
	this.level.levelAnimation.stopAllAnimations();
	this.reshuffleService.stop();
	_.each(tileMatrix, function(columnArray){ //loop over rows
	  _.each(columnArray, function(tile){ //loop over columns
			 if(tile){
			   if( !( gameboard.getGoldTile(tile) || tile.isCollectionKeyCreature() ) ) {
				  tile.clear();
				}else{
					tilesRemaining.push(tile);
				}
			}
		});
	 });
	var key = 'Game Tips.OutOfTime';
	this.level.bubbleTip.showBubbleTip(i18n.t(key));					
	this.unregisterEventHandlers();	
	gameboard.hilightDiv.hide();
	$('#final-score').html(gameboard.score);
	function callback(){
		if( sdkApi.inDemoMode() ){
			new DialogMenu('screen-game', gameboard, 'dialog-game-over');
		}else{
			new DialogMenu('screen-game', gameboard, 'dialog-time-out');
		}
	}
	this.level.levelAnimation.animateDangerBarEmptied(this.screenDiv.selector, tilesRemaining, callback);
}; //Board.prototype.dangerBarEmptied

Board.prototype.saveBoard = function() {
	var restoreLookup, originalblogPositions, tileMatrix, gameboard, x, y, key, originalBlogconfig, timedMode;
	var blogColl, nilcollections;
	restoreLookup = {};
	originalblogPositions = this.level.levelConfig.blobPositions;
	tileMatrix =this.creatureTileMatrix;
	gameboard = this;
	_.each(tileMatrix, function(columnArray){
	  _.each(columnArray, function(tile){
			 if(tile){
				   y = tile.coordinates[0];
				   x = tile.coordinates[1];
				   key = y + '_' + x;
			   restoreLookup[key]= null;
			   if(gameboard.getGoldTile(tile) || tile.isPlain()) {
					originalBlogconfig = originalblogPositions[x][y];
					//TODO jj add constants here for '21' and '11' strings
					if(gameboard.getGoldTile(tile) && originalBlogconfig == '21' && tile.isCreatureOnly()){
						restoreLookup[key]='11'; 
					} else {
				   		restoreLookup[key]=originalBlogconfig; 
					}
				}
				else if(tile.hasSuperFriend() || tile.isBlocked() || tile.isCocooned()){
					restoreLookup[key]= tile.blobConfig;
				}
			  }
		});
 });
	restoreLookup['score'] = gameboard.score;
	blogColl = gameboard.blobCollection.blobCollection;
	nilcollections = [];
    for(var key in blogColl){
		if(blogColl[key].count === 0 )
		  nilcollections.push(key);
	}
	restoreLookup['nilCollection'] =  nilcollections; 	
	if(gameboard.level.dangerBar ){
		restoreLookup['dangerBarTimeRemaining'] =  gameboard.level.dangerBar.timeRemainingMs; 
	}
	timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	store.setItem( timedMode + Galapago.profile + "level" + this.level.id + "restore" , JSON.stringify(restoreLookup) );
}; //Board.prototype.saveBoard()

Board.prototype.handleKeyboardSelect = function() {
    var board = this;
	switch( this.hotspot ) {
		case Board.HOTSPOT_MENU:
			//sdkApi.reportPageView(TGH5.Reporting.Screen.GameMenu);
			if(this.level.dangerBar){
				this.level.dangerBar.pause();
			}
			board.reshuffleService.stop();
			board.displayNavButton( 'menu', false );
			board.hotspot = null;
			new DialogMenu('screen-game', this, 'dialog-game-menu', null, DialogMenu.loadImages(['arrow-left','arrow-right']));
			break;
			//gameMenu.show(this);
		case Board.HOTSPOT_QUIT:	
			if(this.level.dangerBar){
				this.level.dangerBar.pause();
			}
			board.reshuffleService.stop();
			board.displayNavButton( 'quit', false );
			board.hotspot = null;
			new DialogMenu('screen-game', this, 'dialog-quit');
		    break;
		case null: //Fallthrough
		default:
			this.handleTileSelect(this.tileActive);
			if(this.initialSwapForTripletInfo){
				if(this.initialSwapForTripletInfo.tipInfo.initialTile == 'shown'){
					var key = 'Game Tips.'+this.initialSwapForTripletInfo.tipInfo.key+' tip2';
					this.level.bubbleTip.showBubbleTip(i18n.t(key));
					var col = this.initialSwapForTripletInfo.tipInfo.swapTile[0];
					var row = this.initialSwapForTripletInfo.tipInfo.swapTile[1];
					this.initialSwapForTripletInfo.tipInfo.initialTile = 'done';
					this.initialSwapForTripletInfo.tipInfo.swapTile = 'shown';
					var tileActive = this.creatureTileMatrix[col][row];
					this.tileActive.setInactiveAsync().then(function() {
						board.setActiveTile(tileActive);
						return this; //chainable;
					}).done();
				}else if(this.initialSwapForTripletInfo.tipInfo.swapTile == 'shown'){
					var key = 'Game Tips.'+this.initialSwapForTripletInfo.tipInfo.key+' tip3';
					this.level.flashBubbleTip(key);
				}
			}
			break;
	}
	return this; //chainable
}; //Board.prototype.handleKeyboardSelect

Board.prototype.handleRightArrow = function() {
	this.level.levelAnimation.stopMakeMatchAnimation();
	var board, tileRight, col, row;
	board = this;
	if(this.initialSwapForTripletInfo){
	    this.initialSwapForTripletInfo=null ;
		this.level.bubbleTip.clearBubbleTip();
	}
	if(this.hotspot){
		col = board.creatureTileMatrix.length - 1;
	}else{
		col = board.tileActive.coordinates[0];
	}
	row = board.tileActive.coordinates[1];
	do{
		col++;
		if(col==board.creatureTileMatrix.length){
			if(this.hotspot){	
				col = 0;
			}else{
				tileRight = null;
				break;
			}
		}
		tileRight = board.creatureTileMatrix[col][row];
	}while(tileRight === null);
	if( tileRight && !this.navigationLock) {
		board.navigationLock = true;
		if(board.hotspot){
			board.displayNavButton('menu', false);
			board.displayNavButton('quit', false);
			board.hotspot = null;
		}
		
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileRight);
		board.navigationLock = false;
		return this; //chainable;
		}).done();
	}else if(!this.navigationLock){ // move to powerup if on the rightmost
		board.level.levelAnimation.stopCreatureSelectionAnimation();
		board.navigationLock = true;
		board.tileActive.setInactiveAsync(); 
	    if(this.powerUp.isPowerAchieved() && (!this.powerUp.isPowerSelected()) ){
			this.powerUp.addListener();
			this.hotspot = Board.HOTSPOT_POWERUP;
		}else{
			board.displayNavButton('menu', true);
			board.hotspot = Board.HOTSPOT_MENU;
		}
		board.navigationLock = false;
	}
	return this; //chainable
}; //Board.prototype.handleRightArrow

Board.prototype.handleLeftArrow = function() {
	this.level.levelAnimation.stopMakeMatchAnimation();
	var board, tileLeft, col, row;
	board = this;
	if(this.initialSwapForTripletInfo){
	    this.initialSwapForTripletInfo=null ;
		this.level.bubbleTip.clearBubbleTip();
	}
	if(this.hotspot){
		col = 0;
	}else{
		col = board.tileActive.coordinates[0];
	}
	row = board.tileActive.coordinates[1];
	do{
		col--;
		if(col<0){
			if(this.hotspot){
				col = board.creatureTileMatrix.length - 1;
			}else{
				tileLeft = null;
				break;
			}
		}
		tileLeft = board.creatureTileMatrix[col][row];
	}while(tileLeft === null);
	if( tileLeft && !board.navigationLock) {
		board.navigationLock=true;
		if(board.hotspot){
			board.displayNavButton('menu', false);
			board.displayNavButton('quit', false);
			board.hotspot = null;
		}
		
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileLeft);
		board.navigationLock=false;
		return this; //chainable
		}).done();
	} else if(!board.navigationLock){
		board.level.levelAnimation.stopCreatureSelectionAnimation();
		board.navigationLock=true;
		board.tileActive.setInactiveAsync();
		//board.level.levelAnimation.rolloverAnimation.stop();
	    console.log("isPowerAchieved :  "+this.powerUp.isPowerAchieved());
	    if(this.powerUp.isPowerAchieved() && (!this.powerUp.isPowerSelected()) ){
			//this.powerUp.focus();
			this.powerUp.addListener();
			this.hotspot = Board.HOTSPOT_POWERUP;
			//this.powerUp.canvas.focus();
		}else{
			board.displayNavButton('menu', true);
			board.hotspot = Board.HOTSPOT_MENU;	
		}
		board.navigationLock=false;
	}
	return this; //chainable
}; //Board.prototype.handleLeftArrow

Board.prototype.handleDownArrow = function() {
	this.level.levelAnimation.stopMakeMatchAnimation();
	var board, tileDown, col, row;
	board = this;
	if(this.initialSwapForTripletInfo){
	    this.initialSwapForTripletInfo=null ;
		this.level.bubbleTip.clearBubbleTip();
	}
	if(!this.hotspot){
		col = board.tileActive.coordinates[0];
		row = board.tileActive.coordinates[1];
		do{
			row++;
			if(row==board.creatureTileMatrix[col].length){
				row = 0;
			}
			tileDown = board.creatureTileMatrix[col][row];
		}while(tileDown === null);
		if( tileDown && !board.navigationLock) {
			board.navigationLock=true;
			board.tileActive.setInactiveAsync().then(function() {
			board.setActiveTile(tileDown);
			board.navigationLock=false;
			return this; //chainable
			}).done();
		}
	}else if(!board.navigationLock){
		board.navigationLock=true;
		if(this.hotspot == Board.HOTSPOT_POWERUP){
			board.displayNavButton('menu', true);
			board.displayNavButton('quit', false);
			board.hotspot = Board.HOTSPOT_MENU;	
		}else if(this.hotspot == Board.HOTSPOT_MENU) {
			board.displayNavButton('menu', false);
			board.displayNavButton('quit', true);
			this.hotspot = Board.HOTSPOT_QUIT;
		}else if(this.hotspot == Board.HOTSPOT_QUIT){
			if(this.powerUp.isPowerAchieved() && (!this.powerUp.isPowerSelected()) ){
				this.powerUp.addListener("down");
				this.hotspot = Board.HOTSPOT_POWERUP;
				board.displayNavButton('menu', false);
				board.displayNavButton('quit', false);
			}else{
				board.displayNavButton('menu', true);
			board.displayNavButton('quit', false);
				this.hotspot = Board.HOTSPOT_MENU;
			}
		}
		board.navigationLock=false;
	}
	return this; //chainable
}; //Board.prototype.handleDownArrow

Board.prototype.handleUpArrow = function() {
	this.level.levelAnimation.stopMakeMatchAnimation();
	var board, tileUp, col, row;
	board = this;
	if(this.initialSwapForTripletInfo){
	    this.initialSwapForTripletInfo=null ;
		this.level.bubbleTip.clearBubbleTip();
	}
	if(!this.hotspot){
		col = board.tileActive.coordinates[0];
		row = board.tileActive.coordinates[1];
		do{
			row--;
			if(row<0){
				row = board.creatureTileMatrix[col].length - 1;
			}
			tileUp = board.creatureTileMatrix[col][row];
		}while(tileUp === null);
		if( tileUp && !board.navigationLock) {
			board.navigationLock=true;
			board.tileActive.setInactiveAsync().then(function() {
			board.setActiveTile(tileUp);
			board.navigationLock=false;
			return this; //chainable
			}).done();
		}
	}else if(!board.navigationLock){
		board.navigationLock=true;
		if(this.hotspot == Board.HOTSPOT_QUIT) {
			board.displayNavButton('menu', true);
			board.displayNavButton('quit', false);
			this.hotspot = Board.HOTSPOT_MENU;
		}else if(this.hotspot == Board.HOTSPOT_MENU){
			if(this.powerUp.isPowerAchieved() && (!this.powerUp.isPowerSelected()) ){
				this.powerUp.addListener("up");
				this.hotspot = Board.HOTSPOT_POWERUP;
				board.displayNavButton('menu', false);
				board.displayNavButton('quit', false);
			}else{
				board.displayNavButton('menu', false);
				board.displayNavButton('quit', true);
				this.hotspot = Board.HOTSPOT_QUIT;
			}
		}else if(this.hotspot == Board.HOTSPOT_POWERUP){
			board.displayNavButton('menu', false);
			board.displayNavButton('quit', true);
			board.hotspot = Board.HOTSPOT_QUIT;	
		}
		board.navigationLock=false;
	}
	return this; //chainable
}; //Board.prototype.handleUpArrow

// determine whether or not tile2 is adjacent to tile1 either up, down, left or right (not diagonal)
Board.prototype.adjacent = function(tile1, tile2) {
	console.debug( 'called Board.adjacent() with tile1 ' + tile1.coordinates + ' and tile2 ' + tile2.coordinates );
	if( tile2 === this.getNeighbor(tile1, [0, -1]) ||	
		tile2 === this.getNeighbor(tile1, [0, 1])  ||
		tile2 === this.getNeighbor(tile1, [-1, 0]) ||
		tile2 === this.getNeighbor(tile1, [1, 0]) )
	{
		return true;		
	}
	else {
		return false;
	}
}; //Board.prototype.adjacent

Board.prototype.addTriplet = function(triplets, triplet) {
	console.debug( 'found triplet ' + Tile.tileArrayToPointsString(triplet) );
	triplets.push(triplet);
};

Board.prototype.getNeighbor = function( tile, coordsDistance ) {
	return this.getNeighborFromPoint(tile.coordinates, coordsDistance);
};

Board.prototype.getNeighborFromPoint = function( point, coordsDistance ) {
	var tileNeighbor, coordsNeighbor, col, row, matrix;
	matrix = this.creatureTileMatrix;
	coordsNeighbor = MatrixUtil.getNeighborCoordinates(point, coordsDistance);
	col = coordsNeighbor[0];
	row = coordsNeighbor[1];
	if( col < 0 || col >= matrix.length || row < 0 || row >= matrix[0].length ) {
		tileNeighbor = null;
	}
	else {
		tileNeighbor = matrix[coordsNeighbor[0]][coordsNeighbor[1]];
	}
	return tileNeighbor;
};

Board.prototype.getCreatureTilesFromPoints = function(points) {
	var creatureTiles, pointsIt, point;
	creatureTiles = [];
	for( pointsIt = 0; pointsIt < points.length; pointsIt++ ) {
		point = points[pointsIt];
		creatureTiles.push(this.getCreatureTileFromPoint(point));
	}
	return creatureTiles;
}; //Board.prototype.getCreatureTilesFromPoints()

Board.prototype.getCreatureTileFromPoint = function(point) {
	return this.creatureTileMatrix[point[0]][point[1]];
};


Board.prototype.lowerTilesAbove = function(verticalPointsSets) {
	var pointsAbove, tilesAbove, emptyPoints, changedPoints, boardAnimation;
	var board = this;
	var changedPointsArray = [];
	var nonFirstRowPoints = [];
	_.each( verticalPointsSets, function( verticalPointsSet) {
		console.debug( 'lowering tiles above ' + MatrixUtil.pointsArrayToString(verticalPointsSet) );
		//filter already handled pointset if any
		verticalPointsSet = _.filter(verticalPointsSet, function(point){
			return !_.contains(changedPointsArray, point);
		});
		console.debug( 'lowering tiles above for filtered ' + MatrixUtil.pointsArrayToString(verticalPointsSet) );
		if(verticalPointsSet.length > 0){
			emptyPoints = [];
			pointsAbove = MatrixUtil.getNeighborsAbovePoints(verticalPointsSet);
			//board.removeTiles(board.getCreatureTilesFromPoints(verticalPointsSet));
			tilesAbove = board.getCreatureTilesFromPoints(pointsAbove);
			if(board.putInAnimationQ){
				boardAnimation = board.animationQ;
				board.animationQ = [];
			}
			changedPoints = board.lowerTiles(tilesAbove, verticalPointsSet.length);
			changedPointsArray = changedPointsArray.concat(changedPoints);
			var startIndex = tilesAbove.length - changedPoints.length;
			emptyPoints = MatrixUtil.getFirstNRowPoints(verticalPointsSet, startIndex);
			if(startIndex > 0){
				//nullify non first row empty points so that they dont take further part in lower tiles
				board.nullifyEmptyPoints(emptyPoints);
				nonFirstRowPoints = nonFirstRowPoints.concat(emptyPoints);
			}
			else{
				changedPoints = board.fillEmptyPoints(emptyPoints);
				changedPointsArray = changedPointsArray.concat(changedPoints);
			}
			if(board.putInAnimationQ){
				boardAnimation.push(board.animationQ);
				board.animationQ = boardAnimation;
			}
			console.debug( 'changed points Array ' + MatrixUtil.pointsArrayToString(changedPointsArray) );
		}
	});

	nonFirstRowPoints = _.filter(nonFirstRowPoints, function(point){
		return !_.contains(changedPointsArray, point);
	});
	
	//TODO client to confirm non first row empty points functionality
	changedPoints = board.fillEmptyPoints(nonFirstRowPoints, true);
	changedPointsArray = changedPointsArray.concat(changedPoints);
	return changedPointsArray; //chainable
}; //Board.prototype.lowerTilesAbove()

Board.prototype.nullifyEmptyPoints = function(emptyPoints) {
	var tileMatrix = this.creatureTileMatrix;
	_.each(emptyPoints, function(emptyPoint){
		tileMatrix[emptyPoint[0]][emptyPoint[1]] = null;
	});
}; //Board.prototype.nullifyEmptyPoints()

Board.prototype.lowerTiles = function(tiles, numRows) {
	var loweredPoint, board, changedPoints;
	changedPoints = [];
	board = this;
	_.each( tiles, function(tile) {
		if( tile && (tile.isCreatureOnly() || tile.hasSuperFriend())) { //YM: tile could have already been nulled by a previous triplet formed by the same creature move
			loweredPoint = MatrixUtil.lowerPointByNRows(tile.coordinates, numRows);
			var fallingPoint = board.getFallingPoint(loweredPoint);
			var spriteNumber = Tile.PLAIN_TILE_SPRITE_NUMBER; //no creature
			//Falling tile..Add plain tile so that it keeps falling
			if(loweredPoint != fallingPoint){
				board.addTile(tile.coordinates, 'CREATURE', null, spriteNumber);
				board.addTile(loweredPoint, 'CREATURE', null, spriteNumber);
			}
			board.addTile(fallingPoint, tile.blob.blobType, null, null, tile);
			changedPoints.push(fallingPoint);
		}
		else{
			return false;
		}
	});
	return changedPoints; //chainable
}; //Board.prototype.lowerTiles()


Board.prototype.getFallingPoint = function(loweredPoint) {
	var col = loweredPoint[0];
	var row = loweredPoint[1] + 1;
	var tileToBeReplaced = null;
	if(row < this.creatureTileMatrix[0].length){ 
		tileToBeReplaced = this.creatureTileMatrix[col][row];
	}
	if(tileToBeReplaced === null){
		return this.getLeftRightFallingPoint(loweredPoint, col, row);
	}
	if (tileToBeReplaced.isPlain()){
		return this.getFallingPoint(tileToBeReplaced.coordinates);
	}
	else{
		//If current point is plain check down and left
		//if((this.creatureTileMatrix[loweredPoint[0]][loweredPoint[1]]).isPlain()){
			return this.getLeftRightFallingPoint(loweredPoint, col, row);				
		//}
		//else{
		//	return loweredPoint;
		//}
	} 
}; //Board.prototype.getFallingPoint()

Board.prototype.getLeftRightFallingPoint = function(loweredPoint, col, row) {
	var tileToBeReplaced = null;
	col = col -1;
	if(col > -1){
		tileToBeReplaced = this.creatureTileMatrix[col][row];
	}
	if(tileToBeReplaced && tileToBeReplaced.isPlain()){
		return this.getFallingPoint(tileToBeReplaced.coordinates);
	}
	else{
		tileToBeReplaced = null;
		col = col + 2;
		if(col < this.creatureTileMatrix.length){
			tileToBeReplaced = this.creatureTileMatrix[col][row];
		}
		if(tileToBeReplaced && tileToBeReplaced.isPlain()){
			return this.getFallingPoint(tileToBeReplaced.coordinates);
		}
		else{
			return loweredPoint;
		}
	}
}; //Board.prototype.getLeftRightFallingPoint()

Board.prototype.fillEmptyPoints = function(emptyPoints, nonFirstRowPoints) {
	var changedPoints= [];
	var plainSpriteNumber = Tile.PLAIN_TILE_SPRITE_NUMBER; //no creature
	var spriteNumber = Tile.CREATUREONLY_TILE_SPRITE_NUMBER;
	var board = this;
	emptyPoints = ArrayUtil.unique(emptyPoints);
	_.each( emptyPoints, function(point) {
		//var col = point[0];
		//var row = point[1] + 1;
		//var tile = board.creatureTileMatrix[col][row];
		//if(tile && tile.isPlain()){
		if(!nonFirstRowPoints || board.pointEligibleForGeneration(point)){	
			var fallingPoint = board.getFallingPoint(point);
			while(fallingPoint != point){
				board.addTile(fallingPoint, 'CREATURE', null, spriteNumber);
				changedPoints.push(fallingPoint);
				fallingPoint = board.getFallingPoint(point);
			}
			board.addTile(point, 'CREATURE', null, spriteNumber);
			changedPoints.push(point);
		}else{
			board.addTile(point, 'CREATURE', null, plainSpriteNumber);
		}
	});
	return changedPoints;
}; //Board.prototype.fillEmptyPoints()

Board.prototype.pointEligibleForGeneration = function(point) {
	var tileLeftUp =  this.getNeighborFromPoint(point, [-1, -1]);
	var tileRightUp =  this.getNeighborFromPoint(point, [1, -1]);
	return (tileLeftUp !== null && !tileLeftUp.isPlain()) || (tileRightUp !==null && !tileRightUp.isPlain());
}; //Board.prototype.pointEligibleForGeneration()

// run an animation removing a matching tile triplet
Board.prototype.removeTriplets = function(tileTriplets, scoreEvents) {
	var board, counter = 0;
	board = this;
	tileTriplets = _.each( tileTriplets, function(tileTriplet) {
		console.debug( 'removing triplet ' + Tile.tileArrayToPointsString(tileTriplet) );
		if(tileTriplet[0].hasLightningCreature()){
			board.animateLightningStrikeAsync(tileTriplet);
		}
		board.clearTiles(tileTriplet, true);
		board.animateScores(scoreEvents[counter], tileTriplet);
		counter++;
	});
	return this; //chainable
}; //Board.prototype.removeTriplets()

Board.prototype.removeTiles = function(tiles) {
	var board;
	board = this;
	_.each( tiles, function(tile) {
		board.removeTile(tile);
	});
}; //Board.prototype.removeTiles()

Board.prototype.clearTiles = function(tiles, sparkles) {
	var board;
	board = this;
	var pointsArray = Tile.tileArrayToPointsArray(tiles);
	function draw(){
		if(sparkles){
			var centerPoint = pointsArray[Math.floor(pointsArray.length / 2)];
			board.level.levelAnimation.animateSparkles(Tile.getXCoord(centerPoint[0]), Tile.getYCoord(centerPoint[1]));
		}
		_.each( pointsArray, function(point) {
			board.creatureLayer.clearRect( Tile.getXCoord(point[0]), Tile.getYCoord(point[1]), Board.TILE_WIDTH, Board.TILE_HEIGHT );
			var tile = board.getCreatureTilesFromPoints( [point] )[0];
			tile.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
			board.creatureLayer.drawImage(board.level.gameImages.tile_regular, Tile.getXCoord(point[0]), Tile.getYCoord(point[1]), Board.TILE_WIDTH, Board.TILE_HEIGHT );
		});
	}
	if(this.putInAnimationQ){
		this.animationQ.push(draw);
	}else{
		draw();
	}
}; //Board.prototype.clearTiles()

Board.prototype.swapCreatures = function(tileSrc, tileDest) {
	var tempCoordinates/*, deferred*/;
	tempCoordinates = tileSrc.coordinates.slice(0);
	this.addTile(tileDest.coordinates, tileSrc.blob.blobType, null, null, tileSrc);
	this.addTile(tempCoordinates, tileDest.blob.blobType, null, null, tileDest);
	return this;
};

// switch the positions of two creature tiles on the board
// we pause after a flip to give the player time to view the animation
// since the flip can be reversed if no triplet is formed after the flip
Board.prototype.animateSwapCreaturesAsync = function(tileSrc, tileDest) {
	var deferred;
	deferred = Q.defer();
	tileSrc.setUnselected();
	tileDest.setUnselected();

	Q.delay(Tile.DELAY_AFTER_FLIP_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
};

// switch the positions of two creature tiles on the board
// we pause after a flip to give the player time to view the animation
// since the flip can be reversed if no triplet is formed after the flip
Board.prototype.animateJumpCreaturesAsync = function(eligibleForAnimation, tileSrc, tileDest, callback) {
	var deferred;
	//deferred = Q.defer();
	tileSrc.setUnselected();
	tileDest.setUnselected();
	if(eligibleForAnimation){
		this.level.levelAnimation.animateCreaturesSwap(this.creatureLayer, this, tileSrc, tileDest, function(){
			callback();
		} );
	}else{
		callback();
	}
};

Board.prototype.animateBoardBuild = function(callback) {
	var deferred;
	if(this.isBoardBuildAnimationNeeded){
		this.level.levelAnimation.animateBoardBuild(this.creatureLayer, this, function(){
			callback();
		} );
	}else{
		callback();
	}
};

//get the gold tile backing an individual creature tiles
Board.prototype.getGoldTile = function(creatureTile) {
	var creatureTileCol, creatureTileRow;
	creatureTileCol = creatureTile.coordinates[0];
	creatureTileRow = creatureTile.coordinates[1];
	return this.goldTileMatrix[creatureTileCol][creatureTileRow];
}; //Board.prototype.getGoldTile()

Board.prototype.animateGoldRemovalAsync = function(goldTiles) {
	var /*deferred,*/ board;
	//deferred = Q.defer();
	board = this;
	Galapago.audioPlayer.playGoldOrBlockingMatch();
	_.each(goldTiles, function(tile) {
		board.removeTile(tile);
		//board.creatureLayer.clearRect( tile.getXCoord(), tile.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT );
		//var spanId = 'span_'+tile.coordinates[1]+'_'+tile.coordinates[0];
		//$('#'+spanId).css('backgroundImage','url('+board.level.gameImages.tile_regular.src+')');
		//board.creatureLayer.drawImage( board.level.gameImages.tile_regular, tile.getXCoord(), tile.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT );

	});
	//deferred.resolve();
	//return deferred.promise;
	return;
}; //Board.prototype.animateGoldRemovalAsync()

Board.prototype.animateLightningStrikeAsync = function(matchingTilesSet) {
	var board = this;
	function draw(){
		Galapago.audioPlayer.playLightningStrike();
		board.level.levelAnimation.animateLightning(matchingTilesSet);
	}
	if(this.putInAnimationQ){
		this.animationQ.push(draw);
	}else{
		draw();
	}
}; //Board.prototype.animateLightningStrikeAsync()

//generate a random number r between 0 and creatureTypes.length - 1
//return a creature image with the rth creature type from the list
Board.prototype.randomCreature = function(creatureTypes) {
	var randomIt, creatureType, creatureImage, creature;
	randomIt = Math.floor( Math.random() * creatureTypes.length );
	creatureType = creatureTypes[randomIt];
	creatureImage = this.level.getCreatureImage(creatureType, Level.CREATURE_SPRITE_NUMBERS[0]);
	creature  = new Creature(creatureType, creatureImage);
	return creature;
}; //Board.prototype.randomCreature()

Board.prototype.updateScore = function() {
	this.level.levelAnimation.stopScoreTallyingAnimation();
	this.score += Score.consolidateScores(this.scoreEvents);
	this.displayScore();
	return this; //chainable
}; //Board.prototype.updateScore

Board.prototype.animateScores = function(scoreEvent, matchingTilesSet) {
	var board, pointsArray, centerPoint, xCoord, yCoord;
	board = this;
	pointsArray = Tile.tileArrayToPointsArray(matchingTilesSet);
	centerPoint = pointsArray[Math.floor(pointsArray.length / 2)];
	xCoord = Tile.getXCoord(centerPoint[0]);
	yCoord = Tile.getXCoord(centerPoint[1]);
	if(scoreEvent.chainReactionCounter > 1){
		function scoreChainReactionAnimation(){
			board.level.levelAnimation.animateScore(xCoord, yCoord, "x" + scoreEvent.chainReactionCounter, true);
		}
		if(board.putInAnimationQ){
			board.animationQ.push(scoreChainReactionAnimation);
		}else{
			scoreChainReactionAnimation();
		}
	}
	function scoreAnimation(){
		board.level.levelAnimation.animateScore(xCoord, yCoord, scoreEvent.score(), true, true, board);
	}
	if(board.putInAnimationQ){
		board.animationQ.push(scoreAnimation);
	}else{
		scoreAnimation();
	}
};

Board.prototype.displayScore = function() {
	this.scoreElement.html( this.score );
	return this; //chainable
}; //Board.prototype.displayScore()

Board.prototype.handleClickOrTap = function(evt) {
	var col, row, tile, matrix, message, board;
	board = this;
	col = Tile.getCol(evt.clientX);
	row = Tile.getRow(evt.clientY);
	matrix = board.creatureTileMatrix;
	if( col >= 0 && col < matrix.length && row >= row && row < matrix[0].length ) {
		tile = matrix[col][row];
	}
	message = 'x: ' + evt.clientX + ', y:' + evt.clientY;
	if( tile ) {
		message += ' ' + tile.toString();
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tile);
		}).done();
		this.handleTileSelect(tile);
	}
	else {
		message += ' clicked outside of creature grid';
	}
	console.debug(message);
	return;
};//Board.prototype.handleClickOrTap()

Board.prototype.focus = function(evt) {
	$('#layer-creature').focus();
};

Board.prototype.onDialogClose = function(evt) {
	$('#layer-creature').focus();
	if(!this.level.levelCompleted){
		this.setActiveTile(this.tileActive);
	}
};

Board.prototype.onBoardOut = function() {
	this.level.levelAnimation.stopMakeMatchAnimation();
	this.level.levelAnimation.stopCreatureSelectionAnimation();
	if(this.tileActive){
		this.tileActive.setInactiveAsync();
	}
}

Board.prototype.onBoardIn = function() {
	this.setActiveTile(this.tileActive);
}
/* end class Board */

/*
begin class Tile
Tile has a blob (either a Creature or a Gold)
Tile has a matrix coordinate
Tile can be Selected
Tile can be MousedOver
*/
Tile.BORDER_COLOR = '#d3d3d3';
Tile.BORDER_WIDTH = 2;
Tile.DELAY_AFTER_FLIP_MS = 0;
Tile.DELAY_AFTER_ACTIVATE_MS = 0;
Tile.PLAIN_TILE_SPRITE_NUMBER = '0';
Tile.CREATUREONLY_TILE_SPRITE_NUMBER = '1';
Tile.BLOCKED_TILE_SPRITE_NUMBER = '2';
Tile.COCOONED_TILE_SPRITE_NUMBER = '3';

function Tile(board, blob, coordinates, spriteNumber) {
	this.board = board;
	this.blob = blob;
	this.coordinates = coordinates;
	this.spriteNumber = spriteNumber;
}

Tile.draw = function(xCoord, yCoord, goldTile, image, board, hasBorder) {
	var layer = board.creatureLayer;
	layer.clearRect( xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	if( hasBorder ) {
		Tile.drawBorderByCoords(layer, Tile.BORDER_COLOR, Tile.BORDER_WIDTH, xCoord, yCoord) ;
	}
	if( goldTile ) {
		layer.drawImage( goldTile.blob.image, xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	}
	else{
		layer.drawImage(board.level.gameImages.tile_regular, xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	}
	if(image){
		layer.drawImage(image, xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT);
	}
};

Tile.prototype.drawComplete = function(drawSelection, eraseTile, xCoord, yCoord) {
	var goldTile, layer, tile;
	if(!xCoord){
		xCoord = this.getXCoord();
	}
	if(!yCoord){
		yCoord = this.getYCoord();
	}
	tile = this;
	layer = this.board.creatureLayer;
	layer.clearRect( xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	tile.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
	goldTile = this.board.getGoldTile(tile);
	if( goldTile ) {
		layer.drawImage( goldTile.blob.image, xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	}
	else{
		layer.drawImage(this.board.level.gameImages.tile_regular, xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	}
	if(drawSelection){
		layer.drawImage( this.board.level.gameImages.tile_active, xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT );
	}
	if(!eraseTile){
		layer.drawImage(tile.blob.image, xCoord, yCoord, Board.TILE_WIDTH, Board.TILE_HEIGHT);
	}
};

Tile.prototype.toString = function() {
	var output, tileType;
	if( this.blob === null || this.blob.creatureType === null ) {
		tileType = this.spriteNumber;
	}
	else {
		tileType = this.blob.creatureType + ' ' + this.spriteNumber;
	}
	output = '[' + this.coordinates[0] + ',' + this.coordinates[1] + ']:' + tileType;
	return output;
};

//return true if this tile has the same creature as that tile
Tile.prototype.matches = function(that) {
	var isMatch;
	isMatch = false;
	if( that instanceof Tile && that && this.blob && that.blob && this.blob.creatureType === that.blob.creatureType) {
		isMatch = true;
	}
	return isMatch;
};

//return true if this tile has the same color superfriend as that tile
Tile.prototype.matchesSuperFriend = function(that) {
	var isMatch;
	isMatch = false;
	if( that instanceof Tile && that && this.blob.creatureType.indexOf(that.blob.color) > -1) {
		isMatch = true;
	}
	return isMatch;
};

Tile.prototype.setActiveAsync = function(markTile) {
	var deferred;
	//console.debug('active tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	this.drawHilight();
	this.board.level.levelAnimation.animateCreatureSelection(this.board.creatureLayer, this.board, markTile);
	Q.delay(Tile.DELAY_AFTER_ACTIVATE_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}; //Tile.prototype.setActiveAsync()

Tile.prototype.setInactiveAsync = function() {
	var deferred;
	//console.debug('inactive tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	this.eraseHilight();
	Q.delay(Tile.DELAY_AFTER_ACTIVATE_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}; //Tile.prototype.setActiveAsync()

Tile.prototype.setSelectedAsync = function() {
	var deferred;
	console.debug('selected tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	this.drawComplete(true);
	Galapago.audioPlayer.playTileSelect();
	deferred.resolve();
	return deferred.promise;

}; //Tile.prototype.setSelectedAsync()

Tile.prototype.setUnselected = function() {
	this.drawComplete();
	return this; // chainable
};

Tile.prototype.clear = function() {
	var goldAssetPath, imageGold, tileActive;
	tileActive = this.board.tileActive;
	this.drawComplete(false, true);
};

Tile.prototype.drawBorder = function(color, lineWidth) {	
	var layer, x, y, width, height, offset;
	layer = this.board.creatureLayer;
	x = Tile.getXCoord(this.coordinates[0]);
	y = Tile.getYCoord(this.coordinates[1]);
	Tile.drawBorderByCoords(layer, color, lineWidth, x, y) ;
}; //Tile.prototype.drawBorder()

Tile.drawBorderByCoords = function(layer, color, lineWidth, x, y) {	
	var layer, x, y, width, height, offset;
	layer.strokeStyle = color;
	layer.lineWidth = lineWidth;
	offset = 1;
	width = Board.TILE_WIDTH * offset;
	height = Board.TILE_HEIGHT * offset;
	layer.strokeRect(x, y, width, height);
};

Tile.prototype.drawHilight = function() {	
	var div, x, y, width, height;
	div = this.board.hilightDiv;
	x = Tile.getXCoord(this.coordinates[0]) + Board.GRID_LEFT;
	y = Tile.getYCoord(this.coordinates[1]) + Board.GRID_TOP;
	div.css('left', + x + 'px');
	div.css('top', y + 'px');
	div.show();
}; //Tile.prototype.drawHilight()

Tile.prototype.eraseHilight = function() {	
	this.board.hilightDiv.hide();
}; //Tile.prototype.drawHilight()


Tile.prototype.getXCoord = function() {	
	return Tile.getXCoord(this.coordinates[0]);
}; //Tile.prototype.getXCoord()

Tile.prototype.getYCoord = function() {	
	return Tile.getYCoord(this.coordinates[1]);
}; //Tile.prototype.getXCoord()

Tile.prototype.isBlocked = function()  {
	return this.spriteNumber == Tile.BLOCKED_TILE_SPRITE_NUMBER;
};

Tile.prototype.isCocooned = function()  {
	return this.spriteNumber == Tile.COCOONED_TILE_SPRITE_NUMBER;
};

Tile.prototype.isPlain = function()  {
	return this.spriteNumber == Tile.PLAIN_TILE_SPRITE_NUMBER;
};

Tile.prototype.isCreatureOnly = function()  {
	return this.spriteNumber == Tile.CREATUREONLY_TILE_SPRITE_NUMBER;
};

Tile.prototype.isCollectionKeyCreature = function()  {
	return this.isBlocked() || this.isCocooned() || this.hasSuperFriend();
};

Tile.prototype.hasLightningCreature = function()  {
	return this.blob.creatureType && this.blob.creatureType.startsWith('t');
};

Tile.prototype.hasSuperFriend = function()  {
	return this.blob && this.blob.blobType === 'SUPER_FRIEND';
};


//static
Tile.posToPixels = function(pos, basePixels) {
	var unitPixels;
	unitPixels = Math.floor(basePixels);
	return pos * unitPixels;
}; //Tile.prototype.posToPixels()

Tile.pixelsToPos = function(pixels, basePixels) {
	var unitPixels;
	pixels = pixels;
	unitPixels = basePixels;
	return Math.floor(pixels / unitPixels);
}; //Tile.prototype.posToPixels()

Tile.getXCoord = function(col) {
	return Tile.posToPixels(col, Board.TILE_WIDTH);
}; //Tile.prototype.getXCoord()

Tile.getYCoord = function(row) {
	return Tile.posToPixels(row, Board.TILE_HEIGHT);
}; //Tile.prototype.getYCoord()

Tile.getCol = function(xCoord) {
	return Tile.pixelsToPos(xCoord, Board.TILE_WIDTH);
}; //Tile.prototype.getXCoord()

Tile.getRow = function(yCoord) {
	var offsetY;
	offsetY = $('#screen-game')[0].offsetTop - window.scrollY;
	return Tile.pixelsToPos(yCoord, Board.TILE_HEIGHT, 1, offsetY);
}; //Tile.prototype.getYCoord()

Tile.tileArrayToPointsArray = function (tiles) {
	return _.map(tiles, function(tile) {
		return tile.coordinates;
	});
};

//static
Tile.tileArrayToPointsString = function (tiles) {
	return MatrixUtil.pointsArrayToString(Tile.tileArrayToPointsArray(tiles));
};
/* end class Tile */

//TODO consider having Creature and Gold extend a base class Blob

/*
begin class Creature
Creature has a CreatureType
Creature has an Image
*/
function Creature(creatureType, image) {
	//var blobType, creatureType, image;
	this.blobType = 'CREATURE';
	this.creatureType = creatureType;
	this.image = image;
}
/* end class Creature */

/*
begin class Gold
Gold has an Image
*/
function Gold(image) {
	this.blobType = 'GOLD';
	this.image = image;
}
/* end class Gold */

/*
begin class SuperFriend
SuperFriends has an Image
*/
function SuperFriend(image, color) {
	this.blobType = 'SUPER_FRIEND';
	this.image = image;
	this.color = color;
}
/* end class SuperFriend */

/* begin class DangerBar */
DangerBar.REFRESH_INTERVAL_SEC = 5;
DangerBar.RATIO_DANGER = 0.15;
DangerBar.WARNING_10_SEC = 10;
DangerBar.WARNING_5_SEC = 5;
DangerBar.BOTTOM_CAP_TOP = 457;
DangerBar.CAP_TOP_TOP = 63;
DangerBar.FILL_ADJUSTMENT_LEFT = 18;
DangerBar.FILL_ADJUSTMENT_TOP = 31;
DangerBar.CAP_BOTTOM_TOP = 495;
DangerBar.IMAGE_MAGNIFICATION = 2;
DangerBar.CROWN_LEFT = 12;
DangerBar.CROWN_IMAGE_MAGNIFICATION = 1.6;

//the references to style.top and style.left in this class' images are only meant for variable storage
//and layout in a canvas, not via CSS, thus they leave off 'px' from the positions
function DangerBar(initialTimeMs, levelAnimation) {
	this.levelAnimation = levelAnimation;
	this.danger_bar = CanvasUtil.magnifyImage(LoadingScreen.gal.get("screen-game/danger-bar.png"), DangerBar.IMAGE_MAGNIFICATION );
	this.div = $('#div-danger-bar');
	this.div.empty();
	this.div.show();
	this.divAnimation = $('#div-animation-danger-bar');	
	this.divAnimation.empty();
	this.divAnimation.show();
	this.initialTimeMs = initialTimeMs;
	this.timeRemainingMs = initialTimeMs;
	this.fillTop = DangerBar.FILL_ADJUSTMENT_TOP;
	this.fillTopInitial = this.fillTop;
	this.fillHeight = DangerBar.CAP_BOTTOM_TOP - DangerBar.CAP_TOP_TOP;
	this.fillHeightInitial = this.fillHeight;
	/* ym: REQ 4.9.11 Time Warning at 15%
	since our ratio might not match exactly, we keep a counter to keep track
	of the first time the dangerBar goes below the ratio
	*/
	this.numTimesBelowDangerRatio = 0;
	this.timer = null;
	this.div.css( 'background-image', 'url(' + this.danger_bar.src + ')' );
	this.div.css( 'display', 'block' );
	this.imageCrown = null;
	this.fillImage = LoadingScreen.gal.getSprites("screen-game/danger-bar-fill-strip.png")[0];
	this.drawImages();
}

DangerBar.prototype.drawImages = function() {
	var imageCrown;
	if(this.imageCrown){
		this.imageCrown.parentNode.removeChild(this.imageCrown);
	}
	imageCrown = LoadingScreen.gal.get("screen-game/danger-bar-crown.png");
	this.imageCrown = this.addImage(this.div.selector, imageCrown, DangerBar.CROWN_LEFT, this.fillTop - 5, DangerBar.CROWN_IMAGE_MAGNIFICATION);
	this.levelAnimation.animateDangerBar(this.divAnimation.selector, DangerBar.FILL_ADJUSTMENT_LEFT, this.fillTop);
}; //DangerBar.prototype.drawImages()

DangerBar.prototype.isRunning = function() {
	if(!this.timer){
	return false;
	}
	return this.timer.isRunning();
}; //DangerBar.prototype.isRunning()

DangerBar.prototype.start = function() {
	var dangerBar;
	dangerBar = this;
	this.timer = new PauseableInterval( this, dangerBar.update, DangerBar.REFRESH_INTERVAL_SEC * 1000 );
	console.debug('starting danger bar timing with ' + dangerBar.timeRemainingMs/1000 + ' sec remaining');
	return dangerBar; //chainable
}; //DangerBar.prototype.start()

DangerBar.prototype.stop = function() {
	console.debug('stopping danger bar timing with ' + this.timeRemainingMs/1000 + ' sec remaining');
	if(this.timer){
		this.timer.clearInterval();
	}
	return this; //chainable
}; //DangerBar.prototype.stop()

DangerBar.prototype.pause = function() {
	console.debug('pausing danger bar timing with ' + this.timeRemainingMs/1000 + ' sec remaining');
	console.debug('currentTime pause   : '+new Date().getTime());
	this.levelAnimation.stopDangerBarAnimations();
	this.addImage(this.divAnimation.selector, this.fillImage, DangerBar.FILL_ADJUSTMENT_LEFT, this.fillTop, 2);
	if(this.timer){
		this.timer.pause();
	}
	return this; //chainable
}; 

DangerBar.prototype.resume = function() {
	console.debug('resume danger bar timing with ' + this.timeRemainingMs/1000 + ' sec remaining');
	console.debug('currentTime resume: '+new Date().getTime());
	this.divAnimation.empty();
	this.drawImages();
	if(this.timer){
		this.timer.resume();
	}
	return this; //chainable
}; 

DangerBar.prototype.update = function(sender) {
	var ratio, dangerBar, fillHeight;
	dangerBar = Galapago.level.dangerBar;
	dangerBar.timeRemainingMs -= DangerBar.REFRESH_INTERVAL_SEC * 1000;
	ratio = dangerBar.timeRemainingMs / dangerBar.initialTimeMs;
	console.debug( 'danger bar time remaining ' + dangerBar.timeRemainingMs/1000 + ' sec (' + Math.round(ratio* 100) + '%)' );
	fillHeight = Math.round(dangerBar.fillHeightInitial * ratio);
	dangerBar.fillTop += (dangerBar.fillHeight - fillHeight);
	dangerBar.fillHeight = fillHeight;
	dangerBar.drawImages();
	if( ratio > 0 && ratio <= DangerBar.RATIO_DANGER) { //0 < ratio <= DangerBar.RATIO_DANGER
		dangerBar.levelAnimation.animateDangerBarWarning(dangerBar.div.selector, 0, DangerBar.BOTTOM_CAP_TOP);

		if( (ratio <= DangerBar.RATIO_DANGER && dangerBar.numTimesBelowDangerRatio === 0) ||
		(dangerBar.timeRemainingMs/1000 <= 10 && dangerBar.timeRemainingMs/1000 > 5) ||
		(dangerBar.timeRemainingMs/1000 <= 5 && dangerBar.timeRemainingMs/1000 > 0) ) {
			dangerBar.numTimesBelowDangerRatio++;
			dangerBar.playWarningSoundRepeated();
		}
	}
	else if(ratio <= 0){ //ratio = 0; timeout!
		dangerBar.levelAnimation.stopDangerBarAnimations();
		dangerBar.addImage(dangerBar.div.selector, LoadingScreen.gal.getSprites("screen-game/danger-bar-warning-strip.png")[0], 0, DangerBar.BOTTOM_CAP_TOP, 1);
		dangerBar.stop();
		Galapago.level.board.dangerBarEmptied();
	}
	return dangerBar; //chainable
}; //DangerBar.prototype.update()

DangerBar.prototype.addImage = function(parentElementSelector, sprite, left, top, magnificationFactor ){
	var image;
	image = new Image(); 
	image.src = sprite.src;
	image.width = sprite.naturalWidth * magnificationFactor;
	image.height = sprite.naturalHeight * magnificationFactor;
	image.style.position = 'absolute';
	image.style.left = left + 'px';
	image.style.top = top + 'px';
	$(parentElementSelector).append(image);
	return image;
};

//req 4.9.11 time warning
DangerBar.prototype.playWarningSoundRepeated = function() {
	Galapago.audioPlayer.playTimeWarning();
}; //DangerBar.playWarningSoundRepeated()

/* end class DangerBar */

ReshuffleService.CHECK_VALID_MOVE_INTERVAL_MS = 20000;
function ReshuffleService(board){
	this.board = board;
	this.reshuffleInterval = null;
	this.isStarted = false;
}

ReshuffleService.prototype.start = function() {
	var reshuffleService, board, swapForTripletInfo, validMoveFound, powerActive, initialTile, swapTile;
	reshuffleService = this;
	board = this.board;
	if( !this.reshuffleInterval) {
		this.reshuffleInterval = setInterval(function(){
			var validMoveWithGoldFound;
			if(reshuffleService.board.level.id == 1 || reshuffleService.board.level.id == 2){
				swapForTripletInfo = MatchFinder.findMatch(reshuffleService.board, true);
				validMoveWithGoldFound = swapForTripletInfo.tipInfo.initialTile !== null;
			}
			if(!validMoveWithGoldFound){
				swapForTripletInfo = MatchFinder.findMatch(reshuffleService.board);
			}
			validMoveFound = swapForTripletInfo.tipInfo.initialTile !== null;
			powerActive = reshuffleService.board.powerUp.isPowerAchieved();
			if(validMoveFound){
				initialTile = reshuffleService.board.getCreatureTileFromPoint(swapForTripletInfo.tipInfo.initialTile);
				swapTile = reshuffleService.board.getCreatureTileFromPoint(swapForTripletInfo.tipInfo.swapTile);
				reshuffleService.board.level.levelAnimation.stopMakeMatchAnimation();
				reshuffleService.board.level.levelAnimation.animateMakeMatch(reshuffleService.board.creatureLayer, initialTile, swapTile);
				if(validMoveWithGoldFound && (reshuffleService.board.level.id == 1 || reshuffleService.board.level.id == 2)){
					board.level.flashBubbleTip('Game Tips.Make Matches');
				}
			}
			if(powerActive && !validMoveFound){
				board.level.bubbleTip.flashBubbleTip('Game Tips.Use PowerUps');
			}
			if(!powerActive && !validMoveFound){
				board.level.flashBubbleTip('Game Tips.Shuffling Board');
				Galapago.audioPlayer.playReshuffle();
				reshuffleService.board.shuffleBoard();
				console.log("reshuffled");
			}
		}, ReshuffleService.CHECK_VALID_MOVE_INTERVAL_MS);
		this.isStarted = true;
	}
};

ReshuffleService.prototype.stop = function() {
	if(this.reshuffleInterval){
		clearInterval(this.reshuffleInterval);
		this.reshuffleInterval = null;
		this.isStarted = false;
	} 
};

function MatchFinder(){
}

MatchFinder.findMatch = function(board, withGoldTile) {
	var tileMatrix = board.creatureTileMatrix;
	var validMoveFound = false;
	var swapForTripletInfo = {tipInfo:{}};
	_.each(tileMatrix, function(columnArray){
		if(!validMoveFound){
		  	_.each(columnArray, function(tile){
		    	if(!validMoveFound && tile && (tile.isCreatureOnly() || tile.hasSuperFriend())){
		         	var neighborTile = board.getNeighbor(tile, [0, -1]);
					validMoveFound = MatchFinder.checkIfSwapMakesMatch(board, tile, neighborTile, withGoldTile);
					if(!validMoveFound){
			        	neighborTile = board.getNeighbor(tile, [0, 1]);
		         		validMoveFound = MatchFinder.checkIfSwapMakesMatch(board, tile, neighborTile, withGoldTile);
		         	}
		         	if(!validMoveFound){
				 		neighborTile = board.getNeighbor(tile, [-1, 0]);
		         		validMoveFound = MatchFinder.checkIfSwapMakesMatch(board, tile, neighborTile, withGoldTile);
		         	}
		         	if(!validMoveFound){
		         		neighborTile = board.getNeighbor(tile, [1, 0]);
		         		validMoveFound = MatchFinder.checkIfSwapMakesMatch(board, tile, neighborTile, withGoldTile);
		         	}
		         	if(validMoveFound){
			         	swapForTripletInfo.tipInfo["initialTile"] = tile.coordinates;
			         	swapForTripletInfo.tipInfo["swapTile"] = neighborTile.coordinates;
			        }
		        }
		    });
		}
	});
  	return swapForTripletInfo;
}; //MatchFinder.findMatch()

MatchFinder.checkIfSwapMakesMatch = function(board, tileToBeMoved, tileToBeReplaced, withGoldTile){
	if( tileToBeReplaced && ( tileToBeReplaced.isCreatureOnly() || tileToBeReplaced.hasSuperFriend() ) ){
 		var tile = new Tile(this, tileToBeMoved.blob, tileToBeReplaced.coordinates, tileToBeMoved.spriteNumber);
 		var matchingTilesSets = board.tilesEventProcessor.getMatchingTilesSets(tile, tileToBeMoved);
 		if(withGoldTile && matchingTilesSets.length){
			var goldFound =  false;
			_.each(matchingTilesSets, function(matchingTilesSet){
				var goldTiles = board.tilesEventProcessor.getGoldTiles(matchingTilesSet);
				if(goldTiles.length){
					goldFound = true;
				}
			});
 			return goldFound;
 		}else{
 			return matchingTilesSets.length > 0;
 		}
 	}
 	return false;
}; //MatchFinder.checkIfSwapMakesMatch()
