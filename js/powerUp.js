// see @Tyler Whitehouse's answer at http://stackoverflow.com/a/11196395/567525
function PauseableInterval(func, delay , sender){
    this.func = func;
    this.delay = delay;  
    this.triggerSetAt = new Date().getTime();
    this.triggerTime = this.triggerSetAt + this.delay;
   // console.log('initial delay '+delay + ' now '+new Date().getTime());
    this.i = window.setInterval(this.func, this.delay ,sender);
    this.t_restart = null;
    this.paused_timeLeft = 0;
    this.getTimeLeft = function(){
        var now = new Date();
        return this.delay - ((now - this.triggerSetAt) % this.delay);
    }
    this.pause = function(){
        this.paused_timeLeft = this.getTimeLeft();
            //console.log('pause  time left : '+this.paused_timeLeft +' now : '+new Date().getTime());
        window.clearInterval(this.i);
        this.i = null;
                //window.setTimeout(this.resume, 4000);
    }
 
    this.reset = function(sender){
        window.clearInterval(this.i);
        this.i = null;
        this.i = window.setInterval(this.func, this.delay,sender);
    }
 
    this.restart = function(sender){
        sender.i = window.setInterval(sender.func, sender.delay,sender);
    }
 
    this.callAndRestart = function(sender){
      sender.restart(sender);
      //console.log('callAndRestart function called : ' +' now : '+new Date().getTime());
      sender.func();
    }
 
    this.resume = function(){
        if (this.i == null){
           // console.log('resume  time left : '+this.paused_timeLeft +' now : '+new Date().getTime());
            this.i = window.setTimeout(this.callAndRestart, this.paused_timeLeft, this);
        }
    }
 
    this.clearInterval = function(){
           window.clearInterval(this.i);
      }
}
 
/*function test(){
console.log(' now : '+new Date().getTime());
}
var pi = new PauseableInterval(test , 8000);
window.setTimeout(pi.pause, 2000);*/




Powerup.LEFT = 124;
Powerup.TOP = 232;
Powerup.MARGIN = 10;
Powerup.LAYER_POWER_UP = 'layer-power-up';
Powerup.FLIPFLOP_LEFT = 124;
Powerup.FLIPFLOP_TOP = 262;

Powerup.FIRE_LEFT = 124;
Powerup.FIRE_TOP = 343;

Powerup.SHUFFLER_LEFT = 124;
Powerup.SHUFFLER_TOP = 424;

Powerup.FLIPFLOP_SELECTED =1;
Powerup.FIRE_SELECTED =2;
Powerup.SHUFFLER_SELECTED =3;
Powerup.POWER_POINTS = 36;
Powerup.POWER_COLOR_ACTIVE = 'red';
Powerup.POWER_ACTIVATED = 1;
Powerup.POWER_ROLLOVER= 2;
Powerup.POWER_PRESSED= 3;


function Powerup(images,board ,powerupPoints) {
	this.initImages(images);
	this.board=board;
	this.canvas = $('#' + Powerup.LAYER_POWER_UP)[0];
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
		this.updatePowerAchieved();
	}	
	//this.addListner();
}

Powerup.prototype.addListner = function(){
   var powerup = this;
   //this.canvas.onfocus= function(){
       //console.log('on focus called');
	   powerup.boardKeyHandler = window.onkeydown;
	   window.onkeydown=null;
	   powerup.focus();
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
				  powerup.currentFocus=0;
				  powerup.nextFocus=0;
				  window.onkeydown=null;
				  powerup.canvas.onfocus=null;
			      window.onkeydown = powerup.boardKeyHandler;
			      break;
		}
	};   
}

Powerup.prototype.powerUsed = function(){
 if(this.isFlipFlopSelected()){
    this.flipflopPowerAchieved = false;
	//this.drawFlipFlop();
 }else if(this.isFireSelected()){
 	this.firePowerAchieved = false;
	//this.drawFire();
 }else if(this.isShufflerSelected()){
	this.shufflerPowerAchieved = false;
	//this.drawShuffler();
 }
 this.update();
 this.powerSelected=0;
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
		this.board.shuffleBoard();
		this.powerUsed();
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
	this.layer.clearRect( Powerup.FLIPFLOP_LEFT-2, Powerup.FLIPFLOP_TOP-2, this.PowerUps_Swap_Disabled.width+4, this.PowerUps_Swap_Disabled.height+4 );
	this.layer.clearRect(Powerup.FIRE_LEFT-2, Powerup.FIRE_TOP-2, this.PowerUps_Flame_Disabled.width+4, this.PowerUps_Flame_Disabled.height+4);
	this.layer.clearRect(Powerup.SHUFFLER_LEFT-2, Powerup.SHUFFLER_TOP-2, this.PowerUps_Shuffle_Disabled.width+4, this.PowerUps_Shuffle_Disabled.height+4);			
	ctx.drawImage( this.PowerUps_Holder, left, top );
	console.log('this.flipflopPowerAchieved : '+this.flipflopPowerAchieved);
	console.log('this.firePowerAchieved : '+this.firePowerAchieved);
	console.log('this.shufflerPowerAchieved : '+this.shufflerPowerAchieved);
	console.log('this.currentFocus : '+this.currentFocus);
	console.log('this.nextFocus : '+this.nextFocus);
  if(  (this.flipflopPowerAchieved && (this.currentFocus == 0 || (this.nextFocus == 0 && this.currentFocus == Powerup.FLIPFLOP_SELECTED) )) || (this.nextFocus == Powerup.FLIPFLOP_SELECTED)  ){
		this.drawFlipFlop(Powerup.POWER_ROLLOVER);
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
		
		this.drawFire(Powerup.POWER_ROLLOVER);
		
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
		this.drawShuffler(Powerup.POWER_ROLLOVER);
        this.currentFocus=Powerup.SHUFFLER_SELECTED;		
  
  }
}

Powerup.prototype.updatePowerup = function(tripletCount){
  this.timer.reset(this);
  this.score += tripletCount;
  console.log('incrementScore' +this.score );
  return this.updatePowerAchieved();
}

Powerup.prototype.decrementScore = function(sender){
//alert(sender);
  
  if(sender.score>0){
    sender.timer.reset(sender);
    sender.score -= 1;
  }
 // console.log('decrementScore' +sender.score );
}

Powerup.prototype.updatePowerAchieved = function(){
    var flagPowerUpdated = false;
	while(this.score >= Powerup.POWER_POINTS){
		if(!this.flipflopPowerAchieved){
		    this.flipflopPowerAchieved = true;
		}else if(!this.firePowerAchieved){
			this.firePowerAchieved = true;
		}else if(!this.shufflerPowerAchieved){
			this.shufflerPowerAchieved = true;
		}
		this.score -= Powerup.POWER_POINTS;
		this.update();
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
    //this.layer.clearRect( Powerup.FLIPFLOP_LEFT, Powerup.FLIPFLOP_TOP, this.PowerUps_Swap_Disabled.width, this.PowerUps_Swap_Disabled.height );
	this.layer.drawImage( this.PowerUps_Swap_Disabled, Powerup.FLIPFLOP_LEFT, Powerup.FLIPFLOP_TOP );
	if(state == Powerup.POWER_ACTIVATED){
		this.layer.drawImage( this.PowerUps_Swap_Activated, Powerup.FLIPFLOP_LEFT, Powerup.FLIPFLOP_TOP );
	}else if(state == Powerup.POWER_ROLLOVER){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(Powerup.FLIPFLOP_LEFT, Powerup.FLIPFLOP_TOP, this.PowerUps_Swap_Disabled.width, this.PowerUps_Swap_Disabled.height);	
		this.layer.drawImage( this.PowerUps_Swap_Rollover, Powerup.FLIPFLOP_LEFT, Powerup.FLIPFLOP_TOP );
	}else if(state == Powerup.POWER_PRESSED){
	    this.layer.drawImage( this.PowerUps_Swap_Pressed, Powerup.FLIPFLOP_LEFT, Powerup.FLIPFLOP_TOP );
	}
}

Powerup.prototype.drawFire = function(state) {
    //this.layer.clearRect(Powerup.FIRE_LEFT, Powerup.FIRE_TOP, this.PowerUps_Flame_Disabled.width, this.PowerUps_Flame_Disabled.height);
	this.layer.drawImage( this.PowerUps_Flame_Disabled, Powerup.FIRE_LEFT, Powerup.FIRE_TOP );
	if(state == Powerup.POWER_ACTIVATED){
		this.layer.drawImage( this.PowerUps_Flame_Activated, Powerup.FIRE_LEFT, Powerup.FIRE_TOP );
	}else if(state == Powerup.POWER_ROLLOVER){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(Powerup.FIRE_LEFT, Powerup.FIRE_TOP, this.PowerUps_Flame_Disabled.width, this.PowerUps_Flame_Disabled.height);		
		this.layer.drawImage( this.PowerUps_Flame_Rollover, Powerup.FIRE_LEFT, Powerup.FIRE_TOP );
	}else if(state == Powerup.POWER_PRESSED){
	    this.layer.drawImage( this.PowerUps_Flame_Pressed, Powerup.FIRE_LEFT, Powerup.FIRE_TOP );
	}
}

Powerup.prototype.drawShuffler = function(state) {
    //this.layer.clearRect(Powerup.SHUFFLER_LEFT, Powerup.SHUFFLER_TOP, this.PowerUps_Shuffle_Disabled.width, this.PowerUps_Shuffle_Disabled.height);			
	this.layer.drawImage( this.PowerUps_Shuffle_Disabled, Powerup.SHUFFLER_LEFT, Powerup.SHUFFLER_TOP );
	if(state == Powerup.POWER_ACTIVATED){
		this.layer.drawImage( this.PowerUps_Shuffle_Activated, Powerup.SHUFFLER_LEFT, Powerup.SHUFFLER_TOP );
	}else if(state == Powerup.POWER_ROLLOVER){
		this.layer.strokeStyle = Powerup.POWER_COLOR_ACTIVE;
		this.layer.strokeRect(Powerup.SHUFFLER_LEFT, Powerup.SHUFFLER_TOP, this.PowerUps_Shuffle_Disabled.width, this.PowerUps_Shuffle_Disabled.height);			
		this.layer.drawImage( this.PowerUps_Shuffle_Rollover, Powerup.SHUFFLER_LEFT, Powerup.SHUFFLER_TOP );
	}else if(state == Powerup.POWER_PRESSED){
	    this.layer.drawImage( this.PowerUps_Shuffle_Pressed, Powerup.SHUFFLER_LEFT, Powerup.SHUFFLER_TOP );
	}
}

Powerup.prototype.update = function() {
	var ctx, left, top, width, height;
	ctx = this.layer;
	left = Powerup.LEFT;
	top = Powerup.TOP;
	
	width = this.PowerUps_Swap_Disabled.width;
	height = this.PowerUps_Swap_Disabled.height;
	ctx.clearRect( Powerup.FLIPFLOP_LEFT-2, Powerup.FLIPFLOP_TOP-2, this.PowerUps_Swap_Disabled.width+4, this.PowerUps_Swap_Disabled.height+4 );
	ctx.clearRect(Powerup.FIRE_LEFT-2, Powerup.FIRE_TOP-2, this.PowerUps_Flame_Disabled.width+4, this.PowerUps_Flame_Disabled.height+4);
	ctx.clearRect(Powerup.SHUFFLER_LEFT-2, Powerup.SHUFFLER_TOP-2, this.PowerUps_Shuffle_Disabled.width+4, this.PowerUps_Shuffle_Disabled.height+4);			

	ctx.clearRect( left, top, width, height );
	ctx.drawImage( this.PowerUps_Holder, left, top );
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
}; //BobCervantes.prototype.update()
