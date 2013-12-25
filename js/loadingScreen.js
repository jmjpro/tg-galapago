"use strict";

LoadingScreen.STAGE_WIDTH = 1279;
LoadingScreen.STAGE_HEIGHT = 720;
LoadingScreen.BACKGROUND_PATH_PREFIX = 'res/img/screen-loading/';
LoadingScreen.BACKGROUND_PATH_SUFFIX = '.jpg)';

LoadingScreen.mapScreenImageNames = {
	'button-menu-map' : 'button-menu-map.png',
	'button-play-map' : 'button-play-map.png',
	'button-quit-map' : 'button-quit-map.png',
	'button-reset-map' : 'button-reset-map.png',
	'button-start-map' : 'button-start-map.png',
	'green_v' : 'green_v.png',
	'level_stars_gold' : 'level_stars_gold.png',
	'level_stars_silver' : 'level_stars_silver.png',
	'level_lock' : 'level_lock.png'
};

LoadingScreen.PROGRESS_BAR_IMAGE_DIRECTORY='res/img/screen-loading/';
LoadingScreen.MAP_SCREEN_IMAGE_DIRECTORY='res/img/screen-map/';

function LoadingScreen() {
}

LoadingScreen.init = function() {
	//sdkApi && sdkApi.reportPageView(TGH5.Reporting.Screen.Loading);
	this.gal = new GameAssetLoader('js/resourceManifest.json');
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
	var backgroundImage;
	this.gal.onLoaded('screen-loading', function(result) {
		if (result.success) {
			console.debug('screen-loading resource bundle loaded');
			backgroundImage = LoadingScreen.gal.get('background/loading.jpg');
			if( backgroundImage ) {
				LoadingScreen.screenDiv.css( 'background-image','url(' + backgroundImage.src + ')' );
			}
			LoadingScreen.gal.download('common');
			LoadingScreen.progressBar = new ProgressBar();
		}
	});
	this.gal.onProgress("common", function(progress) {
		var percentage = progress.current/progress.total ;
		LoadingScreen.progressBar.progress(percentage);
	});
	this.gal.onLoaded('common', function(result) {
		if (result.success) {
			console.debug('common resource bundle loaded');
			LoadingScreen.progressBar.loaded();
		}
	});
};

LoadingScreen.loadAudioBundle = function(resourceBundle, callback) {
	LoadingScreen.gal.onLoaded( resourceBundle, function(result) {
		if (result.success) {
			LoadingScreen.gal.clearOnLoaded( 'map-audio' );
			if( callback ) {
				callback.call();
			}
		}
	});

	LoadingScreen.gal.download( resourceBundle );
}; //LoadingScreen.loadAudioBundle()

LoadingScreen.hide = function() {
	var that = this;

	//TODO if api.inDemoMode() skip the main menu screen?

	MainMenuScreen.init('screen-loading', LoadingScreen.progressBar, function() {
		var timerId = null;
		if (that !== null && timerId == null) {
			timerId = setTimeout(function() {
				// TODO: remove/hide/shrink not needed elements
				// remove all divs
				that.screenDiv.hide();

				that.screenDiv[0].parentNode.removeChild(that.screenDiv[0]);

				that.screenDiv = null;
				that.canvas = null;
				that.layer = null;

				LoadingScreen.gal.unload('screen-loading');
				that = null;
			}, 1000);
		}
	});
}; //LoadingScreen.hide

/// end LoadingScreen class

/// progress bar TODO refactor to DOM
ProgressBar.TOP = 530;  //TODO move to CSS
ProgressBar.MESSAGE_TOP = 28;

function ProgressBar(){
	this.loadingProgressBar = LoadingScreen.gal.get("screen-loading/loading-progress-bar.png");
	this.loadingProgressBarLeftCap = LoadingScreen.gal.get("screen-loading/loading-progress-bar-left-cap.png");
	this.loadingProgressBarFill =LoadingScreen.gal.get("screen-loading/loading-progress-bar-fill.png");
	this.loadingProgressBarRightCap = LoadingScreen.gal.get("screen-loading/loading-progress-bar-right-cap.png");

	this.canvas = $('#layer-progress-bar')[0];
	this.canvas.focus();
	this.canvas.width = this.loadingProgressBar.naturalWidth;
	this.canvas.height = this.loadingProgressBar.naturalHeight;
	this.canvas.style.left = (LoadingScreen.STAGE_WIDTH - this.loadingProgressBar.naturalWidth) / 2 + 'px';
	this.canvas.style.top = ProgressBar.TOP + 'px';
	this.layer = this.canvas.getContext('2d');
	this.layer.fillStyle = 'rgb(255,255,255)';
	this.layer.textAlign = 'center';
	this.layer.font = '27px HelveticaBold';
	//this.drawImages();
	this.updateProgressBar(0);
	this.isLoadingComplete = false;
}

ProgressBar.prototype.updateProgressBar = function(percentDownloaded) {
	if(percentDownloaded > 1) {
		percentDownloaded = 1;
	}

	var newWidth = (this.canvas.width - this.loadingProgressBarLeftCap.naturalWidth - this.loadingProgressBarRightCap.naturalWidth) * percentDownloaded;
	this.layer.drawImage( this.loadingProgressBar, 0, 0, this.loadingProgressBar.naturalWidth, this.loadingProgressBar.naturalHeight);
	this.layer.drawImage(this.loadingProgressBarLeftCap, 0, 0, this.loadingProgressBarLeftCap.naturalWidth,this.loadingProgressBarLeftCap.naturalHeight);
	this.layer.drawImage(this.loadingProgressBarFill, this.loadingProgressBarLeftCap.naturalWidth, 0, newWidth + 1, this.loadingProgressBarFill.naturalHeight);
	this.layer.drawImage(this.loadingProgressBarRightCap, this.loadingProgressBarLeftCap.naturalWidth + newWidth, 0, this.loadingProgressBarRightCap.naturalWidth, this.loadingProgressBarRightCap.naturalHeight);
	if(/*percentDownloaded >= 1*/false) {
		this.layer.fillText(i18n.t('Loading Screen.Hot Spots'), this.canvas.width/2, ProgressBar.MESSAGE_TOP);
	} else {
		this.layer.fillText(i18n.t('Loading Screen.Instruction Text'), this.canvas.width/2, ProgressBar.MESSAGE_TOP );
	}
};

ProgressBar.prototype.progress = function(percentDownloaded) {
	this.updateProgressBar(percentDownloaded);
};

ProgressBar.prototype.loaded = function() {
	this.updateProgressBar(1);
	this.isLoadingComplete=true;
	LoadingScreen.hide();
};