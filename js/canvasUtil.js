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
	var cw = image.width, ch = image.height, cx = 0, cy = 0;

	//   Calculate new canvas size and x/y coorditates for image
	switch(degrees){
	    case CanvasUtil.LEFT_DIRECTION_DEGREE:
	        cw = image.height;
	        ch = image.width;
	        cy = image.height * (-1);
	        break;
	    case CanvasUtil.UP_DIRECTION_DEGREE:
	        cx = image.width * (-1);
	        cy = image.height * (-1);
	        break;
	    case CanvasUtil.RIGHT_DIRECTION_DEGREE:
	        cw = image.height;
	        ch = image.width;
	        cx = image.width * (-1);
	        break;
	}

	//  Rotate image            
	canvas.width = cw;
	canvas.height = ch;
	ctx.rotate(degrees * Math.PI / 180);
	ctx.drawImage(image, cx, cy);   
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
	img.width *= factor;
	img.height *= factor;
	return img;
}; //CanvasUtil.magnifyImage()