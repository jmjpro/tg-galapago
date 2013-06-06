Collection.FONT_SIZE = '20px';
Collection.FONT_NAME = 'Calibri';
Collection.ITEM_X = 200;
Collection.ITEM_Y = 650;
Collection.ITEM_WIDTH = 47;
Collection.ITEM_HEIGHT = 47;
Collection.ITEM_SPACE = 20;
Collection.MAX_ITEMS = 10;

function Collection(gridLayer){
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
	var count = 0;
	var x = Collection.ITEM_X;
	var layer = this.gridLayer;
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
		x = Collection.ITEM_X + ((Collection.ITEM_WIDTH + Collection.ITEM_SPACE) * (count + 1));
		textColor = 'blue';
		layer.clearRect(x + (Collection.ITEM_WIDTH - 20), Collection.ITEM_Y - 15 , 50, 50);
		if(!skipDrawingImage){
			layer.drawImage(image, x, Collection.ITEM_Y, Collection.ITEM_WIDTH, Collection.ITEM_HEIGHT);
		}
		layer.font = Collection.FONT_SIZE + ' ' + Collection.FONT_NAME;
		layer.fillStyle = textColor;
		layer.fillText(itemCount, x + (Collection.ITEM_WIDTH - 20), Collection.ITEM_Y + 5);
		count ++;
	}
	x = Collection.ITEM_X + ((Collection.ITEM_WIDTH + Collection.ITEM_SPACE) * (count + 1));
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