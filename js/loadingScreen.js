"use strict";

LoadingScreen.STAGE_WIDTH = 1280;
LoadingScreen.STAGE_HEIGHT = 720;
LoadingScreen.BACKGROUND_PATH_PREFIX = 'res/img/screen-loading/';
LoadingScreen.BACKGROUND_PATH_SUFFIX = '.jpg)';
LoadingScreen.DIALOG_IDS = ['option-continue-playing', 'option-main-menu', 'option-new-game', 'option-how-to-play', 'option-options', 'dialog-title', 'dialog-leaderboards'];

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
			console.debug('screen-loading resource bundle loaded');
			LoadingScreen.screenDiv.css( 'background-image','url(' + LoadingScreen.gal.get('screen-loading/background-loading.jpg').src + ')' );
			LoadingScreen.gal.download('all-but-audio');
			LoadingScreen.progressBar = new ProgressBar();
		}
	});
	this.gal.onProgress("all-but-audio", function(progress) { 
		var percentage = progress.current/progress.total ;
		LoadingScreen.progressBar.progress(percentage);
		//console.debug(Math.round(percentage * 100,3) + ' % loaded');
	});
	this.gal.onLoaded('all-but-audio', function(result) {
		if (result.success) {
			console.debug('all-but-audio resource bundle loaded');
			LoadingScreen.progressBar.loaded();
			/*setTimeout( function() {*/
				/*LoadingScreen.progressBar.layer.clearRect(0,0,LoadingScreen.STAGE_WIDTH,LoadingScreen.STAGE_HEIGHT);
				LoadingScreen.progressBar.canvas.onkeydown=null;*/
				//MainMenuScreen.init('screen-loading', LoadingScreen.progressBar);
			/*}, 1000 );*/
		}
	});
};

LoadingScreen.hide = function(evt) {
	//TODO if api.inDemoMode() skip the main menu screen?
	LoadingScreen.progressBar.unregisterEventHandlers();
	if( evt ) {
		evt.stopPropagation();
		evt.preventDefault();		
	}
	this.screenDiv.hide();
	MainMenuScreen.init('screen-loading', progressBar);
}; //LoadingScreen.hide

LoadingScreen.localization = function(){
	_.each( LoadingScreen.DIALOG_IDS, function ( dialogId ) {
		$('#' + dialogId).i18n();
	});
}; //LoadingScreen.localization
/// end LoadingScreen class

/// progress bar
ProgressBar.WIDTH = 475;
ProgressBar.LEFT = 410;
ProgressBar.TOP = 530;
ProgressBar.MESSAGE_TOP = 40;
ProgressBar.LOADING_MESSAGE_LEFT =575;
ProgressBar.CLICK_MESSAGE_LEFT = 515;

function ProgressBar(){
	this.loadingProgressBar = LoadingScreen.gal.get("screen-loading/loading-progress-bar.png");
	this.loadingProgressBarLeftCap = LoadingScreen.gal.get("screen-loading/loading-progress-bar-left-cap.png");
	this.loadingProgressBarFill =LoadingScreen.gal.get("screen-loading/loading-progress-bar-fill.png");
	this.canvas = $('#layer-progress-bar')[0];
	this.canvas.focus();
	this.canvas.width = ProgressBar.WIDTH;
	this.canvas.height = this.loadingProgressBar.height;
	this.canvas.style.left = ProgressBar.LEFT + 'px';
	this.canvas.style.top = ProgressBar.TOP + 'px';
	this.layer = this.canvas.getContext('2d');
	this.layer.textBaseline = 'bottom';
	this.layer.fillStyle = 'rgb(255,255,255)';
	this.drawImages();
	this.isLoadingComplete = false;
	this.registerEventHandlers();
	/*this.canvas.focus();*/
}

ProgressBar.prototype.drawImages = function() {
	this.layer.drawImage( this.loadingProgressBar, 0, 0, this.loadingProgressBar.width, this.loadingProgressBar.height );
	this.layer.textAlign = 'center';
	this.layer.textBaseline = 'bottom';
	this.layer.font = '27pt HelveticaBold';
	this.layer.fillText(i18n.t('Loading Screen.Instruction Text'), ProgressBar.WIDTH/2, ProgressBar.MESSAGE_TOP );
	this.layer.drawImage(this.loadingProgressBarLeftCap, 0, 0, this.loadingProgressBarLeftCap.width, this.loadingProgressBarLeftCap.height);
}; //DangerBar.prototype.drawImages()

ProgressBar.prototype.progress = function(percentdownload) {
	var newWidth=  ProgressBar.WIDTH * percentdownload;
	this.layer.clearRect(0, 0, this.loadingProgressBar.width, this.loadingProgressBar.height);
	this.layer.drawImage(this.loadingProgressBarLeftCap, 0, 0, this.loadingProgressBarLeftCap.width,this.loadingProgressBarLeftCap.height);	
	this.layer.drawImage(this.loadingProgressBarFill, this.loadingProgressBarLeftCap.width, 0, newWidth,this.loadingProgressBarFill.height);
	this.layer.textAlign = 'center';
	this.layer.textBaseline = 'bottom';
	this.layer.font = '27pt HelveticaBold';
	this.layer.fillText(i18n.t('Loading Screen.Instruction Text'), ProgressBar.WIDTH/2, ProgressBar.MESSAGE_TOP );
};

ProgressBar.prototype.loaded = function() {
	this.layer.clearRect(0, 0, this.loadingProgressBar.width, this.loadingProgressBar.height);
	this.layer.drawImage(this.loadingProgressBarLeftCap, 0, 0, this.loadingProgressBarLeftCap.width,this.loadingProgressBarLeftCap.height);	
	this.layer.drawImage(this.loadingProgressBarFill, this.loadingProgressBarLeftCap.width, 0, ProgressBar.WIDTH, this.loadingProgressBarFill.height);
	this.layer.font = '27pt HelveticaBold';
	this.layer.textAlign = 'center';
	this.layer.textBaseline = 'bottom';
	this.layer.fillText(i18n.t('Loading Screen.Hot Spots'), ProgressBar.WIDTH/2, ProgressBar.MESSAGE_TOP);
	this.isLoadingComplete=true;
};

ProgressBar.prototype.registerEventHandlers = function() {
	var progressBar = this;
	window.onclick= function(evt) {
		progressBar.canvas.focus();
	};

	progressBar.canvas.onclick = function(evt) {
		var x = evt.pageX;
		var y = evt.pageY ;
		if(x>=ProgressBar.LEFT && x<= (ProgressBar.LEFT + progressBar.canvas.width) && y>= ProgressBar.TOP && y<= (ProgressBar.TOP+ progressBar.canvas.height )){
			if(progressBar.isLoadingComplete){
				progressBar.unregisterEventHandlers();
				MainMenuScreen.init('screen-loading', progressBar);
				evt.stopPropagation();
				evt.preventDefault();
			}
		}
	};
	progressBar.canvas.onkeydown = function(evt) {
		switch( evt.keyCode ) {
		case 13: // enter
			if( progressBar.isLoadingComplete ){
				progressBar.unregisterEventHandlers();
				MainMenuScreen.init('screen-loading', progressBar);
				evt.stopPropagation();
				evt.preventDefault();
			}
			break;
		}
	};
}; //ProgressBar.prototype.registerEventHandlers()

ProgressBar.prototype.unregisterEventHandlers = function() {
	this.canvas.onclick = null;
	this.canvas.onkeydown = null;
}; //ProgressBar.prototype.unregisterEventHandlers()