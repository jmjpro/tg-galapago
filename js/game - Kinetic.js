"use strict";

/* begin class Galapago */
Galapago.ACTIVE_TILE_LOGIC_LEVELS = [1, 2, 14, 15, 16, 17, 18, 19];

function Galapago() {
	this.levels = [];
	this.level = null;
	this.gameMode = null;
}

Galapago.init = function(levelName, gameMode) {
	//TODO this fails silently so add error handling
	/*
	$.getJSON('./js/levels.json', function(data) {
		levels = levelsFromJson(data);
	});
	*/
	Galapago.levels = Galapago.levelsFromJson(Level.LEVELS_JSON);
	Galapago.level = Level.findByName(levelName);
	Galapago.gameMode = gameMode;
	console.log( 'levelName: ' + levelName );
	console.log( 'theme: ' + Galapago.level.bgTheme );
	console.log( 'gameMode: ' + Galapago.gameMode );
	Galapago.level.display();
	Level.registerEventHandlers();
}; //Galapago.init()

Galapago.setLevel = function(level) {
	document.location.href = FileUtil.stripFileName(document.URL) + 'index.html?level=' + level;
};

Galapago.levelsFromJson = function (levelConfigs) {
	var levels, level;
	levels = [];

	_.each( levelConfigs, function(levelConfig) {
		level = new Level();
		level.levelConfig = levelConfig;
		level.resourcePath = levelConfig.resourcePath;
		level.bgTheme = levelConfig.bgTheme;
		level.creatureTypes = levelConfig.creatureTypes;
		level.treasureType = levelConfig.treasureType;
		levels.push(level);
	});

	return levels;
};

Galapago.printLevelConfigs = function (levelConfigs) {
	_.each( levelConfigs, function(levelConfig) {
		console.debug( levelConfig.toString() );
	});
};
/* end class Galapago */

/* begin class Score */
Score.TRIPLET = 100;
Score.MULTIPLIER_TREASURE = 3;
function Score() {}
/* end class Score */

/* begin class Level */
Level.BACKGROUND_PATH_PREFIX = 'res/img/background/background_';
Level.BACKGROUND_PATH_SUFFIX = '_720.jpg)';
Level.CANVAS_ID = 'canvas-main';
Level.CREATURE_PATH = 'res/img/creatures/';
Level.TREASURE_PATH = 'res/img/game_screen/';
Level.BLOB_IMAGE_EXTENSION = 'png';
Level.CREATURE_IMAGE_IDS = ['01', '02', '03'];
Level.CREATURE_IMAGE_ID = '01';
Level.LOCKING_IMAGE_ID = '02';
Level.COCOON_IMAGE_ID = '03';
Level.LEVELS_JSON = [{"resourcePath":"level_01","bgTheme":"beach","treasureType":"gold","creatureTypes":["Cyclops_Crab","Electric_Cha_Toad","Mandarin_Seastar","Palace_Fish","Pink_Alibi_Frog","Turtle_of_Toi","Two_Bells_Crab"],"creaturePositions":[[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1]],"treasurePositions":[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,1,0,0,0,0],[0,0,0,0,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]},{"resourcePath":"level_02","bgTheme":"forest","treasureType":"gold","creatureTypes":["Galapa_Frog","Grants_Treetopper","Green_Flutterby","Hodapp_Ladybird","Lost_Lightning_Bug","Rosy_Crawler","Violet_Visionary"],"creaturePositions":[[1,1,1],[1,1,1],[1,1,1]],"treasurePositions":[[0,0,0],[0,1,0],[0,0,0]]}];

function Level() {
	this.bgTheme = '';
	this.creatureImages = [];
	this.creatureTypes = [];
	//TODO: do we need to store levelConfig?
	this.levelConfig = ''; // original JSON text
	this.otherImages = [];
	this.resourcePath = '';
	this.treasureImages = [];
	this.treasureType = '';
	this.dangerBar = null;
}

Level.prototype.toString = function() {
	var output;
	output = 'resourcePath: ' + this.resourcePath + ', ' +
			'bgTheme: ' + this.bgTheme + ', ' +
			'creatureTypes: ' + this.creatureTypes + ', ' +
			'board: ' + this.board.toString();
	return output;
};

Level.prototype.setBoard = function(board) {
	this.board = board;
	board.level = this;
};

Level.prototype.buildCreatureImagePaths = function() {
	var creatureTypeIt, creatureImagePathIt, creatureImagePath, creatureImagePaths, spriteIt, creatureType, spriteNumber;
	creatureImagePaths = [];
	creatureImagePathIt = 0;
	for( creatureTypeIt = 0; creatureTypeIt < this.creatureTypes.length; creatureTypeIt++ ) {
		for( spriteIt = 0; spriteIt < Level.CREATURE_IMAGE_IDS.length; spriteIt++ ) {
			creatureType = this.creatureTypes[creatureTypeIt];
			spriteNumber = Level.CREATURE_IMAGE_IDS[spriteIt];
			creatureImagePath = Level.CREATURE_PATH + this.resourcePath + '/' + creatureType + '_' + spriteNumber + '.' + Level.BLOB_IMAGE_EXTENSION;
			creatureImagePaths[creatureImagePathIt] = creatureImagePath;
			creatureImagePathIt++;
		}
	}
	//console.debug('creatureImagePaths: ' + creatureImagePaths);
	return creatureImagePaths;
};

Level.prototype.buildTreasureImagePaths = function() {
	var treasureImagePaths;
	treasureImagePaths = [];
	treasureImagePaths[0] = Level.TREASURE_PATH + 'gold_cell' + '.' + Level.BLOB_IMAGE_EXTENSION;
	return treasureImagePaths;
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
	var level, creatureImagePaths, treasureImagePaths;
	level = this;
	creatureImagePaths = level.buildCreatureImagePaths();
	treasureImagePaths = level.buildTreasureImagePaths();

	return Q.all([
	this.imgpreloadAsync(creatureImagePaths).then( function(imageObjectArray) {
		level.creatureImages = imageObjectArray;
	}, function failure(message) {
		throw new Error(message);
	})/*.done()*/,
	this.imgpreloadAsync(treasureImagePaths).then( function(imageObjectArray) {
		level.treasureImages = imageObjectArray;
	}, function failure(message) {
		throw new Error(message);
	})/*.done()*/]);
}; //Level.prototype.loadImagesAsync()

Level.prototype.display = function() {
	var level = this;
	level.styleCanvas();
	level.setBoard(new Board());
	level.loadImagesAsync().then( function() {
	level.board.build( level.levelConfig.treasurePositions, 'TREASURE', 'GOLD' );
	level.board.build( level.levelConfig.creaturePositions, 'CREATURE', null );
	level.board.stage.add(level.board.gridLayer);
	level.board.gridLayer.setZIndex(1);
	if( !MatrixUtil.isSameDimensions(level.board.creatureTileMatrix, level.board.treasureTileMatrix) ) {
		throw new Error('creatureTileMatrix dimensions must match treasureTileMatrix dimensions');
	}
	level.board.setActiveTile();
	console.debug(level.toString());
	}).done();
	level.dangerBar = new DangerBar(level.levelConfig.dangerBarTime);
	return level; //chainable
}; //Level.prototype.display()

Level.findByName = function(levelName) {
	var level;
	level = _.filter( Galapago.levels, function(level) {
		return level.resourcePath === levelName;
	});

	return (level.length === 1) ? level[0] : null;
};

Level.registerEventHandlers = function() {
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
				Galapago.setLevel('level_01');
				//main('level_01');
				break;
			case 50: // numeric 2
				Galapago.setLevel('level_02');
				//main('level_02');
				break;
			default:
		}
	};
}; //Level.registerEventHandlers()

Level.prototype.styleCanvas = function() {
	var canvas;

	canvas = document.getElementById(Level.CANVAS_ID);
	canvas.style.background = 'url(' + Level.BACKGROUND_PATH_PREFIX + this.bgTheme + Level.BACKGROUND_PATH_SUFFIX;
	canvas.style.background += ' no-repeat scroll top left';
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

Level.prototype.getCreatureImage = function(resourcePath, creatureType, spriteNumber) {
	var creatureImagePath;
	creatureImagePath = Level.CREATURE_PATH + resourcePath + '/' + creatureType + '_' + spriteNumber + '.' + Level.BLOB_IMAGE_EXTENSION;
	return this.getImageByPath(this.creatureImages, creatureImagePath);
};

Level.prototype.getTreasureImage = function(treasureType) {
	var treasureImagePath;
	treasureImagePath = Level.TREASURE_PATH + treasureType.toLowerCase() + '_cell' + '.' + Level.BLOB_IMAGE_EXTENSION;
	return this.getImageByPath(this.treasureImages, treasureImagePath);
};
/* end class Level */

/*
begin class Board
Board has layer with matrix of Tiles with Creatures
Board has layer with matrix of Tiles with Treasures
*/
Board.STAGE_WIDTH_OFFSET = 325;
Board.STAGE_HEIGHT_OFFSET = 100;
Board.CREATURE_FLYOVER_STEP = 20;
Board.WIDTH_TO_HEIGHT_RATIO = 1.25;
Board.IMAGE_MAGNIFICATION = 2;
Board.ANGULAR_SPEED = Math.PI * 2;

function Board() {
	var STAGE_WIDTH, STAGE_HEIGHT;

	STAGE_WIDTH = 1280;
	STAGE_HEIGHT = 720;

	this.stage = new Kinetic.Stage({
		container: Level.CANVAS_ID,
		width: STAGE_WIDTH,
		height: STAGE_HEIGHT
	});

	this.gridLayer = new Kinetic.Layer();

	this.scoreLayer = new Kinetic.Layer();
	this.score = 0;
	this.canvasScore = new Kinetic.Text({
		x: 500,
		y: 34,
		text: this.score,
		fontSize: 30,
		fontFamily: 'Calibri',
		fill: 'cyan'
	});
	this.scoreLayer.add(this.canvasScore);
	this.stage.add(this.scoreLayer);
	this.scoreLayer.setZIndex(2);

	this.creatureLayer = new Kinetic.Layer();	
	this.creatureTileMatrix = [];
	this.treasureLayer = new Kinetic.Layer();
	this.treasureTileMatrix = [];

	this.rotateAnim = null;
	this.moveAnim = null;

	// hold the tile last clicked
	this.tileSelected = null;
	this.tileActive = null;
	/*
	this.stage.on('click', function(evt) {
		console.debug( 'clicked ' + evt.x + ':' + evt.y );
	});
	*/
} //Board constructor

/* req 4.4.2
As default, the cursor is shown on the top leftmost creature on board. However, on new game once in a session, in levels
1,2 and 14 – 19, when Bubble Tips are displayed at the start of the level, the cursor appears on the creature that is
animated according to the displayed tip.
*/
Board.prototype.setActiveTile = function(tile) {
	var tileActive, col, row;
	if(tile) {
		tileActive = tile;
	}
	else if( _.contains(Galapago.ACTIVE_TILE_LOGIC_LEVELS, this.level.levelNum) && level.bubbleTips ) {
		col = this.level.initialActiveTileCoordinates[0];
		row = this.level.initialActiveTileCoordinates[0];
		tileActive = this.creatureTileMatrix[col][row];
		this.tileSelected = tileActive;
	}	
	else { //YJ: activate top left character unless otherwise indicated
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
		case 'TREASURE':
			tileMatrix = this.treasureTileMatrix;
			break;
		case 'CREATURE':
			tileMatrix = this.creatureTileMatrix;
			break;
		default:
			tileMatrix = this.creatureTileMatrix;
	}
	return tileMatrix;
}; //Board.prototype.getTileMatrix()

Board.prototype.countTreasure = function() {
	var rowIt, colIt, treasureCount;
	treasureCount = 0;
	for( rowIt = 0; rowIt < this.treasureTileMatrix.length; rowIt++ ) {
		for( colIt = 0; colIt < this.treasureTileMatrix[rowIt].length; colIt++ ) {
			if( this.treasureTileMatrix[colIt][rowIt] ) { // not null
				treasureCount++;
			}
		}
	}
	return treasureCount;
};

Board.prototype.getLayer = function(blobType) {
	var layer;
	switch( blobType ) {
		case 'TREASURE':
			layer = this.treasureLayer;
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
	var board, canvasImage, colIt, rowIt;
	// one revolution per second
	board = this;

	console.debug("running level complete animation");
	this.rotateAnim = new Kinetic.Animation(function(frame) {
		var angleDiff = frame.timeDiff * Board.ANGULAR_SPEED / 1000;
		var matrix = board.creatureTileMatrix;
		for( rowIt = 0; rowIt < matrix.length; rowIt++ ) {
			for( colIt = 0; colIt < matrix[rowIt].length; colIt++ ) {
				// only move even numbered rows and cols in order to see the animation better
				if( rowIt % 2 === 0 && colIt % 2 === 0 ) {
					if( matrix[colIt][rowIt] ) {
						canvasImage = matrix[colIt][rowIt].canvasImage;
						canvasImage.rotate(angleDiff);
					}
				}
			}
		}

	}, this.creatureLayer);

	this.rotateAnim.start();

	this.moveAnim = new Kinetic.Animation(function(frame) {
		var matrix = board.creatureTileMatrix;
		for( rowIt = 0; rowIt < matrix.length; rowIt++ ) {
			for( colIt = 0; colIt < matrix[rowIt].length; colIt++ ) {
				// only move even numbered rows and cols in order to see the animation better
				if( rowIt % 2 === 0 && colIt % 2 === 0 ) {
					if( matrix[colIt][rowIt] ) {
						canvasImage = matrix[colIt][rowIt].canvasImage;
						canvasImage.setY(canvasImage.getY() - Board.CREATURE_FLYOVER_STEP);
					}
				}
			}
		}
		// stop both rotate animation and move animation once last tile is offscreen
		if( canvasImage.getY() < Tile.HEIGHT * -2 ) {
			board.moveAnim.stop();
			board.rotateAnim.stop();
		}
	}, this.creatureLayer);

	this.moveAnim.start();
};

Board.prototype.toString = function() {
	var output;
	output = 'creatureTileMatrix: ' + this.creatureTileMatrix + ', ' +
			'treasureTileMatrix: ' + this.treasureTileMatrix;
	return output;
};

Board.prototype.build = function(tilePositions, blobType, treasureType) {
	var tileMatrix, layer, colIt, rowIt;
	var coordinates;

	tileMatrix = this.getTileMatrix(blobType);
	layer = this.getLayer(blobType);

	for( rowIt = 0; rowIt < tilePositions.length; rowIt++ ) {
		tileMatrix.push([]);
		for( colIt = 0; colIt < tilePositions[rowIt].length; colIt++ ) {
			tileMatrix[rowIt].push([]);
		}
	}

	for( rowIt = 0; rowIt < tilePositions.length; rowIt++ ) {
		for( colIt = 0; colIt < tilePositions[rowIt].length; colIt++ ) {
			if( tilePositions[rowIt][colIt] === 1 ) {
				coordinates = [colIt, rowIt];
				if( blobType === 'CREATURE' ) {
					this.addCreatureTile(coordinates);
				}
				else {
					this.addTreasureTile(coordinates, treasureType);
				}
			}
			else { //if( tilePositions[rowIt][colIt] === 1 ) {
				tileMatrix[rowIt][colIt] = null;
			}
		}
	}
	this.stage.add(layer);
	switch( layer ) {
		case this.treasureLayer:
			layer.setZIndex(3);
			break;
		case this.creatureLayer:
			layer.setZIndex(4);
			break;
		default:
	}
	return;
};

Board.prototype.addCreatureTile = function(coordinates) {
	var creature, imageName;
	creature = this.randomCreature(this.level.creatureTypes);
	imageName = creature.creatureType;
	this.addTile(coordinates, creature, imageName);
}; //Board.prototype.addCreatureTile()

Board.prototype.addTreasureTile = function(coordinates, treasureType) {
	var treasure, imageName;
	treasure = this.getTreasure(treasureType);
	imageName = treasureType;
	this.addTile(coordinates, treasure, imageName);
}; //Board.prototype.addTreasureTile()

//add a new tile or update the position of an existing tile
//synchronizes coordinate and position information with the tile object
Board.prototype.addTile = function(coordinates, blob, imageName, tile) {
	var layer, tileMatrix, col, row, x, y;

	tileMatrix = this.getTileMatrix(blob.blobType);
	layer = this.getLayer(blob.blobType);
	col = coordinates[0];
	row = coordinates[1];
	x = this.posToPixels(col, Tile.WIDTH, Board.WIDTH_TO_HEIGHT_RATIO, Board.STAGE_WIDTH_OFFSET);
	y = this.posToPixels(row, Tile.HEIGHT, 1, Board.STAGE_HEIGHT_OFFSET);
	if( tile ) {
		console.debug( 'moving existing tile ' + imageName + ' to ' + MatrixUtil.coordinatesToString(coordinates));
		tile.coordinates = coordinates;
		tile.canvasImage.setX(x);
		tile.canvasImage.setY(y);
	}
	else {
		tile = new Tile(blob, coordinates);
		console.debug( 'adding new tile ' + imageName + ' at ' + MatrixUtil.coordinatesToString(coordinates));
		this.addKineticBlobWithBorder(layer, blob, imageName, tile, x, y, Board.WIDTH_TO_HEIGHT_RATIO);
	}
	tileMatrix[col][row] = tile;
	return this; //chainable
}; //Board.prototype.addTile()

Board.prototype.removeTile = function(tile) {
	var layer, tileMatrix, col, row;

	tileMatrix = this.getTileMatrix(tile.blob.blobType);
	layer = this.getLayer(tile.blob.blobType);
	console.debug("removing tile " + MatrixUtil.coordinatesToString(tile.coordinates));
	col = tile.coordinates[0];
	row = tile.coordinates[1];
	tile.canvasImage.destroy();
	tileMatrix[col][row] = null;
	return this; //chainable
}; //Board.prototype.removeTile()


Board.prototype.posToPixels = function(pos, basePixels, widthToHeightRatio, offset ) {
	var unitPixels;
	unitPixels = basePixels * widthToHeightRatio * Board.IMAGE_MAGNIFICATION;
	return pos * unitPixels + offset;
}; //Board.prototype.posToPixels()

// Kinetic assumes that nodes added later to the layer have a higher z-index so the order matters
// TODO this affects event handling; blog about this!
Board.prototype.addKineticBlobWithBorder = function(layer, blob, imageName, tile, x, y, widthToHeightRatio) {
	var kineticBlob, border, col, row, width, height;
	col = tile.coordinates[0];
	row = tile.coordinates[1];
	width = Tile.WIDTH * Board.IMAGE_MAGNIFICATION * widthToHeightRatio;
	height = Tile.HEIGHT * Board.IMAGE_MAGNIFICATION;

	//a grid square containing a treasure will also contain a creature,
	//so only add the border once, for the creature
	if( 'CREATURE' === blob.blobType ) {
		border = new Kinetic.Rect({
			x: x - Tile.BORDER_WIDTH,
			y: y - Tile.BORDER_WIDTH,
			width: width + 2 * Tile.BORDER_WIDTH,
			height: height + 2 * Tile.BORDER_WIDTH,
			stroke: Tile.BORDER_COLOR,
			strokeWidth: Tile.BORDER_WIDTH,
			cornerRadius: Tile.BORDER_RADIUS
		});
		this.gridLayer.add(border);
	}

	kineticBlob = new Kinetic.Image({
		image: blob.image,
		name: imageName,
		x: x,
		y: y,
		width: width,
		height: height
	});
	tile.canvasImage = kineticBlob;
	tile.border = border;
	this.addTileToLayer(tile, layer);
	tile.addEventHandlers();
	return kineticBlob;
}; //Board.prototype.addKineticBlobWithBorder

Board.prototype.addTileToLayer = function(tile, layer) {
	layer.add(tile.canvasImage);
	tile.layer = layer;
	tile.board = this;
	return this; //chainable
};

Board.prototype.handleSelect = function(layer, tile) {
	var board, tilePrev, tileTriplets, treasureTiles;
	board = this;
	tilePrev = this.tileSelected;
	//YJ: one tile selected; select it and move on
	if( tilePrev === null ) {
		board.tileSelected = tile;
		tile.setSelectedAsync().then( function() {
			return;
		}).done();
	}
	//YJ: two different tiles selected; flip them and look for triplets
	else if( tile !== tilePrev && this.adjacent(tile, tilePrev) ) {
		if( Galapago.gameMode === 'MODE_TIMED' ) {
			level.dangerBar.start(); //YJ: RQ 4.4.2
		}
		tile.setSelectedAsync().then(function() {
			board.flipCreatures( tile, tilePrev );
			board.animateFlipCreaturesAsync( tile, tilePrev ).then(function() {
				tileTriplets = board.findTriplets(tilePrev);
				if( tileTriplets && tileTriplets.length >= 1 ) {
					board.removeTriplets(tileTriplets);
					board.animateTripletRemovalAsync(tileTriplets);
					treasureTiles = board.getTreasureTiles(tileTriplets);
					if( treasureTiles && treasureTiles.length > 0 ) {
						board.animateTreasureRemovalAsync(treasureTiles);
						if( board.countTreasure() === 0 ) {
							board.completeAnimationAsync();
						}
					}
					board.updateScore(tileTriplets, treasureTiles);
				}
				else {
					// YJ: if no triplet is formed by this move, flip the creatures back to their previous positions
					console.debug( 'no triplet found: undoing last move');
					board.flipCreatures( tile, tilePrev );
					board.animateFlipCreaturesAsync( tile, tilePrev ).done();
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
	this.handleSelect(this.creatureLayer, this.tileActive);
	return this; //chainable
}; //Board.prototype.handleKeyboardSelect

Board.prototype.handleRightArrow = function() {
	var board, tileRight;
	board = this;
	tileRight = board.getNeighbor(board.tileActive, [1, 0]);
	if( tileRight ) {
		board.tileActive.setInactiveAsync().then(function() {
		board.setActiveTile(tileRight);
		return this; //chainable
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
	var triplets, tileUp2, tileUp1, tileLeft2, tileLeft1, tileDown2, tileDown1, tileRight2, tileRight1;
	console.debug( 'called Board.findTriplets with focal tile ' + tileFocal.coordinates );
	triplets = [];

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
	var tileNeighbor, coordsNeighbor;
	coordsNeighbor = MatrixUtil.getNeighborCoordinates(tile.coordinates, coordsDistance);
	try {
		tileNeighbor = this.creatureTileMatrix[coordsNeighbor[0]][coordsNeighbor[1]];
	}
	catch(ex) {
		console.debug('tileNeighbor invalid: creatureTileMatrix[' + coordsNeighbor[0] + '][' + coordsNeighbor[1] + ']');
		tileNeighbor = null;
	}
	return tileNeighbor;
};

// run an animation removing a matching tile triplet and shifting down the creature tiles above the triplet
Board.prototype.animateTripletRemovalAsync = function(tileTriplets) {
	var /*deferred,*/ tileTriplet, board;
	board = this;
	//deferred = Q.defer();
	//TODO handle multiple tile triplets, just first one
	tileTriplet = tileTriplets[0];
	//_.each( tileTriplets, function(tileTriplet) {
		console.debug( 'animating triplet removal for ' + Tile.tileArrayToPointsString(tileTriplet) );
		tileTriplet[0].canvasImage.destroy();
		tileTriplet[1].canvasImage.destroy();
		tileTriplet[2].canvasImage.destroy();
		board.lowerTilesAbove(tileTriplet);
	//});
	this.creatureLayer.draw();
	//deferred.resolve();
	//return deferred.promise;
	return;
}; //Board.prototype.animateTripletRemovalAsync()


Board.prototype.getCreatureTilesfromPoints = function(points) {
	var creatureTiles, pointsIt, point;
	creatureTiles = [];
	for( pointsIt = 0; pointsIt < points.length; pointsIt++ ) {
		point = points[pointsIt];
		creatureTiles.push(this.creatureTileMatrix[point[0]][point[1]]);
	}
	return creatureTiles;
}; //Board.prototype.getCreatureTilesfromPoints()

Board.prototype.lowerTiles = function(tiles, numRows) {
	var loweredPoint, board;
	board = this;
	_.each( tiles, function(tile) {
		loweredPoint = MatrixUtil.lowerPointByNRows(tile.coordinates, numRows);
		board.addTile(loweredPoint, tile.blob, tile.canvasImage.getName(), tile);
	});
	return this; //chainable
}; //Board.prototype.lowerTiles()

Board.prototype.lowerTilesAbove = function(tileTriplet) {
	var pointsAbove, tilesAbove, emptyPoints, triplet, board;	
	console.debug( 'lowering tiles above ' + Tile.tileArrayToPointsString(tileTriplet) );
	board = this;
	triplet = Tile.tileArrayToPointsArray(tileTriplet);
	pointsAbove = MatrixUtil.getNeighborsAbovePoints(triplet);
	tilesAbove = this.getCreatureTilesfromPoints(pointsAbove);

	if( MatrixUtil.isVerticalPointSet(triplet) ) {
		this.lowerTiles(tilesAbove, 3);
		emptyPoints = MatrixUtil.getFirstNRowPoints(triplet);
	}
	else {
		this.lowerTiles(tilesAbove, 1);
		emptyPoints = MatrixUtil.getNFirstRowPoints(triplet);
	}

	//add a new random creature tile at each of the empty points
	_.each( emptyPoints, function(point) {
		board.addCreatureTile(point);
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

Board.prototype.flipCreatures = function(tileSrc, tileDest) {
	var tempCoordinates, deferred;
	tempCoordinates = tileSrc.coordinates.slice(0);
	this.addTile(tileDest.coordinates, tileSrc.blob, tileSrc.canvasImage.getName(), tileSrc);
	this.addTile(tempCoordinates, tileDest.blob, tileDest.canvasImage.getName(), tileDest);
	return this;
};

// switch the positions of two creature tiles on the board
// we pause after a flip to give the player time to view the animation
// since the flip can be reversed if no triplet is formed after the flip
Board.prototype.animateFlipCreaturesAsync = function(tileSrc, tileDest) {
	var deferred;
	deferred = Q.defer();
	tileSrc.setUnselected();
	tileDest.setUnselected();
	this.creatureLayer.draw();
	Q.delay(Tile.DELAY_AFTER_FLIP_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
};

//get the treasure tiles backing a triplet of creature tiles
Board.prototype.getTreasureTiles = function(triplets) {
	var treasureTiles, treasureTile, tripletsIt, triplet, tripletIt, creatureTile;
	treasureTiles = [];
	for( tripletsIt = 0; tripletsIt < triplets.length; tripletsIt++ ) {
		triplet = triplets[tripletsIt];
		for( tripletIt = 0; tripletIt < triplet.length; tripletIt++ ) {
			creatureTile = triplet[tripletIt];
			treasureTile = this.getTreasureTile(creatureTile);
			if( treasureTile ) {
				treasureTiles.push(treasureTile);
			}
		}
	}
	return treasureTiles;
};


//get the treasure tile backing an individual creature tiles
Board.prototype.getTreasureTile = function(creatureTile) {
	var creatureTileCol, creatureTileRow;
	creatureTileCol = creatureTile.coordinates[0];
	creatureTileRow = creatureTile.coordinates[1];
	return this.treasureTileMatrix[creatureTileCol][creatureTileRow];
};

Board.prototype.animateTreasureRemovalAsync = function(treasureTiles) {
	var deferred, board;
	//deferred = Q.defer();
	board = this;
	_.each(treasureTiles, function(treasureTile) {
		board.removeTile(treasureTile);		
	});
	this.treasureLayer.draw();
	//deferred.resolve();
	//return deferred.promise;
	return;
};

//generate a random number r between 0 and creatureTypes.length - 1
//instantiate a creature with the rth creature type from the list
Board.prototype.randomCreature = function(creatureTypes) {
	var randomIt, creatureType, creatureImage, creature;
	randomIt = Math.floor( Math.random() * creatureTypes.length );
	creatureType = creatureTypes[randomIt];
	creatureImage = this.level.getCreatureImage(this.level.resourcePath, creatureType, Level.CREATURE_IMAGE_ID);
	creature = new Creature(creatureType, creatureImage);
	return creature;
};

Board.prototype.getTreasure = function(treasureType) {
	var treasureImage, treasure;
	treasureImage = this.level.getTreasureImage(treasureType);
	treasure = new Treasure(treasureType, treasureImage);
	return treasure;
};

Board.prototype.updateScore = function(tileTriplets, treasureTiles) {
	var scoreToAdd;
	scoreToAdd = 0;
	_.each(tileTriplets, function(tileTriplet) {
		scoreToAdd += Score.TRIPLET;
		_.each(treasureTiles, function(treasureTile) {
			scoreToAdd *= Score.MULTIPLIER_TREASURE;
		});
	});
	this.score += scoreToAdd;
	this.canvasScore.setText(this.score);
	this.scoreLayer.draw();
}; //Board.prototype.updateScore
/* end class Board */

/*
begin class Tile
Tile has a blob (either a Creature or a Treasure)
Tile has a matrix coordinate
Tile can be Selected
Tile can be MousedOver
*/
Tile.CREATURE_FILTER_BRIGHTNESS = 100;
Tile.BORDER_COLOR = '#d3d3d3';
Tile.BORDER_COLOR_ACTIVE = 'red';
Tile.BORDER_WIDTH = 2;
Tile.BORDER_RADIUS = 3;
Tile.WIDTH = 29;
Tile.HEIGHT = 29;
Tile.DELAY_AFTER_FLIP_MS = 500;
Tile.DELAY_AFTER_ACTIVATE_MS = 100;

function Tile(blob, coordinates, canvasImage) {
	//var blob, coordinates;

	this.blob = blob;
	this.coordinates = coordinates;
	this.canvasImage = canvasImage;
	this.canvasImageBackup = null;
	this.board = null;
	this.layer = null;
	this.border = null;
}

Tile.prototype.toString = function() {
	var output, tileType;
	tileType = this.blob.creatureType || this.blob.treasureType || '';
	output = ' [' + this.coordinates[0] + ',' + this.coordinates[1] + ']:' + tileType;
	return output;
};

//return true if this tile has the same creature as that tile
Tile.prototype.matches = function(that) {
	var isMatch;
	isMatch = false;
	if( this.blob.creatureType === that.blob.creatureType ) {
		isMatch = true;
	}
	return isMatch;
};

Tile.prototype.setActiveAsync = function() {
	var deferred, col, row, border;
	console.debug('active tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	col = this.coordinates[0];
	row = this.coordinates[1];
	this.border.setStroke(Tile.BORDER_COLOR_ACTIVE);
	this.border.draw();
	Q.delay(Tile.DELAY_AFTER_ACTIVATE_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}; //Tile.prototype.setActiveAsync()

Tile.prototype.setInactiveAsync = function() {
	var deferred, col, row, border;
	console.debug('inactive tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();
	col = this.coordinates[0];
	row = this.coordinates[1];
	this.border.setStroke(Tile.BORDER_COLOR);
	this.border.draw();
	Q.delay(Tile.DELAY_AFTER_ACTIVATE_MS).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}; //Tile.prototype.setActiveAsync()

Tile.prototype.setSelectedAsync = function() {
	var deferred, selectedName, tile;
	console.debug('selected tile ' + this.coordinates + ': ' + this.blob.creatureType);
	deferred = Q.defer();

	this.canvasImageBackup = this.canvasImage.clone();
	selectedName = this.canvasImage.getName() + '_selected';
	this.canvasImage.setName(selectedName);
	tile = this;
	this.canvasImage.applyFilter(Kinetic.Filters.Brighten, {val: Tile.CREATURE_FILTER_BRIGHTNESS}, function() {
		tile.canvasImage.draw();
		deferred.resolve();
	});
	return deferred.promise;
}; //Tile.prototype.setSelectedAsync()

Tile.prototype.setUnselected = function() {
	//no need to setUnselected if already unselected
	if( this.canvasImageBackup === null ) {
		return this;
	}
	this.canvasImage.setImage(this.canvasImageBackup.getImage());
	this.canvasImage.setName(this.canvasImageBackup.getName());
	this.canvasImageBackup = null;
	this.canvasImage.draw();
	return this; // chainable
};

Tile.prototype.addEventHandlers = function() {
	var tile;
	tile = this;
	tile.canvasImage.on('mouseover', function(evt) {
		/*
		console.debug('mouseover ' + col + ':' + row + ' ' + this.index + ' ' + this.attrs.name);
		console.debug('begin glow animation');
		*/
		//layer.draw();
	});
	tile.canvasImage.on('mouseout', function(evt) {
		/*
		console.debug('mouseout ' + col + ':' + row + ' ' + this.index + ' ' + this.attrs.name);
		console.debug('end glow animation');
		*/
		//layer.draw();
	});
	tile.canvasImage.on('click', function(evt) {
		console.debug('clicked ' + MatrixUtil.coordinatesToString(tile.coordinates) +
			' ' + this.index + ' ' + this.getName());
		//TODO remove dependency on global variable level
		//either need to move these event handlers to a different class (such as Board)
		//or provide a mechanism to retrieve the board given the tile
		tile.board.handleSelect(tile.layer, tile);
	});
};

//static
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

//TODO consider having Creature and Treasure extend a base class Blob

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
begin class Treasure
Treasure has a TreasureType
Treasure has an Image
*/
function Treasure(treasureType, image) {
	//var blobType, treasureType, image;
	this.blobType = 'TREASURE';
	this.treasureType = treasureType;
	this.image = image;
}
/* end class Creature */

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
	
		/*
		console.time("array concat with builtin concat()");
		neighborPoints = neighborPoints.concat(neighborsAbovePoint);
		console.timeEnd("array concat with builtin concat()");

		neighborPointsCopy = neighborPoints.slice(0);
		console.time("array concat with lodash _.extend()");
		_.extend(neighborPointsCopy, neighborsAbovePoint);
		console.timeEnd("array concat with lodash _.extend()");

		console.assert(_.isEqual(neighborPoints, neighborPointsCopy), 'neighborPoints != neighborPointsCopy');
		*/
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
/* end class MatrixUtil */

/* begin class DangerBar */
function DangerBar(timeRemainingMs) {
	this.timeRemainingMs = timeRemainingMs;
}

DangerBar.prototype.start = function() {
	console.debug('starting danger bar timing');
	return this; //chainable
}
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