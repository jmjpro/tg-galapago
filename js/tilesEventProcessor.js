/* begin class TileMovedEventProcessorResult */
function TileMovedEventProcessorResult(matchingTilesSets, totalMatchedGoldTiles, totalMatchedBlockingTiles, totalMatchedCocoonTiles, totalMatchedSuperFriendTiles, totalTilesAffectedByLightning, totalTilesAffectedBySuperFriend){
	this.matchingTilesSets = matchingTilesSets;
	this.totalMatchedGoldTiles = totalMatchedGoldTiles;
	this.totalMatchedBlockingTiles = totalMatchedBlockingTiles;
	this.totalMatchedCocoonTiles = totalMatchedCocoonTiles;
	this.totalMatchedSuperFriendTiles = totalMatchedSuperFriendTiles;
	this.totalTilesAffectedByLightning = totalTilesAffectedByLightning;
	this.totalTilesAffectedBySuperFriend = totalTilesAffectedBySuperFriend;
}
/* end class TileMovedEventProcessorResult */

/* begin class TilesEventProcessor */
function TilesEventProcessor(board){
	this.board = board;
}

TilesEventProcessor.prototype.tileMoved  = function(tileFocal){
	var totalMatchedTiles = [];
	var totalMatchedGoldTiles = [];
	var totalMatchedBlockingTiles = [];
	var totalMatchedCocoonTiles = [];
	var totalMatchedSuperFriendTiles = [];
	var totalTilesAffectedByLightning = [];
	var totalTilesAffectedBySuperFriend = [];
	var scoreEvents = [];
	var matchingTilesSets = this.getMatchingTilesSets(tileFocal);
	var tilesEventProcessor = this;
	if( matchingTilesSets && matchingTilesSets.length >= 1 ) {
		totalMatchedTiles = TilesEventProcessor.getTotalMatchedTiles(matchingTilesSets);
		_.each( matchingTilesSets, function(matchingTilesSet) {
			//Gold Tiles
			var goldTiles = tilesEventProcessor.getGoldTiles(matchingTilesSet);
			totalMatchedGoldTiles = totalMatchedGoldTiles.concat(goldTiles);
			//Blocked Tiles
			var blockedTiles = tilesEventProcessor.getBlockedTiles(matchingTilesSet);
			totalMatchedBlockingTiles = totalMatchedBlockingTiles.concat(blockedTiles);
			//Coccon Tiles
			var cocoonTiles = tilesEventProcessor.getCocoonTiles(matchingTilesSet);
			totalMatchedCocoonTiles = totalMatchedCocoonTiles.concat(cocoonTiles);
			//Lightning Tiles
			var tilesAffectedByLightning = tilesEventProcessor.getTilesAffectedByLightning(matchingTilesSet);
			totalTilesAffectedByLightning = totalTilesAffectedByLightning.concat(tilesAffectedByLightning);
			// Gold Tiles affected by lightning cause
			var goldTilesAffectedByLightning = tilesEventProcessor.getGoldTiles(tilesAffectedByLightning);
			goldTiles = goldTiles.concat(goldTilesAffectedByLightning);
			totalMatchedGoldTiles = totalMatchedGoldTiles.concat(goldTilesAffectedByLightning);
			//Blocked Tiles affected by lightning cause
			var blockedTilesAffectedByLightning = tilesEventProcessor.getBlockedTiles(tilesAffectedByLightning);
			blockedTiles = blockedTiles.concat(blockedTilesAffectedByLightning);
			totalMatchedBlockingTiles = totalMatchedBlockingTiles.concat(blockedTilesAffectedByLightning);
			//Super Friends affected by lightning cause
			var superFriendTiles = tilesEventProcessor.getSuperFriendTiles(tilesAffectedByLightning);
			totalMatchedSuperFriendTiles = totalMatchedSuperFriendTiles.concat(superFriendTiles);
			var tilesAffectedBySuperFriend = tilesEventProcessor.getTilesAffectedBySuperFriend(superFriendTiles, tilesAffectedByLightning);
			// Super Friends
			superFriendTiles = tilesEventProcessor.getSuperFriendTiles(matchingTilesSet);
			totalMatchedSuperFriendTiles = totalMatchedSuperFriendTiles.concat(superFriendTiles);
			tilesAffectedBySuperFriend = tilesAffectedBySuperFriend.concat(tilesEventProcessor.getTilesAffectedBySuperFriend(superFriendTiles, totalMatchedTiles));
			totalTilesAffectedBySuperFriend = totalTilesAffectedBySuperFriend.concat(tilesAffectedBySuperFriend);
			// Gold Tiles affected by super friend
			var goldTilesAffectedBySuperFriend = tilesEventProcessor.getGoldTiles(tilesAffectedBySuperFriend);
			goldTiles = goldTiles.concat(goldTilesAffectedBySuperFriend);
			totalMatchedGoldTiles = totalMatchedGoldTiles.concat(goldTilesAffectedBySuperFriend);
			// Score
			tilesEventProcessor.board.scoreEvents.push(new ScoreEvent(matchingTilesSet.length, goldTiles.length, blockedTiles.length, 
				cocoonTiles.length, totalTilesAffectedByLightning.length, totalTilesAffectedBySuperFriend.length, false, tilesEventProcessor.board.chainReactionCounter));
		});
		totalMatchedGoldTiles = ArrayUtil.unique(totalMatchedGoldTiles);
		totalMatchedBlockingTiles = ArrayUtil.unique(totalMatchedBlockingTiles);
		totalMatchedCocoonTiles = ArrayUtil.unique(totalMatchedCocoonTiles);
		totalTilesAffectedByLightning = ArrayUtil.unique(totalTilesAffectedByLightning);
		totalTilesAffectedBySuperFriend = ArrayUtil.unique(totalTilesAffectedBySuperFriend);
	}
	return new TileMovedEventProcessorResult(matchingTilesSets, totalMatchedGoldTiles, totalMatchedBlockingTiles, totalMatchedCocoonTiles, totalMatchedSuperFriendTiles, totalTilesAffectedByLightning, totalTilesAffectedBySuperFriend);
}

TilesEventProcessor.getTotalMatchedTiles = function(matchingTilesSets) {
	var totalMatchedTiles = [];
	_.each(matchingTilesSets, function(matchingTilesSet){
		totalMatchedTiles = totalMatchedTiles.concat(matchingTilesSet);
	});
	totalMatchedTiles = ArrayUtil.unique(totalMatchedTiles);
	return totalMatchedTiles;
}

TilesEventProcessor.tileMatchesNeighborTile = function(tile, neighborTile) {
	return neighborTile && !neighborTile.isPlain() && !neighborTile.isCocooned() 
		&& (neighborTile.matches(tile) || (neighborTile.hasSuperFriend() && tile.matchesSuperFriend(neighborTile)) 
			|| (tile.hasSuperFriend() && neighborTile.matchesSuperFriend(tile))) ;
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
		if(TilesEventProcessor.tileMatchesNeighborTile(tileFocal, neighborTile)){
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
		if(TilesEventProcessor.tileMatchesNeighborTile(tileFocal, neighborTile)){
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
		if(TilesEventProcessor.tileMatchesNeighborTile(tileFocal, neighborTile)){
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
		if(TilesEventProcessor.tileMatchesNeighborTile(tileFocal, neighborTile)){
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
		if( neighborTile && neighborTile.isCocooned() && neighborTile.matches(creatureTile)) {
			cocoonTiles.push(neighborTile);
		}
		neighborTile = board.getNeighbor(creatureTile, [0, 1]);
		if( neighborTile &&  neighborTile.isCocooned() && neighborTile.matches(creatureTile)) {
			cocoonTiles.push(neighborTile);
		}
		neighborTile = board.getNeighbor(creatureTile, [-1, 0]);
		if( neighborTile && neighborTile.isCocooned() && neighborTile.matches(creatureTile)) {
			cocoonTiles.push(neighborTile);
		}
		neighborTile = board.getNeighbor(creatureTile, [1, 0]);
		if( neighborTile && neighborTile.isCocooned() && neighborTile.matches(creatureTile)) {
			cocoonTiles.push(neighborTile);
		}
	});
	return cocoonTiles;
};

TilesEventProcessor.prototype.getTilesAffectedByLightning = function(matchingTilesSet) {
	var tilesAffectedByLightning = [];
	var row, col, rowIncrementer, colIncrementer;
	var creatureTile = matchingTilesSet[0];
	var creatureTile1 = matchingTilesSet[1];
	var	tileMatrix = this.board.creatureTileMatrix;
	if(creatureTile.hasLightningCreature()){
		if(creatureTile.coordinates[0] == creatureTile1.coordinates[0]){
			col = creatureTile.coordinates[0];
			row = 0;
			colIncrementer = 0;
			rowIncrementer = 1;
		}
		else{
			col = 0;
			row = creatureTile.coordinates[1];
			colIncrementer = 1;
			rowIncrementer = 0;	
		}
		while(col < tileMatrix.length && row < tileMatrix[col].length){
			var tile = tileMatrix[col][row];
			if(tile && !_.contains(matchingTilesSet, tile) && (tile.isBlocked() || tile.isNonBlockingWithCreature() || tile.hasSuperFriend())){
				tilesAffectedByLightning.push(tile);
			}
			col += colIncrementer;
			row += rowIncrementer;	
		}
	}
	return tilesAffectedByLightning;
}

TilesEventProcessor.prototype.getSuperFriendTiles = function(matchingTilesSet) {
	var superFriendTiles  = [];
	_.each(matchingTilesSet,function(tile){
		if(tile.hasSuperFriend()){
			superFriendTiles.push(tile);
		}
	});
	;return superFriendTiles;
}
TilesEventProcessor.prototype.getTilesAffectedBySuperFriend = function(superFriendTiles, totalMatchedTiles) {
	var tilesAffectedBySuperFriend = [];
	if(superFriendTiles.length>0){
		var	tileMatrix = this.board.creatureTileMatrix;
		_.each(tileMatrix, function(columnArray){
			_.each(columnArray, function(tile){
				if(tile && !_.contains(totalMatchedTiles, tile)  && tile.isNonBlockingWithCreature() 
					&& TilesEventProcessor.matchesSuperFriends(superFriendTiles, tile)){
					tilesAffectedBySuperFriend.push(tile);
				}
			});
		});			
		console.log();
	}
	return tilesAffectedBySuperFriend;
}

TilesEventProcessor.matchesSuperFriends = function(superFriendTiles, tile){
	var matched = false;
	_.each(superFriendTiles, function(superFriendTile){
		if(tile.matchesSuperFriend(superFriendTile)){
			matched = true;
			return;
		}
	});
	return matched;
}

/* end class TilesEventProcessor */
