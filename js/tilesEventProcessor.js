/* begin class TileMovedEventProcessorResult */
function TileMovedEventProcessorResult(matchingTilesSets, totalMatchedGoldTiles, totalMatchedBlockingTiles, totalMatchedCocoonTiles, affectedPointsArray){
	this.matchingTilesSets = matchingTilesSets;
	this.totalMatchedGoldTiles = totalMatchedGoldTiles;
	this.totalMatchedBlockingTiles = totalMatchedBlockingTiles;
	this.totalMatchedCocoonTiles = totalMatchedCocoonTiles;
	this.affectedPointsArray = affectedPointsArray;
}
/* end class TileMovedEventProcessorResult */

/* begin class TilesEventProcessor */
function TilesEventProcessor(board){
	this.board = board;
}

TilesEventProcessor.prototype.tileMoved  = function(tileFocal){
	var totalMatchedGoldTiles = [];
	var totalMatchedBlockingTiles = [];
	var totalMatchedCocoonTiles = [];
	var scoreEvents = [];
	var affectedPointsArray =[];
	var matchingTilesSets = this.getMatchingTilesSets(tileFocal);
	var tilesEventProcessor = this;
	if( matchingTilesSets && matchingTilesSets.length >= 1 ) {
		_.each( matchingTilesSets, function(matchingTilesSet) {
			var goldTiles = tilesEventProcessor.getGoldTiles(matchingTilesSet);
			totalMatchedGoldTiles = totalMatchedGoldTiles.concat(goldTiles);
			var blockedTiles = tilesEventProcessor.getBlockedTiles(matchingTilesSet);
			totalMatchedBlockingTiles = totalMatchedBlockingTiles.concat(blockedTiles);
			var cocoonTiles = tilesEventProcessor.getCocoonTiles(matchingTilesSet);
			totalMatchedCocoonTiles = totalMatchedCocoonTiles.concat(cocoonTiles);
			tilesEventProcessor.board.scoreEvents.push(new ScoreEvent(matchingTilesSet.length, goldTiles.length, blockedTiles.length, 
				cocoonTiles.length, null, null, false, tilesEventProcessor.board.chainReactionCounter));
			affectedPointsArray = affectedPointsArray.concat(Tile.tileArrayToPointsArray(matchingTilesSet));
		});
		totalMatchedGoldTiles = ArrayUtil.unique(totalMatchedGoldTiles);
		totalMatchedBlockingTiles = ArrayUtil.unique(totalMatchedBlockingTiles);
		totalMatchedCocoonTiles = ArrayUtil.unique(totalMatchedCocoonTiles);
		affectedPointsArray = affectedPointsArray.concat(Tile.tileArrayToPointsArray(totalMatchedCocoonTiles));
	}
	return new TileMovedEventProcessorResult(matchingTilesSets, totalMatchedGoldTiles, totalMatchedBlockingTiles, totalMatchedCocoonTiles, affectedPointsArray);
}

TilesEventProcessor.prototype.getMatchingTilesSets = function(tileFocal) {
	var matchingTilesSet, matchingTiles, coordinates, neighborTile, col, row, tilesMatched, x, y, matchFound;
	matchingTilesSet = [];
	matchingTiles = [];
	coordinates = tileFocal ? tileFocal.coordinates : null;
	console.debug( 'called Board.getScoringEvents with focal tile ' + coordinates );
	if( !tileFocal ) { //YM: tileFocal could have been nulled by a previous matchingTilesSet formed from the same move
		return matchingTiles;
	}

	y = 0;
	matchFound = true;
	while(matchFound){
		matchFound = false;
		y--;
		neighborTile = this.board.getNeighbor(tileFocal, [0, y]);
		if(neighborTile && !neighborTile.isPlain() && !neighborTile.isBlocking() && neighborTile.matches(tileFocal)){
			matchingTiles.push(neighborTile);
			matchFound = true;
		}
	}
	matchingTiles.push(tileFocal);
	y = 0;
	matchFound = true;
	while(matchFound){
		matchFound = false;
		y++;
		neighborTile = this.board.getNeighbor(tileFocal, [0, y]);
		if(neighborTile && !neighborTile.isPlain() && !neighborTile.isBlocking() && neighborTile.matches(tileFocal)){
			matchingTiles.push(neighborTile);
			matchFound = true;
		}
	}
	
	if(matchingTiles.length >= Score.NUMBER_OF_TILES_CONSTITUTES_A_MATCH) {
		matchingTilesSet.push(matchingTiles);
	}
	
	matchingTiles =[];
	x = 0;
	matchFound = true;
	while(matchFound){
		matchFound = false;
		x--;
		neighborTile = this.board.getNeighbor(tileFocal, [x, 0]);
		if(neighborTile && !neighborTile.isPlain() && !neighborTile.isBlocking() && neighborTile.matches(tileFocal)){
			matchingTiles.push(neighborTile);
			matchFound = true;
		}
	}
	matchingTiles.push(tileFocal);
	x = 0;
	matchFound = true;
	while(matchFound){
		matchFound = false;
		x++;
		neighborTile = this.board.getNeighbor(tileFocal, [x, 0]);
		if(neighborTile && !neighborTile.isPlain() && !neighborTile.isBlocking() && neighborTile.matches(tileFocal)){
			matchingTiles.push(neighborTile);
			matchFound = true;
		}
	}

	if(matchingTiles.length >= Score.NUMBER_OF_TILES_CONSTITUTES_A_MATCH) {
		matchingTilesSet.push(matchingTiles);
	}

	return matchingTilesSet;
};

//get the gold tiles backing a matchingTilesSet of creature tiles
TilesEventProcessor.prototype.getGoldTiles = function(matchingTilesSet) {
	var goldTiles, goldTile;
	goldTiles = [];
	var board = this.board;
	_.each( matchingTilesSet, function(creatureTile) {
		goldTile = board.getGoldTile(creatureTile);
		if( goldTile ) {
			goldTiles.push(goldTile);
		}
	});
	return goldTiles;
};

//get the blocked tiles backing a matchingTilesSet of creature tiles
TilesEventProcessor.prototype.getBlockedTiles = function(matchingTilesSet) {
	var blockedTiles;
	blockedTiles = [];
	var board = this.board;
	_.each( matchingTilesSet, function(creatureTile) {
		if( creatureTile.isBlocked() ) {
			blockedTiles.push(creatureTile);
		}
	});
	return blockedTiles;
};

//get the cocoon tiles backing a matchingTilesSet of creature tiles
TilesEventProcessor.prototype.getCocoonTiles = function(matchingTilesSet) {
	var cocoonTiles;
	cocoonTiles = [];
	var board = this.board;
	_.each( matchingTilesSet, function(creatureTile) {
		var neighborTile = board.getNeighbor(creatureTile, [0, -1]);
		if( neighborTile && neighborTile.isCocooned() ) {
			cocoonTiles.push(creatureTile);
		}
		neighborTile = board.getNeighbor(creatureTile, [0, 1]);
		if( neighborTile &&  neighborTile.isCocooned() ) {
			cocoonTiles.push(creatureTile);
		}
		neighborTile = board.getNeighbor(creatureTile, [-1, 0]);
		if( neighborTile && neighborTile.isCocooned() ) {
			cocoonTiles.push(creatureTile);
		}
		neighborTile = board.getNeighbor(creatureTile, [1, 0]);
		if( neighborTile && neighborTile.isCocooned() ) {
			cocoonTiles.push(creatureTile);
		}
	});
	return cocoonTiles;
};

/* end class TilesEventProcessor */
