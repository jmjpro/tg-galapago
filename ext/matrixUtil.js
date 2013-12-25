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
}; //MatrixUtil.isSameDimensions()

// returns the matrix point at a certain distance from a particular point
MatrixUtil.getNeighborCoordinates = function(coordinates, coordsDistance) {
	var coordsNeighbor;
	coordsNeighbor = [];
	coordsNeighbor[0] = coordinates[0] + coordsDistance[0];
	coordsNeighbor[1] = coordinates[1] + coordsDistance[1];
	return coordsNeighbor;
}; //MatrixUtil.getNeighborCoordinates()

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
}; //MatrixUtil.getNeighborsAbovePoint()

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
}; //MatrixUtil.getNeighborsAbovePoints()

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
}; //MatrixUtil.isVerticalPointSet()

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
}; //MatrixUtil.getHighestPoint()

MatrixUtil.lowerPointByNRows = function(point, numRows) {
	return [point[0], point[1] + numRows];
}; //MatrixUtil.lowerPointByNRows()

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
}; //MatrixUtil.getFirstNRowPoints()

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
}; //MatrixUtil.getNFirstRowPoints()

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
}; //MatrixUtil.pointsArrayToString()

MatrixUtil.coordinatesToString = function(coordinates) {
	return '[' + coordinates[0] + ',' + coordinates[1] + ']';
}; //MatrixUtil.coordinatesToString()

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