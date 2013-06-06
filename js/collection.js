Collection.FONT_SIZE = '20px';
Collection.FONT_NAME = 'Calibri';
Collection.FONT_COLOR = 'blue';
Collection.ITEM_Y = 650;
Collection.ITEM_WIDTH = 47;
Collection.ITEM_HEIGHT = 47;
Collection.ITEM_SPACE = 20;
Collection.MAX_ITEMS = 10;
Collection.ITEM_COUNT_Y= 652;
Collection.ITEM_COUNT_X_OFFSET= 25;
Collection.LEFT_OFFSET= -50;


function Collection(gridLayer){
	Collection.ITEM_WIDTH = Tile.getWidth();
	Collection.ITEM_HEIGHT = Tile.getHeight();
	Collection.ITEM_COUNT_X_OFFSET = Collection.ITEM_WIDTH / 1.5;
	var imageId;
	this.collection = {};
	this.itemsCount=0;
	this.gridLayer= gridLayer;
}

Collection.prototype.initImages= function(imageArray) {
	var collection = this;
	_.each(imageArray, function(image) {
		imageId = image.id;
		collection[imageId] = image;
	});
}

Collection.prototype.addItem= function(tile) {
	var key = tile.blob.image.id;
	if (key in this.collection) {
   		var count = this.collection[key].count;
   		count ++ ;
   		this.collection[key].count = count;
	} else {
		var item = new Item(tile.blob.image, 1);
		this.collection[key] = item;
	}
	this.itemsCount++;
}

Collection.prototype.removeItem= function(tile) {
	var key = tile.blob.image.id;
	var count = this.collection[key].count;
	count -- ;
	this.collection[key].count = count;
	this.itemsCount--;
}

Collection.prototype.display= function(skipDrawingImage) {
	var numberOfImages = Math.min(_.size(this.collection), Collection.MAX_ITEMS) + 2;
	var count = 0;
	var layer = this.gridLayer;
	var x = (layer.canvas.width / 2) - ((Collection.ITEM_WIDTH * numberOfImages) + (Collection.ITEM_SPACE * (numberOfImages -1))) / 2 ;
	x += Collection.LEFT_OFFSET;
	if(!skipDrawingImage){
		layer.drawImage(this.Bracket_Left, x, Collection.ITEM_Y, Collection.ITEM_WIDTH, Collection.ITEM_HEIGHT);
	}
	for(var key in this.collection){
		var image = this.collection[key].image;
		if(count==Collection.MAX_ITEMS){
			break;
		}
		var textColor, layer, x;
		var itemCount = this.collection[key].count;
		x += Collection.ITEM_WIDTH + Collection.ITEM_SPACE;
		layer.clearRect(x + Collection.ITEM_COUNT_X_OFFSET, Collection.ITEM_COUNT_Y - 15, 50, 50);
		if(!skipDrawingImage){
			layer.drawImage(image, x, Collection.ITEM_Y, Collection.ITEM_WIDTH, Collection.ITEM_HEIGHT);
		}
		if(itemCount > 0){
			layer.font = Collection.FONT_SIZE + ' ' + Collection.FONT_NAME;
			layer.fillStyle = Collection.FONT_COLOR;
			layer.fillText(itemCount, x + Collection.ITEM_COUNT_X_OFFSET, Collection.ITEM_COUNT_Y);
		}
		else{
			layer.drawImage(this.item_collected_mark, x + Collection.ITEM_COUNT_X_OFFSET, Collection.ITEM_COUNT_Y -15, Collection.ITEM_WIDTH/2	, Collection.ITEM_HEIGHT/2);
		}
		count ++;
	}
	x += Collection.ITEM_WIDTH + Collection.ITEM_SPACE;
	if(!skipDrawingImage){
		layer.drawImage(this.Bracket_Right, x, Collection.ITEM_Y, Collection.ITEM_WIDTH, Collection.ITEM_HEIGHT);
	}
		
}

Collection.prototype.isEmpty= function() {
	if(this.itemsCount == 0){
		return true;
	}
}

Collection.prototype.removeItems= function(tiles) {
	var collection = this;
	_.each(tiles,function(tile){
		collection.removeItem(tile);
	});
	collection.display(false);
}

function Item(image, count){
	this.image = image;
	this.count = count;
}