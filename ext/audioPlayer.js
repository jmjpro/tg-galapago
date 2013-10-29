AudioPlayer.PRIORITY_CONFIG_PATH = 'js/audioPriority.json';
function AudioPlayer(isEnabled){
	var url = AudioPlayer.PRIORITY_CONFIG_PATH;
	var audioPlayer = this;
	Galapago.loadJsonAsync(url).then(function(audioPriority){
		audioPlayer.priorities = audioPriority;
	});
	this.queue = PriorityQueue({low:true});
	this.currentAudio = null;
	this.currentAudioInLoop = null;
	this.loop = false;
	this.isEnabled = isEnabled;
	if( !isEnabled ) {
		this.disable(true);
	}
} //constructor

/* if audio is globally disabled we switch the definitions of AudioPlayer.play() and AudioPlayer.playInLoop() with these */
AudioPlayer.prototype.tempPlay = function(){};
AudioPlayer.prototype.tempPlayInLoop = function(){};

AudioPlayer.prototype.disable = function(isInit) {
	if( isInit || this.isEnabled ) {
		this.isEnabled = false;
		this.stop();
		this.stopLoop();
		AudioPlayer.prototype.tempPlay = this.play;
		AudioPlayer.prototype.tempPlayInLoop = this.playInLoop;
		this.play = function(){};
		this.playInLoop = function(){};
	}
}; //AudioPlayer.prototype.disable()

AudioPlayer.prototype.enable = function() {
	if( ! this.isEnabled ) {
		this.isEnabled = true;
		this.play = AudioPlayer.prototype.tempPlay;
		this.playInLoop = AudioPlayer.prototype.tempPlayInLoop;
	}
}; //AudioPlayer.prototype.enable()

AudioPlayer.prototype.play = function(){
	var audioPlayer = this;
	if(!audioPlayer.currentAudio){
		var key = audioPlayer.queue.pop();
		if(key){
			var audio = LoadingScreen.gal.get(key);
			if(audio){
				audio.audioPlayer = this;
				audio.addEventListener('ended', this.playEnded);
				audioPlayer.currentAudio = audio;
				setTimeout(function() {
					audio.play();
				}, 0);
			}
		}
	}
}; //AudioPlayer.prototype.play()

AudioPlayer.prototype.stop = function(){
	this.queue.clear();
	if(this.currentAudio){
		this.currentAudio.pause();
		this.currentAudio = null;
	}
}; //AudioPlayer.prototype.stop()

AudioPlayer.prototype.playEnded = function(){
	this.audioPlayer.currentAudio = null;
	this.audioPlayer.play();
}; //AudioPlayer.prototype.playEnded()

AudioPlayer.prototype.playInLoop = function(key){
	audioPlayer = this;
	this.loop = true;
	audioPlayer.stopLoop();
	this.currentAudioInLoop = LoadingScreen.gal.get(key);
	//keep retrying, assets might be loading;
	if(!this.currentAudioInLoop){
		setTimeout(function() {
			audioPlayer.playInLoop(key);
		}, 1000);
	}
	else{
		this.currentAudioInLoop.loop = true;
		this.currentAudioInLoop.play();
	}
}; //AudioPlayer.prototype.playInLoop()

AudioPlayer.prototype.stopLoop = function(){
	if(this.currentAudioInLoop){
		this.currentAudioInLoop.pause();
	}
}; //AudioPlayer.prototype.stopLoop()


AudioPlayer.prototype.playInvalidTileSelect = function(){
	var key = "Cannot_select.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playTileSelect = function(){
	var key = "Select.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playInvalidSwap = function(){
	var index = Math.ceil( Math.random() * 5);
	var key = "Piece_Off_0"+index+".mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playValidMatch = function(chainReactionCounter){
	var index = (chainReactionCounter % 6) + 1;
	var key = "Match_0"+index+".mp3";
	console.debug("playValidMatch: " + key );
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playGoldOrBlockingMatch = function(){
	var key = "Combo1.mp3";
	this.queue.push(key, this.priorities[key]);
	key = "Match_01.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playLightningStrike = function(){
	var key = "Lightning.mp3";
	this.queue.push(key, this.priorities[key]);
	key = "Match_01.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playCocoonMatch = function(){
	var key = "Cocoon_Tile.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playSuperFriendMatch = function(){
	var key = "SuperMatch.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playLevelWon = function(){
	var key = "Win.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playGameOver = function(){
	var key = "Win.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playTimeWarning = function(){
	var key = "Warning.mp3";
	this.queue.push(key, this.priorities[key]);
	this.queue.push(key, this.priorities[key]);
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playBonusFrenzyStart = function(){
	var key = "SuperMatch.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playBonusFrenzySelect = function(){
	var index = Math.ceil( Math.random() * 5);
	var key = "Match_0"+index+".mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playFlipFlopSwap = function(){
	var key = "Swap.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playFirePowerUsed = function(){
	var key = "BurnIcon.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playShufflePowerUsed = function(){
	var key = "Shuffle3.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playClick = function(){
	var key = "Click.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playBounce = function(){
	var key = "MahJong_PieceClack02.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};

AudioPlayer.prototype.playVolcanoLoop = function(){
	var key = "Volcano_01.mp3";
	this.playInLoop(key);
};

AudioPlayer.prototype.playVolcanoEruptionLoop = function(){
	var key = "Volcano_Eruption.mp3";
	this.playInLoop(key);
};

AudioPlayer.prototype.playReshuffle = function(){
	var key = "Reshuffle.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
};