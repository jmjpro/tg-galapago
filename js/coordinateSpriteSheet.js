// assumes a sheet of symmetric sprites defined by a 1 or 2 dimensional sprite matrix
function CoordinateSpriteSheet(image, imageCoordinateArray) {
	this.image = image;
	this.imageCoordinateArray = imageCoordinateArray;
	var tempCanvas = document.createElement('canvas');
	this._canvas = tempCanvas;
	this._canvas.style.display = 'none';
	this._canvas.style.position = 'absolute';
	this._canvas.style.left = -1000;
	this._canvas.style.top = -1000;
	this._ctx = this._canvas.getContext('2d');
} //constructor

//return an array of image objects corresponding to the rectangular regions in the this.coordinateArray
CoordinateSpriteSheet.prototype.getSprite = function (spriteId) {
	var spriteSheet, imageCoordinate, sprite, x, y, width, height;
	spriteSheet = this;
	imageCoordinate = _.find( this.imageCoordinateArray, {'id' : spriteId} );
	x = imageCoordinate.cell[0];
	y = imageCoordinate.cell[1];
	width = imageCoordinate.cell[2];
	height = imageCoordinate.cell[3];
	spriteSheet._canvas.width = width;
	spriteSheet._canvas.height = height;
	spriteSheet._ctx.drawImage(spriteSheet.image, x, y, width, height, 0, 0, width, height);
	sprite = new Image();
	sprite.src = spriteSheet._canvas.toDataURL("image/png");
	sprite.id = imageCoordinate.id;
	return sprite;
}; //CoordinateSpriteSheet.prototype.getSprite()

//return an array of image objects corresponding to the rectangular regions in the this.coordinateArray
CoordinateSpriteSheet.prototype.getSprites = function () {
	var spriteSheet, spriteArray, imageCoordinate, sprite, x, y, width, height;
	spriteSheet = this;
	spriteArray = [];
	_.each( this.imageCoordinateArray, function( imageCoordinate ) {
		x = imageCoordinate.cell[0];
		y = imageCoordinate.cell[1];
		width = imageCoordinate.cell[2];
		height = imageCoordinate.cell[3];
		spriteSheet._canvas.width = width;
		spriteSheet._canvas.height = height;
		spriteSheet._ctx.drawImage(spriteSheet.image, x, y, width, height, 0, 0, width, height);
		sprite = new Image();
		sprite.src = spriteSheet._canvas.toDataURL("image/png");
		sprite.id = imageCoordinate.id;
		spriteArray.push( sprite );
	});
	return spriteArray;
}; //CoordinateSpriteSheet.prototype.getSprites()