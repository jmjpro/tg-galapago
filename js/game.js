"use strict";

/* begin class Galapago */
Galapago.ACTIVE_TILE_LOGIC_LEVELS = [1, 2, 14, 15, 16, 17, 18, 19];
Galapago.CONFIG_FILE_PATH = 'js/levels.json';
Galapago.GAME_IMAGE_DIRECTORY = 'res/img/game-screen/';
Galapago.DANGER_BAR_IMAGE_DIRECTORY = 'res/img/progress-bar/';
Galapago.STAGE_WIDTH = 1280;
Galapago.STAGE_HEIGHT = 720;
Galapago.BACKGROUND_PATH_PREFIX = 'res/img/background/background_';
Galapago.BACKGROUND_PATH_SUFFIX = '.jpg)';
Galapago.IMAGE_PATH_SUFFIX = '.png';
Galapago.LAYER_BACKGROUND = 'layer-background';
Galapago.LAYER_MAP = 'layer-map';
Galapago.NUM_LEVELS = 70;
Galapago.gameImageNames = [
	'button_quit',
	'button_menu',
	'Bracket_Left',
	'Bracket_Right',
	'item_collected_mark',
	'PowerUps_Flame_Activated',
	'PowerUps_Flame_Disabled',
	'PowerUps_Flame_Pressed',
	'PowerUps_Flame_Rollover',
	'PowerUps_Holder',
	'PowerUps_Shuffle_Activated',
	'PowerUps_Shuffle_Disabled',
	'PowerUps_Shuffle_Pressed',
	'PowerUps_Shuffle_Rollover',
	'PowerUps_Swap_Activated',
	'PowerUps_Swap_Disabled',
	'PowerUps_Swap_Pressed',
	'PowerUps_Swap_Rollover',
	'tile_1',
	'tile_2'
];
Galapago.dangerBarImageNames = [
	'danger_bar',
	'progress_bar',
	/*'progress_bar_cap_bottom01',
	'progress_bar_cap_bottom02',
	'progress_bar_cap_top01',
	'progress_bar_cap_top02',*/
	'progress_bar_fill01',
	'progress_bar_fill02'
];

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

Galapago.localization = function(){
    $("#option-continue-playing").i18n();
    $("#option-main-menu").i18n();
    $("#option-new-game").i18n();
    $("#option-how-to-play").i18n();
    $("#option-options").i18n();
    $("#dialog-title").i18n();
}

Galapago.init = function(gameMode) {
	var levelTemp, level, levelIt;
	Galapago.localization();
	Galapago.audioPlayer = new AudioPlayer();
	Galapago.bubbleTip = new BubbleTip();
	Galapago.gameMode = gameMode;
	Galapago.profile = 'profile';
	Galapago.levels = [];
	console.log( 'gameMode: ' + Galapago.gameMode );
	for( levelIt = 0; levelIt < Galapago.NUM_LEVELS; levelIt++ ){
		levelTemp = new Level(levelIt + 1);
		Galapago.levels.push(levelTemp);
	}
	Galapago.loadJsonAsync(Galapago.CONFIG_FILE_PATH).then(function(data) {
		Galapago.setLevelsFromJson(data);
		level = LevelMap.getNextLevel();
		Galapago.levelMap = new LevelMap(level);
	}, function(status) {
		console.log('failed to load JSON level config with status ' + status);
	})/*.then(function() {
		//Galapago.setLevel(levelName);
	})*/.done();
}; //Galapago.init()

Galapago.buildGameImagePaths = function() {
	var gameImagePaths;
	gameImagePaths = [];
	_.each( Galapago.gameImageNames, function(imageName) {
		gameImagePaths.push(Galapago.GAME_IMAGE_DIRECTORY + imageName + Galapago.IMAGE_PATH_SUFFIX);
	});
	return gameImagePaths;
}; //Galapago.buildGameImagePaths()

Galapago.buildDangerBarImagePaths = function() {
	var dangerBarImagePaths;
	dangerBarImagePaths = [];
	_.each( Galapago.dangerBarImageNames, function(imageName) {
		dangerBarImagePaths.push(Galapago.DANGER_BAR_IMAGE_DIRECTORY + imageName + Galapago.IMAGE_PATH_SUFFIX);
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
	this.level = Level.findById(levelId);
	console.log( 'levelName: ' + this.level.id );
	console.log( 'theme: ' + this.level.bgTheme + '_' + this.level.bgSubTheme );
	this.level.display();
	Level.registerEventHandlers();
	//document.location.href = FileUtil.stripFileName(document.URL) + 'index.html?level=' + level;
};

Galapago.printLevelConfigs = function (levelConfigs) {
	_.each( levelConfigs, function(levelConfig) {
		console.debug( levelConfig.toString() );
	});
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
LevelMap.LEVEL_STATUS_FONT_SIZE = '17px';
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
	this.canvas = $('#' + Galapago.LAYER_MAP)[0];
	this.otherAnimationCanvas = $('#' + 'layer-map-other-animation')[0];
	this.layer = this.canvas.getContext('2d');
	this.otherAnimationLayer = this.otherAnimationCanvas.getContext('2d');
	this.hotspotPointsArray = [];
	this.images = null;
	this.levelCounter = 0;
	this.loadImages(ScreenLoader.mapScreenImageNames, this.initImages);
	this.profile = 'Default';
	this.levelAnimation = new LevelAnimation();
} //LevelMap constructor

LevelMap.prototype.initImages = function( instance, images ) {
	var levelMap = instance;
	levelMap.images = images;
	levelMap.display();
}; //LevelMap.prototype.initImages()

//TODO use q.js instead of callback
LevelMap.prototype.loadImages = function (sources, callback) {
	var levelMap= this;
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	var src;
	// get num of sources
	for(src in sources) {
		numImages++;
	}
	for(src in sources) {
		images[src] = new Image();
		images[src].onload = function() {
			if(++loadedImages >= numImages) {
				callback(levelMap, images);
			}
		};
		images[src].src = ScreenLoader.MAP_SCREEN_IMAGE_DIRECTORY + sources[src];
	}
}; //LevelMap.prototype.loadImages()

LevelMap.prototype.display = function() {	
	sdkApi.reportPageView(TGH5.Reporting.Page.MainMenu);
	this.canvas.style.background = 'url(' + 'res/img/map-screen/Map' + Galapago.BACKGROUND_PATH_SUFFIX;
	this.canvas.width = Galapago.STAGE_WIDTH;
	this.canvas.height = Galapago.STAGE_HEIGHT;
	this.canvas.focus();
	$('ul#map-nav').css('display', 'block');
	this.animate(ScreenLoader.gal.get("map-screen/strip_lava_idle.png"),LevelMap.LAVA_SPRITE_MATRIX);
	Galapago.audioPlayer.playVolcanoLoop();
	var otherAnimationCanvas = this.otherAnimationCanvas;
	otherAnimationCanvas.style.zIndex = 9;
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
	var level1Completed =localStorage.getItem("level1.completed");
	if(!level1Completed){
	  this.levelAnimation.animateGameStartArrow(this.otherAnimationLayer);
	}
	this.drawHotspots();
	this.drawBlinkingArrows(LevelMap.getHighestLevelCompleted());
	this.registerEventHandlers();
};

LevelMap.prototype.drawHotspots = function(level){
	var levelMap = this;
	_.each(Galapago.levels, function(level){
		if(level.isComplete()){
			levelMap.drawHotspot(level.mapHotspotRegion);
			levelMap.drawHotspot(level.mapHotspotRegion, true);
		}
	});
	this.setHotspotLevel(this.hotspotLevel);
}

LevelMap.prototype.drawBlinkingArrows = function(level){
	var levelMap = this;
	var levelId, levelInfo, arrow;
	var nextLevelArrowsInfo = [];
	if(level){
		var unlocksLevelsArrows = level.levelConfig.unlocksLevelsArrows;
		_.each(unlocksLevelsArrows, function(unlockLevelArrow){
			for(levelId in unlockLevelArrow){
				if(!(Level.findById(levelId)).isComplete()){
					levelInfo = unlockLevelArrow[levelId];
					for(arrow in levelInfo){
						var img = ScreenLoader.gal.get("map-screen/next_level_arrow_"+arrow+".png")
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
}

LevelMap.prototype.animate = function(image, spriteMatrix){
    var st=new SpriteSheet(image,spriteMatrix);
	var xIndex =0;
	var that=this;
	var animationCanvas = $('#' + 'layer-map-animation')[0];
	var imageData=st.getSpriteData([xIndex,0]);
	animationCanvas.style.zIndex = 9;
	animationCanvas.onclick = function(evt) {
		that.canvas.focus();
	};
	animationCanvas.width = imageData.width;
	animationCanvas.height = imageData.height;
	this.animationCanvas = animationCanvas;
	this.animationLayer =  animationCanvas.getContext('2d');	
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
}

LevelMap.prototype.updateLevelStatus = function() {
	var text, spriteSheet, levelScore;
	this.layer.clearRect( LevelMap.LEVEL_STATUS_X, LevelMap.LEVEL_STATUS_Y, LevelMap.LEVEL_STATUS_WIDTH, LevelMap.LEVEL_STATUS_HEIGHT);
	this.layer.font = LevelMap.LEVEL_STATUS_FONT_SIZE + ' ' + LevelMap.LEVEL_STATUS_FONT_NAME;
	this.layer.fillStyle = LevelMap.LEVEL_STATUS_FONT_COLOR;
	//text = this.hotspotLevel.name.toUpperCase() + ' ' + this.hotspotLevel.id ;
	text = i18n.t('levels.'+this.hotspotLevel.id)+ ' ' + this.hotspotLevel.id
	//this.layer.fillRect( LevelMap.LEVEL_STATUS_X, LevelMap.LEVEL_STATUS_Y, LevelMap.LEVEL_STATUS_WIDTH, LevelMap.LEVEL_STATUS_HEIGHT);
	this.layer.fillText(text, LevelMap.LEVEL_STATUS_LEVEL_TEXT_X, LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y);
	this.layer.drawImage(this.images.level_stars_silver, LevelMap.DIFFICULTY_STARS_X, LevelMap.DIFFICULTY_STARS_Y );
	spriteSheet = new SpriteSheet(this.images.level_stars_gold, LevelMap.STAR_SPRITE_MATRIX);
	spriteSheet.displayFraction(this.layer, this.hotspotLevel.difficulty/LevelMap.MAX_DIFFICULTY, 1, LevelMap.DIFFICULTY_STARS_X, LevelMap.DIFFICULTY_STARS_Y);
	levelScore = localStorage.getItem('level'+this.hotspotLevel.id);
	if(levelScore){
		this.layer.fillText('Score:', LevelMap.LEVEL_STATUS_LEVEL_TEXT_X+70, LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y+80);
		this.layer.fillText(levelScore, LevelMap.LEVEL_STATUS_LEVEL_TEXT_X+70, LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y+105);
	}
	this.hotspotLevel.isCompleted = localStorage.getItem("level" + this.hotspotLevel.id + ".completed");
	if( this.hotspotLevel.isCompleted ) {
		this.layer.drawImage(this.images.green_v, LevelMap.LEVEL_COMPLETE_INDICATOR_X, LevelMap.LEVEL_COMPLETE_INDICATOR_Y, this.images.green_v.width, this.images.green_v.height);
	}
	else if( this.hotspotLevel.id === 1 || this.hotspotLevel.isUnlocked ) {
		//don't draw anything
	}
	else {
		this.layer.drawImage(this.images.level_lock, LevelMap.LEVEL_COMPLETE_INDICATOR_X, LevelMap.LEVEL_COMPLETE_INDICATOR_Y, this.images.level_lock.width, this.images.level_lock.height);
	}
	return this; //chainable
}; //LevelMap.prototype.updateLevelStatus()

LevelMap.prototype.unregisterEventHandlers = function() {
	var levelMap;
	levelMap = this;
	levelMap.canvas.onmousemove = null;
	levelMap.canvas.onclick = null;
	levelMap.canvas.onkeydown = null;
} //LevelMap.prototype.unregisterEventHandlers()

LevelMap.prototype.registerEventHandlers = function() {
	var levelMap, x, y, point, mapHotspotRegion, levelIt, level;
	levelMap = this;

	/*
	levelMap.canvas.onmousemove = function(e) {
		x = e.pageX - this.offsetLeft;
		y = e.pageY - this.offsetTop;
		point = new Array(2);
		point[0] = x;
		point[1] = y;

		for( levelIt = 0; levelIt < Galapago.levels.length; levelIt++ ) {
			level = Galapago.levels[levelIt];
			mapHotspotRegion = level.mapHotspotRegion;
			if( LevelMap.isPointInPoly(point, mapHotspotRegion) ) {
				console.debug(MatrixUtil.coordinatesToString(point) + ' is in mapHotspotRegion for level ' + level.name);
				levelMap.drawHotspot(mapHotspotRegion);
				break;
			}
			else {
				console.debug(MatrixUtil.coordinatesToString(point) + ' is not in mapHotspotRegion for level ' + level.name);
				levelMap.layer.clearRect( 0, 0, Galapago.STAGE_WIDTH, Galapago.STAGE_HEIGHT);
			}
		}
	} //onmousemove
	*/

	levelMap.canvas.onclick = function(evt) {
		levelMap.handleSelect(evt);
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
			case 48: // numeric 0
				//levelMap.reset();				
				break;
			//TODO remove 49.. its for testing purpose	
			case 49: // numeric 1
				levelMap.quit();
				evt.stopPropagation();
				break;
			case 50: // numeric 2
				//TODO
				//console.debug('start next level');
				break;
			default:
		}
	};
}; //LevelMap.prototype.registerEventHandlers

LevelMap.prototype.quit = function() {
	sdkApi.exit();
	return this; //chainable
};

// erase per-level high scores and completed indicators and set hotspot to level 1
LevelMap.prototype.reset = function() {
	//TODO
	console.debug('reset map');
	return this; //chainable
}; //LevelMap.prototype.reset

LevelMap.prototype.handleSelect = function(evt) {
	var x, y, point, levelIt, level;
	x = evt.pageX - this.offsetLeft;
	y = evt.pageY - this.offsetTop;
	point = new Array(2);
	point[0] = x;
	point[1] = y;

	for( levelIt = 0; levelIt < Galapago.levels.length; levelIt++ ) {
		level = Galapago.levels[levelIt];
		if( LevelMap.isPointInPoly(point, level.mapHotspotRegion) ) {
			//levelMap.drawHotspot(mapHotspotRegion);
			Galapago.setLevel(level.id);
			break;
		}
		else {
			console.debug(MatrixUtil.coordinatesToString(point) + " didn't click anywhere special ");
		}
	}
}; //LevelMap.prototype.handleSelect()

LevelMap.prototype.handleKeyboardSelect = function() {   
    this.animationLayer=null;
	this.animationCanvas.onclick=null;
	
	this.animationCanvas.style.zIndex = 0;
	this.otherAnimationCanvas.style.zIndex = 0;
	clearInterval(this.handle) ;
	Galapago.audioPlayer.stopLoop();
	this.levelAnimation.stopAllAnimations();
	$('ul#map-nav').css('display', 'none');
	Galapago.setLevel(this.hotspotLevel.id);
}; //LevelMap.prototype.handleKeyboardSelect()

LevelMap.prototype.handleUpArrow = function() {
	this.setHotspotLevel(this.hotspotLevel.neighbors.north);
}; //LevelMap.prototype.handleUpArrow()

LevelMap.prototype.handleRightArrow = function() {
	this.setHotspotLevel(this.hotspotLevel.neighbors.east);
}; //LevelMap.prototype.handleRightArrow()

LevelMap.prototype.handleDownArrow = function() {
	var mapScreen, mapNav, level;
	level = this.hotspotLevel.neighbors.south;
	if( level && level.mapHotspotRegion.length > 2 ) {
		this.setHotspotLevel(level);
	}
	else {
		this.unregisterEventHandlers();
		$('ul#map-nav').focus();
		mapScreen = new MapScreen();
		mapScreen.registerEventHandlers();
		mapNav = $('#map-nav');
		mapScreen.setNavItem(mapNav.children('li:nth-child(1)'));
	}
}; //LevelMap.prototype.handleDownArrow()

LevelMap.prototype.handleLeftArrow = function() {
	this.setHotspotLevel(this.hotspotLevel.neighbors.west);
}; //LevelMap.prototype.handleLeftArrow()

LevelMap.prototype.setHotspotLevel = function(level) {
	if( level && level.mapHotspotRegion.length > 2 ) {
		if(this.hotspotLevel){
			this.drawHotspot(this.hotspotLevel.mapHotspotRegion, true);
		}
		this.hotspotLevel = level;
		console.info("hotspot on level " + this.hotspotLevel.id);
		//this.layer.clearRect( 0, 0, Galapago.STAGE_WIDTH, Galapago.STAGE_HEIGHT);
		console.debug(MatrixUtil.pointsArrayToString(this.hotspotLevel.mapHotspotRegion));
		this.drawHotspot(this.hotspotLevel.mapHotspotRegion);
		this.updateLevelStatus();
	}
}; //LevelMap.prototype.setHotspotLevel()

LevelMap.prototype.drawHotspot = function(hotspotPointsArray, dim) {
	var x, y, layer;
	layer = this.layer;
	if(dim){
		layer.globalCompositeOperation = 'destination-out';
		layer.lineWidth = 3;
		layer.beginPath();
		layer.moveTo(hotspotPointsArray[0][0], hotspotPointsArray[0][1]);
		for( var pointIt = 1 ; pointIt < hotspotPointsArray.length ; pointIt++ ){
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
		for( var pointIt = 1 ; pointIt < hotspotPointsArray.length ; pointIt++ ){
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
	highestLevelCompletedId = 0;
	
	for (var i = 0; i < localStorage.length; i++){
		keyIt = localStorage.key(i);
		if( matchResult = keyIt.match(/^level(\d+)\.completed$/) ) {
			levelId = matchResult[1];
			_.each(Level.findById(levelId).unlocksLevels, function( unlockedLevelId ) {
				Level.findById(unlockedLevelId).isUnlocked = true;
			});
			if( parseInt(levelId) > highestLevelCompletedId) {
				highestLevelCompletedId = levelId;
			}
		};
	}

	console.debug('highest level completed = ' + highestLevelCompletedId);
	return Level.findById(highestLevelCompletedId);
}; //LevelMap.getHighestLevelCompleted()

LevelMap.getLevelsCompleted = function() {
	var levelsCompleted = [], keyIt, levelId, matchResult;
	for (var i = 0; i < localStorage.length; i++){
		keyIt = localStorage.key(i);
		if( matchResult = keyIt.match(/^level(\d+)\.completed$/) ) {
			levelId = matchResult[1];
			levelsCompleted.push(parseInt(levelId));
		};
	}
	return levelsCompleted;
}; //LevelMap.getHighestLevelCompleted()

// we want to know the level unlocked by the highest level completed;
// when the highest level completed unlocks multiple levels return the minimum of those levels
LevelMap.getNextLevel = function() {
	var highestLevelCompleted, unlockedLevels, nextLevelId;
	highestLevelCompleted = LevelMap.getHighestLevelCompleted();
	if( typeof highestLevelCompleted === 'undefined' ) {
		nextLevelId = 1;
	}
	else {
		unlockedLevels = highestLevelCompleted.unlocksLevels;
		unlockedLevels = _.filter(unlockedLevels, function(levelId){
			return !Level.findById(levelId).isComplete();
		});
		console.debug('unlocked levels for highest level completed = ' + unlockedLevels);
		nextLevelId = _.min(unlockedLevels);
	}
	return Level.findById(nextLevelId);
} //LevelMap.getNextLevel()

LevelMap.reset = function() {
	var keyIt;
	for (var i = 0; i < localStorage.length; i++) {
		keyIt = localStorage.key(i);
		localStorage.removeItem(keyIt);
	}
}

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
Level.CREATURE_PATH = 'res/img/creatures/';
Level.SUPER_FRIEND_PATH = 'res/img/friends/';
Level.GOLD_PATH = 'res/img/gold-tiles/';
Level.BLOB_IMAGE_EXTENSION = 'png';
Level.CREATURE_SPRITE_NUMBERS = ['1', '2', '3'];
Level.LAYER_GRID = 'layer-grid';
Level.LAYER_GOLD = 'layer-gold';
Level.LAYER_CREATURE = 'layer-creature';
Level.BG_THEME_BEACH_CREATURES = ["blue_crab", "green_turtle", "pink_frog", "red_starfish", "teal_blob", "violet_crab", "yellow_fish"];
Level.BG_THEME_FOREST_CREATURES = ["blue_beetle", "green_butterfly", "pink_lizard", "red_beetle", "teal_bug", "violet_moth", "yellow_frog"];
Level.BG_THEME_CAVE_CREATURES = ["blue_crystal", "green_frog", "pink_spike", "red_beetle", "teal_flyer", "violet_lizard", "yellow_bug"];
Level.SUPER_FRIENDS = ["blue_friend", "green_friend", "pink_friend", "red_friend", "teal_friend", "violet_friend", "yellow_friend"];
Level.BLOB_TYPES = ['CREATURE', 'GOLD'];
Level.MENU_BUTTON_X = 20;
Level.MENU_BUTTON_Y = 650;
Level.MENU_BUTTON_WIDTH = 100;
Level.MENU_BUTTON_HEIGHT = 35;
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
	this.levelAnimation = new LevelAnimation();
	this.isUnlocked = false;
}

Level.prototype.getGold = function() {
	var goldImagePath, goldImage, gold;
	goldImagePath = Level.GOLD_PATH + 'tile_gold_1' + '.' + Level.BLOB_IMAGE_EXTENSION;
	goldImage = this.getImageByPath(this.goldImages, goldImagePath);
	gold = new Gold(goldImage);
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
	sfImagePath = Level.SUPER_FRIEND_PATH + sfType + Galapago.IMAGE_PATH_SUFFIX;
	sfImage = this.getImageByPath(this.superFriendImages, sfImagePath);
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
	var imageId;
	level = this;

	_.each(imageArray, function(image) {
		imageId = image.id;
		level[imageId] = image;
	});
}; //Level.prototype.initImages

Level.prototype.setBoard = function(board) {
	this.board = board;
	board.level = this;
};

Level.prototype.buildCreatureImagePaths = function() {
	var creatureTypeIt, creatureImagePathIt, creatureImagePath, creatureImagePaths, spriteIt, creatureType, spriteNumber;
	creatureImagePaths = [];
	creatureImagePathIt = 0;
	for( creatureTypeIt = 0; creatureTypeIt < this.creatureTypes.length; creatureTypeIt++ ) {
		for( spriteIt = 0; spriteIt < Level.CREATURE_SPRITE_NUMBERS.length; spriteIt++ ) {
			creatureType = this.creatureTypes[creatureTypeIt];
			spriteNumber = Level.CREATURE_SPRITE_NUMBERS[spriteIt];
			creatureImagePath = Level.CREATURE_PATH + this.bgTheme + '/' + creatureType + '_' + spriteNumber + '.' + Level.BLOB_IMAGE_EXTENSION;
			creatureImagePaths[creatureImagePathIt] = creatureImagePath;
			creatureImagePathIt++;
		}
	}
	//console.debug('creatureImagePaths: ' + creatureImagePaths);
	return creatureImagePaths;
}; //Level.prototype.buildCreatureImagePaths()

Level.prototype.buildGoldImagePaths = function() {
	var goldImagePaths;
	goldImagePaths = [];
	goldImagePaths[0] = Level.GOLD_PATH + 'tile_gold_1' + '.' + Level.BLOB_IMAGE_EXTENSION;
	return goldImagePaths;
}; //Level.prototype.buildGoldImagePaths()

Level.prototype.buildSuperFriendImagePaths = function() {
	var superFriendPaths, superFriendPath, superFriendIt;
	superFriendPaths = [];
	for( superFriendIt = 0; superFriendIt < Level.SUPER_FRIENDS.length; superFriendIt++ ) {
		superFriendPath = Level.SUPER_FRIEND_PATH + Level.SUPER_FRIENDS[superFriendIt] + Galapago.IMAGE_PATH_SUFFIX;
		superFriendPaths[superFriendIt] = superFriendPath;
	}
	return superFriendPaths;
}; //Level.prototype.buildSuperFriendImagePaths()

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

Level.prototype.loadImagesAsync = function() {
	var level, creatureImagePaths, goldImagePaths, gameImagePaths, dangerBarImagePaths, superFriendImagePaths, levelAnimationImagePaths;
	level = this;
	creatureImagePaths = level.buildCreatureImagePaths();
	goldImagePaths = level.buildGoldImagePaths();
	superFriendImagePaths = level.buildSuperFriendImagePaths();
	gameImagePaths = Galapago.buildGameImagePaths();
	dangerBarImagePaths = Galapago.buildDangerBarImagePaths();
	levelAnimationImagePaths = LevelAnimation.buildImagePaths(level.bgTheme, level.creatureTypes);

	return Q.all([
	level.imgpreloadAsync(gameImagePaths).then( function(imageObjectArray) {
		level.gameImages = imageObjectArray;
		level.initImages(level.gameImages);
	}, function failure(message) {
		throw new Error(message);
	})/*.done()*/,
	level.imgpreloadAsync(dangerBarImagePaths).then( function(imageObjectArray) {
		level.dangerBarImages = imageObjectArray;
	}, function failure(message) {
		throw new Error(message);
	})/*.done()*/,
	level.imgpreloadAsync(creatureImagePaths).then( function(imageObjectArray) {
		level.creatureImages = imageObjectArray;
	}, function failure(message) {
		throw new Error(message);
	})/*.done()*/,
	level.imgpreloadAsync(superFriendImagePaths).then( function(imageObjectArray) {
		level.superFriendImages = imageObjectArray;
	}, function failure(message) {
		throw new Error(message);
	})/*.done()*/,
	level.imgpreloadAsync(goldImagePaths).then( function(imageObjectArray) {
		level.goldImages = imageObjectArray;
		console.debug('level.goldImages = ' + level.goldImages);
	}, function failure(message) {
		throw new Error(message);
	})/*.done()*/,
	level.imgpreloadAsync(levelAnimationImagePaths).then( function(imageObjectArray) {
		level.levelAnimation.initImages(imageObjectArray);
	}, function failure(message) {
		throw new Error(message);
	})/*.done()*/]);
}; //Level.prototype.loadImagesAsync()

Level.prototype.display = function() {
	var level = this;
	level.styleCanvas();
	level.setBoard(new Board());
	if( level.levelConfig.blobPositions ) {
		level.loadImagesAsync().then( function() {
		level.board.init( level.levelConfig.blobPositions );
		level.board.build( level.levelConfig.blobPositions );
		level.board.buildInitialSwapForTriplet( level.levelConfig.initialSwapForTripletInfo );
		level.board.displayBlobCollections();

		if( !MatrixUtil.isSameDimensions(level.board.creatureTileMatrix, level.board.goldTileMatrix) ) {
			throw new Error('creatureTileMatrix dimensions must match goldTileMatrix dimensions');
		}
		level.board.setActiveTile();
		if( Galapago.gameMode === 'MODE_TIMED') {
			var restoreLookupString = localStorage.getItem(Galapago.gameMode+Galapago.profile+"level"+level.id+"restore");
			var restoreLookup ,dengerBarTimeRemaining = null;
			level.dangerBar = new DangerBar(level.layerBackground, level.dangerBarImages, level.levelConfig.dangerBarSeconds * 1000);
			if(restoreLookupString != undefined){
			   restoreLookup = JSON.parse(restoreLookupString);
			   dengerBarTimeRemaining = restoreLookup['dangerBarTimeRemaining'];
			   if(dengerBarTimeRemaining != undefined){
				  level.dangerBar.timeRemainingMs  = dengerBarTimeRemaining;
				  level.dangerBar.start();
			   }
			}
		}
		console.debug(level.toString());

		level.board.addPowerups();
		level.board.displayLevelName();
		level.board.displayMenuButton(false);
		level.board.display();

		return level; //chainable
		}).done();
	}
	else {
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
	localStorage.removeItem(Galapago.gameMode+Galapago.profile+"level"+this.id+"restore" );
	Galapago.audioPlayer.playLevelWon();
    var level = this;
	sdkApi.requestModalAd("inGame").done(function(){
		level.showLevelMap();
	});
}

Level.prototype.quit = function(){
	this.board.saveBoard();
	this.cleanUp();
    this.showLevelMap();
}

Level.prototype.cleanUp = function(){
	this.dangerBar.stop();
    this.board.powerUp.timer.clearInterval();
 	this.levelAnimation.stopAllAnimations();
 	this.board.reshuffleService.stop();
 	Galapago.audioPlayer.stop();
}

Level.prototype.showLevelMap = function(){
	Galapago.levelMap = new LevelMap(this);
 	Galapago.levelMap.canvas.style.zIndex = 7;
	Galapago.levelMap.canvas.focus();	
}

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

	window.onkeydown = function(evt) {
	//board.creatureLayer.canvas.onkeydown = function(evt) {
		console.debug('key pressed ' + evt.keyCode);
		switch( evt.keyCode ) {
			case 13: // enter
				board.handleKeyboardSelect();
				break;
			case 37: // left arrow
				board.handleLeftArrow();
				evt.preventDefault();
				break;
			case 38: // up arrow
				board.handleUpArrow();
				evt.preventDefault();
				break;
			case 39: // right arrow
				board.handleRightArrow();
				evt.preventDefault();
				break;
			case 40: // down arrow
				board.handleDownArrow();
				evt.preventDefault();
				break;
			//TODO code below here should removed before production
			case 48: // numeric 0
				board.completeAnimationAsync();
				break;
			case 49: // numeric 1
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

Level.prototype.styleCanvas = function() {
	var canvas, layers;

	canvas = $('#' + Galapago.LAYER_BACKGROUND)[0];
	canvas.style.background = 'url(' + Galapago.BACKGROUND_PATH_PREFIX + this.bgTheme + '_' + this.bgSubTheme + Galapago.BACKGROUND_PATH_SUFFIX;
	$('#' + Galapago.LAYER_MAP)[0].style.zIndex = 0;

	layers = $('.game-layer');
	_.each( layers, function(layer) {
	    if(layer.id !='layer-map-animation'){
			layer.width = Galapago.STAGE_WIDTH;
			layer.height = Galapago.STAGE_HEIGHT;
		}
	});
	this.layerBackground = canvas.getContext('2d');
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
	var creatureImagePath;
	creatureImagePath = Level.CREATURE_PATH + this.bgTheme + '/' + creatureType + '_' + spriteNumber + '.' + Level.BLOB_IMAGE_EXTENSION;
	return this.getImageByPath(this.creatureImages, creatureImagePath);
};

Level.prototype.isNew = function() {
	var levelSaved = localStorage.getItem(Galapago.gameMode+Galapago.profile+"level"+ this.id +"restore");
	var levelCompleted = this.isComplete();	
	return !levelSaved && !levelCompleted;
};

Level.prototype.isComplete = function() {
	var levelCompleted = localStorage.getItem("level"+ this.id + ".completed");	
	return levelCompleted;
};
/* end class Level */

/*
begin class Board
Board has layer with matrix of Tiles with Creatures
Board has layer with matrix of Tiles with Gold
*/
Board.STAGE_WIDTH_OFFSET = 325;
Board.STAGE_HEIGHT_OFFSET = 100;
Board.CREATURE_FLYOVER_STEP = 20;
Board.WIDTH_TO_HEIGHT_RATIO = 1;
Board.IMAGE_MAGNIFICATION = 1;
/*
Board.WIDTH_TO_HEIGHT_RATIO = 1.25;
*/
Board.ANGULAR_SPEED = Math.PI * 2;
Board.HOTSPOT_MENU = 'hotspot-menu';
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
	this.gridLayer = $('#' + Level.LAYER_GRID)[0].getContext('2d');
	
	this.score = 0;
	this.drawScore();
	this.hotspot = null;

	this.goldLayer = $('#' + Level.LAYER_GOLD)[0].getContext('2d');
	this.goldTileMatrix = [];

	this.creatureLayer = $('#' + Level.LAYER_CREATURE)[0].getContext('2d');
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
} //Board constructor

Board.prototype.display = function() {
	this.creatureLayer.canvas.focus();
	this.reshuffleService.start();
}; //Board.protoype.display()

Board.prototype.displayBlobCollections = function() {
	this.blobCollection.initImages(this.level.gameImages);
	this.blobCollection.display();
};

Board.prototype.displayLevelName = function() {
	var layer, levelNameText;
	layer = this.creatureLayer;
	layer.clearRect(Board.LEVEL_NAME_X, Board.LEVEL_NAME_Y, Board.LEVEL_NAME_MAX_WIDTH, Board.LEVEL_NAME_MAX_HEIGHT);
	layer.font = Board.LEVEL_NAME_FONT_SIZE + ' ' + Board.LEVEL_NAME_FONT_NAME;
	layer.fillStyle = Board.LEVEL_NAME_FONT_COLOR;
	levelNameText =  i18n.t('levels.'+this.level.id) ;
	levelNameText += ' ' + this.level.id; //TODO for debugging only remove before production!!!
	layer.fillText(levelNameText, Board.LEVEL_NAME_X, Board.LEVEL_NAME_Y);
}; //Board.protoype.displayLevelName()

Board.prototype.displayMenuButton = function(isActive) {
	var textColor, layer, menuButtonImage;
	layer = this.creatureLayer;
	menuButtonImage = this.blobCollection.button_menu;
	if( isActive ) {
		this.buttonActive = 'menuButton';
		layer.drawImage(menuButtonImage, Level.MENU_BUTTON_X, Level.MENU_BUTTON_Y, menuButtonImage.width, menuButtonImage.height);
		layer.strokeStyle = Tile.BORDER_COLOR_ACTIVE;
		layer.strokeRect(Level.MENU_BUTTON_X, Level.MENU_BUTTON_Y, menuButtonImage.width, menuButtonImage.height);
	}
	else {
		this.buttonActive = null;
		layer.clearRect(Level.MENU_BUTTON_X - 1, Level.MENU_BUTTON_Y - 1, menuButtonImage.width + 2, menuButtonImage.height + 2);
		layer.drawImage(menuButtonImage, Level.MENU_BUTTON_X, Level.MENU_BUTTON_Y, menuButtonImage.width, menuButtonImage.height);
	}
}; //Board.protoype.displayMenuButton()

Board.prototype.addPowerups = function() {
	this.powerUp=new Powerup(this.level.gameImages , this , Level.POWER_UP_SCORE);
	Level.POWER_UP_SCORE=0;
};

/* req 4.4.2
As default, the cursor is shown on the top leftmost creature on board. However, on new game once in a session, in levels
1,2 and 14 – 19, when Bubble Tips are displayed at the start of the level, the cursor appears on the creature that is
animated according to the displayed tip.
*/
Board.prototype.setActiveTile = function(tile) {
	var tileActive, col, row;
	var levelPlayed = localStorage.getItem(Galapago.gameMode+Galapago.profile+"level"+this.level.id+".levelPlayed");
	if(tile) {
		tileActive = tile;
	}
	
	else if(!tile &&  _.contains(Galapago.ACTIVE_TILE_LOGIC_LEVELS, this.level.id) && (this.level.bubbleTips || this.level.levelConfig.initialSwapForTripletInfo)
    	       && levelPlayed ==  null) {
	    var initialSwapForTripletInfo =  this.level.levelConfig.initialSwapForTripletInfo;
		col = initialSwapForTripletInfo.tipInfo.initialTile[0];
		row = initialSwapForTripletInfo.tipInfo.initialTile[1];
		tileActive = this.creatureTileMatrix[col][row];
		//Galapago.bubbleTip.showBubbleTip("SELECT THE HIGHLIGHTED CREATURE TO START A COCOON TILE MATCH. TO CLEAR IT, YOU MUST MAKE A MATCH OF THE COCOON'S COLOR NEXT TO IT!"); 
		Galapago.bubbleTip.showBubbleTip(i18n.t('Game Tips.Cocoon tip1'));
		this.isCocoonTipShown = 1;
		localStorage.setItem(Galapago.gameMode+Galapago.profile+"level"+this.level.id+".levelPlayed" ,"1" );
		//this.tileSelected = tileActive;
	}	
	else { //YJ: activate top left tile unless otherwise indicated
		col = this.firstTileCoordinates[0];
		row = this.firstTileCoordinates[1];
		tileActive = this.creatureTileMatrix[col][row];
	}
	this.tileActive = tileActive;
	tileActive.setActiveAsync(function() {
			return this; //chainable
	}).done();
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
	ctx = board.creatureLayer;
	board.creatureYOffset -= Board.CREATURE_FLYOVER_STEP;
	// save the current co-ordinate system before we screw with it
	//ctx.save();
	// move the board up by the creatureYOffset amount; 
	for( rowIt = 0; rowIt < board.creatureTileMatrix.length; rowIt++ ) {
		for( colIt = 0; colIt < board.creatureTileMatrix[rowIt].length; colIt++ ) {
			if( rowIt % 2 === 0 && colIt % 2 === 0 ) {
				ctx.translate(0, board.creatureYOffset);
				tile = board.creatureTileMatrix[colIt][rowIt];
				ctx.drawImage(tile.blob.image, tile.getXCoord(), tile.getYCoord(), Tile.getWidth(), Tile.getHeight());
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
			ctx.drawImage(tile.blob.image, -(Tile.getWidth()/2), -(Tile.getHeight()/2));
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
	var colIt, rowIt, coordinates, cellId, cellObject, spriteNumber;
    var restoreLookupString = localStorage.getItem(Galapago.gameMode+Galapago.profile+"level"+this.level.id+"restore");
	var restoreLookup;
	if(restoreLookupString != undefined){
	 restoreLookup = JSON.parse(restoreLookupString);
	 this.score = restoreLookup['score'];
	 this.drawScore();
	 var nilCollection = restoreLookup['nilCollection'];
	 var image ;
	 var id;
	 for(var key in nilCollection){
	    image=null;
		id=null;
		var tempimages = [];
		tempimages=tempimages.concat(this.level.creatureImages, this.level.superFriendImages, this.level.goldImages);
	    for(var creatureKey in tempimages){
		 id = tempimages[creatureKey].id;
		  if(id == nilCollection[key]){
		     image = tempimages[creatureKey];
		      break;
		  }
		  }
		  var blobItem = new BlobItem(image, 0);
		  this.blobCollection.blobCollection[id] = blobItem;
	 }
	}
	//yj: populate the grid
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
				var key = colIt+'_'+rowIt;
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
				if(null == this.firstTileCoordinates){
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
				this.addTile(coordinates, 'CREATURE', cellObject.blocking, spriteNumber);
				//console.debug('TODO implement add blocking tile at ' + MatrixUtil.coordinatesToString(coordinates) );
			}
			if( typeof cellObject.cocoon != 'undefined' ) {
				spriteNumber = Tile.COCOONED_TILE_SPRITE_NUMBER;
				this.addTile(coordinates, 'CREATURE', cellObject.cocoon, spriteNumber);
			}
			if( typeof cellObject.superFriend != 'undefined' ) {
				var tile = this.addTile(coordinates, 'SUPER_FRIEND', cellObject.superFriend);
				//need config to restore later
				tile.blobConfig = cellId;
			}
		}
	}
	
	console.debug('generated ' + this.creatureCounter + ' creatures to get ' + colIt * rowIt + ' creatures with no triplets');
	return;
}; //Board.prototype.build

Board.prototype.buildInitialSwapForTriplet = function(initialSwapForTripletInfo) {
	var board = this;
	if(board.level.isNew() && initialSwapForTripletInfo){
		var coordinates = initialSwapForTripletInfo.coordinates; 
		var colorId = initialSwapForTripletInfo.color;
		_.each(coordinates,function(coordinate){
			var creature = board.level.getCreatureByColorId(colorId, Tile.CREATUREONLY_TILE_SPRITE_NUMBER);
			var tile = board.addTile(coordinate, 'CREATURE', creature, Tile.CREATUREONLY_TILE_SPRITE_NUMBER);
			board.regenerateMatchingCreatureIfAny(tile, coordinates);
		});
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
	var layer, tileMatrix, col, row, x, y, width, height, imageName;

	tileMatrix = this.getTileMatrix(blobType);
	layer = this.getLayer(blobType);
	col = coordinates[0];
	row = coordinates[1];
	x = Tile.getXCoord(col);
	y = Tile.getYCoord(row);
	width = Tile.getWidth();
	height = Tile.getHeight();
	
	if( tile ) {
		imageName = tile.blob.creatureType;
		console.debug( 'moving existing tile ' + imageName + ' to ' + MatrixUtil.coordinatesToString(coordinates));
		tile.coordinates = coordinates;
		tileMatrix[col][row] = tile;
		layer.clearRect( x, y, width, height );
		layer.drawImage(tile.blob.image, x, y, width, height);
		tile.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
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
		layer.clearRect( x, y, width, height );
		if( blob && blob.image ) {
			layer.drawImage(blob.image, x, y, width, height);
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
	width = Tile.getWidth();
	height = Tile.getHeight();
	var board = this;
	var matchingTilesSets = this.tilesEventProcessor.getMatchingTilesSets(fixedTile);
	_.each(matchingTilesSets, function(matchingTilesSet){
		_.each(matchingTilesSet, function(matchingTile){
			if(fixedTile != matchingTile && !(excludeTileCoords && _.contains(excludeTileCoords, matchingTile.coordinates))){
				var tile = board.getNonMatchingCreatureTile(matchingTile);
				col = tile.coordinates[0];
				row = tile.coordinates[1];
				x = Tile.getXCoord(col);
				y = Tile.getYCoord(row);
				tileMatrix[col][row] = tile; 
				layer.clearRect( x, y, width, height );
				layer.drawImage(tile.blob.image, x, y, width, height);
				return;
			}
		});
	});
}

Board.prototype.getNonMatchingCreatureTile = function(tile) {
	//YJ: keep generating new creatures until we find one that doesn't form a triplet with its neighbors
	do {
		this.creatureCounter++;
		var blob = this.randomCreature(this.level.creatureTypes);
		tile = new Tile(this, blob, tile.coordinates, tile.spriteNumber);
	}
	while( this.tilesEventProcessor.getMatchingTilesSets(tile).length > 0 );
	return tile;
}

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
	var levelHighestScore;
	this.level.cleanUp();
	if(this.bonusFrenzy == undefined){
		this.bonusFrenzy = new BonusFrenzy(this);
	}else{
	    Level.POWER_UP_SCORE = (Score.BONUS_FRENZY_POWERUP_MULTIPLIER * this.bonusFrenzy.getScore());
		this.score += (Score.BONUS_FRENZY_CREATURE_POINTS * this.bonusFrenzy.getScore()) ;
		if( Galapago.gameMode === 'MODE_TIMED') {
		 var timeleft = this.level.dangerBar.timeRemainingMs;
		 this.score += (timeleft/Score.LEVEL_COMPLETE_TIME_BONUS_DIVISOR);
		}
		this.drawScore();
		this.level.isCompleted = true;
		localStorage.setItem("level"+this.level.id + ".completed" , true);
		levelHighestScore = localStorage.getItem("level"+this.level.id);
		if(levelHighestScore && (Number(levelHighestScore) < Number(this.score)) ){
			localStorage.setItem("level"+this.level.id , this.score);
		}
		else if(!levelHighestScore){
			localStorage.setItem("level"+this.level.id , this.score);
		}
		this.level.won();
	}
}

Board.prototype.handleTileSelect = function(tile) {
	var board, tilePrev, tileCoordinates, dangerBar;
	board = this;
	tilePrev = this.tileSelected;
	tileCoordinates = tile.coordinates;
	dangerBar = board.level.dangerBar;
	if(tile && !(tile.isCreatureOnly() || tile.hasSuperFriend()) && !this.powerUp.isFireSelected()){
		//board.sounds['cannot-select'].play();
		Galapago.audioPlayer.playInvalidTileSelect();
		return;
	}
	
	//YJ: one tile selected; select it and move on
	if( (!this.powerUp.isFireSelected()) && tilePrev === null ) {
		board.tileSelected = tile;
		tile.setSelectedAsync().then( function() {
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
			board.animateJumpCreaturesAsync( tile, tilePrev, function() {
				board.swapCreatures( tile, tilePrev );
				board.animateSwapCreaturesAsync( tile, tilePrev ).then(function() {
					board.handleTripletsDebugCounter = 0;
					board.chainReactionCounter = 0;
					board.scoreEvents = [];

					board.handleTriplets([tile, tilePrev]);
					console.log( 'handleTripletsDebugCounter: ' + board.handleTripletsDebugCounter );
					if(dangerBar){
						dangerBar.resume();
					}
					if( board.scoreEvents.length > 0 ) {
						board.updateScore();
						if(board.collectionModified || board.powerAchieved){
						   board.saveBoard();
						   board.collectionModified = false;
						}
						if( board.blobCollection.isEmpty()){
							board.setComplete();
						}else{
							//reset grid lines and active tile
							board.redrawBorders( Tile.BORDER_COLOR, Tile.BORDER_WIDTH );
							board.tileActive = board.getCreatureTilesFromPoints( [tileCoordinates] )[0];
							board.tileActive.setActiveAsync().done();
						}
					}
					else if(!board.powerUp.isFlipFlopSelected()) {
						Galapago.audioPlayer.playInvalidSwap();
						// YJ: if no triplet is formed by this move, flip the creatures back to their previous positions
						console.debug( 'no triplet found: undoing last move');
						board.animateJumpCreaturesAsync( tilePrev, tile ,function() {
							board.swapCreatures( tile, tilePrev );
							board.animateSwapCreaturesAsync( tile, tilePrev ).then(function() {
								board.setActiveTile(tile);
							}).done();
						}, function(error) {
							console.error(error);
						});
					}
					if(board.powerUp.isFlipFlopSelected()){
					  board.powerUp.powerUsed();
					}
					
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
				board.updateScore();
				if(board.collectionModified || board.powerAchieved){
					board.saveBoard();
					board.collectionModified = false;
				}
				if( board.blobCollection.isEmpty()){
					board.setComplete();
				}else{
					//reset grid lines and active tile
					board.redrawBorders( Tile.BORDER_COLOR, Tile.BORDER_WIDTH );
					board.tileActive = board.getCreatureTilesFromPoints( [tileCoordinates] )[0];
					board.tileActive.setActiveAsync().done();
				}
		}
		this.powerUp.powerUsed();	
		this.saveBoard();
	}
	// same tile selected; unselect it and move on
	else {
		tilePrev.setUnselected();
		this.tileSelected = null;
		return;
	}
}; //Board.prototype.handleTileSelect

Board.prototype.shuffleBoard = function() {
var tileMatrix = this.creatureTileMatrix;
var board= this;
board.level.levelAnimation.stopAllAnimations();
_.each(tileMatrix, function(columnArray){
  _.each(columnArray, function(tile){
       if(tile && tile.isCreatureOnly()){
          board.addTile(tile.coordinates, 'CREATURE', null,Tile.CREATUREONLY_TILE_SPRITE_NUMBER);
        }
    });
  });
  var coords = board.tileActive.coordinates; 
  board.tileActive = board.creatureTileMatrix[coords[0]][coords[1]];
  board.tileActive.setActiveAsync().done();
}

Board.prototype.dangerBarEmptied = function() {
var tileMatrix =this.creatureTileMatrix;
var gameboard = this;
localStorage.removeItem(Galapago.gameMode+Galapago.profile+"level"+this.level.id+"restore" );
this.level.levelAnimation.stopAllAnimations();
_.each(tileMatrix, function(columnArray){
  _.each(columnArray, function(tile){
          if(tile){
           if( !(gameboard.getGoldTile(tile) || tile.isBlocked() || tile.isCocooned()  || tile.hasSuperFriend()) ){
              tile.clear();
			  window.onkeydown=null;
			  $('#final-score').html(gameboard.score);
			  new DialogMenu('layer-power-up', gameboard, 'dialog-time-out', 'button-medium-hilight');
            }
          }
    })
 });
}

Board.prototype.saveBoard = function() {
var restoreLookup = {};
var originalblogPositions = this.level.levelConfig.blobPositions;
var tileMatrix =this.creatureTileMatrix;
var gameboard = this;
var x,y;
_.each(tileMatrix, function(columnArray){
  _.each(columnArray, function(tile){
  		 if(tile){
           y =tile.coordinates[0];
           x=tile.coordinates[1];
           var key = y+'_'+x;
  		   restoreLookup[key]= null;
           if(gameboard.getGoldTile(tile) || tile.isBlocked() || tile.isCocooned() || tile.isPlain()){
		      var originalBlogconfig = originalblogPositions[x][y];
		      if(gameboard.getGoldTile(tile) && originalBlogconfig == '21' && tile.isCreatureOnly()){
			  restoreLookup[key]='11'; 
			  }else{
               restoreLookup[key]=originalBlogconfig; 
			  }
            }
            else if(tile.hasSuperFriend()){
            	restoreLookup[key]= tile.blobConfig;
            }
          }
    })
 });
 restoreLookup['score'] = gameboard.score;
 var blogColl = gameboard.blobCollection.blobCollection;
 var nilcollections = [];
    for(var key in blogColl){
		if(blogColl[key].count == 0 )
		  nilcollections.push(key);
	}
 restoreLookup['nilCollection'] =  nilcollections; 	
 if(gameboard.level.dangerBar && gameboard.level.dangerBar.isRunning()){
	restoreLookup['dangerBarTimeRemaining'] =  gameboard.level.dangerBar.timeRemainingMs; 
  }
 localStorage.setItem(Galapago.gameMode+Galapago.profile+"level"+this.level.id+"restore" , JSON.stringify(restoreLookup));
}



Board.prototype.handleKeyboardSelect = function() {
    var board = this;
	switch( this.hotspot ) {
		case Board.HOTSPOT_MENU:
			sdkApi.reportPageView(TGH5.Reporting.Page.GameMenu);
			if(this.level.dangerBar){
				this.level.dangerBar.pause();
			}
			new DialogMenu('layer-power-up', this, 'dialog-game-menu', 'button-huge-hilight');
			break;
			//gameMenu.show(this);
		case null:
		default:
			this.handleTileSelect(this.tileActive);
			if(this.isCocoonTipShown ==1){
			    this.isCocoonTipShown =2;
				Galapago.bubbleTip.showBubbleTip(i18n.t('Game Tips.Cocoon tip2'));
			    var initialSwapForTripletInfo =  this.level.levelConfig.initialSwapForTripletInfo;
				var col = initialSwapForTripletInfo.tipInfo.swapTile[0];
				var row = initialSwapForTripletInfo.tipInfo.swapTile[1];
				var tileActive = this.creatureTileMatrix[col][row];
				//this.setActiveTile(tileActive);
				this.tileActive.setInactiveAsync().then(function() {
					board.setActiveTile(tileActive);
					return this; //chainable;
				}).done();
			}else if(this.isCocoonTipShown ==2){
			    this.isCocoonTipShown=null ;
				Galapago.bubbleTip.clearBubbleTip();
			}
			break;
	}
	return this; //chainable
}; //Board.prototype.handleKeyboardSelect

Board.prototype.handleRightArrow = function() {
	var board, tileRight, col, row;
	board = this;
	if(this.isCocoonTipShown){
	    this.isCocoonTipShown=null ;
		Galapago.bubbleTip.clearBubbleTip();
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
	if( tileRight ) {
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileRight);
		return this; //chainable;
		}).done();
	}
	return this; //chainable
}; //Board.prototype.handleRightArrow

Board.prototype.handleLeftArrow = function() {
	var board, tileLeft, col, row;
	board = this;
	if(this.isCocoonTipShown){
	    this.isCocoonTipShown=null ;	
		Galapago.bubbleTip.clearBubbleTip();
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
	if( tileLeft ) {
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileLeft);
		return this; //chainable
		}).done();
	} else {
	    console.log("isPowerAchieved :  "+this.powerUp.isPowerAchieved());
	    if(this.powerUp.isPowerAchieved()){
			//this.powerUp.focus();
			this.powerUp.addListner();
			//this.powerUp.canvas.focus();
		}
		//board.displayMenuButton(true);
		//this.hotspot = Board.HOTSPOT_MENU;
	}
	return this; //chainable
}; //Board.prototype.handleLeftArrow

Board.prototype.handleDownArrow = function() {
	var board, tileDown, col, row;
	board = this;
	if(this.isCocoonTipShown){
	    this.isCocoonTipShown=null ;	
		Galapago.bubbleTip.clearBubbleTip();
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
	if( tileDown ) {
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileDown);
		return this; //chainable
		}).done();
	}else {
		board.displayMenuButton(true);
		this.hotspot = Board.HOTSPOT_MENU;
	}
	return this; //chainable
}; //Board.prototype.handleDownArrow

Board.prototype.handleUpArrow = function() {
	var board, tileUp, col, row;
	board = this;
	if(this.isCocoonTipShown){
	    this.isCocoonTipShown=null ;
		Galapago.bubbleTip.clearBubbleTip();
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
	if( tileUp ) {
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileUp);
		return this; //chainable
		}).done();
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
		creatureTiles.push(this.creatureTileMatrix[point[0]][point[1]]);
	}
	return creatureTiles;
}; //Board.prototype.getCreatureTilesFromPoints()


Board.prototype.lowerTilesAbove = function(verticalPointsSets) {
	var pointsAbove, tilesAbove, emptyPoints, changedPoints;
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
			board.removeTiles(board.getCreatureTilesFromPoints(verticalPointsSet));
			tilesAbove = board.getCreatureTilesFromPoints(pointsAbove);
			changedPoints = board.lowerTiles(tilesAbove, verticalPointsSet.length);
			changedPointsArray = changedPointsArray.concat(changedPoints);
			var startIndex = tilesAbove.length - changedPoints.length;
			emptyPoints = MatrixUtil.getFirstNRowPoints(verticalPointsSet, startIndex);
			if(startIndex > 0){
				nonFirstRowPoints = nonFirstRowPoints.concat(emptyPoints);
			}
			else{
				changedPoints = board.fillEmptyPoints(emptyPoints);
				changedPointsArray = changedPointsArray.concat(changedPoints);
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
			}
			tile.clear();
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
		if((this.creatureTileMatrix[loweredPoint[0]][loweredPoint[1]]).isPlain()){
			return this.getLeftRightFallingPoint(loweredPoint, col, row);				
		}
		else{
			return loweredPoint;
		}
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
		board.clearTiles(tileTriplet);
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

Board.prototype.clearTiles = function(tiles) {
	var board;
	board = this;
	_.each( tiles, function(tile) {
		tile.clear();
	});
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
Board.prototype.animateJumpCreaturesAsync = function(tileSrc, tileDest, callback) {
	var deferred;
	//deferred = Q.defer();
	tileSrc.setUnselected();
	tileDest.setUnselected();
	this.level.levelAnimation.animateCreaturesSwap(this.getLayer('CREATURE'), this, tileSrc, tileDest, function(){
		callback();
	} );
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
		board.goldLayer.clearRect( tile.getXCoord(), tile.getYCoord(), Tile.getWidth(), Tile.getHeight() );
	});
	//deferred.resolve();
	//return deferred.promise;
	return;
};

Board.prototype.animateLightningStrikeAsync = function(goldTiles) {
	Galapago.audioPlayer.playLightningStrike();
	console.log('Ligthning Struck');
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
	this.gridLayer.clearRect( Score.X, Score.Y - Score.MAX_HEIGHT, Score.MAX_WIDTH, Score.MAX_HEIGHT);
	this.gridLayer.font = Score.FONT_SIZE + ' ' + Score.FONT_NAME;
	this.gridLayer.fillStyle = Score.COLOR;
	this.gridLayer.fillText(this.score, Score.X, Score.Y);
	return this; //chainable
}; //Board.prototype.drawScore()

Board.prototype.redrawBorders = function(color, lineWidth) {
	var board, ctx;
	board = this;
	ctx = board.gridLayer;
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	_.each( board.creatureTileMatrix, function(col) {
		_.each( board.creatureTileMatrix[col], function(tile) {
			ctx.strokeRect(tile.getXCoord(), tile.getYCoord(), Tile.getHeight, Tile.getWidth());
		});
	});
	return this; //chainable
}; //Board.prototype.redrawBorders()

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
}; //Board.prototype.redrawBorders()

/* end class Board */

/*
begin class Tile
Tile has a blob (either a Creature or a Gold)
Tile has a matrix coordinate
Tile can be Selected
Tile can be MousedOver
*/
Tile.CREATURE_BRIGHTNESS_ADJUSTMENT = 100;
Tile.BORDER_COLOR = '#d3d3d3';
Tile.BORDER_COLOR_ACTIVE = 'red';
Tile.BORDER_WIDTH = 2;
Tile.BORDER_RADIUS = 3;
Tile.WIDTH = 47;
Tile.HEIGHT = 47;
Tile.DELAY_AFTER_FLIP_MS = 250;
Tile.DELAY_AFTER_ACTIVATE_MS = 50;
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

Tile.prototype.setActiveAsync = function() {
	var deferred;
	//console.debug('active tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	this.drawBorder(Tile.BORDER_COLOR_ACTIVE, Tile.BORDER_WIDTH);
	this.board.level.levelAnimation.animateCreatureSelection(this.board.getLayer('CREATURE'), this.board);
	Q.delay(Tile.DELAY_AFTER_ACTIVATE_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}; //Tile.prototype.setActiveAsync()

Tile.prototype.setInactiveAsync = function() {
	var deferred;
	//console.debug('inactive tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	this.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
	Q.delay(Tile.DELAY_AFTER_ACTIVATE_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}; //Tile.prototype.setActiveAsync()

Tile.prototype.setSelectedAsync = function() {
	var deferred;
	console.debug('selected tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	this.board.gridLayer.clearRect( this.getXCoord(), this.getYCoord(), Tile.getWidth(), Tile.getHeight() );
	this.board.gridLayer.drawImage( this.board.level.tile_2, this.getXCoord(), this.getYCoord(), Tile.getWidth(), Tile.getHeight() );
	Galapago.audioPlayer.playTileSelect();
	deferred.resolve();
	return deferred.promise;

}; //Tile.prototype.setSelectedAsync()

Tile.prototype.setUnselected = function() {
	this.board.gridLayer.clearRect( this.getXCoord(), this.getYCoord(), Tile.getWidth(), Tile.getHeight() );
	this.board.gridLayer.drawImage( this.board.level.tile_1, this.getXCoord(), this.getYCoord(), Tile.getWidth(), Tile.getHeight() );
	//this.board.creatureLayer.drawImage( this.blob.image, this.getXCoord(), this.getYCoord(), Tile.getWidth(), Tile.getHeight() );
	return this; // chainable
};

/*
Tile.prototype.getFilteredPixels = function (filter, arg1, arg2, arg3) {
	var pixelsOut = Filters.filterImage(filter, this.board.creatureLayer, this.blob.image, this.getXCoord(), this.getYCoord(), Tile.getWidth(), Tile.getHeight(), arg1, arg2, arg3);
	return pixelsOut;
};
*/	

Tile.prototype.clear = function() {
	this.board.creatureLayer.clearRect( this.getXCoord(), this.getYCoord(), Tile.getWidth(), Tile.getHeight() );
};

Tile.prototype.drawBorder = function(color, lineWidth) {	
	var layer, x, y, width, height, borderMultiplier;
	layer = this.board.gridLayer;
	layer.strokeStyle = color;
	layer.lineWidth = lineWidth;
	x = Tile.getXCoord(this.coordinates[0]);
	y = Tile.getYCoord(this.coordinates[1]);
	borderMultiplier = 1;
	width = Tile.getWidth() * borderMultiplier;
	height = Tile.getHeight() * borderMultiplier;
	layer.strokeRect(x, y, width, height);
	var imgTile = Galapago.level.tile_1;
	layer.drawImage( imgTile, x, y, width, height );
}; //Tile.prototype.drawBorder()

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
Tile.posToPixels = function(pos, basePixels, widthToHeightRatio, offset ) {
	var unitPixels;
	unitPixels = Math.floor(basePixels * widthToHeightRatio * Board.IMAGE_MAGNIFICATION);
	return pos * unitPixels + offset;
}; //Tile.prototype.posToPixels()

Tile.pixelsToPos = function(pixels, basePixels, widthToHeightRatio, offset ) {
	var unitPixels;
	pixels = pixels - offset;
	unitPixels = basePixels * widthToHeightRatio * Board.IMAGE_MAGNIFICATION;
	return Math.floor(pixels / unitPixels);
}; //Tile.prototype.posToPixels()

Tile.getXCoord = function(col) {
	return Tile.posToPixels(col, Tile.WIDTH, Board.WIDTH_TO_HEIGHT_RATIO, Board.STAGE_WIDTH_OFFSET);
}; //Tile.prototype.getXCoord()

Tile.getYCoord = function(row) {
	return Tile.posToPixels(row, Tile.HEIGHT, 1, Board.STAGE_HEIGHT_OFFSET);
}; //Tile.prototype.getYCoord()

Tile.getCol = function(xCoord) {
	return Tile.pixelsToPos(xCoord, Tile.WIDTH, Board.WIDTH_TO_HEIGHT_RATIO, Board.STAGE_WIDTH_OFFSET);
}; //Tile.prototype.getXCoord()

Tile.getRow = function(yCoord) {
	var offsetY;
	offsetY = Board.STAGE_HEIGHT_OFFSET + $('#canvas-main')[0].offsetTop - window.scrollY;
	return Tile.pixelsToPos(yCoord, Tile.HEIGHT, 1, offsetY);
}; //Tile.prototype.getYCoord()

Tile.getWidth = function() {
	return Tile.WIDTH * Board.IMAGE_MAGNIFICATION * Board.WIDTH_TO_HEIGHT_RATIO;
}; //Tile.getWidth()

Tile.getHeight = function() {
	return Tile.HEIGHT * Board.IMAGE_MAGNIFICATION;
}; //Tile.getHeight()

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
DangerBar.LAYER_DANGER_BAR = 'layer-danger-bar';
DangerBar.REFRESH_INTERVAL_SEC = 5;
DangerBar.RATIO_DANGER = 0.15;
DangerBar.WARNING_10_SEC = 10;
DangerBar.WARNING_5_SEC = 5;
DangerBar.BOTTOM_CAP_TOP = 383;
DangerBar.PROGRESS_BAR_TOP = 110;
DangerBar.CAP_TOP_TOP = 173;
DangerBar.FILL_TOP_ADJUSTMENT = 48;
DangerBar.CAP_BOTTOM_TOP = 605;
DangerBar.LEFT = 1076;
DangerBar.PROGRESS_BAR_LEFT_ADJUSTMENT = 12;
DangerBar.FILL_WIDTH = 15;

//the references to style.top and style.left in this class' images are only meant for variable storage
//and layout in a canvas, not via CSS, thus they leave off 'px' from the positions
function DangerBar(layerBackground, imageArray, initialTimeMs) {
	this.layerBackground = layerBackground;
	this.layer = $('#' + DangerBar.LAYER_DANGER_BAR)[0].getContext('2d');
	this.initialTimeMs = initialTimeMs;
	this.timeRemainingMs = initialTimeMs;
	//this.intervalId = -1;
	//this.imageArray = imageArray;	
	this.magnifyImages(imageArray);
	this.initImages(imageArray);
	//this.positionImages(imageArray);
	//this.fillTop = DangerBar.CAP_TOP_TOP + this.progress_bar_cap_top01.height;
	this.fillTop = DangerBar.PROGRESS_BAR_TOP + DangerBar.FILL_TOP_ADJUSTMENT;
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
		imageId = image.id;
		dangerBar[imageId] = image;
	});
}; //DangerBar.prototype.initImages

DangerBar.prototype.magnifyImages = function(imageArray) {
	_.each(imageArray, function(image) {
			image.width *= Board.IMAGE_MAGNIFICATION;
			image.height *= Board.IMAGE_MAGNIFICATION;
	});
	DangerBar.PROGRESS_LEFT_ADJUSTMENT *= Board.IMAGE_MAGNIFICATION;
}; //DangerBar.prototype.magnifyImages()

DangerBar.prototype.drawImages = function() {
	this.layerBackground.drawImage( this.progress_bar, DangerBar.LEFT - DangerBar.PROGRESS_BAR_LEFT_ADJUSTMENT, DangerBar.PROGRESS_BAR_TOP, this.progress_bar.width, this.progress_bar.height );
	//this.layer.drawImage( this.progress_bar_cap_top01, DangerBar.LEFT, DangerBar.CAP_TOP_TOP, this.progress_bar_cap_top01.width, this.progress_bar_cap_top01.height );
	//this.layer.drawImage( this.progress_bar_cap_bottom01, DangerBar.LEFT, DangerBar.CAP_BOTTOM_TOP, this.progress_bar_cap_bottom01.width, this.progress_bar_cap_bottom01.height );
	this.layer.drawImage( this.progress_bar_fill01, DangerBar.LEFT, this.fillTop, DangerBar.FILL_WIDTH, this.fillHeight );
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
	fillNormal = dangerBar.progress_bar_fill01;
	fillDanger = dangerBar.progress_bar_fill02;
	bottomCapNormal = dangerBar.progress_bar_cap_bottom01;
	bottomCapDanger = dangerBar.progress_bar_cap_bottom02;
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
	dangerBar.layer.clearRect( DangerBar.LEFT, dangerBar.fillTopInitial, DangerBar.FILL_WIDTH, dangerBar.fillHeightInitial );
	
	if( ratio > DangerBar.RATIO_DANGER ) {
		dangerBar.layer.drawImage( fillNormal, DangerBar.LEFT, dangerBar.fillTop, DangerBar.FILL_WIDTH, fillNormal.height );
	}
	else if( (ratio <= DangerBar.RATIO_DANGER && dangerBar.numTimesBelowDangerRatio === 0) ||
		(dangerBar.timeRemainingMs/1000 <= 10 && dangerBar.timeRemainingMs/1000 > 5) ||
		(dangerBar.timeRemainingMs/1000 <= 5 && dangerBar.timeRemainingMs/1000 > 0) ) {
		dangerBar.numTimesBelowDangerRatio++;
		dangerBar.layer.drawImage( fillDanger, DangerBar.LEFT, dangerBar.fillTop, DangerBar.FILL_WIDTH, fillDanger.height );
		//dangerBar.layer.drawImage( bottomCapDanger, DangerBar.LEFT, DangerBar.CAP_BOTTOM_TOP, bottomCapDanger.width, bottomCapDanger.height );
		dangerBar.playWarningSoundRepeated();
	}
	else { //timeout
		//clear the space between the top cap and the bottom cap, including the bottom cap
		dangerBar.layer.clearRect( DangerBar.LEFT, dangerBar.fillTopInitial, DangerBar.FILL_WIDTH, dangerBar.fillHeightInitial );
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

/* begin class BobCervantes */
BobCervantes.BOB_LEFT = 50;
BobCervantes.BOB_TOP = 0;
BobCervantes.CERVANTES_LEFT = 96;
BobCervantes.CERVANTES_TOP = 0;
BobCervantes.REFRESH_INTERVAL_SEC = 1;

function BobCervantes() {
	this.imageBobEyes = Galapago.gameImages[0];
	this.intervalId = -1;
}

BobCervantes.prototype.start = function() {
	var bobCervantes;
	bobCervantes = this;
	this.intervalId = setInterval(bobCervantes.update, BobCervantes.REFRESH_INTERVAL_SEC * 1000);
	return this; //chainable
}; //BobCervantes.prototype.start()

BobCervantes.prototype.stop = function() {
	console.debug('stopping bobcervantes animation');
	clearInterval(this.intervalId);
	return this; //chainable
}; //BobCervantes.prototype.stop()

BobCervantes.prototype.update = function() {
	var ctx, bobEyesLeft, bobEyesTop, bobEyesWidth, bobEyesHeight;
	ctx = Galapago.bobCervantesLayer;
	bobEyesWidth = this.imageBobEyes.width;
	bobEyesHeight = this.imageBobEyes.height;
	ctx.drawImage( this.imageBobEyes, bobEyesLeft, bobEyesTop );
	ctx.clearRect( bobEyesLeft, bobEyesTop, bobEyesWidth, bobEyesHeight );
}; //BobCervantes.prototype.update()

/* end class BobCervantes */

/* begin class BobCervantes */
/*
Powerup.LEFT = 124;
Powerup.TOP = 232;
Powerup.MARGIN = 10;
Powerup.LAYER_POWER_UP = 'layer-power-up';

function Powerup(images) {
	this.initImages(images);
	this.layer = $('#' + Powerup.LAYER_POWER_UP)[0].getContext('2d');
	this.update();
}

Powerup.prototype.initImages = function(imageArray) {
	var powerup;
	var imageId;
	powerup = this;

	_.each(imageArray, function(image) {
		imageId = image.id;
		powerup[imageId] = image;
	});
}; //DangerBar.prototype.initImages

Powerup.prototype.update = function() {
	var ctx, left, top, width, height;
	ctx = this.layer;
	left = Powerup.LEFT;
	top = Powerup.TOP;
	width = this.PowerUps_Flame_Disabled.width;
	height = this.PowerUps_Flame_Disabled.height;
	ctx.clearRect( left, top, width, height );
	ctx.drawImage( this.PowerUps_Holder, left, top );
	top += Powerup.MARGIN * 3;
	ctx.drawImage( this.PowerUps_Flame_Disabled, left, top );
	top += this.PowerUps_Swap_Disabled.height + Powerup.MARGIN;
	ctx.drawImage( this.PowerUps_Swap_Disabled, left, top );
	top += this.PowerUps_Shuffle_Disabled.height + Powerup.MARGIN;
	ctx.drawImage( this.PowerUps_Shuffle_Disabled, left, top );
}; //BobCervantes.prototype.update()
*/
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


ReshuffleService.CHECK_VALID_MOVE_INTERVAL = 5000;
function ReshuffleService(board){
	this.board = board;
	this.reshuffleInterval = null;
}

ReshuffleService.prototype.start = function() {
	var reshuffleService = this;
	this.reshuffleInterval = setInterval(function(){
		if(!reshuffleService.board.powerUp.isPowerAchieved() && !reshuffleService.validMoveFound()){
			Galapago.audioPlayer.playReshuffle();
			reshuffleService.board.shuffleBoard();
			console.log("reshuffled");
		}
	}, ReshuffleService.CHECK_VALID_MOVE_INTERVAL);
}

ReshuffleService.prototype.stop = function() {
	if(this.reshuffleInterval){
		clearInterval(this.reshuffleInterval);
	} 
}

ReshuffleService.prototype.validMoveFound = function() {
	var reshuffleService = this;
	var board = this.board;
	var tileMatrix = board.creatureTileMatrix;
	var validMoveFound = false;
	_.each(tileMatrix, function(columnArray){
		if(!validMoveFound){
		  	_.each(columnArray, function(tile){
		    	if(!validMoveFound && tile && (tile.isCreatureOnly() || tile.hasSuperFriend())){
		         	var neighborTile = board.getNeighbor(tile, [0, -1]);
					validMoveFound = reshuffleService.checkIfSwapMakesValidMove(tile, neighborTile);
					neighborTile = board.getNeighbor(tile, [0, 1]);
		         	validMoveFound = validMoveFound || reshuffleService.checkIfSwapMakesValidMove(tile, neighborTile);
				 	neighborTile = board.getNeighbor(tile, [-1, 0]);
		         	validMoveFound = validMoveFound || reshuffleService.checkIfSwapMakesValidMove(tile, neighborTile);
		         	neighborTile = board.getNeighbor(tile, [1, 0]);
		         	validMoveFound = validMoveFound || reshuffleService.checkIfSwapMakesValidMove(tile, neighborTile);
		        }
		    });
		};
	});
  	return validMoveFound;
}

ReshuffleService.prototype.checkIfSwapMakesValidMove = function(tileToBeMoved, tileToBeReplaced){
	if(tileToBeReplaced && (tileToBeReplaced.isCreatureOnly() || tileToBeReplaced.hasSuperFriend())){
 		var tile = new Tile(this, tileToBeMoved.blob, tileToBeReplaced.coordinates, tileToBeMoved.spriteNumber);
 		return this.board.tilesEventProcessor.getMatchingTilesSets(tile, tileToBeMoved).length > 0;
 	}
 	return false;
}
