Galapago.CREATURE_SPRITE_MATRIX=[
[{cell: [0, 0], id: 'b1'},{cell: [46, 0], id: 'b2'},{cell: [92, 0], id: 'b3'}],
[{cell: [0, 46], id: 'g1'},{cell: [46, 46], id: 'g2'},{cell: [92, 46], id: 'g3'}],
[{cell: [0, 92], id: 'p1'},{cell: [46, 92], id: 'p2'},{cell: [92, 92], id: 'p3'}],
[{cell: [0, 138], id: 'r1'},{cell: [46, 138], id: 'r2'},{cell: [92, 138], id: 'r3'}],
[{cell: [0, 184], id: 't1'},{cell: [46, 184], id: 't2'},{cell: [92, 184], id: 't3'}],
[{cell: [0, 230], id: 'v1'},{cell: [46, 230], id: 'v2'},{cell: [92, 230], id: 'v3'}],
[{cell: [0, 276], id: 'y1'},{cell: [46, 276], id: 'y2'},{cell: [92, 276], id: 'y3'}]
];

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
	'bracket-right'
];
Galapago.dangerBarImageNames = [
	'danger-bar',
	/*'danger_bar_cap_bottom01',
	'danger_bar_cap_bottom02',
	'danger_bar_cap_top01',
	'danger_bar_cap_top02',*/
	'danger-bar-fill-1',
	'danger-bar-fill-2'
];
Galapago.LAYER_BACKGROUND = 'layer-background';
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

Galapago.init = function(isTimedMode) {
	var levelTemp, level, levelIt;
	Galapago.isBypassLevelLocking = QueryString.isBypassLevelLocking === 'true' ? true : false;
	// switch to the second version of this line to enable audio by default
	Galapago.audioPlayer = new AudioPlayer(QueryString.isAudioEnabled === 'true' ? true : false);
	//Galapago.audioPlayer = new AudioPlayer(QueryString.isAudioEnabled === 'false' ? false : true);
	Galapago.mapScreen =new MapScreen();
	Galapago.isTimedMode = isTimedMode;
	Galapago.profile = 'profile';
	Galapago.levels = [];
	console.log( 'Galapago.isTimedMode: ' + Galapago.isTimedMode );
	console.log( 'Galapago.isBypassLevelLocking: ' + Galapago.isBypassLevelLocking );
	console.log( 'Galapago.audioPlayer.isEnabled: ' + Galapago.audioPlayer.isEnabled );
	for( levelIt = 0; levelIt < Galapago.NUM_LEVELS; levelIt++ ){
		levelTemp = new Level(levelIt + 1);
		Galapago.levels.push(levelTemp);
	}
	var configFilePath = QueryString.levels === 'ya' ? Galapago.CONFIG_FILE_PATH_YA : Galapago.CONFIG_FILE_PATH;
	console.debug( 'configFilePath: ' + configFilePath );
	Galapago.loadJsonAsync(configFilePath).then(function(data) {
		Galapago.setLevelsFromJson(data);
		level = LevelMap.getNextLevel();
		Galapago.levelMap = new LevelMap(level);
	}, function(status) {
		console.log('failed to load JSON level config with status ' + status);
	})/*.then(function() {
		//Galapago.setLevel(levelName);
	})*/.done();
	//level 1 is always unlocked
	Level.findById(1).isUnlocked = true;
}; //Galapago.init()

Galapago.buildGameImagePaths = function() {
	var gameImagePaths;
	gameImagePaths = [];
	_.each( Galapago.gameImageNames, function(imageName) {
		gameImagePaths.push(Galapago.GAME_SCREEN_GAL_PREFIX + imageName + Galapago.IMAGE_PATH_SUFFIX);
	});
	return gameImagePaths;
}; //Galapago.buildGameImagePaths()

Galapago.buildDangerBarImagePaths = function() {
	var dangerBarImagePaths;
	dangerBarImagePaths = [];
	_.each( Galapago.dangerBarImageNames, function(imageName) {
		dangerBarImagePaths.push(Galapago.GAME_SCREEN_GAL_PREFIX + imageName + Galapago.IMAGE_PATH_SUFFIX);
	});
	return dangerBarImagePaths;
}; //Galapago.buildDangerBarImagePaths()

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

Galapago.setLevel = function(levelId) {
	var theme, subTheme, backgroundBundle, themeBundle;
	console.debug( 'entering Galapago.setLevel()' );
	this.level = Level.findById(levelId);
	console.log( 'levelName: ' + this.level.id );
	theme = this.level.bgTheme;
	subTheme = this.level.bgSubTheme;
	backgroundBundle = theme + '-' + subTheme;
	themeBundle = theme + '-common';
	console.log( 'backgroundBundle: ' + backgroundBundle );

	LoadingScreen.gal.onLoaded( backgroundBundle, function(result) {
		if (result.success) {
			LoadingScreen.gal.clearOnLoaded( backgroundBundle );
			console.debug( backgroundBundle + ' resource bundle loaded' );
			LoadingScreen.gal.download(Galapago.RESOURCE_BUNDLE_BOARD_COMMON);
		}
	});

	LoadingScreen.gal.onLoaded( Galapago.RESOURCE_BUNDLE_BOARD_COMMON, function(result) {
		if (result.success) {
			LoadingScreen.gal.clearOnLoaded(Galapago.RESOURCE_BUNDLE_BOARD_COMMON);
			console.debug( Galapago.RESOURCE_BUNDLE_BOARD_COMMON + ' resource bundle loaded' );
			LoadingScreen.gal.download(themeBundle);
		}
	});
	
	LoadingScreen.gal.onLoaded(themeBundle, function(result) {
		if (result.success) {
			LoadingScreen.gal.clearOnLoaded(theme);
			console.debug(themeBundle + ' resource bundle loaded');
			Galapago.level.levelAnimation = new LevelAnimation();
			Galapago.level.bubbleTip = new BubbleTip(Galapago.level.levelAnimation);
			Galapago.level.display();
			Level.registerEventHandlers();
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
/* end class Galapago */

LevelMap.WIDTH = 1280;
LevelMap.HEIGHT = 640;
LevelMap.LEVEL_STATUS_X = 985;
LevelMap.LEVEL_STATUS_Y = 75;
LevelMap.LEVEL_NAV_X = 257;
LevelMap.LEVEL_NAV_Y = 647;
LevelMap.LEVEL_NAV_BUTTON_WIDTH = 145;
LevelMap.LEVEL_NAV_BUTTON_MARGIN = 16;
LevelMap.LEVEL_STATUS_WIDTH = 235;
LevelMap.LEVEL_STATUS_HEIGHT = 151;
LevelMap.LEVEL_STATUS_LEVEL_TEXT_X = LevelMap.LEVEL_STATUS_X + 10;
LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y = LevelMap.LEVEL_STATUS_Y + 30;
LevelMap.LEVEL_COMPLETE_INDICATOR_X = LevelMap.LEVEL_STATUS_X + 10;
LevelMap.LEVEL_COMPLETE_INDICATOR_Y = LevelMap.LEVEL_STATUS_Y + 63;
LevelMap.DIFFICULTY_STARS_X = LevelMap.LEVEL_STATUS_X + 51;
LevelMap.DIFFICULTY_STARS_Y = LevelMap.LEVEL_STATUS_Y + 53;
LevelMap.MAX_DIFFICULTY = 5;
LevelMap.LEVEL_STATUS_LEVEL_NAME_SIZE = '15px';
LevelMap.LEVEL_STATUS_SCORE_LABEL_SIZE = '17px';
LevelMap.LEVEL_STATUS_SCORE_SIZE = '22px';
LevelMap.LEVEL_STATUS_FONT_NAME = 'JungleFever';
LevelMap.LEVEL_STATUS_FONT_COLOR = 'rgb(19,97,197)';
//TODO: define this in a JSON config file
LevelMap.STAR_SPRITE_MATRIX = [
	[{cell: [0, 0]}, {cell: [18, 0]}, {cell: [36, 0]}, {cell: [54, 0]}, {cell: [72, 0]}, {cell: [90, 0]}, {cell: [108, 0]}, {cell: [126, 0]}, {cell: [144, 0]}, {cell: [162, 0]}]
];

LevelMap.LAVA_SPRITE_MATRIX = [
[{cell: [0, 0], id: 'lava-1'}, {cell: [190, 0], id: 'lava-2'}, {cell: [380, 0], id: 'lava-3'}, {cell: [570, 0], id: 'lava-4'}, {cell: [760, 0], id: 'lava-5'}, {cell: [950, 0], id: 'lava-6'}, {cell: [1140, 0], id: 'lava-7'}, {cell: [1330, 0], id: 'lava-8'}, {cell: [1520, 0], id: 'lava-9'}, {cell: [1710, 0], id: 'lava-10'}, {cell: [1900, 0], id: 'lava-11'}, {cell: [2090, 0], id: 'lava-12'}, {cell: [2280, 0], id: 'lava-13'}, {cell: [2470, 0], id: 'lava-14'}, {cell: [2660, 0], id: 'lava-15'}, {cell: [2850, 0], id: 'lava-16'}, {cell: [3040, 0], id: 'lava-17'}, {cell: [3230, 0], id: 'lava-18'}, {cell: [3420, 0], id: 'lava-19'}, {cell: [3610, 0], id: 'lava-20'}, {cell: [3800, 0], id: 'lava-21'}, {cell: [3990, 0], id: 'lava-22'}, {cell: [4180, 0], id: 'lava-23'}, {cell: [4370, 0], id: 'lava-24'}, {cell: [4560, 0], id: 'lava-25'}, {cell: [4750, 0], id: 'lava-26'}, {cell: [4940, 0], id: 'lava-27'}, {cell: [5130, 0], id: 'lava-28'}, {cell: [5320, 0], id: 'lava-29'}, {cell: [5510, 0], id: 'lava-30'}, {cell: [5700, 0], id: 'lava-31'}],
];

/* begin class LevelMap */
function LevelMap(level) {
	this.hotspotLevel = level;
	this.screenDiv = $('#screen-map');
	this.canvas = $(Galapago.LAYER_MAP)[0];
	this.animationCanvas = $('#' + 'layer-map-animation')[0];
	this.otherAnimationCanvas = $('#' + 'layer-map-other-animation')[0];
	this.layer = this.canvas.getContext('2d');
	this.otherAnimationLayer = this.otherAnimationCanvas.getContext('2d');
	this.hotspotPointsArray = [];
	this.images = [];
	this.levelCounter = 0;
	//this.setImages(LoadingScreen.mapScreenImageNames);
	this.levelAnimation = new LevelAnimation();
	this.display();
	this.profile = 'Default';
} //LevelMap constructor

LevelMap.prototype.display = function() {
	var backgroundImage;
	backgroundImage = LoadingScreen.gal.get('background/map.jpg');
	if( backgroundImage ) {
		this.screenDiv.css( 'background-image','url(' + backgroundImage.src + ')' );
	}
	this.screenDiv.css( 'display', 'block');
	this.canvas.focus();
	/*
	this.animate(LoadingScreen.gal.get(MapScreen.GAL_PREFIX + 'strip_lava_idle.png'),LevelMap.LAVA_SPRITE_MATRIX);
	var otherAnimationCanvas = this.otherAnimationCanvas;
	otherAnimationCanvas.width = LevelMap.WIDTH;
	otherAnimationCanvas.height = LevelMap.HEIGHT;
	var levelAnimation = this;
	otherAnimationCanvas.onclick = function(evt) {
		levelAnimation.canvas.focus();
	};
	var completedLevelIds = LevelMap.getLevelsCompleted();
	if(completedLevelIds.length){
		this.levelAnimation.animateBonFire(completedLevelIds, LevelMap.getHighestLevelCompleted().id, this.otherAnimationLayer);
	}
	this.levelAnimation.animateBombs(this.otherAnimationLayer);
	if(!Level.isComplete("1")){
	  this.levelAnimation.animateGameStartArrow(this.otherAnimationLayer);
	}
	this.drawBlinkingArrows(LevelMap.getHighestLevelCompleted());
	*/
	this.drawHotspots();
	this.registerEventHandlers();
	Galapago.audioPlayer.playVolcanoLoop();
}; //LevelMap.prototype.display()

LevelMap.prototype.drawHotspots = function(level){
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
						var img = LoadingScreen.gal.get(MapScreen.GAL_PREFIX + 'next_level_arrow_' + arrow + '.png');
						var coordinates = levelInfo[arrow];
						var x = coordinates[0];
						var y = coordinates[1];
						nextLevelArrowsInfo.push({"image":img,"xCoord":x,"yCoord":y});
					}
				}
			}
		});
	}
	if(nextLevelArrowsInfo.length){
		levelMap.levelAnimation.animateNextLevelArrows(levelMap.otherAnimationLayer, nextLevelArrowsInfo);
	}
}; //LevelMap.prototype.drawBlinkingArrows()

LevelMap.prototype.animate = function(image, spriteMatrix){
    var st=new SpriteSheet(image,spriteMatrix);
	var xIndex =0;
	var that=this;
	var imageData=st.getSpriteData([xIndex,0]);
	//animationCanvas.style.zIndex = 9;
	this.animationCanvas.onclick = function(evt) {
		that.canvas.focus();
	};
	this.animationCanvas.width = imageData.width;
	this.animationCanvas.height = imageData.height;
	this.animationLayer =  this.animationCanvas.getContext('2d');	
	function cycleSprite(){
	    var imageData=st.getSpriteData([xIndex,0]);
	    that.animationLayer.clearRect(0,0,imageData.width,imageData.height);			
		that.animationLayer.putImageData(imageData,0,0);
		xIndex=xIndex+1;
		if(Number(xIndex)>spriteMatrix[0].length-2){
		  xIndex=0;
		}
	}
	this.handle =window.setInterval(cycleSprite,300);
}; //LevelMap.prototype.animate()

LevelMap.prototype.updateLevelStatus = function() {
	var text, spriteSheet, levelScore, level_stars_silver, level_stars_gold, green_v, level_lock;
	level_stars_silver = LoadingScreen.gal.get( MapScreen.GAL_PREFIX + 'level-stars-silver.png');
	level_stars_gold = LoadingScreen.gal.get( MapScreen.GAL_PREFIX + 'level-stars-gold.png');
	green_v = LoadingScreen.gal.get( MapScreen.GAL_PREFIX + 'green-v.png');
	level_lock = LoadingScreen.gal.get( MapScreen.GAL_PREFIX + 'level-lock.png');
	this.layer.clearRect( LevelMap.LEVEL_STATUS_X, LevelMap.LEVEL_STATUS_Y, LevelMap.LEVEL_STATUS_WIDTH, LevelMap.LEVEL_STATUS_HEIGHT);
	this.layer.font = LevelMap.LEVEL_STATUS_LEVEL_NAME_SIZE + ' ' + LevelMap.LEVEL_STATUS_FONT_NAME;
	this.layer.fillStyle = LevelMap.LEVEL_STATUS_FONT_COLOR;
	text = i18n.t('levels.'+this.hotspotLevel.id)+ ' ' + this.hotspotLevel.id;
	this.layer.fillText(text, LevelMap.LEVEL_STATUS_LEVEL_TEXT_X, LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y);
	this.layer.drawImage(level_stars_silver, LevelMap.DIFFICULTY_STARS_X, LevelMap.DIFFICULTY_STARS_Y );
	spriteSheet = new SpriteSheet(level_stars_gold, LevelMap.STAR_SPRITE_MATRIX);
	spriteSheet.displayFraction(this.layer, this.hotspotLevel.difficulty/LevelMap.MAX_DIFFICULTY, 1, LevelMap.DIFFICULTY_STARS_X, LevelMap.DIFFICULTY_STARS_Y);
	var mode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	levelScore = localStorage.getItem( mode + Galapago.profile + "level" + this.hotspotLevel.id + ".highScore");
	if(levelScore){
		this.layer.font = LevelMap.LEVEL_STATUS_SCORE_LABEL_SIZE + ' ' + LevelMap.LEVEL_STATUS_FONT_NAME;
		this.layer.fillText('Score:', LevelMap.LEVEL_STATUS_LEVEL_TEXT_X+70, LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y+80);
		this.layer.font = LevelMap.LEVEL_STATUS_SCORE_SIZE + ' ' + LevelMap.LEVEL_STATUS_FONT_NAME;
		this.layer.fillText(levelScore, LevelMap.LEVEL_STATUS_LEVEL_TEXT_X+70, LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y+105);
	}
	this.hotspotLevel.isCompleted = Level.isComplete(this.hotspotLevel.id);
	if( this.hotspotLevel.isCompleted ) {
		this.layer.drawImage(green_v, LevelMap.LEVEL_COMPLETE_INDICATOR_X, LevelMap.LEVEL_COMPLETE_INDICATOR_Y, green_v.width, green_v.height);
	}
	else if( this.hotspotLevel.isUnlocked ) {
		//don't draw anything
	}
	else {
		this.layer.drawImage(level_lock, LevelMap.LEVEL_COMPLETE_INDICATOR_X, LevelMap.LEVEL_COMPLETE_INDICATOR_Y, level_lock.width, level_lock.height);
	}
	return this; //chainable
}; //LevelMap.prototype.updateLevelStatus()

LevelMap.prototype.unregisterEventHandlers = function() {
	var levelMap;
	levelMap = this;
	levelMap.canvas.onmousemove = null;
	levelMap.canvas.onclick = null;
	levelMap.canvas.onkeydown = null;
}; //LevelMap.prototype.unregisterEventHandlers()

LevelMap.prototype.registerEventHandlers = function() {
	var levelMap, x, y, point, mapHotspotRegion, levelIt, level;
	levelMap = this;

	
	window.onmousemove = function(e) {
		x = e.pageX ;//- this.offsetLeft;
		y = e.pageY ;//- this.offsetTop;
		point = new Array(2);
		point[0] = x;
		point[1] = y;

		for( levelIt = 0; levelIt < Galapago.levels.length; levelIt++ ) {
			level = Galapago.levels[levelIt];
			mapHotspotRegion = level.mapHotspotRegion;
			if( LevelMap.isPointInPoly(point, mapHotspotRegion) ) {
				if(level.isUnlocked){
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
	}; //onmousemove
	

	//levelMap.canvas.onclick = function(evt) {
	window.onclick = function(evt) {
		levelMap.handleSelect(evt);
		evt.preventDefault();
		evt.stopPropagation();
	}; //onclick

	levelMap.canvas.onkeydown = function(evt) {
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
			case 48: // numeric 0
				Galapago.isBypassLevelLocking = true;
				console.debug( 'Galapago.isBypassLevelLocking: ' + Galapago.isBypassLevelLocking );
				break;
			case 49: // numeric 1
				Galapago.isBypassLevelLocking = false;
				console.debug( 'Galapago.isBypassLevelLocking: ' + Galapago.isBypassLevelLocking );
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
	};
}; //LevelMap.prototype.registerEventHandlers

LevelMap.prototype.quit = function() {
	this.cleanup();
	sdkApi.exit();
	return this; //chainable
};

// erase per-level high scores and completed indicators and set hotspot to level 1
LevelMap.prototype.reset = function() {
	localStorage.clear();
	console.debug('reset map');
	return this; //chainable
}; //LevelMap.prototype.reset

LevelMap.prototype.handleSelect = function(evt) {
	var x, y, point, levelIt, level;
	x = evt.pageX ;//- this.offsetLeft;
	y = evt.pageY ;//- this.offsetTop;
	point = new Array(2);
	point[0] = x;
	point[1] = y;

	for( levelIt = 0; levelIt < Galapago.levels.length; levelIt++ ) {
		level = Galapago.levels[levelIt];
		if( LevelMap.isPointInPoly(point, level.mapHotspotRegion) ) {
			//levelMap.drawHotspot(mapHotspotRegion);
			this.setHotspotLevel(level);
			if( Galapago.isBypassLevelLocking || this.hotspotLevel.isUnlocked ) {
				window.onclick = null;
				window.onmousemove = null;
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
	if( Galapago.isBypassLevelLocking || this.hotspotLevel.isUnlocked ) {
	    this.cleanup();
		//$( 'ul#map-nav' ).css( 'display', 'none' );
		Galapago.setLevel(this.hotspotLevel.id);
	}
	else {
		console.debug( 'level ' + this.hotspotLevel.id + ' is locked');
	}
}; //LevelMap.prototype.handleKeyboardSelect()

LevelMap.prototype.cleanup = function() {
    this.animationLayer=null;
	this.animationCanvas.onclick=null;
	this.unregisterEventHandlers();
	this.screenDiv.css('display', 'none');
	this.cleanupAnimationAndSound();
}; //LevelMap.prototype.cleanup()

LevelMap.prototype.cleanupAnimationAndSound = function() {
	clearInterval(this.handle) ;
	Galapago.audioPlayer.stopLoop();
	this.levelAnimation.stopAllAnimations();
}; //LevelMap.prototype.cleanupAnimationAndSound()

LevelMap.prototype.handleUpArrow = function() {
	if(this.hotspotLevel.neighbors.north && this.hotspotLevel.neighbors.north.isUnlocked) {
		this.setHotspotLevel(this.hotspotLevel.neighbors.north);
	}
}; //LevelMap.prototype.handleUpArrow()

LevelMap.prototype.handleRightArrow = function() {
	if(this.hotspotLevel.neighbors.east && this.hotspotLevel.neighbors.east.isUnlocked) {
		this.setHotspotLevel(this.hotspotLevel.neighbors.east);
	}
}; //LevelMap.prototype.handleRightArrow()

LevelMap.prototype.handleDownArrow = function() {
	var mapScreen, mapNav, level;
	level = this.hotspotLevel.neighbors.south;
	if( level && level.mapHotspotRegion.length > 2 ) {
		if(this.hotspotLevel.neighbors.south && this.hotspotLevel.neighbors.south.isUnlocked){
			this.setHotspotLevel(level);
		}
	}
	else {
		this.unregisterEventHandlers();
		this.levelAnimation.stopGameStartArrow();
		this.drawHotspot(this.hotspotLevel.mapHotspotRegion, true);
		$('ul#map-nav').focus();
		mapScreen = Galapago.mapScreen ;
		mapScreen.registerEventHandlers();
		mapNav = $('#map-nav');
		mapScreen.setNavItem(mapNav.children('li:nth-child(1)'));
	}
}; //LevelMap.prototype.handleDownArrow()

LevelMap.prototype.handleLeftArrow = function() {
	if(this.hotspotLevel.neighbors.west && this.hotspotLevel.neighbors.west.isUnlocked){
		this.setHotspotLevel(this.hotspotLevel.neighbors.west);
	}
}; //LevelMap.prototype.handleLeftArrow()

LevelMap.prototype.setHotspotLevel = function(level) {
	if( level && level.mapHotspotRegion.length > 2 ) {
		if(this.hotspotLevel){
			this.drawHotspot(this.hotspotLevel.mapHotspotRegion, true);
		}
		this.hotspotLevel = level;
		console.info("hotspot on level " + this.hotspotLevel.id);
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

LevelMap.show = function(level){
	Galapago.levelMap = new LevelMap(level);
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
	for (var i = 0; i < localStorage.length; i++){
		keyIt = localStorage.key(i);
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
	for (var i = 0; i < localStorage.length; i++){
		keyIt = localStorage.key(i);
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
	var highestLevelCompleted, unlockedLevelIds, unlockedLevels, nextLevelId;
	unlockedLevels = [];
	highestLevelCompleted = LevelMap.getHighestLevelCompleted();
	if( typeof highestLevelCompleted === 'undefined' ) {
		nextLevel = Level.findById(1);
	}
	else {
		unlockedLevelIds = highestLevelCompleted.unlocksLevels;
		unlockedLevelIds = _.filter(unlockedLevelIds, function(levelId){
			return !Level.isComplete(levelId);
		});
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
	var keyIt;
	var keyList = new  Array();
	for (var i = 0; i < localStorage.length; i++) {
		keyIt = localStorage.key(i);
		if(keyIt.indexOf(Galapago.profile)>0){ // reset all the local storage of current Profile only.
			//localStorage.removeItem(keyIt);
			keyList.push(keyIt);
		}
	}
	for (var i = 0; i < keyList.length; i++) {
		localStorage.removeItem(keyList[i]);
	}
}; //LevelMap.reset()

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
Level.LAYER_GRID = 'layer-grid';
Level.LAYER_GOLD = 'layer-gold';
Level.LAYER_CREATURE = 'layer-creature';
Level.LAYER_HILIGHT = 'layer-hilight';
Level.LAYER_SCORE = 'layer-score';
Level.LAYER_BONUS_FRENZY = 'layer-bonus-frenzy';
Level.LAYER_GAME_ANIMATION = 'layer-game-animation';
Level.LAYER_GAME_LIGHTNING = 'layer-game-lightning';
Level.BG_THEME_BEACH_CREATURES = ["blue-crab", "green-turtle", "pink-frog", "red-starfish", "teal-blob", "violet-crab", "yellow-fish"];
Level.BG_THEME_FOREST_CREATURES = ["blue-beetle", "green-butterfly", "pink-lizard", "red-beetle", "teal-bug", "violet-moth", "yellow-frog"];
Level.BG_THEME_CAVE_CREATURES = ["blue-crystal", "green-frog", "pink-spike", "red-beetle", "teal-flyer", "violet-lizard", "yellow-bug"];
Level.SUPER_FRIENDS = ["blue-friend", "green-friend", "pink-friend", "red-friend", "teal-friend", "violet-friend", "yellow-friend"];
Level.COLORS = ["blue", "green", "pink", "red", "teal", "violet", "yellow"];
Level.BLOB_TYPES = ['CREATURE', 'GOLD'];
Level.MENU_BUTTON_X = 124;
Level.MENU_BUTTON_Y = 600;
Level.BUTTON_WIDTH = 116;
Level.BUTTON_HEIGHT = 42;
Level.POWER_UP_SCORE =0;

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
	this.dangerBarImages = [];
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
	sf = new SuperFriend(sfImage, sfType.replace('_friend',''));
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
			image.id  = image.id.substring( Galapago.GAME_SCREEN_GAL_PREFIX.length, image.id.length - Galapago.IMAGE_PATH_SUFFIX.length );
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
	goldImagePaths[0] = Galapago.GAME_SCREEN_GAL_PREFIX + 'tile_gold_1' + Level.BLOB_IMAGE_EXTENSION;
	return goldImagePaths;
}; //Level.prototype.buildGoldImagePaths()

Level.prototype.imgpreloadAsync = function(imagePaths) {
	var deferred, imageObjectArray, imageObjectArrayAsString;
	deferred = Q.defer();
	imgpreload(imagePaths, function( images ) {
		imageObjectArray = images;
		imageObjectArrayAsString = 'imageObjectArray = ';
		_.each(imageObjectArray, function(imageObject) {
			imageObjectArrayAsString += imageObject.src + ', ';
		});
		console.debug( imageObjectArrayAsString );
		if( imageObjectArray.length < 1 ) {
			deferred.reject('error loading images ' + imagePaths);
		}
		deferred.resolve(imageObjectArray);
	});
	return deferred.promise;
};

Level.prototype.getCreatureImages = function(bgTheme) {
	var creatureSpriteSheet;
	if(!(bgTheme  in Galapago.creatureImages)){
		switch( bgTheme ) {
			case 'beach':
 				creatureSpriteSheet = new SpriteSheet(LoadingScreen.gal.get("screen-game/creatures-beach-strip.png"),Galapago.CREATURE_SPRITE_MATRIX);
				Galapago.creatureImages[bgTheme] = this.loadImageSprites(bgTheme, creatureSpriteSheet, Level.BG_THEME_BEACH_CREATURES);
				break;
			case 'forest':
				creatureSpriteSheet = new SpriteSheet(LoadingScreen.gal.get("screen-game/creatures-forest-strip.png"),Galapago.CREATURE_SPRITE_MATRIX);
				Galapago.creatureImages[bgTheme] = this.loadImageSprites(bgTheme, creatureSpriteSheet, Level.BG_THEME_FOREST_CREATURES);
				break;
			case 'cave':
				creatureSpriteSheet = new SpriteSheet(LoadingScreen.gal.get("screen-game/creatures-cave-strip.png"),Galapago.CREATURE_SPRITE_MATRIX);
				Galapago.creatureImages[bgTheme] = this.loadImageSprites(bgTheme, creatureSpriteSheet, Level.BG_THEME_CAVE_CREATURES);
		}
		if(!('superFriends'  in Galapago.creatureImages)){
			Galapago.creatureImages['superFriends'] = this.loadSuperFriends(creatureSpriteSheet);
		}
	}
	return Galapago.creatureImages[bgTheme];
}; //Level.prototype.getCreatureImages()

Level.prototype.loadImageSprites = function(bgTheme, creatureSpriteSheet, creatureTypes) {
	var images={};
	for(var x=0; x<creatureSpriteSheet.spriteMatrix.length;x++){
		for(var y=0; y<creatureSpriteSheet.spriteMatrix[x].length - 1;y++){
			var image = creatureSpriteSheet.getSpriteNew([y,x]);
			var id = creatureSpriteSheet.spriteMatrix[x][y].id;
			var creatureType = _.filter(creatureTypes, function(creatureType) {
				return creatureType.startsWith(id[0]);
			})[0];
			image.id = creatureType + '_' + id[1]; 
			images[image.id] = image;
		}
	}
	return images;
}; //Level.prototype.loadImageSprites()

Level.prototype.loadSuperFriends = function(creatureSpriteSheet) {
	var images, galImagePath
	images={};
	_.each( Level.COLORS, function(color) {
		galImagePath = Galapago.GAME_SCREEN_GAL_PREFIX + 'superfriends/' + color + Galapago.IMAGE_PATH_SUFFIX;
		images[color[0]] = LoadingScreen.gal.get( galImagePath );
	});
	return images;
}; //Level.prototype.loadSuperFriends()

Level.prototype.loadImages = function() {
	var level, goldImagePaths, gameImagePaths, dangerBarImagePaths, levelAnimationImagePaths, levelAnimationImages, image, gameImages;
	level = this;	
	goldImagePaths = level.buildGoldImagePaths();
	gameImagePaths = Galapago.buildGameImagePaths();
	dangerBarImagePaths = Galapago.buildDangerBarImagePaths();
	gameImages = [];
	level.creatureImages = level.getCreatureImages(level.bgTheme);
	level.superFriendImages = Galapago.creatureImages['superFriends'];

	_.each( gameImagePaths, function( gameImagePath ) {
		//console.debug( gameImagePath );
		image = LoadingScreen.gal.get( gameImagePath );
		gameImages.push( image );
	});
	level.initImages(gameImages);

	_.each( dangerBarImagePaths, function( dangerBarImagePath ) {
		level.dangerBarImages.push( LoadingScreen.gal.get( dangerBarImagePath ) );
	});

	_.each( goldImagePaths, function( goldImagePath ) {
		level.goldImages.push( LoadingScreen.gal.get( goldImagePath ) );
	});

	levelAnimationImages = [];
	_.each( levelAnimationImagePaths, function( levelAnimationImagePath ) {
		levelAnimationImages.push( LoadingScreen.gal.get( levelAnimationImagePath ) );
	});
	level.levelAnimation.initImages(level.bgTheme, level.creatureTypes);

}; //Level.prototype.loadImages()

Level.prototype.display = function() {
	var level, timedMode;
	console.debug( 'entering Level.prototype.display()');
	level = this;
	level.setBoard(new Board());
	level.styleCanvas();
	level.board.drawScore();
	$('#screen-game').show();
	console.debug( 'after show #screen-game');
	if( level.levelConfig.blobPositions ) {
		level.loadImages();
		level.board.init( level.levelConfig.blobPositions );
		level.board.putInAnimationQ = true;
		level.board.build( level.levelConfig.blobPositions );
		level.board.buildInitialSwapForTriplet( level.levelConfig.initialSwapForTripletInfo );
		level.board.putInAnimationQ = false;
		level.board.animationQ = [];
		level.levelAnimation.animateBoardBuild(level.board.creatureLayer, level.board.gameAnimationLayer, level.board.creatureTileMatrix, function(){
		level.board.displayBlobCollections();
		if( !MatrixUtil.isSameDimensions(level.board.creatureTileMatrix, level.board.goldTileMatrix) ) {
			throw new Error('creatureTileMatrix dimensions must match goldTileMatrix dimensions');
		}
		timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
		if( Galapago.isTimedMode ) {
			var restoreLookupString = localStorage.getItem( timedMode + Galapago.profile + "level" + level.id + "restore" );
			var restoreLookup ,dangerBarTimeRemaining = null;
			level.dangerBar = new DangerBar(level.layerBackground, level.dangerBarImages, level.levelConfig.dangerBarSeconds * 1000);
			if(restoreLookupString != undefined){
			   restoreLookup = JSON.parse(restoreLookupString);
			   dangerBarTimeRemaining = restoreLookup['dangerBarTimeRemaining'];
			   if(dangerBarTimeRemaining != undefined){
				  level.dangerBar.timeRemainingMs  = dangerBarTimeRemaining;
				  level.dangerBar.start();
			   }
			}
		}
		console.debug(level.toString());

		level.board.addPowerups();
		level.board.displayLevelName();
		level.board.displayMenuButton(false);
		level.board.displayQuitButton(false);
		level.board.display();
		level.board.setActiveTile();
		localStorage.setItem(timedMode+Galapago.profile+"level"+level.id+".levelPlayed" ,"1" );
		console.debug( 'exiting Level.prototype.display()');
		return level; //chainable
		});
	}
	else {
		console.debug( 'exiting Level.prototype.display()');
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
	localStorage.removeItem( timedMode + Galapago.profile + "level" + this.id + "restore" );
	Galapago.audioPlayer.playLevelWon();
    level = this;
    level.cleanup();
	sdkApi.requestModalAd("inGame").done(function(){
		LevelMap.show(LevelMap.getNextLevel());
		//level.showLevelMap(LevelMap.getNextLevel());
	});
}; //Level.prototypepx()

Level.prototype.quit = function(){
	this.board.saveBoard();
	this.cleanup();
}; //Level.prototype.quit()

Level.prototype.cleanup = function(isPreserveGridLayer){
	if( isPreserveGridLayer ) {
		this.board.hideGoldAndCreatures();
	}
	else {
		this.board.screenDiv.hide();		
	}
	this.bubbleTip.hideBubbleTip();
	if(this.dangerBar){
		this.dangerBar.stop();
	}
    this.board.powerUp.timer.clearInterval();
 	this.levelAnimation.stopAllAnimations();
	if(this.levelAnimation.powerAchievedAnimation){
		this.levelAnimation.stopAllPowerAchieved();
		this.levelAnimation.powerAchievedAnimation = null;
	}
 	this.board.reshuffleService.stop();
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

Level.registerEventHandlers = function() {
	var level, board;
	level = Galapago.level;
	board = level.board;
	document.onclick = function(evt) {
		console.log('x: ' + evt.clientX + ', y:' + evt.clientY);
	};

	$('#layer-grid').click(function(evt) {
		board.handleClickOrTap(evt);
	});

	$('#layer-grid').tap(function(evt) { 
		board.handleClickOrTap(evt);
	});
	
	//$('#layer-bonus-frenzy').click(function(evt){
	window.onclick = function(evt){
		board.handleMouseClickEvent(evt);
		evt.preventDefault();
		evt.stopPropagation();
	};
	window.onmousemove = function(evt){
		board.handleMouseMoveEvent(evt);
		evt.preventDefault();
		evt.stopPropagation();
	};	
	window.onkeydown = function(evt) {
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
				level.quit();
				LevelMap.show(level);				
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
				toggleDebugConsole('top');
				break;
			case 57: // 9
				toggleDebugConsole('bottom');
				break;
			default:
		}
	};
}; //Level.registerEventHandlers()

Level.prototype.unregisterEventHandlers = function() {
	document.onclick = null;
	$('#layer-grid').off('click');
	$('#layer-grid').off('tap');
	window.onkeydown = null;
}; //Level.prototype.unregisterEventHandlers()

Level.prototype.styleCanvas = function() {
	var canvasBackground, themeComplete, resourcePath, backgroundImage, canvasScore, canvasGameAnimation;
	console.debug('entering Level.prototype.styleCanvas()');
	console.debug('styling background canvas');
	canvasBackground = $(this.board.screenDiv.selector + ' #' + Galapago.LAYER_BACKGROUND);
	console.debug( 'canvasBackground: ' + canvasBackground.selector );
	themeComplete = this.bgTheme + '-' + this.bgSubTheme;
	resourcePath = 'background/' + themeComplete + '.jpg';
	backgroundImage = LoadingScreen.gal.get(resourcePath);
	if( backgroundImage ) {
		console.debug('setting background to ' + resourcePath);
		canvasBackground.css( 'background-image','url(' + LoadingScreen.gal.get(resourcePath).src + ')' );
	}
	/*
	console.debug('before changing canvas width and height');
	canvasBackground[0].width = LoadingScreen.STAGE_WIDTH;
	canvasBackground[0].height = LoadingScreen.STAGE_HEIGHT;
	console.debug('after changing canvas width and height');
	*/
	canvasBackground.css('left', '0px');
	canvasBackground.css('top', '0px');
	this.layerBackground = canvasBackground[0].getContext('2d');
	console.debug('styling .layer-board canvas');
	_.each( $('.layer-board'), function(layer) {
		layer.width = Board.GRID_WIDTH;
		layer.height = Board.GRID_HEIGHT;
		layer.style.left = Board.GRID_LEFT + 'px';
		layer.style.top = Board.GRID_TOP + 'px';
	});
	console.debug('styling bonus frenzy canvas');
	canvasBonusFrenzy = $('#' + Level.LAYER_BONUS_FRENZY);
	canvasBonusFrenzy[0].width = Board.GRID_WIDTH;
	canvasBonusFrenzy[0].height = Board.GRID_HEIGHT + Board.GRID_TOP;
	canvasBonusFrenzy.css('left', Board.GRID_LEFT + 'px');
	canvasBonusFrenzy.css('top', '0px');

	console.debug('styling score canvas');
	canvasScore = $('#' + Level.LAYER_SCORE);
	canvasScore[0].width = Score.MAX_WIDTH;
	canvasScore[0].height = Score.MAX_HEIGHT;
	canvasScore.css('left', Score.X + 'px');
	canvasScore.css('top', Score.Y + 'px');

	console.debug('styling game animation canvas');
	canvasGameAnimation = $('#' + Level.LAYER_GAME_ANIMATION);
	canvasGameAnimation[0].width = Board.GRID_WIDTH;
	canvasGameAnimation[0].height = LoadingScreen.STAGE_HEIGHT - Board.GRID_TOP;
	canvasGameAnimation.css('left', Board.GRID_LEFT + 'px');
	canvasGameAnimation.css('top', Board.GRID_TOP + 'px');

	console.debug('styling lightning canvas');
	canvasGameLightning = $('#' + Level.LAYER_GAME_LIGHTNING);
	canvasGameLightning[0].width = LevelAnimation.LIGHTNING_IMAGE_WIDTH;
	canvasGameLightning[0].height = LevelAnimation.LIGHTNING_IMAGE_WIDTH;
	canvasGameLightning.css('left', (Board.GRID_LEFT + (Board.GRID_WIDTH/2)) - (LevelAnimation.LIGHTNING_IMAGE_WIDTH/2) + 'px');
	canvasGameLightning.css('top', (Board.GRID_TOP + (Board.GRID_HEIGHT/2)) - (LevelAnimation.LIGHTNING_IMAGE_WIDTH/2) + 'px');
	console.debug('exiting Level.prototype.styleCanvas()');
}; //Level.prototype.styleCanvas()

// returns a JS Image object
Level.prototype.getImageByPath = function(images, imagePath) {
	var image, imageIt, fullImagePath;
	image = null;
	for( imageIt = 0; imageIt < images.length; imageIt++ ) {
		fullImagePath = FileUtil.stripFileName(document.URL) + imagePath;
		if( images[imageIt].src === fullImagePath ) {
			return images[imageIt];
		}
	}
	return null;
};

Level.prototype.getCreatureImage = function(creatureType, spriteNumber) {
	var creatureImageKey = creatureType + '_' + spriteNumber;
	return this.creatureImages[creatureImageKey];
};

Level.prototype.isNew = function() {
	var	timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	var levelPlayed = localStorage.getItem(timedMode+Galapago.profile+"level"+this.id+".levelPlayed");	
	return !levelPlayed;
};

Level.isComplete = function(id) {
	var timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	return localStorage.getItem(timedMode + Galapago.profile + "level" + id + ".completed");	
};
/* end class Level */

/*
begin class Board
Board has layer with matrix of Tiles with Creatures
Board has layer with matrix of Tiles with Gold
*/
Board.TILE_WIDTH = 47;
Board.TILE_HEIGHT = 47;
Board.MAX_COLUMNS = 13;
Board.MAX_ROWS = 11;
Board.GRID_LEFT = 325;
Board.GRID_TOP = 100;
Board.GRID_WIDTH = Board.MAX_COLUMNS * Board.TILE_WIDTH;
Board.GRID_HEIGHT = Board.MAX_ROWS * Board.TILE_HEIGHT;
Board.CREATURE_FLYOVER_STEP = 20;
Board.ANGULAR_SPEED = Math.PI * 2;
Board.HOTSPOT_MENU = 'hotspot-menu';
Board.HOTSPOT_QUIT = 'hotspot-quit';
Board.HOTSPOT_TILE = 'hotspot-tile';
Board.HOTSPOT_POWERUP_FLIPFLOP = 'hotspot-powerup-flipflop';
Board.HOTSPOT_POWERUP_FIREPOWER = 'hotspot-powerup-firepower';
Board.HOTSPOT_POWERUP_SHUFFLE = 'hotspot-powerup-shuffle';
Board.LEVEL_NAME_X = 600;
Board.LEVEL_NAME_Y = 60;
Board.LEVEL_NAME_MAX_WIDTH = 100;
Board.LEVEL_NAME_MAX_HEIGHT = 30;
Board.LEVEL_NAME_FONT_SIZE = '30px';
Board.LEVEL_NAME_FONT_NAME = 'JungleFever';
Board.LEVEL_NAME_FONT_COLOR = 'rgb(19,19,197)';

function Board() {
	this.screenDiv = $('#screen-game');
	this.backgroundLayer = $(this.screenDiv.selector + ' #' + Galapago.LAYER_BACKGROUND)[0].getContext('2d');
	this.gridLayer = $('#' + Level.LAYER_GRID)[0].getContext('2d');
	this.goldLayer = $('#' + Level.LAYER_GOLD)[0].getContext('2d');
	this.creatureLayer = $('#' + Level.LAYER_CREATURE)[0].getContext('2d');
	this.hilightLayer = $('#' + Level.LAYER_HILIGHT)[0].getContext('2d');
	this.scoreLayer = $('#' + Level.LAYER_SCORE)[0].getContext('2d');
	this.bonusFrenzyLayer = $('#' + Level.LAYER_BONUS_FRENZY)[0].getContext('2d');
	this.gameAnimationLayer = $('#' + Level.LAYER_GAME_ANIMATION)[0].getContext('2d');
	this.gameLightningLayer = $('#' + Level.LAYER_GAME_LIGHTNING)[0].getContext('2d');

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
	this.blobCollection = new BlobCollection(this.gridLayer);

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
} //Board constructor

Board.prototype.quit = function() {
	this.level.cleanup(false);
	sdkApi.exit();
	return this; //chainable
}; //Board.prototype.quit()

Board.prototype.hideGoldAndCreatures = function() {
	$('#' + Level.LAYER_GOLD).hide();
	$('#' + Level.LAYER_CREATURE).hide();
}; //Board.protoype.hideBoardLayer()

Board.prototype.showGoldAndCreatures = function() {
	$('#' + Level.LAYER_GOLD).show();
	$('#' + Level.LAYER_CREATURE).show();
}; //Board.protoype.showBoardLayer()

Board.prototype.display = function() {
	//this.showGoldAndCreatures();
	this.creatureLayer.canvas.focus();
	this.level.levelAnimation.initBobCervantes(this.backgroundLayer);
	this.reshuffleService.start();
}; //Board.protoype.display()

Board.prototype.displayBlobCollections = function() {
	this.blobCollection.initImages(this.level.gameImages);
	this.blobCollection.display();
};

Board.prototype.displayLevelName = function() {
	var layer, levelNameText;
	layer = this.backgroundLayer;
	layer.clearRect(Board.LEVEL_NAME_X, Board.LEVEL_NAME_Y, Board.LEVEL_NAME_MAX_WIDTH, Board.LEVEL_NAME_MAX_HEIGHT);
	layer.textBaseline = 'top';
	layer.font = Board.LEVEL_NAME_FONT_SIZE + ' ' + Board.LEVEL_NAME_FONT_NAME;
	layer.fillStyle = Board.LEVEL_NAME_FONT_COLOR;
	levelNameText =  i18n.t('levels.'+this.level.id) ;
	levelNameText += ' ' + this.level.id; //TODO for debugging only remove before production!!!
	layer.fillText(levelNameText, Board.LEVEL_NAME_X, Board.LEVEL_NAME_Y);
}; //Board.protoype.displayLevelName()

Board.prototype.displayMenuButton = function(isActive) {
	var textColor, layer, menuButtonImage, gameButtonCursor;
	layer = this.backgroundLayer;
	menuButtonImage = LoadingScreen.gal.get('screen-map/button-regular.png');
	gameButtonCursor = LoadingScreen.gal.get('screen-map/button-cursor.png');
	if( isActive ) {
		this.buttonActive = 'menuButton';
		layer.drawImage(menuButtonImage, Level.MENU_BUTTON_X, Level.MENU_BUTTON_Y, Level.BUTTON_WIDTH, Level.BUTTON_HEIGHT);
		layer.drawImage(gameButtonCursor, Level.MENU_BUTTON_X - 1, Level.MENU_BUTTON_Y - 1, Level.BUTTON_WIDTH, Level.BUTTON_HEIGHT);
	}
	else {
		this.buttonActive = null;
		layer.clearRect(Level.MENU_BUTTON_X - 1, Level.MENU_BUTTON_Y - 1, Level.BUTTON_WIDTH + 2, Level.BUTTON_HEIGHT + 2);
		layer.drawImage(menuButtonImage, Level.MENU_BUTTON_X, Level.MENU_BUTTON_Y, Level.BUTTON_WIDTH, Level.BUTTON_HEIGHT);
	}
	layer.font = '17px JungleFever';
	layer.fillStyle = 'rgb(107,45,0)';
	layer.fillText('MENU', Level.MENU_BUTTON_X+33, Level.MENU_BUTTON_Y+10);
}; //Board.protoype.displayMenuButton()

Board.prototype.displayQuitButton = function(isActive) {
	var textColor, layer, quitButtonImage, gameButtonCursor;
	layer = this.backgroundLayer;
	quitButtonImage = LoadingScreen.gal.get('screen-map/button-regular.png');
	gameButtonCursor = LoadingScreen.gal.get('screen-map/button-cursor.png');
	var quitImageX = Level.MENU_BUTTON_X;
	var quitImageY = (Level.MENU_BUTTON_Y + Level.BUTTON_HEIGHT +10);
	
	if( isActive ) {
		this.buttonActive = 'quitButton';
		layer.drawImage(quitButtonImage, quitImageX, quitImageY, Level.BUTTON_WIDTH, Level.BUTTON_HEIGHT);
		layer.drawImage(gameButtonCursor, quitImageX - 1, quitImageY - 1, gameButtonCursor.width, gameButtonCursor.height);
	}
	else {
		this.buttonActive = null;
		layer.clearRect(quitImageX - 1, quitImageY - 1, Level.BUTTON_WIDTH + 2, Level.BUTTON_HEIGHT + 2);
		layer.drawImage(quitButtonImage, quitImageX, quitImageY, Level.BUTTON_WIDTH, Level.BUTTON_HEIGHT);
	}
	layer.font = '17px JungleFever';
	layer.fillStyle = 'rgb(107,45,0)';
	layer.fillText('QUIT', Level.MENU_BUTTON_X+35, quitImageY+10);
}; //Board.protoype.displayMenuButton()

Board.prototype.addPowerups = function() {
	this.powerUp=new Powerup(this , Level.POWER_UP_SCORE);
	Level.POWER_UP_SCORE=0;
};

/* req 4.4.2
As default, the cursor is shown on the top leftmost creature on board. However, on new game once in a session, in levels
1,2 and 14 – 19, when Bubble Tips are displayed at the start of the level, the cursor appears on the creature that is
animated according to the displayed tip.
*/
Board.prototype.setActiveTile = function(tile) {
	var markTile;
	var timedMode, tileActive, col, row;
	if(tile) {
		tileActive = tile;
	}
	
	else if(!tile &&  _.contains(Galapago.ACTIVE_TILE_LOGIC_LEVELS, this.level.id) && this.initialSwapForTripletInfo) {
	    col = this.initialSwapForTripletInfo.tipInfo.initialTile[0];
		row = this.initialSwapForTripletInfo.tipInfo.initialTile[1];
		tileActive = this.creatureTileMatrix[col][row];
		var key = 'Game Tips.'+this.initialSwapForTripletInfo.tipInfo.key+' tip1';
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

Board.prototype.getLayer = function(blobType) {
	var layer;
	switch( blobType ) {
		case 'GOLD':
			layer = this.goldLayer;
			break;
		case 'CREATURE':
			layer = this.creatureLayer;
			break;
		default:
			layer = this.creatureLayer;
	}
	return layer;
};

Board.prototype.completeAnimationAsync = function() {
	var /*rotateAngle, */board, layer;
	console.debug("running level complete animation");
	board = Galapago.level.board;
	layer = board.creatureLayer;
	layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);	

	this.rotateAngle = 0;
	//setInterval(this.spinCreatures, 1000/30);
/*
	setInterval(this.drawFlyingCreatures, 1000/30);
	if( board.creatureYOffset < 0) {
		clearInterval(this.drawFlyingCreatures);
	}

	this.gridLayer.fillText('Level completed', 600, 350);*/
	return this; //chainable
}; //Board.prototype.completeAnimationAsync()

Board.prototype.spinCreatures = function() {
	var board, layer;
	board = Galapago.level.board;
	layer = board.creatureLayer;
	layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);	
	board.drawRotatedCreatures(layer, board.rotateAngle);
	board.rotateAngle += 2;
}; //Board.prototype.spinCreatures()

Board.prototype.drawFlyingCreatures = function () { 
	var board, ctx, rowIt, colIt, tile;
	//ctx = this.creatureLayer;	
	board = Galapago.level.board;
	board.creatureYOffset -= Board.CREATURE_FLYOVER_STEP;
	// save the current co-ordinate system before we screw with it
	//ctx.save();
	// move the board up by the creatureYOffset amount; 
	for( rowIt = 0; rowIt < board.creatureTileMatrix.length; rowIt++ ) {
		for( colIt = 0; colIt < board.creatureTileMatrix[rowIt].length; colIt++ ) {
			if( rowIt % 2 === 0 && colIt % 2 === 0 ) {
				ctx.translate(0, board.creatureYOffset);
				tile = board.creatureTileMatrix[colIt][rowIt];
				ctx.drawImage(tile.blob.image, tile.getXCoord(), tile.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT);
			}
		}
	}
	// and restore the co-ords to how they were when we began
	//ctx.restore(); 
}; //Board.prototype.drawFlyingCreatures()

/*
Board.prototype.drawRotatedCreatures = function (angle) { 
	var ctx, rowIt, colIt, tile;
	ctx = this.creatureLayer;
	// save the current co-ordinate system before we screw with it
	ctx.save();
	// draw it up and to the left by half the width and height of the image
	for( rowIt = 0; rowIt < this.creatureTileMatrix.length; rowIt++ ) {
		for( colIt = 0; colIt < this.creatureTileMatrix[rowIt].length; colIt++ ) {
			// move to the middle of where we want to draw our image
			ctx.translate(x, y);
			// rotate around that point, converting our angle from degrees to radians 
			ctx.rotate(angle * TO_RADIANS);
			tile = this.creatureTileMatrix[colIt][rowIt];
			ctx.drawImage(tile.blob.image, -(Board.TILE_WIDTH/2), -(Board.TILE_HEIGHT/2));
		}
	}
	// and restore the co-ords to how they were when we began
	ctx.restore(); 
};
*/

Board.prototype.toString = function() {
	var output;
	output = 'creatureTileMatrix: ' + this.creatureTileMatrix + ', ' +
			'goldTileMatrix: ' + this.goldTileMatrix;
	return output;
}; //Board.prototype.toString

Board.prototype.init = function(tilePositions) {
	var board, tileMatrix, colIt, rowIt;
	board = this;
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
    restoreLookupString = localStorage.getItem( timedMode + Galapago.profile + "level" + this.level.id + "restore" );
	if(restoreLookupString != undefined){
		restoreLookup = JSON.parse(restoreLookupString);
		this.score = restoreLookup['score'];
		this.drawScore();
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
			if( cellObject.hasCreature ) {
				if(null === this.firstTileCoordinates){
					this.firstTileCoordinates = coordinates;
				}
				spriteNumber = Tile.CREATUREONLY_TILE_SPRITE_NUMBER;
				this.addTile(coordinates, 'CREATURE', null, spriteNumber);
			}
			if( typeof cellObject.gold != 'undefined' ) {
				this.addTile(coordinates, 'GOLD', cellObject.gold);
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
			var tile = board.addTile(coordinate, 'CREATURE', creature, Tile.CREATUREONLY_TILE_SPRITE_NUMBER);
			board.regenerateMatchingCreatureIfAny(tile, coordinates);
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
Board.prototype.addTile = function(coordinates, blobType, blob, spriteNumber, tile) {
	var layer, tileMatrix, col, row, x, y, width, height, imageName, previousX, previousY;

	tileMatrix = this.getTileMatrix(blobType);
	layer = this.getLayer(blobType);
	col = coordinates[0];
	row = coordinates[1];
	x = Tile.getXCoord(col);
	y = Tile.getYCoord(row);
	width = Board.TILE_WIDTH;
	height = Board.TILE_HEIGHT;
	
	if( tile ) {
		imageName = tile.blob.creatureType;
		console.debug( 'moving existing tile ' + imageName + ' to ' + MatrixUtil.coordinatesToString(coordinates));
		previousX = Tile.getXCoord(tile.coordinates[0]);
		previousY = Tile.getYCoord(tile.coordinates[1]);
		tile.coordinates = coordinates;
		tileMatrix[col][row] = tile;	
		function drawReplace(){
			layer.clearRect( x, y, width, height );
			layer.drawImage(tile.blob.image, x, y, width, height);
			tile.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
		}
		if(this.putInAnimationQ){
			this.animationQ.push(function(){
				layer.clearRect( previousX, previousY, width, height );
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
		}		
		else if( blob.blobType === 'GOLD' || blob.blobType === 'SUPER_FRIEND' ) {
			imageName = blob.blobType;
			tile = new Tile(this, blob, coordinates, spriteNumber);
			tileMatrix[col][row] = tile;
			this.blobCollection.addBlobItem(tile);
			tile.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
		}
		console.debug( 'adding new tile ' + imageName + ' at ' + MatrixUtil.coordinatesToString(coordinates));
		if( blob && blob.image ) {
			function draw(){
				layer.clearRect( x, y, width, height );
				layer.drawImage(blob.image, x, y, width, height);
			}
			if(this.putInAnimationQ && blob.blobType != 'GOLD'){
				this.animationQ.push(draw);
			}else{
				draw();
			}
		}
		if(spriteNumber === Tile.BLOCKED_TILE_SPRITE_NUMBER || (blob && blob.blobType === 'SUPER_FRIEND')){
			this.regenerateMatchingCreatureIfAny(tile);
		}	
	}
	return tile; 
}; //Board.prototype.addTile()

Board.prototype.regenerateMatchingCreatureIfAny = function(tile, excludeTileCoords) {
	var layer, tileMatrix, col, row, x, y, width, height, imageName;
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
				function draw(){ 
				layer.clearRect( x, y, width, height );
				layer.drawImage(tile.blob.image, x, y, width, height);
				}
				if(board.putInAnimationQ){
					board.animationQ.push(draw);
				}else{
					draw();
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
} //Board.prototype.getNonMatchingCreatureTile()

Board.prototype.removeTile = function(tile) {
	var layer, tileMatrix, col, row;

	tileMatrix = this.getTileMatrix(tile.blob.blobType);
	layer = this.getLayer(tile.blob.blobType);
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

Board.prototype.handleMouseMoveEvent = function(evt) {
	var board = this;
	
	if(board.animationQ.length){
			return;
		}
	var	x = evt.pageX ;//- this.offsetLeft;
	var y = evt.pageY ;
	if(board.powerUp && board.powerUp.isPowerAchieved() && (!board.powerUp.isPowerSelected())){ // entertain only if powerup is achived and no powerup is selected 
		if(x> Powerup.LEFT && x< (Powerup.LEFT+Powerup.POWER_UP_WIDTH) && y>Powerup.TOP && y< (Powerup.TOP+Powerup.POWER_UP_HEIGHT)){ // only if mouse (x,y) lies in powerup canvas
			//alert('power up cliecked'+ x +"  "+ y);
			if(!board.isPowerUpFocused){
				//alert('adddinggg');
				board.powerUp.addListener();
				board.isPowerUpFocused = true;
			}
			var absFlipFlowTop = Powerup.TOP +Powerup.FLIPFLOP_TOP; //calculate absolute flipflop top 
			var absFireTop = Powerup.TOP +Powerup.FIRE_TOP ;
			var absFhufflerTop = Powerup.TOP +Powerup.SHUFFLER_TOP ;
			if(board.powerUp.flipflopPowerAchieved && y> absFlipFlowTop  && y< (absFlipFlowTop+Powerup.POWER_ICON_HEIGHT )){ // in flipflop power
					//alert('flipflop power up');
					board.powerUp.currentFocus = Powerup.FLIPFLOP_SELECTED;
					board.powerUp.focus();
					
			}else if(board.powerUp.firePowerAchieved && y>absFireTop && y< (absFireTop+Powerup.POWER_ICON_HEIGHT)){ // in fire power
					//alert('fire power up');
					board.powerUp.currentFocus = Powerup.FIRE_SELECTED;
					board.powerUp.focus();
					
				
			}else if(board.powerUp.shufflerPowerAchieved && y>absFhufflerTop && y< (absFhufflerTop+Powerup.POWER_ICON_HEIGHT)){ // in shuffler power
					//alert('shuffler power up');
					board.powerUp.currentFocus = Powerup.SHUFFLER_SELECTED;
					board.powerUp.focus();
					
			}
			
		}else if(board.isPowerUpFocused){
			board.isPowerUpFocused =false
			board.powerUp.update();
			board.powerUp.currentFocus=0;
			board.powerUp.nextFocus=0;
			window.onkeydown=null;
			board.powerUp.focusOn= 0;
			//board.powerUp.canvas.onfocus=null;
			window.onkeydown = board.powerUp.boardKeyHandler;
		}
	}
	
	if(board.blobCollection && board.blobCollection.button_menu){
		var menuButtonImage = board.blobCollection.button_menu;
		var quitButtonY = Level.MENU_BUTTON_Y + menuButtonImage.height+10;
		var quitButtonImage = board.blobCollection.button_quit;
		if(x> Level.MENU_BUTTON_X && x< (Level.MENU_BUTTON_X+menuButtonImage.width) && y>Level.MENU_BUTTON_Y && y< (Level.MENU_BUTTON_Y+menuButtonImage.height)){
				board.tileActive.setInactiveAsync();
				board.displayMenuButton(true);
				board.displayQuitButton(false);
				board.hotspot = Board.HOTSPOT_MENU;
		}else if(x> Level.MENU_BUTTON_X && x< (Level.MENU_BUTTON_X+Level.BUTTON_WIDTH) && y>quitButtonY && y< (quitButtonY+Level.BUTTON_HEIGHT)){
				board.tileActive.setInactiveAsync();
				board.displayMenuButton(false);
				board.displayQuitButton(true);
				board.hotspot = Board.HOTSPOT_QUIT;
		}else if(board.hotspot){
				board.displayMenuButton(false);
				board.displayQuitButton(false);
				board.hotspot = null;	
				board.setActiveTile(board.tileActive);
		}
	}	
}; //Board.prototype.handleMouseMoveEvent()

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
					var currentX = tile.getXCoord()+325;
					var currentY = tile.getYCoord()+100;
					
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
						board.displayMenuButton(false);
						board.displayQuitButton(false);
						board.hotspot = null;
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
		this.handleMouseClickForMenuAndQuit(x,y);
		//powerup handling 
		this.handleMouseClickForPowerUp(x,y);
}; //Board.prototype.handleMouseClickEvent()

Board.prototype.handleMouseClickForMenuAndQuit = function(x,y) {
	var board = this;
	var menuButtonImage = board.blobCollection.button_menu;
	if(x> Level.MENU_BUTTON_X && x< (Level.MENU_BUTTON_X+menuButtonImage.width) && y>Level.MENU_BUTTON_Y && y< (Level.MENU_BUTTON_Y+menuButtonImage.height)){
			board.displayMenuButton(true);
			board.displayQuitButton(false);
			board.hotspot = Board.HOTSPOT_MENU;
			board.handleKeyboardSelect();
	}
	var quitButtonY = Level.MENU_BUTTON_Y + menuButtonImage.height+10;
	var quitButtonImage = board.blobCollection.button_quit;
	if(x> Level.MENU_BUTTON_X && x< (Level.MENU_BUTTON_X+Level.BUTTON_WIDTH) && y>quitButtonY && y< (quitButtonY+Level.BUTTON_HEIGHT)){
			board.displayMenuButton(false);
			board.displayQuitButton(true);
			board.hotspot = Board.HOTSPOT_QUIT;
			board.handleKeyboardSelect();
	}
}; //Board.prototype.handleMouseClickForMenuAndQuit()

Board.prototype.handleMouseClickForPowerUp = function(x,y) {
	var board = this;
	if(board.powerUp.isPowerAchieved() && (!board.powerUp.isPowerSelected())){ // entertain only if powerup is achived and no powerup is selected 
		if(x> Powerup.LEFT && x< (Powerup.LEFT+Powerup.POWER_UP_WIDTH) && y>Powerup.TOP && y< (Powerup.TOP+Powerup.POWER_UP_HEIGHT)){ // only if mouse (x,y) lies in powerup canvas
			//alert('power up cliecked'+ x +"  "+ y);
			var absFlipFlowTop = Powerup.TOP +Powerup.FLIPFLOP_TOP; //calculate absolute flipflop top 
			var absFireTop	   = Powerup.TOP +Powerup.FIRE_TOP ;
			var absFhufflerTop = Powerup.TOP +Powerup.SHUFFLER_TOP ;
			if(board.powerUp.flipflopPowerAchieved && y> absFlipFlowTop  && y< (absFlipFlowTop+Powerup.POWER_ICON_HEIGHT )){ // in flipflop power
					//alert('flipflop power up');
					board.powerUp.currentFocus = Powerup.FLIPFLOP_SELECTED;
					board.powerUp.focusOn= 1;
					board.powerUp.handleSelect();
					powerup.board.isPowerUpFocused = false;
				
			}else if(board.powerUp.firePowerAchieved && y>absFireTop && y< (absFireTop+Powerup.POWER_ICON_HEIGHT)){ // in fire power
					//alert('fire power up');
					board.powerUp.currentFocus = Powerup.FIRE_SELECTED;
					board.powerUp.focusOn= 1;
					board.powerUp.handleSelect();
					powerup.board.isPowerUpFocused = false;
				
				
			}else if(board.powerUp.shufflerPowerAchieved && y>absFhufflerTop && y< (absFhufflerTop+Powerup.POWER_ICON_HEIGHT)){ // in shuffler power
					//alert('shuffler power up');
					board.powerUp.currentFocus = Powerup.SHUFFLER_SELECTED;
					board.powerUp.focusOn= 1;
					board.powerUp.handleSelect();
					powerup.board.isPowerUpFocused = false;
			}
			
		}
	}
}; //Board.prototype.handleMouseClickForPowerUp()

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
		board.removeTriplets(tileTriplets);
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
			board.animateLightningStrikeAsync(tilesMovedEventProcessorResult.totalTilesAffectedByLightning);
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
		board.chainReactionCounter++;
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
			//board.setComplete();  // board is not updated with final score yet.
			//board.completeAnimationAsync();
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
			board.level.levelAnimation.animateStars(board.gameAnimationLayer, tile.getXCoord(), tile.getYCoord(), tile.blob.image.id, board.blobCollection);
		});
	}
	if(this.putInAnimationQ){
		this.animationQ.push(draw);
	}else{
		draw();
	}
}

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
}

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
}


Board.prototype.setComplete = function() {
	var levelHighestScore, timedMode;
	this.level.cleanup(true);
	if(this.bonusFrenzy == undefined){
		window.onkeydown= null;
		window.onclick = null;
		window.onmousemove = null;
		this.bonusFrenzy = new BonusFrenzy(this);
	}else{
		$('#level').html(this.score);
	    Level.POWER_UP_SCORE = (Score.BONUS_FRENZY_POWERUP_MULTIPLIER * this.bonusFrenzy.getScore());
		this.score += (Score.BONUS_FRENZY_CREATURE_POINTS * this.bonusFrenzy.getScore()) ;
		if( Galapago.isTimedMode ) {
			var timeleft = this.level.dangerBar.timeRemainingMs;
			$('#timeBonus').html(timeleft/Score.LEVEL_COMPLETE_TIME_BONUS_DIVISOR);		 
			this.score += (timeleft/Score.LEVEL_COMPLETE_TIME_BONUS_DIVISOR);
		} else {
			$('#row-timeBonus').hide();
		}
		this.drawScore();
		this.level.isCompleted = true;
		timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
		localStorage.setItem( timedMode + Galapago.profile + "level" + this.level.id + ".completed", true );
		levelHighestScore = localStorage.getItem( timedMode + Galapago.profile + "level" + this.level.id + ".highScore");
		var totalScore = localStorage.getItem( timedMode + Galapago.profile + ".totalScore" );
		if(totalScore){
			if(levelHighestScore && (Number(levelHighestScore) < Number(this.score)) ) {
				totalScore=Number(totalScore)+this.score - Number(levelHighestScore);
			}
			else {
				totalScore=Number(totalScore)+this.score;
			}
			localStorage.setItem( timedMode + Galapago.profile + ".totalScore", totalScore );
		}
		else {
			totalScore=this.score;
			localStorage.setItem( timedMode + Galapago.profile + ".totalScore", totalScore );
		}
		if(levelHighestScore && (Number(levelHighestScore) < Number(this.score)) ){
			localStorage.setItem( timedMode + Galapago.profile + "level" + this.level.id + ".highScore", this.score );
		}
		else if(!levelHighestScore){
			localStorage.setItem( timedMode + Galapago.profile + "level" + this.level.id + ".highScore", this.score);
		}
		$('#bonusFrenzy').html( this.bonusFrenzy.getScore() );
		$('#bonusPoints').html( Score.BONUS_FRENZY_CREATURE_POINTS * this.bonusFrenzy.getScore() );
		$('#levelScore').html( this.score );
		$('#score').html( totalScore );
		$('#dialog-level-won').css('background-image','url(' + LoadingScreen.gal.get(MainMenuScreen.DIALOG_PREFIX+'dialog-regular.png').src + ')');
		new DialogMenu('screen-game', this, 'dialog-level-won', 'button-medium-hilight','button-medium-hilight','button_medium_regular');
		this.showGoldAndCreatures();
	}
} //Board.prototype.setComplete()

Board.prototype.handleTileSelect = function(tile) {
	var board, tilePrev, tileCoordinates, dangerBar;
	board = this;
	board.navigationLock = true;
	console.log("appling navigation lock in handle tile select 2273");
	tilePrev = this.tileSelected;
	tileCoordinates = tile.coordinates;
	dangerBar = board.level.dangerBar;
	if(tile && !(tile.isCreatureOnly() || tile.hasSuperFriend()) && !this.powerUp.isFireSelected()){
		//board.sounds['cannot-select'].play();
		Galapago.audioPlayer.playInvalidTileSelect();
		board.navigationLock = false;
		console.log('reverting navigation lock in handle tile select 2281');
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
					board.level.levelAnimation.animateDroppingCreatures(board.animationQ).then(function(){
						board.animationQ = [];
						board.putInAnimationQ = false;
						
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
							board.setActiveTile(tilePrev);
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
		if(dangerBar){
			dangerBar.resume();
		}
		if( board.scoreEvents.length > 0 ) {
			board.updateScoreAndCollections(tileCoordinates);
		}else if(board.blobCollection.isEmpty()){
			if(board.level.id==1){
				board.level.bubbleTip.showBubbleTip(i18n.t("Game Tips.BonusFrienzy tip"));
				board.level.levelCompleted = true;
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
		tilePrev.setUnselected();
		this.tileSelected = null;
		board.navigationLock = false;
		return;
	}
}; //Board.prototype.handleTileSelect

Board.prototype.updateScoreAndCollections = function(coordinatesToActivate) {
	var board = this;
	board.updateScore();
	if(board.collectionModified || board.powerAchieved){
	   board.saveBoard();
	   board.collectionModified = false;
	}
	board.tileActive = board.getCreatureTilesFromPoints( [coordinatesToActivate] )[0];
	board.tileActive.setActiveAsync().done();
	if( board.blobCollection.isEmpty()){
		if(board.level.id==1){
			board.level.bubbleTip.showBubbleTip(i18n.t('Game Tips.BonusFrienzy tip'));
			board.level.levelCompleted = true;
		}else{
		board.setComplete();
	}
	}
}

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
	var originalLockedTiles = []
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
			    }while(!temp || temp.isPlain())
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
	
}

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
} //Board.prototype.handleLockedTilesForShuffle

Board.prototype.dangerBarEmptied = function() {
	var timedMode, tileMatrix, gameboard;
	tileMatrix =this.creatureTileMatrix;
	gameboard = this;
	timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	localStorage.removeItem( timedMode + Galapago.profile + "level" + this.level.id + "restore" );
	this.level.levelAnimation.stopAllAnimations();
	_.each(tileMatrix, function(columnArray){ //loop over rows
	  _.each(columnArray, function(tile){ //loop over columns
			  if(tile){
			   if( !(gameboard.getGoldTile(tile) || tile.isBlocked() || tile.isCocooned()  || tile.hasSuperFriend()) ){
				  tile.clear();
				  
				}
			  }
		})
	 });
	window.onkeydown=null;	
	$('#final-score').html(gameboard.score);
	if(sdkApi.inDemoMode()){
			$('#dialog-game-over').css('background-image','url(' + LoadingScreen.gal.get(MainMenuScreen.DIALOG_PREFIX+'dialog-small.png').src + ')');
			 new DialogMenu('screen-game', gameboard, 'dialog-game-over', 'button-medium-hilight' ,'button-medium-hilight' ,'button_medium_regular' );
	}else{
			$('#dialog-time-out').css('background-image','url(' + LoadingScreen.gal.get(MainMenuScreen.DIALOG_PREFIX+'dialog-regular.png').src + ')');
			 new DialogMenu('screen-game', gameboard, 'dialog-time-out', 'button-medium-hilight','button-medium-hilight','button_medium_regular');
	}
} //Board.prototype.dangerBarEmptied

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
			   if(gameboard.getGoldTile(tile) || tile.isPlain()){
					  originalBlogconfig = originalblogPositions[x][y];
				  if(gameboard.getGoldTile(tile) && originalBlogconfig == '21' && tile.isCreatureOnly()){
				  restoreLookup[key]='11'; 
				  }else{
				   restoreLookup[key]=originalBlogconfig; 
				  }
				}
				else if(tile.hasSuperFriend() || tile.isBlocked() || tile.isCocooned()){
					restoreLookup[key]= tile.blobConfig;
				}
			  }
		})
 });
	restoreLookup['score'] = gameboard.score;
	blogColl = gameboard.blobCollection.blobCollection;
	nilcollections = [];
    for(var key in blogColl){
		if(blogColl[key].count == 0 )
		  nilcollections.push(key);
	}
	restoreLookup['nilCollection'] =  nilcollections; 	
	if(gameboard.level.dangerBar ){
		restoreLookup['dangerBarTimeRemaining'] =  gameboard.level.dangerBar.timeRemainingMs; 
	}
	timedMode = Galapago.isTimedMode ? Galapago.MODE_TIMED : Galapago.MODE_RELAXED;
	localStorage.setItem( timedMode + Galapago.profile + "level" + this.level.id + "restore" , JSON.stringify(restoreLookup) );
} //Board.prototype.saveBoard()

Board.prototype.handleKeyboardSelect = function() {
    var board = this;
	switch( this.hotspot ) {
		case Board.HOTSPOT_MENU:
			//sdkApi.reportPageView(TGH5.Reporting.Page.GameMenu);
			if(this.level.dangerBar){
				this.level.dangerBar.pause();
			}
			board.reshuffleService.stop();
			$('#dialog-game-menu').css('background-image','url(' + LoadingScreen.gal.get(MainMenuScreen.DIALOG_PREFIX+'dialog-regular.png').src + ')');
			new DialogMenu('screen-game', this, 'dialog-game-menu', 'button-huge-hilight','button-huge-hilight','button-huge');
			break;
			//gameMenu.show(this);
		case Board.HOTSPOT_QUIT:	
			if(this.level.dangerBar){
				this.level.dangerBar.pause();
			}
			board.reshuffleService.stop();
			$('#dialog-quit').css('background-image','url(' + LoadingScreen.gal.get(MainMenuScreen.DIALOG_PREFIX+'dialog-regular-no-title.png').src + ')');
			new DialogMenu('screen-game', this, 'dialog-quit', 'button-huge-hilight','button-huge-hilight','button-huge');
		    break;
		case null:
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
					this.level.bubbleTip.showBubbleTip(i18n.t(key));
					Galapago.delay(5000).done(function(){board.level.bubbleTip.clearBubbleTip(i18n.t(key))});
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
	col = board.tileActive.coordinates[0];
	row = board.tileActive.coordinates[1];
	do{
		col++;
		if(col==board.creatureTileMatrix.length){
			break;
		}
		tileRight = board.creatureTileMatrix[col][row];
	}while(tileRight == null)
	if( tileRight && (!this.hotspot) && (!this.navigationLock)) {
		board.navigationLock = true;
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileRight);
		board.navigationLock = false;
		return this; //chainable;
		}).done();
	}else { // move to powerup if on the rightmost 
	    if(this.powerUp.isPowerAchieved() && (!this.powerUp.isPowerSelected()) ){
			this.powerUp.addListener();
		}else{
			board.tileActive.setInactiveAsync();
			board.displayMenuButton(true);
			board.displayQuitButton(false);
			this.hotspot = Board.HOTSPOT_MENU;
	}
	
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
	col = board.tileActive.coordinates[0];
	row = board.tileActive.coordinates[1];
	do{
		col--;
		if(col<0){
			break;
		}
		tileLeft = board.creatureTileMatrix[col][row];
	}while(tileLeft == null)
	if( tileLeft && (!this.hotspot) && (!this.navigationLock)) {
		board.navigationLock=true;
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileLeft);
		board.navigationLock=false;
		return this; //chainable
		}).done();
	} else {
	    console.log("isPowerAchieved :  "+this.powerUp.isPowerAchieved());
	    if(this.powerUp.isPowerAchieved() && (!this.powerUp.isPowerSelected()) ){
			//this.powerUp.focus();
			this.powerUp.addListener();
			//this.powerUp.canvas.focus();
		}
		//board.displayMenuButton(true);
		//this.hotspot = Board.HOTSPOT_MENU;
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
	col = board.tileActive.coordinates[0];
	row = board.tileActive.coordinates[1];
	do{
		row++;
		if(row==board.creatureTileMatrix[col].length){
			break;
		}
		tileDown = board.creatureTileMatrix[col][row];
	}while(tileDown == null)
	if( tileDown && (!this.hotspot) && (!this.navigationLock)) {
		board.navigationLock=true;
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileDown);
		board.navigationLock=false;
		return this; //chainable
		}).done();
	}else if(this.hotspot != Board.HOTSPOT_MENU && (!this.navigationLock) ){
		board.navigationLock=true;
		board.tileActive.setInactiveAsync();
		board.displayMenuButton(true);
		board.displayQuitButton(false);
		this.hotspot = Board.HOTSPOT_MENU;
		board.navigationLock=false;
	}else if(!this.navigationLock){
		board.navigationLock=true;
		board.displayMenuButton(false);
		board.displayQuitButton(true);
		this.hotspot = Board.HOTSPOT_QUIT;
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
	if(this.hotspot == Board.HOTSPOT_QUIT){
		board.displayMenuButton(true);
		board.displayQuitButton(false);
		this.hotspot = Board.HOTSPOT_MENU;	
	}else{
	    if(this.hotspot == Board.HOTSPOT_MENU) {
		  board.displayMenuButton(false);
		  this.hotspot=null;
		  board.setActiveTile(board.tileActive);
		  return;
		}
		col = board.tileActive.coordinates[0];
		row = board.tileActive.coordinates[1];
		do{
			row--;
			if(row<0){
				break;
			}
			tileUp = board.creatureTileMatrix[col][row];
		}while(tileUp == null)
		if( tileUp && (!this.navigationLock)) {
			board.navigationLock=true;
			board.tileActive.setInactiveAsync().then(function() {
			board.setActiveTile(tileUp);
			board.navigationLock=false;;
			return this; //chainable
			}).done();
		}
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
	var tileNeighbor, coordsNeighbor, col, row, matrix;
	matrix = this.creatureTileMatrix;
	coordsNeighbor = MatrixUtil.getNeighborCoordinates(tile.coordinates, coordsDistance);
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
				board.nullifyEmptPoints(emptyPoints);
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
	changedPoints = board.fillEmptyPoints(nonFirstRowPoints);
	changedPointsArray = changedPointsArray.concat(changedPoints);
	return changedPointsArray; //chainable
}; //Board.prototype.lowerTilesAbove()

Board.prototype.nullifyEmptPoints = function(emptyPoints) {
	var tileMatrix = this.creatureTileMatrix;
	_.each(emptyPoints, function(emptyPoint){
		tileMatrix[emptyPoint[0]][emptyPoint[1]] = null;
	});
}

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
}

Board.prototype.fillEmptyPoints = function(emptyPoints) {
	var changedPoints= [];
	var spriteNumber = Tile.CREATUREONLY_TILE_SPRITE_NUMBER;
	var board = this;
	emptyPoints = ArrayUtil.unique(emptyPoints);
	_.each( emptyPoints, function(point) {
		//var col = point[0];
		//var row = point[1] + 1;
		//var tile = board.creatureTileMatrix[col][row];
		//if(tile && tile.isPlain()){
			var fallingPoint = board.getFallingPoint(point);
			while(fallingPoint != point){
				board.addTile(fallingPoint, 'CREATURE', null, spriteNumber);
				changedPoints.push(fallingPoint);
				fallingPoint = board.getFallingPoint(point);
			}
			board.addTile(point, 'CREATURE', null, spriteNumber);
			changedPoints.push(point);
		//}
	});
	return changedPoints;
}

// run an animation removing a matching tile triplet
Board.prototype.removeTriplets = function(tileTriplets) {
	var board;
	board = this;
	tileTriplets = _.each( tileTriplets, function(tileTriplet) {
		console.debug( 'removing triplet ' + Tile.tileArrayToPointsString(tileTriplet) );
		if(tileTriplet[0].hasLightningCreature()){
			board.animateLightningStrikeAsync(tileTriplet);
		}
		board.clearTiles(tileTriplet, true);
	});
	return this; //chainable
}; //Board.prototype.removeTriplets

Board.prototype.removeTiles = function(tiles) {
	var board;
	board = this;
	_.each( tiles, function(tile) {
		board.removeTile(tile);
	});
}

Board.prototype.clearTiles = function(tiles, sparkles) {
	var board;
	board = this;
	var pointsArray = Tile.tileArrayToPointsArray(tiles);
	function draw(){
		if(sparkles){
			var centerPoint = pointsArray[Math.floor(pointsArray.length / 2)];
			board.level.levelAnimation.animateSparkles(board.gameAnimationLayer, Tile.getXCoord(centerPoint[0]), Tile.getYCoord(centerPoint[1]));
		}
		_.each( pointsArray, function(point) {
			board.creatureLayer.clearRect( Tile.getXCoord(point[0]), Tile.getYCoord(point[1]), Board.TILE_WIDTH, Board.TILE_HEIGHT );
		});
	}
	if(this.putInAnimationQ){
		this.animationQ.push(draw);
	}else{
		draw();
	}
}

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
		
	//this.creatureLayer.draw();
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
		this.level.levelAnimation.animateCreaturesSwap(this.getLayer('CREATURE'), this, tileSrc, tileDest, function(){
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
};

Board.prototype.animateGoldRemovalAsync = function(goldTiles) {
	var /*deferred,*/ board;
	//deferred = Q.defer();
	board = this;
	Galapago.audioPlayer.playGoldOrBlockingMatch();
	_.each(goldTiles, function(tile) {
		board.removeTile(tile);
		board.goldLayer.clearRect( tile.getXCoord(), tile.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT );
	});
	//deferred.resolve();
	//return deferred.promise;
	return;
};

Board.prototype.animateLightningStrikeAsync = function(matchingTilesSet) {
	var board = this;
	function draw(){
		Galapago.audioPlayer.playLightningStrike();
		board.level.levelAnimation.animateLightning(board.gameLightningLayer, matchingTilesSet);
	}
	if(this.putInAnimationQ){
		this.animationQ.push(draw);
	}else{
		draw();
	}
};

//generate a random number r between 0 and creatureTypes.length - 1
//return a creature image with the rth creature type from the list
Board.prototype.randomCreature = function(creatureTypes) {
	var randomIt, creatureType, creatureImage, creature;
	randomIt = Math.floor( Math.random() * creatureTypes.length );
	creatureType = creatureTypes[randomIt];
	creatureImage = this.level.getCreatureImage(creatureType, Level.CREATURE_SPRITE_NUMBERS[0]);
	creature  = new Creature(creatureType, creatureImage);
	return creature;
};

Board.prototype.updateScore = function() {
	this.score += Score.consolidateScores(this.scoreEvents);
	this.drawScore();
}; //Board.prototype.updateScore

Board.prototype.drawScore = function() {
	var layer;
	layer = this.scoreLayer;
	//layer = this.backgroundLayer;
	layer.clearRect( 0, 0, Score.MAX_WIDTH, Score.MAX_HEIGHT);
	layer.textBaseline = 'top';
	layer.font = Score.FONT_SIZE + 'px ' + Score.FONT_NAME;
	layer.fillStyle = Score.COLOR;//Board.LEVEL_NAME_FONT_COLOR;
	layer.fillText(this.score, 0, 0);
	return this; //chainable
}; //Board.prototype.drawScore()

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
}; //Board.prototype.handleClickOrTap()

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
	this.board.level.levelAnimation.animateCreatureSelection(this.board.getLayer('CREATURE'), this.board, markTile);
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
	this.board.gridLayer.clearRect( this.getXCoord(), this.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.board.gridLayer.drawImage( this.board.level.gameImages.tile_active, this.getXCoord(), this.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT );
	Galapago.audioPlayer.playTileSelect();
	deferred.resolve();
	return deferred.promise;

}; //Tile.prototype.setSelectedAsync()

Tile.prototype.setUnselected = function() {
	this.board.gridLayer.clearRect( this.getXCoord(), this.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT );
	this.board.gridLayer.drawImage( this.board.level.gameImages.tile_regular, this.getXCoord(), this.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT );
	return this; // chainable
};

/*
Tile.prototype.getFilteredPixels = function (filter, arg1, arg2, arg3) {
	var pixelsOut = Filters.filterImage(filter, this.board.creatureLayer, this.blob.image, this.getXCoord(), this.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT, arg1, arg2, arg3);
	return pixelsOut;
};
*/	

Tile.prototype.clear = function() {
	this.board.creatureLayer.clearRect( this.getXCoord(), this.getYCoord(), Board.TILE_WIDTH, Board.TILE_HEIGHT );
};

Tile.prototype.drawBorder = function(color, lineWidth) {	
	var layer, x, y, width, height, offset;
	layer = this.board.gridLayer;
	x = Tile.getXCoord(this.coordinates[0]);
	y = Tile.getYCoord(this.coordinates[1]);
	layer.strokeStyle = color;
	layer.lineWidth = lineWidth;
	offset = 1;
	width = Board.TILE_WIDTH * offset;
	height = Board.TILE_HEIGHT * offset;
	layer.drawImage( this.board.level.gameImages.tile_regular, x, y, width, height );
	layer.strokeRect(x, y, width, height);
}; //Tile.prototype.drawBorder()

Tile.prototype.drawHilight = function() {	
	var layer, x, y, width, height, offset;
	layer = this.board.hilightLayer;
	offset = 1;
	x = Tile.getXCoord(this.coordinates[0])/* - offset*/;
	y = Tile.getYCoord(this.coordinates[1])/* - offset*/;
	width = Board.TILE_WIDTH/* + 2 * offset*/;
	height = Board.TILE_HEIGHT/* + 2 * offset*/;
	layer.drawImage( this.board.level.gameImages.tile_selected, x, y, width, height );
}; //Tile.prototype.drawHilight()

Tile.prototype.eraseHilight = function() {	
	var x, y;
	x = Tile.getXCoord(this.coordinates[0]);
	y = Tile.getYCoord(this.coordinates[1]);
	this.board.hilightLayer.clearRect( x, y, Board.TILE_WIDTH, Board.TILE_HEIGHT );
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

/* class MatrixUtil */
// helper functions for manipulating matrices and points
function MatrixUtil() {}

// determine whether or not two matrices have the same width and height
MatrixUtil.isSameDimensions = function(matrix1, matrix2) {
	if( matrix1.length === matrix2.length /* compare column count */ &&
		/* assuming for now a match if the last column's row counts match */
		matrix1[matrix1.length-1].length === matrix2[matrix2.length-1].length ) {
		return true;
	}
	else {
		return false;
	}
};

// returns the matrix point at a certain distance from a particular point
MatrixUtil.getNeighborCoordinates = function(coordinates, coordsDistance) {
	var coordsNeighbor;
	coordsNeighbor = [];
	coordsNeighbor[0] = coordinates[0] + coordsDistance[0];
	coordsNeighbor[1] = coordinates[1] + coordsDistance[1];
	return coordsNeighbor;
};

//given a point at row R in a NxM matrix, returns an array of coordinates for points above that point
MatrixUtil.getNeighborsAbovePoint = function(coordinates) {
	var neighborPoints, col, row, rowIt;
	neighborPoints = [];
	col = coordinates[0];
	row = coordinates[1];
	for( rowIt = row - 1; rowIt >= 0; rowIt--) {
		neighborPoints.push([col, rowIt]);
	}
	return neighborPoints;
};

//utility wrapper for getNeighborsAbove for a set (array) of points
//first filter only the highest point in the input for a vertical set such as [[0,1],[0,2],[0,3]]
MatrixUtil.getNeighborsAbovePoints = function(points) {
	var neighborPoints, neighborsAbovePoint, highestPoint/*, neighborPointsCopy*/;
	neighborPoints = [];

	if( MatrixUtil.isVerticalPointSet(points) ) {
		highestPoint = [];
		highestPoint.push(MatrixUtil.getHighestPoint(points));
		points = highestPoint;
	}

	_.each(points, function(point) {
		neighborsAbovePoint = MatrixUtil.getNeighborsAbovePoint(point);
		neighborPoints = neighborPoints.concat(neighborsAbovePoint);
	});

	console.debug('getNeighborsAbovePoints results for input ' +
		MatrixUtil.pointsArrayToString(points) + ' is ' +
		MatrixUtil.pointsArrayToString(neighborPoints));
	return neighborPoints;
};

/* this is hard-coded right now for a triplet of points but it could be generalized */
MatrixUtil.isVerticalPointSet = function(points) {
	if( points.length > 1){
		var previousCol = points[0][0];
		var cnt;
		for( cnt = 1 ; cnt < points.length; cnt++){
			var currentCol = points[cnt][0];
			if(previousCol != currentCol){
				return false;
			}
		}
		return true;
	} 
	return false;
};

//higher points have smaller row numbers
//first loop to determine the highestRow
//second loop to return the point with the highestRow
//TODO investigate doing this in one loop with lodash min/max
MatrixUtil.getHighestPoint = function(points) {
	var row, highestRow, highestPoint;
	highestRow = 99; //a large number, larger than anything we're likely to encounter
	highestPoint = points[0];

	_.each(points, function(point) {
		row = point[1];
		if( row < highestRow ) {
			highestRow = row;
		}
	});

	_.each(points, function(point) {
		row = point[1];
		if( highestRow === row ) {
			highestPoint = point;
		}
	});
	return highestPoint;
};

MatrixUtil.lowerPointByNRows = function(point, numRows) {
	return [point[0], point[1] + numRows];
};

// depending on the number of rows N in the input verticalPoints,
// return the points in the first N rows of the column that holds those points
MatrixUtil.getFirstNRowPoints = function(verticalPoints, startIndex) {
	var firstPoints, rowIt, col;
	firstPoints = [];
	rowIt = startIndex + verticalPoints.length - 1;
	col = verticalPoints[0][0];
	for(rowIt; rowIt >= startIndex; rowIt--) {
		firstPoints.push([col, rowIt]);
	}
	return firstPoints;
};

// depending on the number of columns N in the input horizontalPoints,
// return the points in the first row of those N columms
MatrixUtil.getNFirstRowPoints = function(horizontalPoints) {
	var firstPoints, col, row;
	firstPoints = [];
	row = 0;
	_.each(horizontalPoints, function(point) {
		col = point[0];
		firstPoints.push([col, 0]);
	});
	return firstPoints;
};

MatrixUtil.pointsArrayToString = function(points) {
	var pointsString, pointsIt;
	pointsString = '[';
	pointsIt = 0;
	_.each(points, function(point) {
		pointsString += MatrixUtil.coordinatesToString(point);
		if( pointsIt < (points.length - 1) ) {
			pointsString += ', ';
		}
		pointsIt++;
	});
	pointsString += ']';
	return pointsString;
};

MatrixUtil.coordinatesToString = function(coordinates) {
	return '[' + coordinates[0] + ',' + coordinates[1] + ']';
};

// determine the points that are about to change once the pointTriplet is removed
MatrixUtil.getChangingPoints = function(pointsArray) {
	var pointsAbove, changingPoints;
	changingPoints = [];
	console.debug( 'calculating changing points for ' + MatrixUtil.pointsArrayToString(pointsArray) );
	pointsAbove = MatrixUtil.getNeighborsAbovePoints(pointsArray);
	changingPoints = changingPoints.concat(pointsArray).concat(pointsAbove);
	return changingPoints;
}; //MatrixUtil.getChangingPoints()

/* end class MatrixUtil */

/* begin class DangerBar */
DangerBar.REFRESH_INTERVAL_SEC = 5;
DangerBar.RATIO_DANGER = 0.15;
DangerBar.WARNING_10_SEC = 10;
DangerBar.WARNING_5_SEC = 5;
DangerBar.BOTTOM_CAP_TOP = 383;
DangerBar.DANGER_BAR_TOP = 110;
DangerBar.CAP_TOP_TOP = 63;
DangerBar.FILL_ADJUSTMENT_LEFT = 18;
DangerBar.FILL_ADJUSTMENT_TOP = 33;
DangerBar.CAP_BOTTOM_TOP = 495;
DangerBar.LEFT = 1064;
DangerBar.FILL_WIDTH = 15;

//the references to style.top and style.left in this class' images are only meant for variable storage
//and layout in a canvas, not via CSS, thus they leave off 'px' from the positions
function DangerBar(layerBackground, imageArray, initialTimeMs) {
	this.layerBackground = layerBackground;
	this.initImages(imageArray);
	this.canvas = $('#layer-danger-bar');
	this.canvas[0].width = this.danger_bar.width;
	this.canvas[0].height = this.danger_bar.height;
	this.canvas.css( 'left', DangerBar.LEFT + 'px' );
	this.canvas.css( 'top', DangerBar.DANGER_BAR_TOP + 'px' );
	this.layer = this.canvas[0].getContext('2d');
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
	this.drawImages();
}

//dynamically add properties to the DangerBar for each image
//this makes reference to the images easier later
DangerBar.prototype.initImages = function(imageArray) {
	var dangerBar;
	var imageId;
	dangerBar = this;

	_.each(imageArray, function(image) {
		image.width *= 2;
		image.height *= 2;
		imageId = image.id.substring( Galapago.GAME_SCREEN_GAL_PREFIX.length, image.id.length - Galapago.IMAGE_PATH_SUFFIX.length );
		dangerBar[replaceAll( imageId, '-', '_' )] = image;
	});
}; //DangerBar.prototype.initImages

DangerBar.prototype.drawImages = function() {
	this.layerBackground.drawImage( this.danger_bar, DangerBar.LEFT, DangerBar.DANGER_BAR_TOP, this.danger_bar.width, this.danger_bar.height )
	//this.layer.drawImage( this.danger_bar_cap_top01, DangerBar.LEFT, DangerBar.CAP_TOP_TOP, this.danger_bar_cap_top01.width, this.danger_bar_cap_top01.height );
	//this.layer.drawImage( this.danger_bar_cap_bottom01, DangerBar.LEFT, DangerBar.CAP_BOTTOM_TOP, this.danger_bar_cap_bottom01.width, this.danger_bar_cap_bottom01.height );
	this.layer.drawImage( this.danger_bar_fill_1, DangerBar.FILL_ADJUSTMENT_LEFT, this.fillTop, DangerBar.FILL_WIDTH, this.fillHeight );
}; //DangerBar.prototype.drawImages()

DangerBar.prototype.isRunning = function() {
	if(!this.timer){
	return false;
	}
	//return this.intervalId >= 0;
	return this.timer.isRunning();
}; //DangerBar.prototype.isRunning()

DangerBar.prototype.start = function() {
	var dangerBar;
	dangerBar = this;
	//dangerBar.layer.clearRect( DangerBar.LEFT, DangerBar.CAP_TOP_TOP, DangerBar.FILL_WIDTH, dangerBar.fillTop );
	this.timer = new PauseableInterval(dangerBar.update,DangerBar.REFRESH_INTERVAL_SEC * 1000,this);
	//dangerBar.intervalId = setInterval(dangerBar.update, DangerBar.REFRESH_INTERVAL_SEC * 1000);
	console.debug('starting danger bar timing with ' + dangerBar.timeRemainingMs/1000 + ' sec remaining');
	return dangerBar; //chainable
}; //DangerBar.prototype.start()

DangerBar.prototype.stop = function() {
	console.debug('stopping danger bar timing with ' + this.timeRemainingMs/1000 + ' sec remaining');
	//clearInterval(this.intervalId);
	if(this.timer){
		this.timer.clearInterval();
	}
	return this; //chainable
}; //DangerBar.prototype.stop()

DangerBar.prototype.pause = function() {
	console.debug('pausing danger bar timing with ' + this.timeRemainingMs/1000 + ' sec remaining');
	console.debug('currentTime pause   : '+new Date().getTime());
	if(this.timer){
		this.timer.pause();
	}
	return this; //chainable
}; 

DangerBar.prototype.resume = function() {
	console.debug('resume danger bar timing with ' + this.timeRemainingMs/1000 + ' sec remaining');
	console.debug('currentTime resume: '+new Date().getTime());
	if(this.timer){
		this.timer.resume();
	}
	return this; //chainable
}; 

DangerBar.prototype.update = function(sender) {
	var ratio, dangerBar, fillHeight, fillNormal, fillDanger, bottomCapNormal, bottomCapDanger;
	dangerBar = Galapago.level.dangerBar;
	fillNormal = dangerBar.danger_bar_fill_1;
	fillDanger = dangerBar.danger_bar_fill_2;
	bottomCapNormal = dangerBar.danger_bar_cap_bottom01;
	bottomCapDanger = dangerBar.danger_bar_cap_bottom02;
	dangerBar.timeRemainingMs -= DangerBar.REFRESH_INTERVAL_SEC * 1000;
	ratio = dangerBar.timeRemainingMs / dangerBar.initialTimeMs;
	console.debug( 'danger bar time remaining ' + dangerBar.timeRemainingMs/1000 + ' sec (' + Math.round(ratio* 100) + '%)' );
	fillHeight = Math.round(dangerBar.fillHeightInitial * ratio);
	dangerBar.fillTop += (dangerBar.fillHeight - fillHeight);
	dangerBar.fillHeight = fillHeight;
	//YM: the height reduces from the bottom, so we need to shift the top down
	// by the same amount that we reduce the height
	fillNormal.height = fillHeight;
	fillDanger.height = fillHeight;
	//clear the space between the top cap and the bottom cap
	dangerBar.layer.clearRect( DangerBar.FILL_ADJUSTMENT_LEFT, dangerBar.fillTopInitial, DangerBar.FILL_WIDTH, dangerBar.fillHeightInitial );
	
	if( ratio > DangerBar.RATIO_DANGER ) {
		dangerBar.layer.drawImage( fillNormal, DangerBar.FILL_ADJUSTMENT_LEFT, dangerBar.fillTop, DangerBar.FILL_WIDTH, fillNormal.height );
	}
	else if( ratio > 0 ) { //0 < ratio <= DangerBar.RATIO_DANGER
		dangerBar.layer.drawImage( fillDanger, DangerBar.FILL_ADJUSTMENT_LEFT, dangerBar.fillTop, DangerBar.FILL_WIDTH, fillDanger.height );

		if( (ratio <= DangerBar.RATIO_DANGER && dangerBar.numTimesBelowDangerRatio === 0) ||
		(dangerBar.timeRemainingMs/1000 <= 10 && dangerBar.timeRemainingMs/1000 > 5) ||
		(dangerBar.timeRemainingMs/1000 <= 5 && dangerBar.timeRemainingMs/1000 > 0) ) {
			dangerBar.numTimesBelowDangerRatio++;
			dangerBar.playWarningSoundRepeated();
		}
	}
	else { //ratio = 0; timeout!
		//clear the space between the top cap and the bottom cap, including the bottom cap
		dangerBar.layer.clearRect( DangerBar.FILL_ADJUSTMENT_LEFT, dangerBar.fillTopInitial, DangerBar.FILL_WIDTH, dangerBar.fillHeightInitial );
		dangerBar.stop();
		Galapago.level.board.dangerBarEmptied();
	}
	return dangerBar; //chainable
}; //DangerBar.prototype.update()

//req 4.9.11 time warning
DangerBar.prototype.playWarningSoundRepeated = function() {
	Galapago.audioPlayer.playTimeWarning();
}; //DangerBar.playWarningSoundRepeated()

/* end class DangerBar */

/* class FileUtil */
// helper functions for manipulating files and filenames
function FileUtil() {}
//strip everything after the last slash in a file path
FileUtil.stripFileName = function (filePath) {
	if( !(filePath === undefined || filePath === null) ) {
		return filePath.substr(0, filePath.lastIndexOf('/') + 1);
	}
};
/* end class FileUtil */

/* class ArrayUtil */
// helper functions for manipulating arrays
function ArrayUtil() {}

//from Justin Johnson at http://stackoverflow.com/a/1890233/567525
ArrayUtil.unique = function(arr) {
	var hash, result;
	hash = {};
	result = [];
	for ( var i = 0, l = arr.length; i < l; ++i ) {
		//it works with objects! tested with Chrome, FF, Opera on Windows 7
		if ( !hash.hasOwnProperty(arr[i]) ) {
			hash[ arr[i] ] = true;
			result.push(arr[i]);
		}
	}
	return result;
};
/* end class ArrayUtil */

// define a startsWith method on String if it doesn't exist already
if (typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function (str){
		return this.slice(0, str.length) === str;
	};
}


ReshuffleService.CHECK_VALID_MOVE_INTERVAL = 30000;
function ReshuffleService(board){
	this.board = board;
	this.reshuffleInterval = null;
	this.isStarted = false;
}

ReshuffleService.prototype.start = function() {
	var reshuffleService = this;
	var board = this.board
	if( !this.reshuffleInterval) {
		this.reshuffleInterval = setInterval(function(){
			var swapForTripletInfo = MatchFinder.findMatch(reshuffleService.board);
			var validMoveFound = swapForTripletInfo.tipInfo.initialTile != null;
			var powerActive = reshuffleService.board.powerUp.isPowerAchieved();
			if(validMoveFound){
				var initialTile = reshuffleService.board.getCreatureTileFromPoint(swapForTripletInfo.tipInfo.initialTile);
				var swapTile = reshuffleService.board.getCreatureTileFromPoint(swapForTripletInfo.tipInfo.swapTile);
				reshuffleService.board.level.levelAnimation.stopMakeMatchAnimation();
				reshuffleService.board.level.levelAnimation.animateMakeMatch(reshuffleService.board.creatureLayer, initialTile, swapTile);
				if(reshuffleService.board.level.id == 1 || reshuffleService.board.level.id == 2){
					board.level.bubbleTip.showBubbleTip(i18n.t('Game Tips.Make Matches'));
					Galapago.delay(5000).done(function(){board.level.bubbleTip.clearBubbleTip(i18n.t('Game Tips.Make Matches'))});
				}
			}
			if(powerActive && !validMoveFound){
				board.level.bubbleTip.showBubbleTip(i18n.t('Game Tips.Use PowerUps'));
				Galapago.delay(5000).done(function(){board.level.bubbleTip.clearBubbleTip(i18n.t('Game Tips.Use PowerUps'))});
			}
			if(!powerActive && !validMoveFound){
				board.level.bubbleTip.showBubbleTip(i18n.t('Game Tips.Shuffling Board'));
				Galapago.audioPlayer.playReshuffle();
				reshuffleService.board.shuffleBoard();
				console.log("reshuffled");
				Galapago.delay(5000).done(function(){board.level.bubbleTip.clearBubbleTip(i18n.t('Game Tips.Shuffling Board'))});
			}
		}, ReshuffleService.CHECK_VALID_MOVE_INTERVAL);
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
		};
	});
  	return swapForTripletInfo;
}

MatchFinder.checkIfSwapMakesMatch = function(board, tileToBeMoved, tileToBeReplaced, withGoldTile){
	if(tileToBeReplaced && (tileToBeReplaced.isCreatureOnly() || tileToBeReplaced.hasSuperFriend())){
 		var tile = new Tile(this, tileToBeMoved.blob, tileToBeReplaced.coordinates, tileToBeMoved.spriteNumber);
 		var matchingTilesSets = board.tilesEventProcessor.getMatchingTilesSets(tile, tileToBeMoved);
 		if(withGoldTile && matchingTilesSets.length){
			var goldFound =  false;
			_.each(matchingTilesSets, function(matchingTilesSet){
				var goldTiles = board.tilesEventProcessor.getGoldTiles(matchingTilesSet);
				if(goldTiles.length){
					goldFound = true;
				}
			})
 			return goldFound;
 		}else{
 			return matchingTilesSets.length > 0;
 		}
 	}
 	return false;
}

// see @Tyler Whitehouse's answer at http://stackoverflow.com/a/11196395/567525
function PauseableInterval(func, delay , sender){
    this.func = func;
    this.delay = delay;  
    this.triggerSetAt = new Date().getTime();
    this.triggerTime = this.triggerSetAt + this.delay;
   // console.log('initial delay '+delay + ' now '+new Date().getTime());
    this.i = window.setInterval(this.func, this.delay ,sender);
    this.t_restart = null;
    this.paused_timeLeft = 0;
    this.getTimeLeft = function(){
        var now = new Date();
        return this.delay - ((now - this.triggerSetAt) % this.delay);
    }
    this.pause = function(){
        this.paused_timeLeft = this.getTimeLeft();
            //console.log('pause  time left : '+this.paused_timeLeft +' now : '+new Date().getTime());
        window.clearInterval(this.i);
        this.i = null;
                //window.setTimeout(this.resume, 4000);
    }
 
    this.reset = function(sender){
        window.clearInterval(this.i);
        this.i = null;
        this.i = window.setInterval(this.func, this.delay,sender);
    }
 
    this.restart = function(sender){
        sender.i = window.setInterval(sender.func, sender.delay,sender);
    }
 
    this.callAndRestart = function(sender){
      sender.restart(sender);
      //console.log('callAndRestart function called : ' +' now : '+new Date().getTime());
      sender.func();
    }
 
    this.resume = function(){
        if (this.i == null){
           // console.log('resume  time left : '+this.paused_timeLeft +' now : '+new Date().getTime());
            this.i = window.setTimeout(this.callAndRestart, this.paused_timeLeft, this);
        }
    }
 
    this.clearInterval = function(){
           window.clearInterval(this.i);
      }
	  
	 this.isRunning = function(){
	     if(this.i != null)
		   return true;
		return false;
     }	 
} //function PauseableInterval()

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
} //function replaceAll()
