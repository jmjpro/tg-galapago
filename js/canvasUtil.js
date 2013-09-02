CanvasUtil.LEFT_DIRECTION_DEGREE = 90;
CanvasUtil.RIGHT_DIRECTION_DEGREE = 270;
CanvasUtil.UP_DIRECTION_DEGREE = 180;

function CanvasUtil() {}

CanvasUtil.canvasImageRotate = function(ctx, image, width, height, x, y, degrees) {
    var widthHalf = Math.floor(width / 2);
    var heightHalf = Math.floor(height / 2);
    
    ctx.save();
    
    ctx.translate(x, y);
    ctx.translate(widthHalf, heightHalf);
    ctx.rotate((Math.PI / 180) * degrees);
    ctx.drawImage(image, -widthHalf, -heightHalf);   
}

CanvasUtil.canvasRotateImageDirection = function(canvas, ctx, image, degrees) {
	var cw = image.naturalWidth, ch = image.naturalHeight, cx = 0, cy = 0;

	//   Calculate new canvas size and x/y coorditates for image
	switch(degrees){
	    case CanvasUtil.LEFT_DIRECTION_DEGREE:
	        cw = image.naturalHeight;
	        ch = image.naturalWidth;
	        cy = image.naturalHeight * (-1);
	        break;
	    case CanvasUtil.UP_DIRECTION_DEGREE:
	        cx = image.naturalWidth * (-1);
	        cy = image.naturalHeight * (-1);
	        break;
	    case CanvasUtil.RIGHT_DIRECTION_DEGREE:
	        cw = image.naturalHeight;
	        ch = image.naturalWidth;
	        cx = image.naturalWidth * (-1);
	        break;
	}

	//  Rotate image            
	canvas.width = cw;
	canvas.height = ch;
	ctx.rotate(degrees * Math.PI / 180);
	ctx.drawImage(image, cx, cy);   
};

CanvasUtil.getTempCanvas = function() {
	var canvas;
	canvas = document.createElement("canvas");
	canvas.style.display = 'none';
	canvas.style.position = 'absolute';
	canvas.style.left = '-1000px';
	canvas.style.top = '-1000px';
	canvas.width = 1;
	canvas.height = 1;
	return canvas;
}; //CanvasUtil.getTempCanvas()

//assumes all images are same dimensions
CanvasUtil.rotateImages = function(images, degrees) {
	var image, imagesRotated, imageRotated, canvas, ctx, cw, ch, cx, cy;
	image = images[0];
	imagesRotated = [];
	canvas = CanvasUtil.getTempCanvas();
	ctx = canvas.getContext('2d');
	for( i = 0; i < images.length; i++ ) {
		image = images[i];
		imagesRotated.push( CanvasUtil.rotateImage( image, degrees, ctx ) );
	}
	return imagesRotated;
}; //CanvasUtil.rotateImages()

CanvasUtil.rotateImage = function( image, degrees, ctx  ) {
	var canvas, imageRotated, cw, ch, cx, cy;
	if( !ctx ) {
		ctx = CanvasUtil.getTempCanvas().getContext('2d');
	}
	canvas = ctx.canvas;
	cw = image.naturalWidth;
	ch = image.naturalHeight;
	cx = 0;
	cy = 0;

	//   Calculate new canvas size and x/y coorditates for image
	switch(degrees){
	    case CanvasUtil.LEFT_DIRECTION_DEGREE:
	        cw = image.naturalHeight;
	        ch = image.naturalWidth;
	        cy = image.naturalHeight * (-1);
	        break;
	    case CanvasUtil.UP_DIRECTION_DEGREE:
	        cx = image.naturalWidth * (-1);
	        cy = image.naturalHeight * (-1);
	        break;
	    case CanvasUtil.RIGHT_DIRECTION_DEGREE:
	        cw = image.naturalHeight;
	        ch = image.naturalWidth;
	        cx = image.naturalWidth * (-1);
	        break;
	}

	//  Rotate image
	canvas.width = cw;
	canvas.height = ch;
	ctx.rotate(degrees * Math.PI / 180);
	ctx.clearRect(cx,cy,image.naturalWidth,image.naturalHeight);
	ctx.drawImage(image, cx, cy);
	imageRotated = new Image();
	imageRotated.src = canvas.toDataURL('image/png');
	return imageRotated;
};

// Code taken from MatthewCrumley (http://stackoverflow.com/a/934925/298479)
CanvasUtil.getBase64Image = function(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL;
}; //CanvasUtil.getBase64Image()

CanvasUtil.magnifyImage = function( img, factor ) {
	img.width = img.naturalWidth * factor;
	img.height = img.naturalHeight * factor;
	return img;
}; //CanvasUtil.magnifyImage()