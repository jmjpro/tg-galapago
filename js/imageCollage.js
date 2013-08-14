// assumes a sheet of symmetric images defined by a 1 or 2 dimensional image matrix
function ImageCollage(image, imageCoordinateArray) {
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
ImageCollage.prototype.getImage = function (imageId) {
	var imageCollage, imageCoordinate, image, x, y, width, height;
	imageCollage = this;
	imageCoordinate = _.find( this.imageCoordinateArray, {'id' : imageId} );
	x = imageCoordinate.cell[0];
	y = imageCoordinate.cell[1];
	width = imageCoordinate.cell[2];
	height = imageCoordinate.cell[3];
	imageCollage._canvas.width = width;
	imageCollage._canvas.height = height;
	imageCollage._ctx.drawImage(imageCollage.image, x, y, width, height, 0, 0, width, height);
	image = new Image();
	image.src = imageCollage._canvas.toDataURL("image/png");
	image.id = imageCoordinate.id;
	return image;
}; //ImageCollage.prototype.getImage()

//return an array of image objects corresponding to the rectangular regions in the this.coordinateArray
ImageCollage.prototype.getImages = function () {
	var imageCollage, imageArray;
	imageCollage = this;
	imageArray = [];
	_.each( this.imageCoordinateArray, function( imageCoordinate ) {
		imageArray.push( imageCollage.getImage(imageCoordinate.id) );
	});
	return imageArray;
}; //ImageCollage.prototype.getImages()