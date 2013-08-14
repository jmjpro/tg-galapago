ImageCollage.COLLAGE_ARRAY = [
	{
		'collageId': 'main_menu_static.png',
		'imageCoordinateArray': [
			 {'cell': [0, 0, 611, 121], 'id': 'main_menu_button_change_player_selected.png'}, 
			 {'cell': [0, 121, 611, 121], 'id': 'main_menu_button_change_player_regular.png'},
			 {'cell': [0, 242, 467, 329], 'id': 'main_menu_button_timed_selected.png'},
			 {'cell': [0, 571, 467, 329], 'id': 'main_menu_button_timed_regular.png'},
			 {'cell': [467, 242, 467, 329], 'id': 'main_menu_button_relaxed_selected.png'}, 
			 {'cell': [467, 571, 467, 329], 'id': 'main_menu_button_relaxed_regular.png'},
			 {'cell': [611, 0, 331, 116], 'id': 'main_menu_button_options_selected.png'}, 
			 {'cell': [611, 116, 331, 116], 'id': 'main_menu_button_options_regular.png'},
			 {'cell': [942, 0, 25, 25], 'id': 'main_menu_arrow_left.png'},
			 {'cell': [942, 25, 25, 25], 'id': 'main_menu_arrow_right.png'}
		]
	}
];

// assumes a sheet of symmetric images defined by a 1 or 2 dimensional image matrix
function ImageCollage(collageDescriptor) {
	this.image = LoadingScreen.gal.get(collageDescriptor.collageId);
	this.collageId = collageDescriptor.collageId;
	this.imageCoordinateArray = collageDescriptor.imageCoordinateArray;
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

ImageCollage.loadByName = function (collageId) {
	var imageCollage, collageDescriptor;
	collageDescriptor = _.find( ImageCollage.COLLAGE_ARRAY, function( collageDescriptor ) {
		if( collageDescriptor.collageId === collageId ) {
			return collageDescriptor;
		}
	});
	imageCollage = new ImageCollage(collageDescriptor);
	return imageCollage;
}; //ImageCollage.loadByName()