"use strict";

ScreenLoader.STAGE_WIDTH = 1280;
ScreenLoader.STAGE_HEIGHT = 720;
ScreenLoader.LAYER_MAP = 'layer-map';
ScreenLoader.BACKGROUND_PATH_PREFIX = 'res/img/loading-screen/';
ScreenLoader.BACKGROUND_PATH_SUFFIX = '.jpg)';
ScreenLoader.progressBarImageNames = {
      loadingprogressbar:"loading-progress-bar.png",
	  loadingprogressbarfill:"loading-progress-bar-fill.png",
	  loadingprogressbarleftcap:"loading-progress-bar-left-cap.png"
};

ScreenLoader.PROGRESS_BAR_IMAGE_DIRECTORY='res/img/loading-screen/'
function ScreenLoader() {
}

ScreenLoader.init = function(gameMode) {
	this.canvas = $('#' + ScreenLoader.LAYER_MAP)[0];
	this.layer = this.canvas.getContext('2d');
	this.gal = new GameAssetLoader('js/loadingScreen.manifest');
	this.layer.clearRect( 0, 0, ScreenLoader.STAGE_WIDTH, ScreenLoader.STAGE_HEIGHT);
    this.canvas.style.background = 'url(' + ScreenLoader.BACKGROUND_PATH_PREFIX + 'background-loading' + ScreenLoader.BACKGROUND_PATH_SUFFIX;
	this.canvas.style.zIndex = 0;
	this.canvas.width = ScreenLoader.STAGE_WIDTH;
	this.canvas.height = ScreenLoader.STAGE_HEIGHT;	
	this.registerEvent();
	this.gal.init(function() {
		ScreenLoader.gal.download('Map Screen and Level 1');
	});
	
	this.progressBar = new ProgressBar(this.layer, ScreenLoader.progressBarImageNames,gameMode);
	
	//console.log( 'gameMode: ' + Galapago.gameMode );	
};

ScreenLoader.registerEvent = function(){
    var screenLoader = this;
	this.gal.onProgress("Map Screen and Level 1", function(progress) { 
	   var percentage = progress.current/progress.total ;
	   screenLoader.progressBar.progress(percentage);
	});
	this.gal.onLoaded('Map Screen and Level 1', function(result) {
	  if (result.success) {
	     screenLoader.progressBar.loaded(result);	  
	  }
	});
}

/// progress bar
ProgressBar.LAYER_DANGER_BAR = 'layer-danger-bar';
ProgressBar.PROGRESS_BAR_Width = 475;
ProgressBar.LEFT = 410;
ProgressBar.TOP = 530;
ProgressBar.LOADING_MESSAGE_TOP = 555;
ProgressBar.LOADING_MESSAGE_LEFT =575;
ProgressBar.CLICK_MESSAGE_LEFT =520;

function ProgressBar(layerBackground, imageSource,gameMode){
	this.layerBackground = layerBackground;	
	this.canvas = $('#' + ProgressBar.LAYER_DANGER_BAR)[0];
	this.canvas.width=ScreenLoader.STAGE_WIDTH;
	this.canvas.height=ScreenLoader.STAGE_HEIGHT;
	this.layer = this.canvas.getContext('2d');
	this.loadImages(imageSource,this.drawImages);
	this.isLoadingComplete = false;
	this.registerEventHandlers(gameMode);
}

ProgressBar.prototype.loadImages = function (sources, callback) {
        var progressBar= this;
        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        // get num of sources
        for(var src in sources) {
          numImages++;
        }
        for(var src in sources) {
          images[src] = new Image();
          images[src].onload = function() {
            if(++loadedImages >= numImages) {
              callback(progressBar,images);
            }
          };
          images[src].src = ScreenLoader.PROGRESS_BAR_IMAGE_DIRECTORY+sources[src];
        }
      }

ProgressBar.prototype.drawImages = function(progressBar,images) {
    progressBar.images=images;
	progressBar.layerBackground.drawImage( images.loadingprogressbar, ProgressBar.LEFT, ProgressBar.TOP, images.loadingprogressbar.width, images.loadingprogressbar.height );
	
	progressBar.layer.font = 'italic 20pt Calibri';
	progressBar.layer.fillStyle = 'white';
	progressBar.layer.fillText('LOADING...',ProgressBar.LOADING_MESSAGE_LEFT, ProgressBar.LOADING_MESSAGE_TOP );
	progressBar.layer.drawImage(images.loadingprogressbarleftcap,ProgressBar.LEFT, ProgressBar.TOP,images.loadingprogressbarleftcap.width,images.loadingprogressbarleftcap.height);
    progressBar.showCopywrite(progressBar.layer);
}; //DangerBar.prototype.drawImages()

ProgressBar.prototype.progress = function(percentdownload) {
     
	var newWidth=  ProgressBar.PROGRESS_BAR_Width*percentdownload;
	this.layer.clearRect(0,0,ScreenLoader.STAGE_WIDTH,ScreenLoader.STAGE_HEIGHT);
	this.layer.drawImage(this.images.loadingprogressbarleftcap,ProgressBar.LEFT, ProgressBar.TOP,this.images.loadingprogressbarleftcap.width,this.images.loadingprogressbarleftcap.height);	
	this.layer.drawImage(this.images.loadingprogressbarfill,415, ProgressBar.TOP,newWidth,this.images.loadingprogressbarfill.height);
	this.layer.font = 'italic 20pt Calibri';
	this.layer.fillStyle = 'white';
	this.layer.fillText('LOADING...', ProgressBar.LOADING_MESSAGE_LEFT, ProgressBar.LOADING_MESSAGE_TOP);
	this.showCopywrite(this.layer);
	
	//alert((percentdownload*100)+"% ldccccdvvm..");
};


ProgressBar.prototype.loaded = function(result) {	 
	this.layer.clearRect(0,0,ScreenLoader.STAGE_WIDTH,ScreenLoader.STAGE_HEIGHT);
	this.layer.drawImage(this.images.loadingprogressbarleftcap,ProgressBar.LEFT, ProgressBar.TOP,this.images.loadingprogressbarleftcap.width,this.images.loadingprogressbarleftcap.height);	
	this.layer.drawImage(this.images.loadingprogressbarfill,415, ProgressBar.TOP,ProgressBar.PROGRESS_BAR_Width,this.images.loadingprogressbarfill.height);
	this.layer.font = 'italic 20pt Calibri';
	this.layer.fillStyle = 'white';
	this.layer.fillText('CLICK HERE TO PLAY', ProgressBar.CLICK_MESSAGE_LEFT, ProgressBar.LOADING_MESSAGE_TOP);	
    this.showCopywrite(this.layer);
	this.isLoadingComplete=true;
	//this.results=result;
};

ProgressBar.prototype.showCopywrite =function(context){
    context.font='italic 9pt Calibri'
    context.fillStyle = 'white';
	context.fillText('I-play is a trademark and trading name of Oberon Media,Inc. and its subsidiaries. 2008 Oberon Media.All Rights Reserved.', 320, 650);
	context.fillText('2013 TransGaming Interactive Corp. All RIGHTS RESERVED. ', 440, 665);
}

ProgressBar.prototype.registerEventHandlers = function(gameMode) {
var progressBar = this;
window.onkeydown = function(evt) {
		switch( evt.keyCode ) {
			case 13: // enter
			   if(progressBar.isLoadingComplete){
			    progressBar.layer.clearRect(0,0,ScreenLoader.STAGE_WIDTH,ScreenLoader.STAGE_HEIGHT);
				//alert();
				Galapago.init(gameMode);
				}
				break;
		}
	};
}
