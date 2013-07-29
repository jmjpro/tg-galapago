BlobCollection.FONT_SIZE = '20px';
BlobCollection.FONT_NAME = 'JungleFever';
BlobCollection.FONT_COLOR = 'rgb(255,255,255)';
BlobCollection.COLLECTION_Y = 632;
BlobCollection.COUNT_HEIGHT = 30;
/*
BlobCollection.ITEM_WIDTH = 47;
BlobCollection.ITEM_HEIGHT = 47;
*/
BlobCollection.ITEM_SPACE = 12;
BlobCollection.MAX_ITEMS = 10;
//BlobCollection.ITEM_COUNT_X_OFFSET= 25;
BlobCollection.LEFT_OFFSET= -50;


function BlobCollection(){
	BlobCollection.ITEM_WIDTH = Board.TILE_WIDTH;
	BlobCollection.ITEM_HEIGHT = Board.TILE_HEIGHT;
	BlobCollection.ITEM_COUNT_X_OFFSET = BlobCollection.ITEM_WIDTH/2 - 5;
	this.blobCollection = {};
	this.blobItemsCount=0;
	this.canvas = $('#layer-collection-key');
	this.layer = this.canvas[0].getContext('2d');
}

BlobCollection.prototype.initImages= function(imageArray) {
	var imageId, blobCollection = this;
	_.each(imageArray, function(image) {
		imageId = image.id;
		blobCollection[imageId] = image;
	});
};

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
};

BlobCollection.prototype.removeBlobItem= function(tile) {
	var key = tile.blob.image.id;
	if (key in this.blobCollection) {
		var count = this.blobCollection[key].count;
		count -- ;
		this.blobCollection[key].count = count;
		this.blobItemsCount--;
	}
};

BlobCollection.prototype.display= function(skipDrawingImage) {
	var numberOfImages, count, layer, left, key, image, x, blobItemCount;
	numberOfImages = Math.min(_.size(this.blobCollection), BlobCollection.MAX_ITEMS) + 2;
	count = 0;
	x = 0;
	layer = this.layer;
	this.canvas[0].width = (BlobCollection.ITEM_WIDTH * numberOfImages) + (BlobCollection.ITEM_SPACE * (numberOfImages-1));
	this.canvas[0].height = BlobCollection.COUNT_HEIGHT + this.Bracket_Right.height;
	left = (LoadingScreen.STAGE_WIDTH / 2) - (this.canvas[0].width / 2);
	this.canvas.css('left', left + 'px');
	this.canvas.css('top', BlobCollection.COLLECTION_Y + 'px');

	//x += BlobCollection.LEFT_OFFSET;
	if(!skipDrawingImage){
		layer.drawImage(this.Bracket_Left, 0, BlobCollection.COUNT_HEIGHT, this.Bracket_Left.width, this.Bracket_Left.height);
	}
	for(key in this.blobCollection){
		image = this.blobCollection[key].image;
		if(count==BlobCollection.MAX_ITEMS){
			break;
		}
		blobItemCount = this.blobCollection[key].count;
		x += BlobCollection.ITEM_WIDTH + BlobCollection.ITEM_SPACE;
		layer.clearRect(x + BlobCollection.ITEM_COUNT_X_OFFSET, 0, BlobCollection.ITEM_WIDTH, BlobCollection.ITEM_WIDTH);
		if(!skipDrawingImage){
			layer.drawImage(image, x, BlobCollection.COUNT_HEIGHT, BlobCollection.ITEM_WIDTH, BlobCollection.ITEM_HEIGHT);
		}
		if(blobItemCount > 0){
			layer.textBaseline = 'top';
			layer.font = BlobCollection.FONT_SIZE + ' ' + BlobCollection.FONT_NAME;
			layer.fillStyle = BlobCollection.FONT_COLOR;
			layer.fillText(blobItemCount, x + BlobCollection.ITEM_COUNT_X_OFFSET, 0);
		}
		else{
			layer.drawImage(this.item_collected_mark, x + BlobCollection.ITEM_COUNT_X_OFFSET, 0, BlobCollection.ITEM_WIDTH/2, BlobCollection.ITEM_HEIGHT/2);
		}
		count ++;
	}
	x += BlobCollection.ITEM_WIDTH + BlobCollection.ITEM_SPACE;
	if(!skipDrawingImage){
		layer.drawImage(this.Bracket_Right, x, BlobCollection.COUNT_HEIGHT, this.Bracket_Right.width, this.Bracket_Right.height);
	}
};

BlobCollection.prototype.isEmpty= function() {
  if(this.blobItemsCount === 0){
		return true;
	}
};

BlobCollection.prototype.removeBlobItems= function(tiles) {
	var blobCollection = this;
	_.each(tiles,function(tile){
		blobCollection.removeBlobItem(tile);
	});
	blobCollection.display(false);
};

function BlobItem(image, count){
	this.image = image;
	this.count = count;
}