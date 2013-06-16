getTile = function(coordinates){
	var tile = new Tile();
	tile.coordinates = coordinates;
	return tile;
}

getCoordinatesArray = function(tilesArray){
	var coordArray = _.map(tilesArray, function(tileArray){
		tileArray = _.map(tileArray, function(tile){
			return tile.coordinates;
		});
		return tileArray;
	});
	return coordArray;
}