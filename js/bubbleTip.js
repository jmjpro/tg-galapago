BubbleTip.DISPLAY_TIME_MS = 5000;

function BubbleTip(levelAnimation) {
	this.levelAnimation = levelAnimation;
	this.content = '';
	this.element = $('#bubbleTip');
} //function BubbleTip() constructor

BubbleTip.prototype.showBubbleTip = function (text) {
	var gameTipsSelectionEle;

    this.content = text;
	gameTipsSelectionEle = $('#gameTipsSelection');

	if(!(this.content === '') && gameTipsSelectionEle.html() === 'On'){
		this.levelAnimation.animateBobCervantes();
		this.element.html(this.content);
		this.element.css( 'display', 'block' );
	} 
} //BubbleTip.prototype.showBubbleTip()

BubbleTip.prototype.clearBubbleTip = function (text) {
	if(!text || this.content === text){
		this.content='';
		this.hideBubbleTip();
		this.levelAnimation.stopBobCervantes();
	}
} //BubbleTip.prototype.clearBubbleTip()

BubbleTip.prototype.hideBubbleTip = function () {
	var bubbleTip = $('#bubbleTip')[0];
	this.element.css( 'display', 'none' );
} //BubbleTip.prototype.hideBubbleTip()