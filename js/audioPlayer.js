AudioPlayer.PRIORITY_CONFIG_PATH = 'js/audioPriority.json';
function AudioPlayer(){
	var url = AudioPlayer.PRIORITY_CONFIG_PATH;
	var audioPlayer = this;
	Galapago.loadJsonAsync(url).then(function(audioPriority){
		audioPlayer.priorities = audioPriority;
	});
	this.queue = PriorityQueue({low:true});
	this.currentAudio = null;
	this.loop = false;
}

AudioPlayer.prototype.play = function(){
	var audioPlayer = this;
	if(!audioPlayer.currentAudio){
		var key = audioPlayer.queue.pop();
		if(key){
			var audio = ScreenLoader.gal.get(key);
			audio.addEventListener('ended', function() {
				audioPlayer.currentAudio = null;
				audioPlayer.play();
			})
			audioPlayer.currentAudio = audio;
			setTimeout(function() {
				audio.play();
			}, 0);
		}
	}
}

AudioPlayer.prototype.playInLoop = function(key){
	var audioPlayer = this;
	this.loop = true;
	this.currentAudio = ScreenLoader.gal.get(key);
	//keep retrying, assets might be loading;
	if(!this.currentAudio){
		setTimeout(function() {
			audioPlayer.playInLoop(key);
		}, 1000);
	}
	else{
		this.currentAudio.addEventListener('ended', function() {
			audioPlayer.keepPlaying();
		});
	}
	this.keepPlaying();
}

AudioPlayer.prototype.stopLoop = function(key){
	this.currentAudio = null;
	this.loop = false;
}

AudioPlayer.prototype.keepPlaying = function(){
	var audioPlayer = this;
	var currentAudio = audioPlayer.currentAudio;
	if(currentAudio && this.loop){
		setTimeout(function() {
			currentAudio.play();
		}, 0);
	}
}

AudioPlayer.prototype.playInvalidTileSelect = function(){
	var key = "Cannot_select.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playTileSelect = function(){
	var key = "Select.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playInvalidSwap = function(){
	var index = Math.ceil( Math.random() * 5);
	var key = "Piece_Off_0"+index+".mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playValidMatch = function(chainReactionCounter){
	var index = (chainReactionCounter % 6) + 1;
	var key = "Match_0"+index+".mp3";
	console.debug("playValidMatch: " + key );
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playGoldOrBlockingMatch = function(){
	var key = "Combo1.mp3";
	this.queue.push(key, this.priorities[key]);
	key = "Match_01.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playLightningStrike = function(){
	var key = "Lightning.mp3";
	this.queue.push(key, this.priorities[key]);
	key = "Match_01.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playCocoonMatch = function(){
	var key = "Cocoon_Tile.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playSuperFriendMatch = function(){
	var key = "SuperMatch.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playLevelWon = function(){
	var key = "Win.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playGameOver = function(){
	var key = "Win.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

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
}

AudioPlayer.prototype.playBonusFrenzySelect = function(){
	var index = Math.ceil( Math.random() * 5);
	var key = "Match_0"+index+".mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playFlipFlopSwap = function(){
	var key = "Swap.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playFirePowerUsed = function(){
	var key = "BurnIcon.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playShufflePowerUsed = function(){
	var key = "Shuffle3.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playClick = function(){
	var key = "Click.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playBounce = function(){
	var key = "MahJong_PieceClack02.mp3";
	this.queue.push(key, this.priorities[key]);
	this.play();
}

AudioPlayer.prototype.playVolcanoLoop = function(){
	var key = "Volcano_01.mp3";
	this.playInLoop(key);
}

AudioPlayer.prototype.playVolcanoEruptionLoop = function(){
	var key = "Volcano_Eruption.mp3";
	this.playInLoop(key);
}