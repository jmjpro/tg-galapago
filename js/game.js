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
Galapago.LAYER_BACKGROUND = 'layer-background';
Galapago.LAYER_MAP = 'layer-map';
Galapago.NUM_LEVELS = 70;
Galapago.gameImageNames = [
	'button_quit',
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
		level.setBgTheme(levelJson.bgTheme);
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

Galapago.init = function(gameMode) {
	var levelTemp, level, levelIt;
	Galapago.gameMode = gameMode
	Galapago.levels = [];
	console.log( 'gameMode: ' + Galapago.gameMode );
	for( levelIt = 0; levelIt < Galapago.NUM_LEVELS; levelIt++ ){
		levelTemp = new Level(levelIt + 1);
		Galapago.levels.push(levelTemp);
	}
	Galapago.loadJsonAsync(Galapago.CONFIG_FILE_PATH).then(function(data) {
		Galapago.setLevelsFromJson(data);
		level = Level.findById(1);
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
		gameImagePaths.push(Galapago.GAME_IMAGE_DIRECTORY + imageName + '.png');
	});
	return gameImagePaths;
}; //Galapago.buildGameImagePaths()

Galapago.buildDangerBarImagePaths = function() {
	var dangerBarImagePaths;
	dangerBarImagePaths = [];
	_.each( Galapago.dangerBarImageNames, function(imageName) {
		dangerBarImagePaths.push(Galapago.DANGER_BAR_IMAGE_DIRECTORY + imageName + '.png');
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
	console.log( 'theme: ' + this.level.bgTheme );
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

LevelMap.LEVEL_STATUS_X = 957;
LevelMap.LEVEL_STATUS_Y = 45;
LevelMap.LEVEL_STATUS_WIDTH = 235;
LevelMap.LEVEL_STATUS_HEIGHT = 151;
LevelMap.LEVEL_STATUS_LEVEL_TEXT_X = LevelMap.LEVEL_STATUS_X + 10;
LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y = LevelMap.LEVEL_STATUS_Y + 30;
LevelMap.LEVEL_STATUS_FONT_SIZE = '20px';
LevelMap.LEVEL_STATUS_FONT_NAME = 'Calibri';
LevelMap.LEVEL_STATUS_FONT_COLOR = 'cyan';

/* begin class LevelMap */
function LevelMap(level) {
	this.hotspotLevel = level;
	this.canvas = $('#' + Galapago.LAYER_MAP)[0];
	this.layer = this.canvas.getContext('2d');
	this.hotspotPointsArray = [];
	this.registerEventHandlers();
	this.levelCounter = 0;
	this.display();
	this.setHotspotLevel(level);

} //LevelMap constructor

LevelMap.prototype.updateLevelStatus = function() {
	var text;
	this.layer.clearRect( LevelMap.LEVEL_STATUS_X, LevelMap.LEVEL_STATUS_Y, LevelMap.LEVEL_STATUS_WIDTH, LevelMap.LEVEL_STATUS_HEIGHT);
	this.layer.font = LevelMap.LEVEL_STATUS_FONT_SIZE + ' ' + LevelMap.LEVEL_STATUS_FONT_NAME;
	this.layer.fillStyle = LevelMap.LEVEL_STATUS_FONT_COLOR;
	text = this.hotspotLevel.name.toUpperCase() + ' ' + this.hotspotLevel.id ;
	//this.layer.fillRect( LevelMap.LEVEL_STATUS_X, LevelMap.LEVEL_STATUS_Y, LevelMap.LEVEL_STATUS_WIDTH, LevelMap.LEVEL_STATUS_HEIGHT);
	this.layer.fillText(text, LevelMap.LEVEL_STATUS_LEVEL_TEXT_X, LevelMap.LEVEL_STATUS_LEVEL_TEXT_Y);
	return this; //chainable
}; //Board.prototype.drawScore()

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

	window.onkeydown = function(evt) {
		console.debug('key pressed ' + evt.keyCode);
		switch( evt.keyCode ) {
			case 13: // enter
				levelMap.handleKeyboardSelect();
				break;
			case 37: // left arrow
				levelMap.handleLeftArrow();
				break;
			case 38: // up arrow
				levelMap.handleUpArrow();
				break;
			case 39: // right arrow
				levelMap.handleRightArrow();
				break;
			case 40: // down arrow
				levelMap.handleDownArrow();
				break;
			case 48: // numeric 0
				console.debug('reset map');
				break;
			case 50: // numeric 2
				console.debug('start next level');
				break;
			default:
		}
	};
}; //LevelMap.prototype.registerEventHandlers

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
	Galapago.setLevel(this.hotspotLevel.id);
}; //LevelMap.prototype.handleKeyboardSelect()

LevelMap.prototype.handleUpArrow = function() {
	this.setHotspotLevel(this.hotspotLevel.neighbors.north);
}; //LevelMap.prototype.handleLeftArrow()

LevelMap.prototype.handleRightArrow = function() {
	this.setHotspotLevel(this.hotspotLevel.neighbors.east);
}; //LevelMap.prototype.handleRightArrow()

LevelMap.prototype.handleDownArrow = function() {
	this.setHotspotLevel(this.hotspotLevel.neighbors.south);
}; //LevelMap.prototype.handleRightArrow()

LevelMap.prototype.handleLeftArrow = function() {
	this.setHotspotLevel(this.hotspotLevel.neighbors.west);
}; //LevelMap.prototype.handleLeftArrow()

LevelMap.prototype.setHotspotLevel = function(level) {
	if( level && level.mapHotspotRegion.length > 2 ) {
		this.hotspotLevel = level;
		console.info("hotspot on level " + this.hotspotLevel.id);
		this.layer.clearRect( 0, 0, Galapago.STAGE_WIDTH, Galapago.STAGE_HEIGHT);
		console.debug(MatrixUtil.pointsArrayToString(this.hotspotLevel.mapHotspotRegion));
		this.drawHotspot(this.hotspotLevel.mapHotspotRegion);
		this.updateLevelStatus();
	}
}; //LevelMap.prototype.setHotspotLevel()

LevelMap.prototype.display = function() {
	this.canvas.style.background = 'url(' + Galapago.BACKGROUND_PATH_PREFIX + 'map' + Galapago.BACKGROUND_PATH_SUFFIX;
	this.canvas.width = Galapago.STAGE_WIDTH;
	this.canvas.height = Galapago.STAGE_HEIGHT;
};

LevelMap.prototype.drawHotspot = function(hotspotPointsArray) {
	var x, y;
	this.layer.strokeStyle = 'white';
	this.layer.beginPath();
	this.layer.moveTo(hotspotPointsArray[0][0], hotspotPointsArray[0][1]);
	for( var pointIt = 1 ; pointIt < hotspotPointsArray.length ; pointIt++ ){
		x = hotspotPointsArray[pointIt][0];
		y = hotspotPointsArray[pointIt][1];
		this.layer.lineTo( x, y );
		//this.debugDisplayMapCoordinates(x, y);
	}
	this.layer.closePath();
	this.layer.stroke();
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
}
/* end class MapCell */

/* begin class Level */
Level.CREATURE_PATH = 'res/img/creatures/';
Level.GOLD_PATH = 'res/img/gold-tiles/';
Level.BLOB_IMAGE_EXTENSION = 'png';
Level.CREATURE_SPRITE_NUMBERS = ['1', '2', '3'];
Level.LAYER_GRID = 'layer-grid';
Level.LAYER_GOLD = 'layer-gold';
Level.LAYER_CREATURE = 'layer-creature';
Level.BG_THEME_BEACH_CREATURES = ["blue_crab", "green_turtle", "pink_frog", "red_starfish", "teal_blob", "violet_crab", "yellow_fish"];
Level.BG_THEME_FOREST_CREATURES = ["blue_beetle", "green_butterfly", "pink_lizard", "red_beetle", "teal_bug", "violet_moth", "yellow_frog"];
Level.BG_THEME_MOUNTAINS_CREATURES = ["blue_crystal", "green_frog", "pink_spike", "red_beetle", "teal_flyer", "violet_lizard", "yellow_bug"];
Level.BLOB_TYPES = ['CREATURE', 'GOLD'];

function Level(id) {
	this.id = id;
	this.name = '';
	this.bgTheme = '';
	this.creatureImages = [];
	this.creatureTypes = [];
	//TODO: do we need to store levelConfig?
	this.levelConfig = ''; // original JSON text
	this.goldImages = [];
	this.mapHotspotRegion = [];
	this.dangerBar = null;
	this.gameImages = [];
	this.dangerBarImages = [];
	this.layerBackground = null;
	this.neighbors = {};
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

	creatureType = _.filter( this.creatureTypes, function(creatureType) {
		return creatureType.startsWith(colorId);
	})[0];

	creatureImage = this.getCreatureImage(creatureType, creatureSpriteNumber);
	creature = new Creature(creatureType, creatureImage);
	return creature;
}; //Level.prototype.getCreatureByColorId

Level.prototype.setBgTheme = function(bgTheme) {
	this.bgTheme = bgTheme;
	this.creatureTypes = Level.getCreatureTypesFromTheme(this.bgTheme);
};

Level.prototype.toString = function() {
	var output;
	output = 'name: ' + this.name + ', ' +
			'bgTheme: ' + this.bgTheme + ', ' +
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
};

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
	var level, creatureImagePaths, goldImagePaths, gameImagePaths, dangerBarImagePaths;
	level = this;
	creatureImagePaths = level.buildCreatureImagePaths();
	goldImagePaths = level.buildGoldImagePaths();
	gameImagePaths = Galapago.buildGameImagePaths();
	dangerBarImagePaths = Galapago.buildDangerBarImagePaths();

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
	level.imgpreloadAsync(goldImagePaths).then( function(imageObjectArray) {
		level.goldImages = imageObjectArray;
		console.debug('level.goldImages = ' + level.goldImages);
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

		if( !MatrixUtil.isSameDimensions(level.board.creatureTileMatrix, level.board.goldTileMatrix) ) {
			throw new Error('creatureTileMatrix dimensions must match goldTileMatrix dimensions');
		}
		level.board.setActiveTile();
		level.dangerBar = new DangerBar(level.layerBackground, level.dangerBarImages, level.levelConfig.dangerBarSeconds * 1000);
		console.debug(level.toString());

		level.board.addPowerups();

		return level; //chainable
		}).done();
	}
	else {
		return level; //chainable
	}
}; //Level.prototype.display()

Level.getCreatureTypesFromTheme = function(bgTheme) {
	var creatureTypes;
	switch( bgTheme ) {
		case 'beach':
			creatureTypes = Level.BG_THEME_BEACH_CREATURES;
			break;
		case 'forest':
			creatureTypes = Level.BG_THEME_FOREST_CREATURES;
			break;
		case 'mountains':
			creatureTypes = Level.BG_THEME_MOUNTAINS_CREATURES;
			break;
	}
	return creatureTypes;
}; //Level.getCreatureTypesFromTheme

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
	document.onclick = function(evt) {
		console.log('x: ' + evt.clientX + ', y:' + evt.clientY);
	};

	$('#layer-grid').click(function(evt) {
		Galapago.level.board.handleClickOrTap(evt);
	});

	$('#layer-grid').tap(function(evt) { 
		Galapago.level.board.handleClickOrTap(evt);
	});

	window.onkeydown = function(evt) {
		console.debug('key pressed ' + evt.keyCode);
		switch( evt.keyCode ) {
			case 13: // enter
				Galapago.level.board.handleKeyboardSelect();
				break;
			case 37: // left arrow
				Galapago.level.board.handleLeftArrow();
				break;
			case 38: // up arrow
				Galapago.level.board.handleUpArrow();
				break;
			case 39: // right arrow
				Galapago.level.board.handleRightArrow();
				break;
			case 40: // down arrow
				Galapago.level.board.handleDownArrow();
				break;
			case 48: // numeric 0
			Galapago.level.board.completeAnimationAsync();
				break;
			case 49: // numeric 1
				//Galapago.setLevel('level_01');
				break;
			case 50: // numeric 2
				//Galapago.setLevel('level_02');
				break;
			default:
		}
	};
}; //Level.registerEventHandlers()

Level.prototype.styleCanvas = function() {
	var canvas, layers;

	canvas = $('#' + Galapago.LAYER_BACKGROUND)[0];
	canvas.style.background = 'url(' + Galapago.BACKGROUND_PATH_PREFIX + this.bgTheme + Galapago.BACKGROUND_PATH_SUFFIX;
	$('#' + Galapago.LAYER_MAP)[0].style.zIndex = 0;

	layers = $('.game-layer');
	_.each( layers, function(layer) {
		layer.width = Galapago.STAGE_WIDTH;
		layer.height = Galapago.STAGE_HEIGHT;
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

function Board() {
	this.gridLayer = $('#' + Level.LAYER_GRID)[0].getContext('2d');
	this.score = 0;
	this.drawScore();

	this.goldLayer = $('#' + Level.LAYER_GOLD)[0].getContext('2d');
	this.goldTileMatrix = [];

	this.creatureLayer = $('#' + Level.LAYER_CREATURE)[0].getContext('2d');
	this.creatureTileMatrix = [];

	// hold the tile last clicked
	this.tileSelected = null;
	this.tileActive = null;

	this.rotateAngle = 0;
	this.creatureYOffset = 0;

	this.creatureCounter = 0;
	this.chainReactionCounter = 0;
	this.scoreEvents = [];
	this.handleTripletsDebugCounter = 0;
	this.level = null;	
} //Board constructor

Board.prototype.addPowerups = function() {
	new Powerup(this.level.gameImages);
};

/* req 4.4.2
As default, the cursor is shown on the top leftmost creature on board. However, on new game once in a session, in levels
1,2 and 14 – 19, when Bubble Tips are displayed at the start of the level, the cursor appears on the creature that is
animated according to the displayed tip.
*/
Board.prototype.setActiveTile = function(tile) {
	var tileActive, col, row;
	if(tile && (tile.isBlocked() || tile.isCocooned())){
		tile = this.tileActive;
	}
	if(tile) {
		tileActive = tile;
	}
	else if( _.contains(Galapago.ACTIVE_TILE_LOGIC_LEVELS, this.level.levelNum) && this.level.bubbleTips ) {
		col = this.level.initialActiveTileCoordinates[0];
		row = this.level.initialActiveTileCoordinates[0];
		tileActive = this.creatureTileMatrix[col][row];
		this.tileSelected = tileActive;
	}	
	else { //YJ: activate top left tile unless otherwise indicated
		col = 0;
		row = 0;
		tileActive = this.creatureTileMatrix[col][row];
	}
	tileActive.setActiveAsync(function() {
			return this; //chainable
	}).done();
	this.tileActive = tileActive;
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

	setInterval(this.drawFlyingCreatures, 1000/30);
	if( board.creatureYOffset < 0) {
		clearInterval(this.drawFlyingCreatures);
	}

	this.gridLayer.fillText('Level completed', 600, 350);
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
				tileMatrix[colIt].push([]);
			}
		}
	});
}; //Board.prototype.init

Board.prototype.build = function(tilePositions) {
	var colIt, rowIt, coordinates, cellId, cellObject, spriteNumber;

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
			coordinates = [colIt, rowIt];
			if( cellObject.hasCreature ) {
				spriteNumber = Tile.UNBLOCKED_TILE_SPRITE_NUMBER;
				this.addTile(coordinates, 'CREATURE', null, spriteNumber);
			}
			if( typeof cellObject.gold != 'undefined' ) {
				this.addTile(coordinates, 'GOLD', cellObject.gold);
			}
			if( cellObject.hasTileOnly ) {
				spriteNumber = Tile.PLAIN_TILE_SPRITE_NUMBER; //no creature
				this.addTile(coordinates, 'CREATURE', null, spriteNumber);
			}
			if( typeof cellObject.blocking === 'undefined' ) {
				//this.blockingTileMatrix[colIt][rowIt] = null;
			}
			else {
				spriteNumber = Tile.BLOCKED_TILE_SPRITE_NUMBER;
				this.addTile(coordinates, 'CREATURE', cellObject.blocking, spriteNumber);
				//console.debug('TODO implement add blocking tile at ' + MatrixUtil.coordinatesToString(coordinates) );
			}
			if( typeof cellObject.cocoon === 'undefined' ) {
				//this.cocoonTileMatrix[colIt][rowIt] = null;
			}
			else {
				spriteNumber = Tile.COCOONED_TILE_SPRITE_NUMBER;
				this.addTile(coordinates, 'CREATURE', cellObject.cocoon, spriteNumber);
				//this.addTile();
			}
			if( typeof cellObject.superFriendImage === 'undefined' ) {
				//this.superFriendTileMatrix[colIt][rowIt] = null;
			}
			else {
				console.debug('TODO implement add super friend tile at ' + MatrixUtil.coordinatesToString(coordinates) );
				//this.addTile();					
			}
			//TODO: logic for lighting creatures else if()
		}
	}
	console.debug('generated ' + this.creatureCounter + ' creatures to get ' + colIt * rowIt + ' creatures with no triplets');
	return;
}; //Board.prototype.build

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
	if( cellId.length >=3 && cellId[2].search('[bgpurty]') !== -1 ) {
		cellObject.blocking = this.level.getCreatureByColorId( cellId[2], Level.CREATURE_SPRITE_NUMBERS[1] );
	}
	//if the fourth string char contains one of these color ids
	if( cellId.length >=4 && cellId[3].search('[bgpurty]') !== -1 ) {
		cellObject.cocoon = this.level.getCreatureByColorId( cellId[3], Level.CREATURE_SPRITE_NUMBERS[2] );
	}
	//if the fifth string char contains one of these color ids
	if( cellId.length >=5 && cellId[4].search('[bgpurty]') !== -1 ) {
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
	}
	else {
		if( 'CREATURE' === blobType ) {
			tile = new Tile(this, blob, coordinates, spriteNumber);
			if( spriteNumber === '1' ) {
				//YJ: keep generating new creatures until we find one that doesn't form a triplet with its neighbors
				do {
					this.creatureCounter++;
					blob = this.randomCreature(this.level.creatureTypes);
					imageName = blob.creatureType;
					tile = new Tile(this, blob, coordinates, spriteNumber);
				}
				while( this.findTriplets(tile).length > 0 );
			}
			else if( spriteNumber === '2' ) {
				imageName = blob.creatureType;
			}
			tileMatrix[col][row] = tile;
			tile.drawBorder(Tile.BORDER_COLOR, Tile.BORDER_WIDTH);
		}		
		else if( blob.blobType === 'GOLD' ) {
			imageName = blob.blobType;
			tile = new Tile(this, blob, coordinates, spriteNumber);
			tileMatrix[col][row] = tile;
		}

		console.debug( 'adding new tile ' + imageName + ' at ' + MatrixUtil.coordinatesToString(coordinates));
		layer.clearRect( x, y, width, height );
		if( blob && blob.image ) {
			layer.drawImage(blob.image, x, y, width, height);
		}
	}
	return this; //chainable
}; //Board.prototype.addTile()

Board.prototype.removeTile = function(tile) {
	var layer, tileMatrix, col, row;

	tileMatrix = this.getTileMatrix(tile.blob.blobType);
	layer = this.getLayer(tile.blob.blobType);
	console.debug("removing tile " + MatrixUtil.coordinatesToString(tile.coordinates));
	col = tile.coordinates[0];
	row = tile.coordinates[1];
	//tile.canvasImage.destroy();
	var tile = tileMatrix[col][row];
	tile.spriteNumber = Tile.PLAIN_TILE_SPRITE_NUMBER;
	return this; //chainable
}; //Board.prototype.removeTile()

Board.prototype.addTileToLayer = function(tile, layer) {
	//layer.add(tile.canvasImage);
	tile.layer = layer;
	tile.board = this;
	return this; //chainable
}; //Board.prototype.addTileToLayer()

Board.prototype.handleTriplets = function(tile) {
	var board, dangerBar, tileTriplets, totalMatchedGoldTiles, pointsArray, changingPointsArray, changedTiles;
	board = this;
	dangerBar = board.level.dangerBar;
	board.handleTripletsDebugCounter++;
	pointsArray = [];
	changingPointsArray = [];
	var tileMovedEventProcessorResult = (new TilesEventProcessor(board)).tileMoved(tile);
	tileTriplets = tileMovedEventProcessorResult.matchingTilesSets;
	if( tileTriplets && tileTriplets.length > 0 ) {
		pointsArray = tileMovedEventProcessorResult.affectedPointsArray;
		totalMatchedGoldTiles = tileMovedEventProcessorResult.totalMatchedGoldTiles;
		if(totalMatchedGoldTiles && totalMatchedGoldTiles.length > 0 ) {
			board.animateGoldRemovalAsync(totalMatchedGoldTiles);
		}
		board.chainReactionCounter++;
		//YM: pointsArray can contain duplicates due to overlapping triplets
		//remove the duplicates
		console.debug( 'pointsArray with possible duplicates ' + MatrixUtil.pointsArrayToString(pointsArray) );
		pointsArray = ArrayUtil.unique(pointsArray);
		console.debug( 'pointsArray with any duplicates removed ' + MatrixUtil.pointsArrayToString(pointsArray) );
		changingPointsArray = MatrixUtil.getChangingPoints(pointsArray);
		board.removeTriplets(tileTriplets);
		board.animateTripletsRemovalAsync(tileTriplets);
		if( board.countGold() === 0 ) {
			if( dangerBar.isRunning() ) {
				dangerBar.stop();
			}
			board.completeAnimationAsync();
			return tileTriplets;
		}
		changedTiles = board.getCreatureTilesFromPoints(changingPointsArray);
		_.each( changedTiles, function( tile ) {
			board.handleTriplets(tile);
		});
	}
	return this; //chainable
}; //Board.prototype.handleTriplets()

Board.prototype.handleSelect = function(tile) {
	var board, tilePrev, tileCoordinates, dangerBar;
	board = this;
	tilePrev = this.tileSelected;
	tileCoordinates = tile.coordinates;
	dangerBar = board.level.dangerBar;
	//YJ: one tile selected; select it and move on
	if( tilePrev === null ) {
		board.tileSelected = tile;
		tile.setSelectedAsync().then( function() {
			return;
		}).done();
	}
	//YJ: two different tiles selected; swap them and look for triplets
	else if( tile !== tilePrev && this.adjacent(tile, tilePrev) ) {
		if( Galapago.gameMode === 'MODE_TIMED' && !dangerBar.isRunning() ) {
			dangerBar.start(); //YJ: RQ 4.4.2
		}
		tile.setSelectedAsync().then(function() {
			board.swapCreatures( tile, tilePrev );
			board.animateSwapCreaturesAsync( tile, tilePrev ).then(function() {
				board.handleTripletsDebugCounter = 0;
				board.chainReactionCounter = 0;
				board.scoreEvents = [];
				console.log( 'tilePrev triplets' );
				board.handleTriplets(tilePrev);
				console.log( 'tile triplets' );
				board.handleTriplets(tile);
				console.log( 'handleTripletsDebugCounter: ' + board.handleTripletsDebugCounter );
				if( board.scoreEvents.length > 0 ) {
					board.updateScore();
					//reset grid lines and active tile
					board.redrawBorders( Tile.BORDER_COLOR, Tile.BORDER_WIDTH );
					board.tileActive = board.getCreatureTilesFromPoints( [tileCoordinates] )[0];
					board.tileActive.setActiveAsync().done();
				}
				else {
					// YJ: if no triplet is formed by this move, flip the creatures back to their previous positions
					console.debug( 'no triplet found: undoing last move');
					board.swapCreatures( tile, tilePrev );
					board.animateSwapCreaturesAsync( tile, tilePrev ).done();
				}
			}, function(error) {
				console.error(error);
			}).done();
		}, function(error) {
			console.error(error);
		}).done();
		board.tileSelected = null;
		return;
	}
	// same tile selected; unselect it and move on
	else {
		tilePrev.setUnselected();
		this.tileSelected = null;
		return;
	}
}; //Board.prototype.handleSelect

Board.prototype.handleKeyboardSelect = function() {
	this.handleSelect(this.tileActive);
	return this; //chainable
}; //Board.prototype.handleKeyboardSelect

Board.prototype.handleRightArrow = function() {
	var board, tileRight;
	board = this;
	tileRight = board.getNeighbor(board.tileActive, [1, 0]);
	if( tileRight ) {
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileRight);
		return this; //chainable;
		}).done();
	}
	return this; //chainable
}; //Board.prototype.handleRightArrow

Board.prototype.handleLeftArrow = function() {
	var board, tileLeft;
	board = this;
	tileLeft = board.getNeighbor(board.tileActive, [-1, 0]);
	if( tileLeft ) {
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileLeft);
		return this; //chainable
		}).done();
	}
	return this; //chainable
}; //Board.prototype.handleLeftArrow

Board.prototype.handleDownArrow = function() {
	var board, tileDown;
	board = this;
	tileDown = board.getNeighbor(board.tileActive, [0, 1]);
	if( tileDown ) {
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileDown);
		return this; //chainable
		}).done();
	}
	return this; //chainable
}; //Board.prototype.handleDownArrow

Board.prototype.handleUpArrow = function() {
	var board, tileUp;
	board = this;
	tileUp = board.getNeighbor(board.tileActive, [0, -1]);
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
/*
* search tileFocal and at most the six possible triplets formed with the
* 8 surrounding tiles (2 in each direction up, down, left, right for three)
* for three creatures all the same
*/
Board.prototype.findTriplets = function(tileFocal) {
	var triplets, tileUp2, tileUp1, tileLeft2, tileLeft1, tileDown2, tileDown1, tileRight2, tileRight1, coordinates;
	triplets = [];
	coordinates = tileFocal ? tileFocal.coordinates : null;
	console.debug( 'called Board.findTriplets with focal tile ' + coordinates );
	if( !tileFocal ) { //YM: tileFocal could have been nulled by a previous triplet formed from the same move
		return triplets;
	}
	tileUp2 = this.getNeighbor(tileFocal, [0, -2]);
	tileUp1 = this.getNeighbor(tileFocal, [0, -1]);
	tileLeft2 = this.getNeighbor(tileFocal, [-2, 0]);
	tileLeft1 = this.getNeighbor(tileFocal, [-1, 0]);
	tileDown1 = this.getNeighbor(tileFocal, [0, 1]);
	tileDown2 = this.getNeighbor(tileFocal, [0, 2]);
	tileRight1 = this.getNeighbor(tileFocal, [1, 0]);
	tileRight2 = this.getNeighbor(tileFocal, [2, 0]);

	if( tileUp2 && tileUp1 && tileUp2.matches(tileFocal) && tileUp1.matches(tileFocal) ) {
		this.addTriplet(triplets, [tileUp2, tileUp1, tileFocal]);
	}
	if( tileLeft2 && tileLeft1 && tileLeft2.matches(tileFocal) && tileLeft1.matches(tileFocal) ) {
		this.addTriplet(triplets, [tileLeft2, tileLeft1, tileFocal]);
	}
	if( tileDown1 && tileDown2 && tileFocal.matches(tileDown1) && tileFocal.matches(tileDown2) ) {
		this.addTriplet(triplets, [tileFocal, tileDown1, tileDown2]);
	}
	if( tileRight1 && tileRight2 && tileFocal.matches(tileRight1) && tileFocal.matches(tileRight2) ) {
		this.addTriplet(triplets, [tileFocal, tileRight1, tileRight2]);
	}
	if( tileUp1 && tileDown1 && tileUp1.matches(tileFocal) && tileFocal.matches(tileDown1) ) {
		this.addTriplet(triplets, [tileUp1, tileFocal, tileDown1]);
	}
	if( tileLeft1 && tileRight1 && tileLeft1.matches(tileFocal) && tileFocal.matches(tileRight1) ) {
		this.addTriplet(triplets, [tileLeft1, tileFocal, tileRight1]);
	}
	return triplets;
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

// run an animation removing a matching tile triplet and shifting down the creature tiles above the triplet
Board.prototype.animateTripletsRemovalAsync = function(tileTriplets) {
	var /*deferred, tileTriplet,*/ board;
	board = this;
	//deferred = Q.defer();
	//TODO handle multiple tile triplets, not just first one
	//tileTriplet = tileTriplets[0];
	_.each( tileTriplets, function(tileTriplet) {
		console.debug( 'animating triplet removal for ' + Tile.tileArrayToPointsString(tileTriplet) );
		$('#sound-match-01')[0].play();
		_.each( tileTriplet, function(tile) {
			tile.clear();
		});
		board.lowerTilesAbove(tileTriplet);
	});
	//this.creatureLayer.draw();
	//deferred.resolve();
	//return deferred.promise;
	return;
}; //Board.prototype.animateTripletsRemovalAsync()


Board.prototype.getCreatureTilesFromPoints = function(points) {
	var creatureTiles, pointsIt, point;
	creatureTiles = [];
	for( pointsIt = 0; pointsIt < points.length; pointsIt++ ) {
		point = points[pointsIt];
		creatureTiles.push(this.creatureTileMatrix[point[0]][point[1]]);
	}
	return creatureTiles;
}; //Board.prototype.getCreatureTilesFromPoints()

Board.prototype.lowerTiles = function(tiles, numRows) {
	var loweredPoint, board;
	board = this;
	_.each( tiles, function(tile) {
		if( tile && !tile.isBlocked() && !tile.isCocooned()) { //YM: tile could have already been nulled by a previous triplet formed by the same creature move
			var keepLooping = false;
			do {
				loweredPoint = MatrixUtil.lowerPointByNRows(tile.coordinates, numRows);
				var tileToBeReplaced = board.creatureTileMatrix[loweredPoint[0]][loweredPoint[1]];
				if(tileToBeReplaced && (tileToBeReplaced.isBlocked() || tileToBeReplaced.isCocooned())){
					keepLooping = true;
					numRows--;
				}
				else{
					keepLooping = false;
				}
			} 
			while (keepLooping)
			loweredPoint = board.getLowestPoint(loweredPoint);
			board.addTile(loweredPoint, tile.blob.blobType, null, null, tile);
		}
		else{
			numRows++;
		}
	});
	return this; //chainable
}; //Board.prototype.lowerTiles()


Board.prototype.getLowestPoint = function(loweredPoint) {
	var col = loweredPoint[0];
	var row = loweredPoint[1] + 1;
	var tileToBeReplaced = null;
	if(row < this.creatureTileMatrix[0].length){ 
		tileToBeReplaced = this.creatureTileMatrix[col][row];
	}
	if(tileToBeReplaced == null){
		return loweredPoint;
	}
	else if (tileToBeReplaced.isPlain()){
		return this.getLowestPoint(tileToBeReplaced.coordinates);
	}
	else{
		//If current point is plain check down and left
		if((this.creatureTileMatrix[loweredPoint[0]][loweredPoint[1]]).isPlain()){
			tileToBeReplaced = null;
			col = col -1;
			if(col > -1){
				tileToBeReplaced = this.creatureTileMatrix[col][row];
			}
			if(tileToBeReplaced && tileToBeReplaced.isPlain()){
				return this.getLowestPoint(tileToBeReplaced.coordinates);
			}
			else{
				tileToBeReplaced = null;
				col = col + 2;
				if(col < this.creatureTileMatrix.length){
					tileToBeReplaced = this.creatureTileMatrix[col][row];
				}
				if(tileToBeReplaced && tileToBeReplaced.isPlain()){
					return this.getLowestPoint(tileToBeReplaced.coordinates);
				}
				else{
					return loweredPoint;
				}
			}
		}
		else{
			return loweredPoint;
		}
	} 
}

Board.prototype.lowerTilesAbove = function(tileTriplet) {
	var pointsAbove, tilesAbove, emptyPoints, triplet, board, spriteNumber;	
	console.debug( 'lowering tiles above ' + Tile.tileArrayToPointsString(tileTriplet) );
	board = this;
	triplet = Tile.tileArrayToPointsArray(tileTriplet);
	pointsAbove = MatrixUtil.getNeighborsAbovePoints(triplet);
	tilesAbove = this.getCreatureTilesFromPoints(pointsAbove);

	if( MatrixUtil.isVerticalPointSet(triplet) ) {
		this.lowerTiles(tilesAbove, triplet.length);
		emptyPoints = MatrixUtil.getFirstNRowPoints(triplet);
	}
	else {
		this.lowerTiles(tilesAbove, 1); 
		emptyPoints = MatrixUtil.getNFirstRowPoints(triplet);
	}

	//add a new random creature tile at each of the empty points
	_.each( emptyPoints, function(point) {
		var lowestPoint = board.getLowestPoint(point);
		while(lowestPoint != point)
		{
			spriteNumber = Tile.UNBLOCKED_TILE_SPRITE_NUMBER;
			board.addTile(lowestPoint, 'CREATURE', null, spriteNumber);
			lowestPoint = board.getLowestPoint(point);		
		}
		spriteNumber = Tile.UNBLOCKED_TILE_SPRITE_NUMBER;
		board.addTile(point, 'CREATURE', null, spriteNumber);
	});
	return this; //chainable
}; //Board.prototype.lowerTilesAbove()

// run an animation removing a matching tile triplet and shifting down the creature tiles above the triplet
Board.prototype.removeTriplets = function(tileTriplets) {
	var board;
	board = this;
	_.each( tileTriplets, function(tileTriplet) {
		console.debug( 'removing triplet ' + Tile.tileArrayToPointsString(tileTriplet) );
		_.each( tileTriplet, function(tile) {
			board.removeTile(tile);
		});
	});
	return this; //chainable
}; //Board.prototype.removeTriplets

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
	_.each(goldTiles, function(tile) {
		board.removeTile(tile);
		board.goldLayer.clearRect( tile.getXCoord(), tile.getYCoord(), Tile.getWidth(), Tile.getHeight() );
	});
	//deferred.resolve();
	//return deferred.promise;
	return;
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
		this.handleSelect(tile);
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
Tile.WIDTH = 62;
Tile.HEIGHT = 62;
Tile.DELAY_AFTER_FLIP_MS = 250;
Tile.DELAY_AFTER_ACTIVATE_MS = 50;
Tile.PLAIN_TILE_SPRITE_NUMBER = '0';
Tile.UNBLOCKED_TILE_SPRITE_NUMBER = '1';
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
	tileType = this.blob.creatureType || '';
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

Tile.prototype.setActiveAsync = function() {
	var deferred;
	console.debug('active tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	this.drawBorder(Tile.BORDER_COLOR_ACTIVE, Tile.BORDER_WIDTH);
	Q.delay(Tile.DELAY_AFTER_ACTIVATE_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}; //Tile.prototype.setActiveAsync()

Tile.prototype.setInactiveAsync = function() {
	var deferred;
	console.debug('inactive tile ' + this.coordinates + ': ' + this.blob.creatureType);
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
}

Tile.prototype.isCocooned = function()  {
	return this.spriteNumber == Tile.COCOONED_TILE_SPRITE_NUMBER;
}

Tile.prototype.isPlain = function()  {
	return this.spriteNumber == Tile.PLAIN_TILE_SPRITE_NUMBER;
}

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
	if( points[0][0] === points[1][0] && points[1][0] === points[2][0] ) {
		return true;
	}
	else {
		return false;
	}
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
MatrixUtil.getFirstNRowPoints = function(verticalPoints) {
	var firstPoints, rowIt, col;
	firstPoints = [];
	rowIt = 0;
	col = verticalPoints[0][0];
	for(rowIt; rowIt < verticalPoints.length; rowIt++) {
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
DangerBar.RATIO_DANGER = 0.85;
DangerBar.WARNING_10_SEC = 10;
DangerBar.WARNING_5_SEC = 5;
DangerBar.WARNING_SOUND_ID = 'sound-warning';
DangerBar.WARNING_SOUND_LENGTH_SEC = 0.7;
DangerBar.BOTTOM_CAP_TOP = 383;
DangerBar.PROGRESS_BAR_TOP = 150;
DangerBar.CAP_TOP_TOP = 173;
DangerBar.FILL_TOP_ADJUSTMENT = 48;
DangerBar.CAP_BOTTOM_TOP = 605;
DangerBar.LEFT = 1105;
DangerBar.PROGRESS_BAR_LEFT_ADJUSTMENT = 12;
DangerBar.FILL_WIDTH = 15;

//the references to style.top and style.left in this class' images are only meant for variable storage
//and layout in a canvas, not via CSS, thus they leave off 'px' from the positions
function DangerBar(layerBackground, imageArray, initialTimeMs) {
	this.layerBackground = layerBackground;
	this.layer = $('#' + DangerBar.LAYER_DANGER_BAR)[0].getContext('2d');
	this.initialTimeMs = initialTimeMs;
	this.timeRemainingMs = initialTimeMs;
	this.intervalId = -1;
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
	return this.intervalId >= 0;
}; //DangerBar.prototype.isRunning()

DangerBar.prototype.start = function() {
	var dangerBar;
	dangerBar = this;
	//dangerBar.layer.clearRect( DangerBar.LEFT, DangerBar.CAP_TOP_TOP, DangerBar.FILL_WIDTH, dangerBar.fillTop );
	dangerBar.intervalId = setInterval(dangerBar.update, DangerBar.REFRESH_INTERVAL_SEC * 1000);
	console.debug('starting danger bar timing with ' + dangerBar.timeRemainingMs/1000 + ' sec remaining');
	return dangerBar; //chainable
}; //DangerBar.prototype.start()

DangerBar.prototype.stop = function() {
	console.debug('stopping danger bar timing with ' + this.timeRemainingMs/1000 + ' sec remaining');
	clearInterval(this.intervalId);
	return this; //chainable
}; //DangerBar.prototype.stop()

DangerBar.prototype.update = function() {
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
	else if( ratio <= DangerBar.RATIO_DANGER && this.numTimesBelowDangerRatio === 0 ||
		dangerBar.timeRemainingMs/1000 <= 10 && dangerBar.timeRemainingMs/1000 > 5 ||
		dangerBar.timeRemainingMs/1000 <= 5 && dangerBar.timeRemainingMs/1000 > 0) {
		this.numTimesBelowDangerRatio++;
		dangerBar.layer.drawImage( fillDanger, DangerBar.LEFT, dangerBar.fillTop, DangerBar.FILL_WIDTH, fillDanger.height );
		//dangerBar.layer.drawImage( bottomCapDanger, DangerBar.LEFT, DangerBar.CAP_BOTTOM_TOP, bottomCapDanger.width, bottomCapDanger.height );
		DangerBar.playWarningSoundRepeated();
	}
	else { //timeout
		//clear the space between the top cap and the bottom cap, including the bottom cap
		dangerBar.layer.clearRect( DangerBar.LEFT, dangerBar.fillTopInitial, DangerBar.FILL_WIDTH, dangerBar.fillHeightInitial );
		dangerBar.stop();
	}
	return dangerBar; //chainable
}; //DangerBar.prototype.update()

//req 4.9.11 time warning
DangerBar.playWarningSoundRepeated = function() {
	SoundUtil.playSoundAsync(DangerBar.WARNING_SOUND_ID, DangerBar.WARNING_SOUND_LENGTH_SEC).then(function() {
	SoundUtil.playSoundAsync(DangerBar.WARNING_SOUND_ID, DangerBar.WARNING_SOUND_LENGTH_SEC).then(function() {
	SoundUtil.playSoundAsync(DangerBar.WARNING_SOUND_ID, DangerBar.WARNING_SOUND_LENGTH_SEC);
	});}).done();
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
Powerup.LEFT = 124;
Powerup.TOP = 228;
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

function SpriteSheet(image) {
		this.image = image;
		//create a temporary canvas and position it offscreen;
		var tempCanvas = document.createElement('canvas');
		document.body.appendChild(tempCanvas);
		this.canvas = tempCanvas;
		this.canvas.style.display = 'none';
		this.canvas.style.position = 'absolute';
		this.canvas.style.left = -1000;
		this.canvas.style.top = -1000;
		this.ctx = this.canvas.getContext('2d');
}

//returns a JavaScript image object representing the specified slice of the sprite sheet
SpriteSheet.prototype.getSprite = function(x, y, width, height) {
		var sprite, spriteURL;
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx.drawImage(this.image, x, y, width, height, 0, 0, width, width);
		spriteURL = this.canvas.toDataURL();
		sprite = new Image();
		sprite.src = spriteURL;
		return sprite;
}; //SpriteSheet.prototype.getSprite

function SoundUtil() {}

SoundUtil.playSoundAsync = function(soundElementId, soundLengthSec) {
	var deferred, selector;
	deferred = Q.defer();
	selector = '#' + soundElementId;
	$(selector)[0].addEventListener('ended', function() {SoundUtil[soundElementId] = 'ended';});
	$(selector)[0].play();
	setTimeout(function() {
		if(SoundUtil[soundElementId] === 'ended') {
			deferred.resolve();
		}
		else {
			deferred.reject();
		}
	}, soundLengthSec * 1000);
	return deferred.promise;
}; //SoundUtil.playSoundAsync