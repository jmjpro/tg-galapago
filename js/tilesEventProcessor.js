/* begin class TileMovedEventProcessorResult */
function TileMovedEventProcessorResult(matchingTilesSets, totalMatchedGoldTiles, affectedPointsArray){
	this.matchingTilesSets = matchingTilesSets;
	this.totalMatchedGoldTiles = totalMatchedGoldTiles;
	this.affectedPointsArray = affectedPointsArray;
}
/* end class TileMovedEventProcessorResult */

/* begin class TilesEventProcessor */
function TilesEventProcessor(board){
	this.board = board;
}

TilesEventProcessor.prototype.tileMoved  = function(tileFocal){
	var totalMatchedGoldTiles = [];
	var scoreEvents = [];
	var affectedPointsArray =[];
	var matchingTilesSets = this.getMatchingTilesSets(tileFocal);
	var tilesEventProcessor = this;
	if( matchingTilesSets && matchingTilesSets.length >= 1 ) {
		_.each( matchingTilesSets, function(matchingTilesSet) {
			var goldTiles = tilesEventProcessor.getGoldTiles(matchingTilesSet);
			_.each( goldTiles, function(goldTile){
				totalMatchedGoldTiles.push(goldTile);
			});
			var blockedTiles = tilesEventProcessor.getBlockedTiles(matchingTilesSet);
			var cocoonTiles = tilesEventProcessor.getCocoonTiles(matchingTilesSet);
			tilesEventProcessor.board.scoreEvents.push(new ScoreEvent(matchingTilesSet.length, goldTiles.length, blockedTiles.length, 
				cocoonTiles.length, null, null, false, tilesEventProcessor.board.chainReactionCounter));
			affectedPointsArray = affectedPointsArray.concat(Tile.tileArrayToPointsArray(matchingTilesSet));
		});
	}
	return new TileMovedEventProcessorResult(matchingTilesSets, totalMatchedGoldTiles, affectedPointsArray);
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
	col = coordinates[0];
	row = coordinates[1];
	x = 0;
	matchFound = true;
	while(matchFound){
		matchFound = false;
		x--;
		neighborTile = this.board.getNeighbor(tileFocal, [x, 0]);
		if(neighborTile && !neighborTile.isPlain() && neighborTile.matches(tileFocal)){
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
		if(neighborTile && !neighborTile.isPlain() && neighborTile.matches(tileFocal)){
			matchingTiles.push(neighborTile);
			matchFound = true;
		}
	}

	if(matchingTiles.length >= Score.NUMBER_OF_TILES_CONSTITUTES_A_MATCH) {
		matchingTilesSet.push(matchingTiles);
	}

	matchingTiles =[];
	y = 0;
	matchFound = true;
	while(matchFound){
		matchFound = false;
		y--;
		neighborTile = this.board.getNeighbor(tileFocal, [0, y]);
		if(neighborTile && !neighborTile.isPlain() && neighborTile.matches(tileFocal)){
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
		if(neighborTile && !neighborTile.isPlain() && neighborTile.matches(tileFocal)){
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
	var blockedTiles, blockedTile;
	blockedTiles = [];
	var board = this.board;
	_.each( matchingTilesSet, function(creatureTile) {
		if( creatureTile.isBlocked() ) {
			blockedTiles.push(blockedTile);
		}
	});
	return blockedTiles;
};

//get the cocoon tiles backing a matchingTilesSet of creature tiles
TilesEventProcessor.prototype.getCocoonTiles = function(matchingTilesSet) {
	var cocoonTiles, cocoonTile;
	cocoonTiles = [];
	var board = this.board;
	_.each( matchingTilesSet, function(creatureTile) {
		if( creatureTile.isCocooned() ) {
			cocoonTiles.push(cocoonTile);
		}
	});
	return cocoonTiles;
};

/* end class TilesEventProcessor */
