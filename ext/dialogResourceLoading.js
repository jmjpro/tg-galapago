DialogResourceLoading.DIALOG_SHOW_WAIT_MS = 2000;
DialogResourceLoading.LOADING_ANIMATION_MS = 300;
function DialogResourceLoading(parentElementSelector){
	this.levelLoaded = false;
	this.inerval = null;
	this.div = $("#div-level-loading");
	this.screenGameDiv = $(parentElementSelector); 
	this.init();
}

DialogResourceLoading.prototype.init = function(){
	var resourceLoadingDialog = this;
	setTimeout(function(){
		if(!resourceLoadingDialog.levelLoaded){
			resourceLoadingDialog.screenGameDiv.addClass("blur");
			resourceLoadingDialog.div.show();
			resourceLoadingDialog.animate();
		}
	}, DialogResourceLoading.DIALOG_SHOW_WAIT_MS);	
};

DialogResourceLoading.prototype.animate = function(){
	var resourceLoadingDialog, cycleId, cnt, text; 
	resourceLoadingDialog = this;
	cycleId = 1;
	resourceLoadingDialog.interval = setInterval(function(){
		text = "LOADING";
		for(cnt=0; cnt<cycleId; cnt++){
			text+= ".";
		}
		resourceLoadingDialog.div.html(text);
		cycleId++;
		if(cycleId > 3){
			cycleId = 1;
		}
	}, DialogResourceLoading.LOADING_ANIMATION_MS);
};

DialogResourceLoading.prototype.onResourceLoad = function(){
	this.levelLoaded = true;
	clearInterval(this.interval);
	this.screenGameDiv.removeClass("blur");
	this.div.hide();
};