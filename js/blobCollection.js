BlobCollection.FONT_SIZE = '20px';
BlobCollection.FONT_NAME = 'Calibri'; //JungleFever
BlobCollection.FONT_COLOR = 'white';
BlobCollection.ITEM_Y = 662;
BlobCollection.ITEM_WIDTH = 47;
BlobCollection.ITEM_HEIGHT = 47;
BlobCollection.ITEM_SPACE = 12;
BlobCollection.MAX_ITEMS = 10;
BlobCollection.ITEM_COUNT_Y= 652;
BlobCollection.ITEM_COUNT_X_OFFSET= 25;
BlobCollection.LEFT_OFFSET= -50;


function BlobCollection(gridLayer){
	BlobCollection.ITEM_WIDTH = Tile.getWidth();
	BlobCollection.ITEM_HEIGHT = Tile.getHeight();
	BlobCollection.ITEM_COUNT_X_OFFSET = BlobCollection.ITEM_WIDTH/2 - 5;
	var imageId;
	this.blobCollection = {};
	this.blobItemsCount=0;
	this.gridLayer= gridLayer;
}

BlobCollection.prototype.initImages= function(imageArray) {
	var blobCollection = this;
	_.each(imageArray, function(image) {
		imageId = image.id;
		blobCollection[imageId] = image;
	});
}

BlobCollection.prototype.addBlobItem= function(tile) {
	var key = tile.blob.image.id;
	if (key in this.blobCollection) {
   		var count = this.blobCollection[key].count;
   		count ++ ;
   		this.blobCollection[key].count = count;
	} else {
		var blobItem = new BlobItem(tile.blob.image, 1);
		this.blobCollection[key] = blobItem;
	}
	this.blobItemsCount++;
}

BlobCollection.prototype.removeBlobItem= function(tile) {
	var key = tile.blob.image.id;
	if (key in this.blobCollection) {
		var count = this.blobCollection[key].count;
		count -- ;
		this.blobCollection[key].count = count;
		this.blobItemsCount--;
	}
}

BlobCollection.prototype.display= function(skipDrawingImage) {
	var numberOfImages = Math.min(_.size(this.blobCollection), BlobCollection.MAX_ITEMS) + 2;
	var count = 0;
	var layer = this.gridLayer;
	var x = (layer.canvas.width / 2) - ((BlobCollection.ITEM_WIDTH * numberOfImages) + (BlobCollection.ITEM_SPACE * (numberOfImages -1))) / 2 ;
	x += BlobCollection.LEFT_OFFSET;
	if(!skipDrawingImage){
		layer.drawImage(this.Bracket_Left, x, BlobCollection.ITEM_Y, BlobCollection.ITEM_WIDTH, BlobCollection.ITEM_HEIGHT);
	}
	for(var key in this.blobCollection){
		var image = this.blobCollection[key].image;
		if(count==BlobCollection.MAX_ITEMS){
			break;
		}
		var textColor, layer, x;
		var blobItemCount = this.blobCollection[key].count;
		x += BlobCollection.ITEM_WIDTH + BlobCollection.ITEM_SPACE;
		layer.clearRect(x + BlobCollection.ITEM_COUNT_X_OFFSET, BlobCollection.ITEM_COUNT_Y - 15, 50, 50);
		if(!skipDrawingImage){
			layer.drawImage(image, x, BlobCollection.ITEM_Y, BlobCollection.ITEM_WIDTH, BlobCollection.ITEM_HEIGHT);
		}
		if(blobItemCount > 0){
			layer.font = BlobCollection.FONT_SIZE + ' ' + BlobCollection.FONT_NAME;
			layer.fillStyle = BlobCollection.FONT_COLOR;
			layer.fillText(blobItemCount, x + BlobCollection.ITEM_COUNT_X_OFFSET, BlobCollection.ITEM_COUNT_Y);
		}
		else{
			layer.drawImage(this.item_collected_mark, x + BlobCollection.ITEM_COUNT_X_OFFSET, BlobCollection.ITEM_COUNT_Y -15, BlobCollection.ITEM_WIDTH/2	, BlobCollection.ITEM_HEIGHT/2);
		}
		count ++;
	}
	x += BlobCollection.ITEM_WIDTH + BlobCollection.ITEM_SPACE;
	if(!skipDrawingImage){
		layer.drawImage(this.Bracket_Right, x, BlobCollection.ITEM_Y, BlobCollection.ITEM_WIDTH, BlobCollection.ITEM_HEIGHT);
	}
		
}

BlobCollection.prototype.isEmpty= function() {
	if(this.blobItemsCount == 0){
		return true;
	}
}

BlobCollection.prototype.removeBlobItems= function(tiles) {
	var blobCollection = this;
	_.each(tiles,function(tile){
		blobCollection.removeBlobItem(tile);
	});
	blobCollection.display(false);
}

function BlobItem(image, count){
	this.image = image;
	this.count = count;
}