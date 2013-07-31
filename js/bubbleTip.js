function BubbleTip(levelAnimation) {
	this.levelAnimation = levelAnimation;
}
BubbleTip.prototype.showBubbleTip = function (text) {
    this.content = text;
    var bubbleTip = $('#bubbleTip')[0];
	if(this.content!=''){
		this.levelAnimation.animateBobCervantes();
		bubbleTip.innerHTML=this.content;
		bubbleTip.style.display='block';
	} 
}

BubbleTip.prototype.clearBubbleTip = function (text) {
	if(!text || this.content == text){
		this.content="";
		this.hideBubbleTip();
		this.levelAnimation.stopBobCervantes();
	}
}

BubbleTip.prototype.hideBubbleTip = function () {
	var bubbleTip = $('#bubbleTip')[0];
	bubbleTip.style.display='none'; 
}

//showBubbleTip("SELECT THE HIGHLIGHTED CREATURE TO START A COCOON TILE MATCH. TO CLEAR IT, YOU MUST MAKE A MATCH OF THE COCOON'S COLOR NEXT TO IT!");