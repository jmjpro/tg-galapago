function SpriteSheet(image, spriteMatrix) {
	this.image = image;
	this.spriteMatrix = spriteMatrix;
	var tempCanvas = document.createElement('canvas');
	this._canvas = tempCanvas;
	this._canvas.style.display = 'none';
	this._canvas.style.position = 'absolute';
	this._canvas.style.left = -1000;
	this._canvas.style.top = -1000;
	this._ctx = this._canvas.getContext('2d');
}

SpriteSheet.prototype.getSprite = function (matrixCell) {
	var spriteData, x, y, width, height, col, row, numCols, numRows;
	col = matrixCell[0];
	row = matrixCell[1];
	x = this.spriteMatrix[row][col].cell[0];
	y = this.spriteMatrix[row][col].cell[1];
	numRows = this.spriteMatrix.length;
	numCols = this.spriteMatrix[0].length;
	if( col + 1 < numCols ) {
		width = this.spriteMatrix[row][col + 1].cell[0] - x;
	} else { //last column of sprites
		width = this.image.width - x;
	}
	if( row + 1 < numRows ) {
		height = this.spriteMatrix[row + 1][col].cell[1] - y;
	} else { //last row of sprites
		height = this.image.height - y;
	}
	this._canvas.width = width;
	this._canvas.height = height;
	this._ctx.drawImage(this.image, x, y, width, height, 0, 0, width, height);
	spriteData = this._ctx.getImageData(0, 0, width, height);
	//returning the image data here is much faster than toDataURL(), but get/putImageData() don't account for css canvas stretching
	//http://stackoverflow.com/questions/2588181/canvas-is-stretched-when-using-css-but-normal-with-width-height-properties
	//just need to ensure that we don't stretch the canvas by defining it's width and height in CSS
	/*
	spriteURL = this._canvas.toDataURL( );
	sprite = new Image();
	sprite.src = spriteURL;
	*/
	return spriteData;
};

SpriteSheet.prototype.getSpriteNew = function (matrixCell) {
	var spriteData, x, y, width, height, col, row, numCols, numRows;
	col = matrixCell[0];
	row = matrixCell[1];
	x = this.spriteMatrix[row][col].cell[0];
	y = this.spriteMatrix[row][col].cell[1];
	numRows = this.spriteMatrix.length;
	numCols = this.spriteMatrix[0].length;
	if( col + 1 < numCols ) {
		width = this.spriteMatrix[row][col + 1].cell[0] - x;
	} else { //last column of sprites
		width = this.image.width - x;
	}
	if( row + 1 < numRows ) {
		height = this.spriteMatrix[row + 1][col].cell[1] - y;
	} else { //last row of sprites
		height = this.image.height - y;
	}
	this._canvas.width = width;
	this._canvas.height = height;
	this._ctx.drawImage(this.image, x, y, width, height, 0, 0, width, height);
	var savedImage = new Image()
	savedImage.src = this._canvas.toDataURL("image/png")
	//spriteData = this._ctx.getImageData(0, 0, width, height);
	//returning the image data here is much faster than toDataURL(), but get/putImageData() don't account for css canvas stretching
	//http://stackoverflow.com/questions/2588181/canvas-is-stretched-when-using-css-but-normal-with-width-height-properties
	//just need to ensure that we don't stretch the canvas by defining it's width and height in CSS
	/*
	spriteURL = this._canvas.toDataURL( );
	sprite = new Image();
	sprite.src = spriteURL;
	*/
	return savedImage;
};


SpriteSheet.prototype.getSpriteData = function (matrixCell) {
	var spriteData, x, y, width, height, col, row, numCols, numRows;
	col = matrixCell[0];
	row = matrixCell[1];
	x = this.spriteMatrix[row][col].cell[0];
	y = this.spriteMatrix[row][col].cell[1];
	numRows = this.spriteMatrix.length;
	numCols = this.spriteMatrix[0].length;
	if( col < numCols - 1 ) {
		width = this.spriteMatrix[row][col + 1].cell[0] - x;
	} else { //last column of sprites
		width = this.image.width - x;
	}
	if( row < numRows - 1 ) {
		height = this.spriteMatrix[row + 1][col].cell[1] - y;
	} else { //last row of sprites
		height = this.image.height - y;
	}
	this._canvas.width = width;
	this._canvas.height = height;
	this._ctx.drawImage(this.image, x, y, width, height, 0, 0, width, height);
	spriteData = this._ctx.getImageData(0, 0, width, height);
	//returning the image data here is much faster than toDataURL(), but get/putImageData() don't account for css canvas stretching
	//http://stackoverflow.com/questions/2588181/canvas-is-stretched-when-using-css-but-normal-with-width-height-properties
	//just need to ensure that we don't stretch the canvas by defining it's width and height in CSS
	/*
	spriteURL = this._canvas.toDataURL( );
	sprite = new Image();
	sprite.src = spriteURL;
	*/
	return spriteData;
}; //SpriteSheet.prototype.getSpriteData()

SpriteSheet.prototype.getSliceData = function (matrixCellStart, matrixCellEnd) {
	var sliceData, x, y, width, height, colStart, rowStart, colEnd, rowEnd, numCols, numRows;
	numRows = this.spriteMatrix.length;
	numCols = this.spriteMatrix[0].length;
	colStart = matrixCellStart[0];
	rowStart = matrixCellStart[1];
	x = this.spriteMatrix[rowStart][colStart].cell[0];
	y = this.spriteMatrix[rowStart][colStart].cell[1];
	colEnd = null;
	rowEnd = null;
	if( matrixCellEnd !== null ) {
		colEnd = matrixCellEnd[0];
		rowEnd = matrixCellEnd[1] + 1 < numRows ? matrixCellEnd[1] + 1 : matrixCellEnd[1];
	}
	if( colEnd !== null && colEnd + 1 < numCols ) {
		width = this.spriteMatrix[rowEnd][colEnd + 1].cell[0] - x;
	} else { //last column of sprites
		width = this.image.width - x;
	}
	if( rowEnd !== null && rowEnd + 1 < numRows ) {
		height = this.spriteMatrix[rowEnd + 1][colEnd].cell[1] - y;
	} else { //last row of sprites
		height = this.image.height - y;
	}
	this._canvas.width = width;
	this._canvas.height = height;
	this._ctx.drawImage(this.image, x, y, width, height, 0, 0, width, height);
	sliceData = this._ctx.getImageData(0, 0, width, height);
	return sliceData;
}; //SpriteSheet.prototype.getSliceData()

SpriteSheet.prototype.displaySlice = function(context, matrixCellStart, matrixCellEnd) {
	var spriteData;
	spriteData = this.getSliceData(matrixCellStart, matrixCellEnd);
	context.putImageData(spriteData, 0, 0);
}; //SpriteSheet.prototype.displaySlice()

SpriteSheet.prototype.displayFraction = function(context, fractionWidth, fractionHeight, x, y) {
	var spriteData, endCol, endRow, matrixCellEnd, x, y;
	if( typeof x === 'undefined') {
		x = 0;
	}
	if( typeof y === 'undefined') {
		y = 0;
	}
	matrixCellEnd = [];
	if( fractionWidth === 0 || fractionHeight === 0 ) {
		return;
	}
	else {
		endCol = fractionWidth === 1 ? this.spriteMatrix[0].length - 1 : Math.floor((this.spriteMatrix[0].length - 1) * fractionWidth );
		endRow = fractionHeight === 1 ? this.spriteMatrix.length - 1 : Math.floor((this.spriteMatrix.length - 1) * fractionHeight );
		matrixCellEnd[0] = endCol;
		matrixCellEnd[1] = endRow;
		spriteData = this.getSliceData([0,0], matrixCellEnd);
		context.putImageData(spriteData, x, y);
	}
}; //SpriteSheet.prototype.displayFraction()

SpriteSheet.prototype.displayAll = function(context, displayLabels) {
	var spriteData, rowIt, colIt, xOffset, yOffset, x, y;
	yOffset = 0;
	for (rowIt = 0; rowIt < this.spriteMatrix.length; rowIt++) {
		xOffset = 0;
		for (colIt = 0; colIt < this.spriteMatrix[rowIt].length; colIt++) {
			spriteData = this.getSpriteData([colIt, rowIt]);
			x = xOffset;
			y = yOffset;
			context.putImageData(spriteData, x, y);
			if( displayLabels && typeof this.spriteMatrix[rowIt][colIt].id != 'undefined' ) {
				context.fillText( this.spriteMatrix[rowIt][colIt].id, x, y + spriteData.height - 2 );
			}
			xOffset += spriteData.width;
		}
		yOffset += spriteData.height;
	}
};