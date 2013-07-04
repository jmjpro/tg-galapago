"use strict";

ScreenLoader.STAGE_WIDTH = 1280;
ScreenLoader.STAGE_HEIGHT = 720;
ScreenLoader.LAYER_MAP = 'layer-map';
ScreenLoader.BACKGROUND_PATH_PREFIX = 'res/img/loading-screen/';
ScreenLoader.BACKGROUND_PATH_SUFFIX = '.jpg)';

ScreenLoader.mapScreenImageNames = {
	button_cursor_map: "button_cursor_map.png",
	button_menu_map: "button_menu_map.png",
	button_play_map: "button_play_map.png",
	button_quit_map: "button_quit_map.png",
	button_reset_map: "button_reset_map.png",
	button_start_map: "button_start_map.png",
	green_v:"green_v.png",
	level_stars_gold:"level_stars_gold.png",
	level_stars_silver:"level_stars_silver.png",
	level_lock:"level_lock.png",
};

ScreenLoader.PROGRESS_BAR_IMAGE_DIRECTORY='res/img/loading-screen/';
ScreenLoader.MAP_SCREEN_IMAGE_DIRECTORY='res/img/map-screen/';

function ScreenLoader() {
}

ScreenLoader.init = function(gameMode) {
	this.canvas = $('#' + ScreenLoader.LAYER_MAP)[0];
	this.layer = this.canvas.getContext('2d');
	this.gal = new GameAssetLoader('js/loadingScreen.manifest');
	this.layer.clearRect( 0, 0, ScreenLoader.STAGE_WIDTH, ScreenLoader.STAGE_HEIGHT);
		this.canvas.style.background = 'url(' + ScreenLoader.BACKGROUND_PATH_PREFIX + 'background-loading' + ScreenLoader.BACKGROUND_PATH_SUFFIX;
	//this.canvas.style.zIndex = 0;
	this.canvas.width = ScreenLoader.STAGE_WIDTH;
	this.canvas.height = ScreenLoader.STAGE_HEIGHT;	
	this.gameMode=gameMode;
	this.registerEvent();
	this.gal.init(function() {
		ScreenLoader.gal.download('loadingScreen');
	});
	
	
	
	//console.log( 'gameMode: ' + Galapago.gameMode );	
};

ScreenLoader.registerEvent = function(){
	var screenLoader = this;
	this.gal.onLoaded('loadingScreen', function(result) {
		if (result.success) {
		    screenLoader.progressBar = new ProgressBar(screenLoader.layer,screenLoader.gameMode);
			screenLoader.gal.download('Map Screen and Level 1');	           			
		}
	});
	this.gal.onProgress("Map Screen and Level 1", function(progress) { 
		 var percentage = progress.current/progress.total ;
		 screenLoader.progressBar.progress(percentage);
	});
	this.gal.onLoaded('Map Screen and Level 1', function(result) {
		if (result.success) {
			 screenLoader.progressBar.loaded(result);
			 ScreenLoader.gal.download('allLevels');	  
		}
	});
	this.gal.onLoaded('allLevels', function(result) {
		if (result.success) {
			//alert("loaded");
			console.debug('allLevels content loaded');	  
		}
	});
}

/// progress bar
ProgressBar.LAYER_DANGER_BAR = 'layer-danger-bar';
ProgressBar.PROGRESS_BAR_Width = 475;
ProgressBar.LEFT = 410;
ProgressBar.TOP = 530;
ProgressBar.LOADING_MESSAGE_TOP = 565;
ProgressBar.LOADING_MESSAGE_LEFT =555;
ProgressBar.CLICK_MESSAGE_LEFT =415;

function ProgressBar(layerBackground,gameMode){
	this.layerBackground = layerBackground;	
	this.canvas = $('#' + ProgressBar.LAYER_DANGER_BAR)[0];
	this.canvas.style.zIndex = 10;
	this.canvas.width=ScreenLoader.STAGE_WIDTH;
	this.canvas.height=ScreenLoader.STAGE_HEIGHT;
	this.layer = this.canvas.getContext('2d');
	//this.loadImages(imageSource,this.drawImages);
	this.drawImages();
	this.isLoadingComplete = false;
	this.registerEventHandlers(gameMode);
	this.canvas.focus();
}

/*ProgressBar.prototype.loadImages = function (sources, callback) {
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
}*/

ProgressBar.prototype.drawImages = function(progressBar,images) {
		//progressBar.images=images;
	var loadingprogressbar = ScreenLoader.gal.get("loading-screen/loading-progress-bar.png");
	var loadingprogressbarleftcap = ScreenLoader.gal.get("loading-screen/loading-progress-bar-left-cap.png");
	this.layerBackground.drawImage( loadingprogressbar, ProgressBar.LEFT, ProgressBar.TOP, loadingprogressbar.width, loadingprogressbar.height );
	
	this.layer.font = '32pt JungleFever';
	this.layer.fillStyle = 'white';
	this.layer.fillText(i18n.t('Loading Screen.Instruction Text'),ProgressBar.LOADING_MESSAGE_LEFT, ProgressBar.LOADING_MESSAGE_TOP );
	this.layer.drawImage(loadingprogressbarleftcap,ProgressBar.LEFT, ProgressBar.TOP,loadingprogressbarleftcap.width,loadingprogressbarleftcap.height);
	this.showCopywrite();
}; //DangerBar.prototype.drawImages()

ProgressBar.prototype.progress = function(percentdownload) {
	var loadingprogressbar = ScreenLoader.gal.get("loading-screen/loading-progress-bar.png");	 
	var newWidth=  ProgressBar.PROGRESS_BAR_Width*percentdownload;
	var loadingprogressbarleftcap = ScreenLoader.gal.get("loading-screen/loading-progress-bar-left-cap.png");
	var loadingprogressbarfill =ScreenLoader.gal.get("loading-screen/loading-progress-bar-fill.png");
	this.layer.clearRect(ProgressBar.LEFT, ProgressBar.TOP, loadingprogressbar.width, loadingprogressbar.height);
	this.layer.drawImage(loadingprogressbarleftcap,ProgressBar.LEFT, ProgressBar.TOP,loadingprogressbarleftcap.width,loadingprogressbarleftcap.height);	
	this.layer.drawImage(loadingprogressbarfill,415, ProgressBar.TOP,newWidth,loadingprogressbarfill.height);
	this.layer.font = '32pt JungleFever';
	this.layer.fillStyle = 'white';
	this.layer.fillText(i18n.t('Loading Screen.Instruction Text'), ProgressBar.LOADING_MESSAGE_LEFT, ProgressBar.LOADING_MESSAGE_TOP);
	
	//this.showCopywrite();
	
	//alert((percentdownload*100)+"% ldccccdvvm..");
};


ProgressBar.prototype.loaded = function(result) {	
	var loadingprogressbarleftcap = ScreenLoader.gal.get("loading-screen/loading-progress-bar-left-cap.png");
	var loadingprogressbarfill =ScreenLoader.gal.get("loading-screen/loading-progress-bar-fill.png"); 
	//this.layer.clearRect(0,0,ScreenLoader.STAGE_WIDTH,ScreenLoader.STAGE_HEIGHT);	
	this.layer.drawImage(loadingprogressbarleftcap,ProgressBar.LEFT, ProgressBar.TOP,loadingprogressbarleftcap.width,loadingprogressbarleftcap.height);	
	this.layer.drawImage(loadingprogressbarfill,415, ProgressBar.TOP,ProgressBar.PROGRESS_BAR_Width,loadingprogressbarfill.height);
	this.layer.font = '32pt JungleFever';
	this.layer.fillStyle = 'white';
	this.layer.fillText(i18n.t('Loading Screen.Hot Spots'), ProgressBar.CLICK_MESSAGE_LEFT, ProgressBar.LOADING_MESSAGE_TOP);	
	//this.showCopywrite();
	this.isLoadingComplete=true;
	//this.results=result;
};

ProgressBar.prototype.showCopywrite =function(){
	this.layer.font='13pt ArialBold'
	this.layer.fillStyle = 'white';
	this.layer.fillText('I-play is a trademark and trading name of Oberon Media,Inc. and its subsidiaries. 2008 Oberon Media.All Rights Reserved.', 320, 650);
	this.layer.fillText('2013 TransGaming Interactive Corp. All RIGHTS RESERVED. ', 440, 665);
}

ProgressBar.prototype.registerEventHandlers = function(gameMode) {
var progressBar = this;
this.canvas.onkeydown = function(evt) {
		switch( evt.keyCode ) {
			case 13: // enter
				 if(progressBar.isLoadingComplete){
					progressBar.layer.clearRect(0,0,ScreenLoader.STAGE_WIDTH,ScreenLoader.STAGE_HEIGHT);
					progressBar.canvas.onkeydown=null;
					progressBar.canvas.style.zIndex = 5;
				   //alert();
				    Galapago.init(gameMode);
				 }
				break;
		}
	};
}
