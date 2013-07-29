"use strict";

LoadingScreen.STAGE_WIDTH = 1280;
LoadingScreen.STAGE_HEIGHT = 720;
LoadingScreen.BACKGROUND_PATH_PREFIX = 'res/img/screen-loading/';
LoadingScreen.BACKGROUND_PATH_SUFFIX = '.jpg)';

LoadingScreen.mapScreenImageNames = {
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

LoadingScreen.PROGRESS_BAR_IMAGE_DIRECTORY='res/img/screen-loading/';
LoadingScreen.MAP_SCREEN_IMAGE_DIRECTORY='res/img/screen-map/';

function LoadingScreen() {
}

LoadingScreen.init = function() {
	sdkApi.reportPageView(TGH5.Reporting.Page.Loading);
	LoadingScreen.localization();
	this.gal = new GameAssetLoader('js/loadingScreen.manifest');
	this.screenDiv = $('#screen-loading');
	this.screenDiv.width = LoadingScreen.STAGE_WIDTH;
	this.screenDiv.height = LoadingScreen.STAGE_HEIGHT;	
	this.screenDiv.show();
	this.registerEvent();
	this.gal.init(function() {
		LoadingScreen.gal.download('screen-loading');
	});
};

LoadingScreen.registerEvent = function(){
	var LoadingScreen = this;
	this.gal.onLoaded('screen-loading', function(result) {
		if (result.success) {
			LoadingScreen.screenDiv.css( 'background-image','url(' + LoadingScreen.gal.get('screen-loading/background-loading.jpg').src + ')' );
			LoadingScreen.gal.download('screen-main-menu and screen-map');
		}
	});
	this.gal.onLoaded('screen-main-menu and screen-map', function(result) {
		if (result.success) {
			console.debug('screen-main-menu and screen-map resources loaded');
			LoadingScreen.gal.download('dialogs');
		}
	});
	this.gal.onLoaded('dialogs', function(result) {
		if (result.success) {
			console.debug('dialogs resources loaded');
			LoadingScreen.gal.download('screen-game');
			LoadingScreen.progressBar = new ProgressBar(LoadingScreen.screenDiv);
		}
	});
	this.gal.onProgress("screen-game", function(progress) { 
		var percentage = progress.current/progress.total ;
		LoadingScreen.progressBar.progress(percentage);
		console.debug(Math.round(percentage * 100,3) + ' % loaded');
	});
	this.gal.onLoaded('screen-game', function(result) {
		if (result.success) {
			console.debug('screen-game resources loaded');
			LoadingScreen.progressBar.loaded(result);
			setTimeout( function() {
				/*LoadingScreen.progressBar.layer.clearRect(0,0,LoadingScreen.STAGE_WIDTH,LoadingScreen.STAGE_HEIGHT);
				LoadingScreen.progressBar.canvas.onkeydown=null;*/
				MainMenuScreen.init('screen-loading', LoadingScreen.progressBar);
			}, 1000 );
		}
	});
}

LoadingScreen.localization = function(){
    $("#option-continue-playing").i18n();
    $("#option-main-menu").i18n();
    $("#option-new-game").i18n();
    $("#option-how-to-play").i18n();
    $("#option-options").i18n();
    $("#dialog-title").i18n();
    $("#dialog-leaderboards").i18n();
}

/// progress bar
ProgressBar.WIDTH = 475;
ProgressBar.LEFT = 410;
ProgressBar.TOP = 530;
ProgressBar.MESSAGE_TOP = 560;
ProgressBar.LOADING_MESSAGE_LEFT =575;
ProgressBar.CLICK_MESSAGE_LEFT = 515;

function ProgressBar(backgroundLayer){
	this.backgroundLayer = backgroundLayer;
	this.backgroundLayer.focus();
	this.loadingProgressBar = LoadingScreen.gal.get("screen-loading/loading-progress-bar.png");
	this.loadingProgressBarLeftCap = LoadingScreen.gal.get("screen-loading/loading-progress-bar-left-cap.png");
	this.loadingProgressBarFill =LoadingScreen.gal.get("screen-loading/loading-progress-bar-fill.png");
	this.canvas = $('#layer-progress-bar')[0];
	this.canvas.width = ProgressBar.WIDTH;
	this.canvas.height = this.loadingProgressBar.height;
	this.canvas.style.left = ProgressBar.LEFT + 'px';
	this.canvas.style.top = ProgressBar.TOP + 'px';
	console.debug( document.activeElement + ' has focus');
	this.layer = this.canvas.getContext('2d');
	this.layer.textBaseline = 'top';
	this.layer.fillStyle = 'rgb(255,255,255)';
	this.drawImages();
	this.isLoadingComplete = false;
	this.registerEventHandlers();
	/*this.canvas.focus();*/
}

ProgressBar.prototype.drawImages = function(progressBar,images) {
	this.layer.drawImage( this.loadingProgressBar, 0, 0, this.loadingProgressBar.width, this.loadingProgressBar.height );	
	this.layer.font = '27pt HelveticaBold';
	this.layer.fillText(i18n.t('Loading Screen.Instruction Text'),ProgressBar.LOADING_MESSAGE_LEFT, ProgressBar.MESSAGE_TOP );
	this.layer.drawImage(this.loadingProgressBarLeftCap, 0, 0, this.loadingProgressBarLeftCap.width, this.loadingProgressBarLeftCap.height);
	this.showCopywrite();
}; //DangerBar.prototype.drawImages()

ProgressBar.prototype.progress = function(percentdownload) {
	var newWidth=  ProgressBar.WIDTH * percentdownload;
	this.layer.clearRect(0, 0, this.loadingProgressBar.width, this.loadingProgressBar.height);
	this.layer.drawImage(this.loadingProgressBarLeftCap, 0, 0, this.loadingProgressBarLeftCap.width,this.loadingProgressBarLeftCap.height);	
	this.layer.drawImage(this.loadingProgressBarFill, this.loadingProgressBarLeftCap.width, 0, newWidth,this.loadingProgressBarFill.height);
	this.layer.font = '27pt HelveticaBold';
	this.layer.fillText(i18n.t('Loading Screen.Instruction Text'), 0, 0);
};

ProgressBar.prototype.loaded = function(result) {	
	this.layer.clearRect(0, 0, this.loadingProgressBar.width, this.loadingProgressBar.height);
	this.layer.drawImage(this.loadingProgressBarLeftCap, 0, 0, this.loadingProgressBarLeftCap.width,this.loadingProgressBarLeftCap.height);	
	this.layer.drawImage(this.loadingProgressBarFill, this.loadingProgressBarLeftCap, 0, ProgressBar.WIDTH, this.loadingProgressBarFill.height);
	this.layer.font = '27pt HelveticaBold';
	this.layer.fillText(i18n.t('Loading Screen.Hot Spots'), 0, 0);
	this.isLoadingComplete=true;
};

ProgressBar.prototype.showCopywrite =function(){
	var copyrightChar = 169;
	this.layer.font='13pt HelveticaBold'
	this.layer.fillText('I-play is a trademark and trading name of Oberon Media,Inc. and its subsidiaries. ' + String.fromCharCode(copyrightChar) + ' 2008 Oberon Media.All Rights Reserved.', 180, 650);
	this.layer.fillText(String.fromCharCode(copyrightChar) + ' 2013 TransGaming Interactive Corp. All RIGHTS RESERVED.', 420, 665);
}

ProgressBar.prototype.registerEventHandlers = function() {
var progressBar = this;
progressBar.canvas.onkeydown = function(evt) {
		switch( evt.keyCode ) {
			case 13: // enter
				 if(progressBar.isLoadingComplete){
					progressBar.layer.clearRect(0,0,LoadingScreen.STAGE_WIDTH,LoadingScreen.STAGE_HEIGHT);
					progressBar.canvas.onkeydown=null;
					//TODO if api.inDemoMode() skip the main menu screen?
				    MainMenuScreen.init('screen-loading', progressBar);
				    evt.stopPropagation();
					evt.preventDefault();
				 }
				break;
		}
	};
}

ProgressBar.prototype.unregisterEventHandlers = function() {
	this.canvas.onkeydown = null;
}