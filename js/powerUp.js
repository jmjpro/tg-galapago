Powerup.LEFT = 124;
Powerup.TOP = 232;
Powerup.MARGIN = 10;
Powerup.LAYER_POWER_UP = 'layer-power-up';
Powerup.NOTCH_SPACE_HEIGHT = 75;
Powerup.FLIPFLOP_TOP = 30;
Powerup.FIRE_TOP = Powerup.FLIPFLOP_TOP + Powerup.NOTCH_SPACE_HEIGHT;
Powerup.SHUFFLER_TOP = Powerup.FIRE_TOP + Powerup.NOTCH_SPACE_HEIGHT;

Powerup.FLIPFLOP_SELECTED =1;
Powerup.FIRE_SELECTED =2;
Powerup.SHUFFLER_SELECTED =3;
Powerup.POWER_POINTS = 36;
Powerup.POWER_COLOR_ACTIVE = 'red';
Powerup.POWER_ACTIVATED = 1;
Powerup.POWER_ROLLOVER= 2;
Powerup.POWER_PRESSED= 3;

Powerup.POWER_ICON_HEIGHT= 40;
Powerup.POWER_UP_WIDTH= 70;
Powerup.POWER_UP_HEIGHT = 280;
Powerup.LAYER_WIDTH = 70;
Powerup.LAYER_HEIGHT = 280;



function Powerup(images,board ,powerupPoints) {
	this.initImages(images);
	this.board=board;
	this.canvas = $('#' + Powerup.LAYER_POWER_UP)[0];
	this.canvas.width = this.PowerUps_Swap_Disabled.width;
	this.canvas.height = this.PowerUps_Holder.height;
	this.canvas.style.left = Powerup.LEFT + 'px';
	this.canvas.style.top = Powerup.TOP + 'px';
	this.layer = $('#' + Powerup.LAYER_POWER_UP)[0].getContext('2d');
	this.update();
	this.timer = new PauseableInterval(this.decrementScore,5000,this);
	this.score=0;
	this.flipflopPowerAchieved = false;
	this.firePowerAchieved = false;
	this.shufflerPowerAchieved = false;
	this.currentFocus=0;
	this.nextFocus=0;
    this.powerSelected=0;
	if(powerupPoints > 0){
		this.score = powerupPoints;
		if(Powerup.POWER_POINTS > this.score){
			this.update();
		}
		this.updatePowerAchieved();
	}	
	//this.addListner();
}

Powerup.prototype.addListner = function(){
   var powerup = this;
   //this.canvas.onfocus= function(){
       //console.log('on focus called');
	   powerup.boardKeyHandler = window.onkeydown;
	   powerup.board.isPowerUpFocused = true;
	   window.onkeydown=null;
	   powerup.focus();
	   powerup.focusOn= 1;
	   powerup.registerEvents();
   //}
  // console.log('listener Added');
}
Powerup.prototype.registerEvents=function(){
   var powerup = this;
   window.onkeydown = function(e) {
		switch(e.keyCode) { 
			// User pressed "up" arrow
			case 38:
			    powerup.handleUp();
				powerup.focus();
			    break;
			case 39: // right arrow
			      powerup.update();
				  powerup.currentFocus=0;
				  powerup.nextFocus=0;
				  window.onkeydown=null;
				  powerup.focusOn= 0;
				  powerup.board.isPowerUpFocused = false;
				  powerup.canvas.onfocus=null;
			      window.onkeydown = powerup.boardKeyHandler;
				break;				
			// User pressed "down" arrow
			case 40:
			    powerup.handleDown();
				powerup.focus();
			    break;
			// User pressed "enter"
			case 13:
				  powerup.handleSelect();
				  //powerup.currentFocus=0;
				  powerup.nextFocus=0;
				  window.onkeydown=null;
				  powerup.canvas.onfocus=null;
				  powerup.board.isPowerUpFocused = false;
			      window.onkeydown = powerup.boardKeyHandler;
			      break;
		}
	};   
}

Powerup.prototype.powerUsed = function(){
 if(this.isFlipFlopSelected()){
    this.flipflopPowerAchieved = false;
//this.board.level.levelAnimation.stopPowerAchieved(this.flipflopAnimator);
	//this.drawFlipFlop();
 }else if(this.isFireSelected()){
 	this.firePowerAchieved = false;
//	this.board.level.levelAnimation.stopPowerAchieved(this.fireAnimator);	
	//this.drawFire();
 }else if(this.isShufflerSelected()){
	this.shufflerPowerAchieved = false;
//	this.board.level.levelAnimation.stopPowerAchieved(this.shufflerAnimator);		
	//this.drawShuffler();
 }
 this.update();
 this.powerSelected=0;
 this.focusOn= 0;
 this.currentFocus=0;
 //this.board.saveBoard(); // auto save state when power is used.
}

Powerup.prototype.handleSelect = function(){
	if(this.currentFocus == Powerup.FLIPFLOP_SELECTED){
		this.powerSelected = Powerup.FLIPFLOP_SELECTED;
		this.drawFlipFlop(Powerup.POWER_PRESSED);
	}else if(this.currentFocus == Powerup.FIRE_SELECTED){
        this.powerSelected = Powerup.FIRE_SELECTED;	
		this.drawFire(Powerup.POWER_PRESSED);
	}else if(this.currentFocus == Powerup.SHUFFLER_SELECTED){
	    this.powerSelected = Powerup.SHUFFLER_SELECTED;
		this.drawShuffler(Powerup.POWER_PRESSED);
		Galapago.audioPlayer.playShufflePowerUsed();
		this.powerUsed();
		this.board.shuffleBoard();
	}
}

Powerup.prototype.handleUp=function(){
    this.nextFocus=0;
 if(this.currentFocus == Powerup.FLIPFLOP_SELECTED && this.shufflerPowerAchieved){
	this.nextFocus = Powerup.SHUFFLER_SELECTED;
 }else if(this.currentFocus == Powerup.FLIPFLOP_SELECTED && this.firePowerAchieved){
    this.nextFocus = Powerup.FIRE_SELECTED;
 }
 
  if(this.currentFocus == Powerup.FIRE_SELECTED && this.flipflopPowerAchieved){
	this.nextFocus = Powerup.FLIPFLOP_SELECTED;
 }else if(this.currentFocus == Powerup.FIRE_SELECTED && this.shufflerPowerAchieved){
    this.nextFocus = Powerup.SHUFFLER_SELECTED;
 }

  if(this.currentFocus == Powerup.SHUFFLER_SELECTED && this.firePowerAchieved){
	this.nextFocus = Powerup.FIRE_SELECTED;
 }else if(this.currentFocus == Powerup.SHUFFLER_SELECTED && this.flipflopPowerAchieved){
    this.nextFocus = Powerup.FLIPFLOP_SELECTED;
 } 
 
}


Powerup.prototype.handleDown=function(){
   this.nextFocus=0;
 if(this.currentFocus == Powerup.FLIPFLOP_SELECTED && this.firePowerAchieved){
    this.nextFocus = Powerup.FIRE_SELECTED;
 }else if(this.currentFocus == Powerup.FLIPFLOP_SELECTED && this.shufflerPowerAchieved){
	this.nextFocus = Powerup.SHUFFLER_SELECTED;
 }
 
 if(this.currentFocus == Powerup.FIRE_SELECTED && this.shufflerPowerAchieved){
    this.nextFocus = Powerup.SHUFFLER_SELECTED;
 }else if(this.currentFocus == Powerup.FIRE_SELECTED && this.flipflopPowerAchieved){
	this.nextFocus = Powerup.FLIPFLOP_SELECTED;
 }

 if(this.currentFocus == Powerup.SHUFFLER_SELECTED && this.flipflopPowerAchieved){
    this.nextFocus = Powerup.FLIPFLOP_SELECTED;
 } else if(this.currentFocus == Powerup.SHUFFLER_SELECTED && this.firePowerAchieved){
	this.nextFocus = Powerup.FIRE_SELECTED;
 }
 
}


Powerup.prototype.isPowerAchieved = function(){
	return this.flipflopPowerAchieved || this.firePowerAchieved || this.shufflerPowerAchieved;
}

Powerup.prototype.isPowerSelected = function(){
	return this.isFlipFlopSelected() || this.isFireSelected() || this.isShufflerSelected();
}

Powerup.prototype.isFlipFlopSelected = function(){
  //return true;
  return (this.powerSelected === Powerup.FLIPFLOP_SELECTED);
}

Powerup.prototype.isFireSelected = function(){
  return (this.powerSelected === Powerup.FIRE_SELECTED);
}

Powerup.prototype.isShufflerSelected = function(){
  return (this.powerSelected === Powerup.SHUFFLER_SELECTED);
}

Powerup.prototype.focus = function(){
   var ctx, left, top, width, height;
	ctx = this.layer;
	left = Powerup.LEFT;
	top = Powerup.TOP;
	width = this.PowerUps_Swap_Disabled.width;
	height = this.PowerUps_Swap_Disabled.height;
	/*
	this.layer.clearRect( 0-2, Powerup.FLIPFLOP_TOP-2, this.PowerUps_Swap_Disabled.width+4, this.PowerUps_Swap_Disabled.height+4 );
	this.layer.clearRect(0-2, Powerup.FIRE_TOP-2, this.PowerUps_Flame_Disabled.width+4, this.PowerUps_Flame_Disabled.height+4);
	this.layer.clearRect(0-2, Powerup.SHUFFLER_TOP-2, this.PowerUps_Shuffle_Disabled.width+4, this.PowerUps_Shuffle_Disabled.height+4);			
	*/
	this.layer.clearRect( 0, 0, Powerup.LAYER_WIDTH, Powerup.LAYER_HEIGHT);
	
	ctx.drawImage( this.PowerUps_Holder, 0, 0 );
	
	console.log('this.flipflopPowerAchieved : '+this.flipflopPowerAchieved);
	console.log('this.firePowerAchieved : '+this.firePowerAchieved);
	console.log('this.shufflerPowerAchieved : '+this.shufflerPowerAchieved);
	console.log('this.currentFocus : '+this.currentFocus);
	console.log('this.nextFocus : '+this.nextFocus);
  if(  (this.flipflopPowerAchieved && (this.currentFocus == 0 || (this.nextFocus == 0 && this.currentFocus == Powerup.FLIPFLOP_SELECTED) )) || (this.nextFocus == Powerup.FLIPFLOP_SELECTED)  ){
		if(this.isFlipFlopSelected()){
			this.drawFlipFlop(Powerup.POWER_PRESSED);
		}else{
			this.drawFlipFlop(Powerup.POWER_ROLLOVER);
		}
		this.currentFocus=Powerup.FLIPFLOP_SELECTED;
		
		if(this.firePowerAchieved){
			this.drawFire(Powerup.POWER_ACTIVATED);
		}else{
			this.drawFire();
		}
	
		if(this.shufflerPowerAchieved){
			this.drawShuffler(Powerup.POWER_ACTIVATED);
		}else{
			this.drawShuffler();
		}
		
  }else if((this.firePowerAchieved && (this.currentFocus == 0 || (this.nextFocus == 0 && this.currentFocus == Powerup.FIRE_SELECTED))) || (this.nextFocus == Powerup.FIRE_SELECTED) ){
		if(this.flipflopPowerAchieved){
			this.drawFlipFlop(Powerup.POWER_ACTIVATED);
		}else{
		    this.drawFlipFlop();
		}
		if(this.isFireSelected()){
			this.drawFire(Powerup.POWER_PRESSED);
		}else{
			this.drawFire(Powerup.POWER_ROLLOVER);
		}
		
		if(this.shufflerPowerAchieved){
			this.drawShuffler(Powerup.POWER_ACTIVATED);
		}else{
			this.drawShuffler();
		}
		this.currentFocus=Powerup.FIRE_SELECTED;
  }else if((this.shufflerPowerAchieved && (this.currentFocus == 0 || (this.nextFocus == 0 && this.currentFocus == Powerup.SHUFFLER_SELECTED )) ) || (this.nextFocus == Powerup.SHUFFLER_SELECTED) ){
  
		if(this.flipflopPowerAchieved){
			this.drawFlipFlop(Powerup.POWER_ACTIVATED);
		}else{
			this.drawFlipFlop();
		}
		
		if(this.firePowerAchieved){
			this.drawFire(Powerup.POWER_ACTIVATED);
		}else{
			this.drawFire();
		}
		if(this.isShufflerSelected()){
			this.drawShuffler(Powerup.POWER_PRESSED);
		}else{
			this.drawShuffler(Powerup.POWER_ROLLOVER);
		}
        this.currentFocus=Powerup.SHUFFLER_SELECTED;		
  
  }
  this.animatePowerStatus();
}

Powerup.prototype.updatePowerup = function(tripletCount){
  this.timer.reset(this);
  this.score += tripletCount;
  console.log('incrementScore' +this.score );
  console.log('incrementScore' +this.score/Powerup.POWER_POINTS );
  if(this.score < Powerup.POWER_POINTS){
	if(this.focusOn ==1){
		this.focus();
	}else{
		this.update();
	}
  }
  return this.updatePowerAchieved();
}

Powerup.prototype.decrementScore = function(sender){
//alert(sender);
  
  if(sender.score>0){
    sender.timer.reset(sender);
    sender.score -= 1;
	if(sender.focusOn ==1){
		sender.focus();
	}else{
		sender.update();
	}
  }
  
 // console.log('decrementScore' +sender.score );
}

Powerup.prototype.animatePowerStatus = function(){
	var percentScoreGain =this.score/Powerup.POWER_POINTS
    //if(percentScoreGain > .70){
	//	return;
	//}
    var clipHeight = (Powerup.POWER_ICON_HEIGHT*percentScoreGain);
	console.log("clipHeight : "+clipHeight);
    var newHeigth=  (Powerup.POWER_ICON_HEIGHT - clipHeight);
	console.log('newHeigth : ' +newHeigth);

	if(!this.flipflopPowerAchieved){
	    //this.layer.clearRect( 0-2, Powerup.FLIPFLOP_TOP-2, this.PowerUps_Swap_Disabled.width+4, this.PowerUps_Swap_Disabled.height+4 );
		//this.layer.drawImage( this.PowerUps_Swap_Disabled, 0, Powerup.FLIPFLOP_TOP );
		this.layer.drawImage( this.PowerUps_Swap_Activated ,0, 10+newHeigth, this.PowerUps_Swap_Activated.width , clipHeight, 0, (Powerup.FLIPFLOP_TOP +Powerup.POWER_ICON_HEIGHT+10 - clipHeight) ,this.PowerUps_Swap_Activated.width,clipHeight );
	}else if(!this.firePowerAchieved){
		//this.layer.drawImage( this.PowerUps_Flame_Disabled, 0, Powerup.FIRE_TOP );
		//this.layer.drawImage( this.PowerUps_Flame_Activated, 0, Powerup.FIRE_TOP+newHeigth );
		this.layer.drawImage( this.PowerUps_Flame_Activated ,0, 10+newHeigth, this.PowerUps_Flame_Activated.width , clipHeight, 0, (Powerup.FIRE_TOP +Powerup.POWER_ICON_HEIGHT +10 - clipHeight) ,this.PowerUps_Flame_Activated.width,clipHeight );
	}else if(!this.shufflerPowerAchieved){
		//this.layer.drawImage( this.PowerUps_Shuffle_Disabled, 0, Powerup.SHUFFLER_TOP );
		//this.layer.drawImage( this.PowerUps_Shuffle_Activated, 0, Powerup.SHUFFLER_TOP +newHeigth);
		this.layer.drawImage( this.PowerUps_Shuffle_Activated ,0, 10+newHeigth, this.PowerUps_Shuffle_Activated.width , clipHeight, 0, (Powerup.SHUFFLER_TOP +Powerup.POWER_ICON_HEIGHT +10 - clipHeight) ,this.PowerUps_Shuffle_Activated.width,clipHeight );
	}
	
	
}


Powerup.prototype.updatePowerAchieved = function(){
    var flagPowerUpdated = false;
	var powerUpAnimationCanvas = $('#' + 'layer-map-other-animation')[0];
	var powerUpAnimationLayer = powerUpAnimationCanvas.getContext('2d');
	while(this.score >= Powerup.POWER_POINTS){
		if(!this.flipflopPowerAchieved){
		    this.flipflopPowerAchieved = true;
			this.flipflopAnimator = this.board.level.levelAnimation.animatePowerAchieved(powerUpAnimationLayer, [115,222]); //[115,222]//[124,262]
		}else if(!this.firePowerAchieved){
			this.firePowerAchieved = true;
			this.fireAnimator = this.board.level.levelAnimation.animatePowerAchieved(powerUpAnimationLayer, [115,303]); //343
		}else if(!this.shufflerPowerAchieved){
			this.shufflerPowerAchieved = true;
			this.shufflerAnimator =this.board.level.levelAnimation.animatePowerAchieved(powerUpAnimationLayer, [115,384]);//424
		}
		this.score -= Powerup.POWER_POINTS;
		if(this.focusOn ==1){
			this.focus();
		}else{
			this.update();
		}
		flagPowerUpdated = true;
		//this.board.saveBoard();
	}
	return flagPowerUpdated;

}

Powerup.prototype.initImages = function(imageArray) {
	var powerup;
	var imageId;
	powerup = this;

	_.each(imageArray, function(image) {
		imageId = image.id;
		powerup[imageId] = image;
	});
}; //DangerBar.prototype.initImages

Powerup.prototype.drawFlipFlop = function(state) {
    //this.layer.clearRect( 0, Powerup.FLIPFLOP_TOP, this.PowerUps_Swap_Disabled.width, this.PowerUps_Swap_Disabled.height );
	this.layer.drawImage( this.PowerUps_Swap_Disabled, 0, Powerup.FLIPFLOP_TOP );
	if(state == Powerup.POWER_ACTIVATED){
		this.layer.drawImage( this.PowerUps_Swap_Activated, 0, Powerup.FLIPFLOP_TOP );
	}else if(state == Powerup.POWER_ROLLOVER){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(0, Powerup.FLIPFLOP_TOP, this.PowerUps_Swap_Disabled.width, this.PowerUps_Swap_Disabled.height);	
		this.layer.drawImage( this.PowerUps_Swap_Rollover, 0, Powerup.FLIPFLOP_TOP );
	}else if(state == Powerup.POWER_PRESSED){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(0, Powerup.FLIPFLOP_TOP, this.PowerUps_Swap_Disabled.width, this.PowerUps_Swap_Disabled.height);	
	    this.layer.drawImage( this.PowerUps_Swap_Pressed, 0, Powerup.FLIPFLOP_TOP );
	}
}

Powerup.prototype.drawFire = function(state) {
    //this.layer.clearRect(0, Powerup.FIRE_TOP, this.PowerUps_Flame_Disabled.width, this.PowerUps_Flame_Disabled.height);
	this.layer.drawImage( this.PowerUps_Flame_Disabled, 0, Powerup.FIRE_TOP );
	if(state == Powerup.POWER_ACTIVATED){
		this.layer.drawImage( this.PowerUps_Flame_Activated, 0, Powerup.FIRE_TOP );
	}else if(state == Powerup.POWER_ROLLOVER){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(0, Powerup.FIRE_TOP, this.PowerUps_Flame_Disabled.width, this.PowerUps_Flame_Disabled.height);		
		this.layer.drawImage( this.PowerUps_Flame_Rollover, 0, Powerup.FIRE_TOP );
	}else if(state == Powerup.POWER_PRESSED){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(0, Powerup.FIRE_TOP, this.PowerUps_Flame_Disabled.width, this.PowerUps_Flame_Disabled.height);			
	    this.layer.drawImage( this.PowerUps_Flame_Pressed, 0, Powerup.FIRE_TOP );
	}
}

Powerup.prototype.drawShuffler = function(state) {
    //this.layer.clearRect(0, Powerup.SHUFFLER_TOP, this.PowerUps_Shuffle_Disabled.width, this.PowerUps_Shuffle_Disabled.height);			
	this.layer.drawImage( this.PowerUps_Shuffle_Disabled, 0, Powerup.SHUFFLER_TOP );
	if(state == Powerup.POWER_ACTIVATED){
		this.layer.drawImage( this.PowerUps_Shuffle_Activated, 0, Powerup.SHUFFLER_TOP );
	}else if(state == Powerup.POWER_ROLLOVER){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(0, Powerup.SHUFFLER_TOP, this.PowerUps_Shuffle_Disabled.width, this.PowerUps_Shuffle_Disabled.height);			
		this.layer.drawImage( this.PowerUps_Shuffle_Rollover, 0, Powerup.SHUFFLER_TOP );
	}else if(state == Powerup.POWER_PRESSED){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(0, Powerup.SHUFFLER_TOP, this.PowerUps_Shuffle_Disabled.width, this.PowerUps_Shuffle_Disabled.height);				
	    this.layer.drawImage( this.PowerUps_Shuffle_Pressed, 0, Powerup.SHUFFLER_TOP );
	}
}

Powerup.prototype.update = function() {
	/*
	var ctx, left, top, width, height;
	ctx = this.layer;
	left = Powerup.LEFT;
	top = Powerup.TOP;
	
	/*
	width = this.PowerUps_Swap_Disabled.width;
	height = this.PowerUps_Swap_Disabled.height;
	ctx.clearRect( 0-2, Powerup.FLIPFLOP_TOP-2, this.PowerUps_Swap_Disabled.width+4, this.PowerUps_Swap_Disabled.height+4 );
	ctx.clearRect(0-2, Powerup.FIRE_TOP-2, this.PowerUps_Flame_Disabled.width+4, this.PowerUps_Flame_Disabled.height+4);
	ctx.clearRect(0-2, Powerup.SHUFFLER_TOP-2, this.PowerUps_Shuffle_Disabled.width+4, this.PowerUps_Shuffle_Disabled.height+4);			
	*/
	this.layer.clearRect( 0, 0, Powerup.LAYER_WIDTH , Powerup.LAYER_HEIGHT );

	this.layer.drawImage( this.PowerUps_Holder, 0, 0 );
	
	//top += Powerup.MARGIN * 3;
	if(this.flipflopPowerAchieved){
		this.drawFlipFlop(Powerup.POWER_ACTIVATED);
	}else{
	    this.drawFlipFlop();
	}
	
	if(this.firePowerAchieved){
		this.drawFire(Powerup.POWER_ACTIVATED);
	}else{
		this.drawFire();
	}
	

	if(this.shufflerPowerAchieved){
		this.drawShuffler(Powerup.POWER_ACTIVATED);
	}else{
		this.drawShuffler();
		
	}
	this.animatePowerStatus();
}; //Powerup.prototype.update()
