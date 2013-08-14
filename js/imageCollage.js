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
	},
	{
		'collageId': 'map_level_ui_static.png',
		'imageCoordinateArray': [
			 {'cell': [0, 0, 52, 514], 'id': 'danger_bar.png'},
			 {'cell': [52, 0, 70, 71], 'id': 'PowerUps_Flame_Disabled.png'},
			 {'cell': [52, 71, 70, 71], 'id': 'PowerUps_Flame_Rollover.png'},
			 {'cell': [52, 142, 70, 71], 'id': 'PowerUps_Flame_Pressed.png'},
			 {'cell': [52, 213, 70, 71], 'id': 'PowerUps_Flame_Activated.png'},
			 {'cell': [122, 0, 70, 71], 'id': 'PowerUps_Swap_Disabled.png'},
			 {'cell': [122, 71, 70, 71], 'id': 'PowerUps_Swap_Rollover.png'},
			 {'cell': [122, 142, 70, 71], 'id': 'PowerUps_Swap_Pressed.png'},
			 {'cell': [122, 213, 70, 71], 'id': 'PowerUps_Swap_Activated.png'},
			 {'cell': [192, 0, 70, 71], 'id': 'PowerUps_Shuffle_Disabled.png'},
			 {'cell': [192, 71, 70, 71], 'id': 'PowerUps_Shuffle_Rollover.png'},
			 {'cell': [192, 142, 70, 71], 'id': 'PowerUps_Shuffle_Pressed.png'},
			 {'cell': [261, 0, 19, 284], 'id': 'PowerUps_Holder.png'},
			 {'cell': [281, 0, 38, 26], 'id': 'next_level_arrow_down.png'},
			 {'cell': [281, 26, 37, 24], 'id': 'next_level_arrow_left_down.png'},
			 {'cell': [281, 50, 37, 24], 'id': 'next_level_arrow_right_down.png'},
			 {'cell': [281, 74, 30, 24], 'id': 'next_level_arrow_left_up.png'},
			 {'cell': [281, 98, 30, 24], 'id': 'next_level_arrow_right_up.png'},
			 {'cell': [281, 122, 34, 25], 'id': 'next_level_arrow_left.png'},
			 {'cell': [281, 147, 34, 25], 'id': 'next_level_arrow_right.png'},
			 {'cell': [281, 172, 27, 23], 'id': 'next_level_arrow_up.png'},
			 {'cell': [319, 0, 56, 56], 'id': 'tile_2.png'},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''},
			 {'cell': [281, 172, 27, 23], 'id': ''}
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