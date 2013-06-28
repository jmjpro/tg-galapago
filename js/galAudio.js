function GalAudio() {
	this.assets = [
		{
			"id" : "select",
			"src" : "res/audio/Select.mp3"
		},
		{
			"id" : "burn-icon",
			"src" : "res/audio/BurnIcon.mp3"
		},
		{
			"id" : "cannot-select",
			"src" : "res/audio/Cannot_select.mp3"
		},
		{
			"id" : "click",
			"src" : "res/audio/Click.mp3"
		},
		{
			"id" : "combo1",
			"src" : "res/audio/Combo1.mp3"
		},
		{
			"id" : "lightning",
			"src" : "res/audio/Lightning.mp3"
		},
		{
			"id" : "piece-off-1",
			"src" : "res/audio/Piece_Off_01.mp3"
		},
		{
			"id" : "piece-off-2",
			"src" : "res/audio/Piece_Off_02.mp3"
		},
		{
			"id" : "piece-off-3",
			"src" : "res/audio/Piece_Off_03.mp3"
		},
		{
			"id" : "piece-off-4",
			"src" : "res/audio/Piece_Off_04.mp3"
		},
		{
			"id" : "piece-off-5",
			"src" : "res/audio/Piece_Off_05.mp3"
		},
		{
			"id" : "sound-match-1",
			"src" : "res/audio/Match_01.mp3"
		},
		{
			"id" : "sound-match-2",
			"src" : "res/audio/Match_02.mp3"
		},
		{
			"id" : "sound-match-3",
			"src" : "res/audio/Match_03.mp3"
		},
		{
			"id" : "sound-match-4",
			"src" : "res/audio/Match_04.mp3"
		},
		{
			"id" : "sound-match-5",
			"src" : "res/audio/Match_05.mp3"
		},
		{
			"id" : "sound-warning",
			"src" : "res/audio/Warning.mp3"
		}
	];
}

GalAudio.prototype.load = function() {
	var sounds;
	sounds = [];
	_.each(this.assets, function(asset) {
		sounds[asset.id] = new Audio();
		sounds[asset.id].src = asset.src;
	});
	return sounds;
};