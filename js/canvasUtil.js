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