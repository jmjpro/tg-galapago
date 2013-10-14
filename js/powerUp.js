Powerup.LEFT = 124;
Powerup.TOP = 232;
Powerup.MARGIN = 10;
Powerup.NOTCH_SPACE_HEIGHT = 75;
Powerup.FLIPFLOP_TOP = 30;
Powerup.FIRE_TOP = Powerup.FLIPFLOP_TOP + Powerup.NOTCH_SPACE_HEIGHT;
Powerup.SHUFFLER_TOP = Powerup.FIRE_TOP + Powerup.NOTCH_SPACE_HEIGHT;
Powerup.FLIPFLOP_ANIMATION_TOP = -20;
Powerup.FIRE_ANIMATION_TOP = -20;
Powerup.SHUFFLER_ANIMATION_TOP = -20;
Powerup.FLIPFLOP_SELECTED = 1;
Powerup.FIRE_SELECTED = 2;
Powerup.SHUFFLER_SELECTED = 3;
Powerup.POWER_POINTS = 3;
Powerup.POWER_COLOR_ACTIVE = 'red';
Powerup.POWER_ACTIVATED = 1;
Powerup.POWER_ROLLOVER = 2;
Powerup.POWER_PRESSED = 3;

Powerup.POWER_ICON_HEIGHT = 38;
Powerup.POWER_UP_WIDTH = 70;
Powerup.POWER_UP_HEIGHT = 280;
Powerup.LAYER_WIDTH = 70;
Powerup.LAYER_HEIGHT = 280;
Powerup.GAME_IMAGE_DIRECTORY = 'screen-game/';
Powerup.IMAGE_PATH_SUFFIX = '.png';
Powerup.IMAGE_MAGNIFICATION = 2;
Powerup.LEFT_ADJUSTMENT = 15;
Powerup.TOP_ADJUSTMENT = 10;
Powerup.ANIMATION_LEFT = 1;
Powerup.MIN_POINTS_FOR_TIP = 8;
Powerup.UPDATE_POINTS_INTERVAL_SEC = 5;
Powerup.UPDATE_CHEAT_INTERVAL_SEC = 1;

Powerup.gameImageNames = [
    'flame-fill',
    'flame-disabled',
    'powerups-holder',
    'shuffle-fill',
    'shuffle-disabled',
    'swap-fill',
    'swap-disabled'
];


function Powerup(board, powerupPoints) {
    this.initImages();
    this.board = board;
    this.div = $('#div-power-up');
    this.divFlipFlop = $('#div-flip-flop-power-up');
    this.divFireUp = $('#div-fire-power-up');
    this.divShuffler = $('#div-shuffle-power-up');
    this.divFlipFlopAnimation = $('#div-flip-flop-animation-power-up');
	this.divFireAnimation = $('#div-fire-animation-power-up');
	this.divShuffleAnimation = $('#div-shuffle-animation-power-up');

    this.update();
    if (QueryString.cheat === 'true') {
        $('#power-up-label').css('display', 'block');
        this.timer = new PauseableInterval(this, this.decrementScore, Powerup.UPDATE_POINTS_INTERVAL_SEC * 1000, this.updateCheat, Powerup.UPDATE_CHEAT_INTERVAL_SEC * 1000);
    } else {
        this.timer = new PauseableInterval(this, this.decrementScore, Powerup.UPDATE_POINTS_INTERVAL_SEC * 1000);
    }
    this.score = 0;
    this.flipflopPowerAchieved = false;
    this.firePowerAchieved = false;
    this.shufflerPowerAchieved = false;
    this.currentFocus = 0;
    this.nextFocus = 0;
    this.powerSelected = 0;
    if (powerupPoints > 0) {
        this.score = powerupPoints;
        if (Powerup.POWER_POINTS > this.score) {
            this.update();
        }
        this.updatePowerAchieved();
    }
	this.registerMouseListeners();
}

Powerup.prototype.registerMouseListeners = function () {
	var powerUp = this;
	powerUp.divFlipFlopAnimation.on('mouseover',function(){powerUp.handleMouseOver(this);});
	powerUp.divFlipFlopAnimation.on('click',function(){powerUp.handleMouseClick(this);});
	powerUp.divFireAnimation.on('mouseover',function(){powerUp.handleMouseOver(this);});
	powerUp.divFireAnimation.on('click',function(){powerUp.handleMouseClick(this);});
	powerUp.divShuffleAnimation.on('mouseover',function(){powerUp.handleMouseOver(this);});
	powerUp.divShuffleAnimation.on('click',function(){powerUp.handleMouseClick(this);});
	
	powerUp.divFlipFlopAnimation.on('mouseout',function(){powerUp.handleMouseOut(this);});
	powerUp.divFireAnimation.on('mouseout',function(){powerUp.handleMouseOut(this);});
	powerUp.divShuffleAnimation.on('mouseout',function(){powerUp.handleMouseOut(this);});
	
};

Powerup.prototype.handleMouseOut = function(element){
	this.board.isPowerUpFocused =false;
	if(!this.isPowerSelected()){
		this.update();
	}
	this.currentFocus=0;
	this.nextFocus=0;
	window.onkeydown=null;
	this.focusOn= 0;
	window.onkeydown = this.boardKeyHandler;
	this.board.tileActive.setActiveAsync().done();
};
Powerup.prototype.handleMouseOver = function(element){
	if(this.isPowerAchieved() && (!this.isPowerSelected())){
		if(!this.board.isPowerUpFocused){
			this.addListener();
			this.board.isPowerUpFocused = true;
		}
		this.board.level.levelAnimation.stopCreatureSelectionAnimation();
		this.board.tileActive.setInactiveAsync();
		if(this.flipflopPowerAchieved &&  element.id== 'div-flip-flop-animation-power-up'){
			this.currentFocus = Powerup.FLIPFLOP_SELECTED;
			this.focus();
		}else if(this.firePowerAchieved && element.id== 'div-fire-animation-power-up'){
			this.currentFocus = Powerup.FIRE_SELECTED;
			this.focus();
		}else if(this.shufflerPowerAchieved && element.id== 'div-shuffle-animation-power-up'){
			this.currentFocus = Powerup.SHUFFLER_SELECTED;
			this.focus();
		}
	}
};

Powerup.prototype.handleMouseClick = function(element){
	if(this.isPowerAchieved() && (!this.isPowerSelected())){
		if(this.flipflopPowerAchieved &&  element.id== 'div-flip-flop-animation-power-up'){
			this.currentFocus = Powerup.FLIPFLOP_SELECTED;
			this.focusOn= 1;
			this.handleSelect();
			this.board.isPowerUpFocused = false;
		}else if(this.firePowerAchieved && element.id== 'div-fire-animation-power-up'){
			this.currentFocus = Powerup.FIRE_SELECTED;
			this.focusOn= 1;
			this.handleSelect();
			this.board.isPowerUpFocused = false;			
		}else if(this.shufflerPowerAchieved && element.id== 'div-shuffle-animation-power-up'){
			this.currentFocus = Powerup.SHUFFLER_SELECTED;
			this.focusOn= 1;
			this.handleSelect();
			this.board.isPowerUpFocused = false;			
		}
	}	
};

Powerup.prototype.updateCheat = function (sender) {
    $('#ppoints').html(sender.score);
    $('#ptime').html(Math.round(sender.timer.getTimeLeft() / 1000));
};
Powerup.prototype.activatePowerUpUsingCheatCode = function () {
    console.log('Powerup CheatCode used');
    this.score += Powerup.POWER_POINTS;
    this.updatePowerAchieved();
};

Powerup.prototype.addListener = function (arrowKey) {
    var powerup = this;
    powerup.board.isPowerUpFocused = true;
    if (arrowKey) {
        this.currentFocus = -1;
        switch (arrowKey) {
        case "up":
            powerup.handleUp();
            break;
        case "down":
            powerup.handleDown();
            break;
        }
    }
    powerup.focus();
    powerup.focusOn = 1;
    powerup.registerEvents();
};

Powerup.prototype.registerEvents = function () {
    var powerup = this;
	var powerUpDivs = ['div-flip-flop-animation-power-up','div-fire-animation-power-up','div-shuffle-animation-power-up'];	
    _.each( powerUpDivs, function( animationDiv ) {
		$('#'+animationDiv).off( 'keydown');
		$('#'+animationDiv).on( 'keydown', function(evt) {
			powerup.handleKeyBoardEvent(evt);
		});
	});
}; //Powerup.prototype.registerEvents

Powerup.prototype.handleKeyBoardEvent = function (e) {
	var powerup = this;
	switch (e.keyCode) {
        case 37: // left arrow
            powerup.removeNavigation(e);
            break;
            // User pressed "up" arrow
        case 38:
            if (powerup.handleUp()) {
                powerup.focus();
            } else {
                powerup.removeNavigation(e);
            }
            break;
        case 39: // right arrow
            powerup.removeNavigation(e);
            break;
            // User pressed "down" arrow
        case 40:
            if (powerup.handleDown()) {
                powerup.focus();
            } else {
                powerup.removeNavigation(e);
            }
            break;
            // User pressed "enter"
        case 13:
			  powerup.handleSelect();
			  powerup.nextFocus=0;
			  powerup.board.isPowerUpFocused = false;
			  powerup.board.focus();
		      break;
	}
	e.preventDefault();
	e.stopPropagation();
}
Powerup.prototype.removeNavigation = function (e) {
    this.update();
    this.currentFocus = 0;
    this.nextFocus = 0;
    this.focusOn = 0;
    this.board.isPowerUpFocused = false;
	this.board.focus();
	this.board.handleKeyboardEvent(e);
};

Powerup.prototype.powerUsed = function () {
    if (this.isFlipFlopSelected()) {
        this.flipflopPowerAchieved = false;
        this.board.level.levelAnimation.stopPowerAchieved(this.flipflopAnimator);
        this.board.level.levelAnimation.stopPowerActivated();
    } else if (this.isFireSelected()) {
        this.firePowerAchieved = false;
        this.board.level.levelAnimation.stopPowerAchieved(this.fireAnimator);
        this.board.level.levelAnimation.stopPowerActivated();
    } else if (this.isShufflerSelected()) {
        this.shufflerPowerAchieved = false;
        this.board.level.levelAnimation.stopPowerAchieved(this.shufflerAnimator);
    }
    this.update();
    this.powerSelected = 0;
    this.focusOn = 0;
    this.currentFocus = 0;
    //this.board.saveBoard(); // auto save state when power is used.
};

Powerup.prototype.handleSelect = function () {
    var levelAnimation = this.board.level.levelAnimation;
    if (this.currentFocus == Powerup.FLIPFLOP_SELECTED) {
        this.powerSelected = Powerup.FLIPFLOP_SELECTED;
        this.drawFlipFlop(Powerup.POWER_PRESSED);
        levelAnimation.animatePowerActivated(this.divFlipFlopAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.FLIPFLOP_ANIMATION_TOP]);
    } else if (this.currentFocus == Powerup.FIRE_SELECTED) {
        this.powerSelected = Powerup.FIRE_SELECTED;
        this.drawFire(Powerup.POWER_PRESSED);
        levelAnimation.animatePowerActivated(this.divFireAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.FIRE_ANIMATION_TOP]);
    } else if (this.currentFocus == Powerup.SHUFFLER_SELECTED) {
        this.powerSelected = Powerup.SHUFFLER_SELECTED;
        this.drawShuffler(Powerup.POWER_PRESSED);
        Galapago.audioPlayer.playShufflePowerUsed();
        this.powerUsed();
        this.board.shuffleBoard();
    }
};

Powerup.prototype.handleUp = function () {
    this.nextFocus = 0;
    if (this.currentFocus == -1) {
        if (this.shufflerPowerAchieved) {
            this.nextFocus = Powerup.SHUFFLER_SELECTED;
        } else if (this.firePowerAchieved) {
            this.nextFocus = Powerup.FIRE_SELECTED;
        } else if (this.flipflopPowerAchieved) {
            this.nextFocus = Powerup.FLIPFLOP_SELECTED;
        }
        return true;
    }
    if (this.currentFocus == Powerup.FLIPFLOP_SELECTED) {
        return false;
    }
    if (this.currentFocus == Powerup.FIRE_SELECTED) {
        if (this.flipflopPowerAchieved) {
            this.nextFocus = Powerup.FLIPFLOP_SELECTED;
        } else {
            return false;
        }
    }
    if (this.currentFocus == Powerup.SHUFFLER_SELECTED) {
        if (this.firePowerAchieved) {
            this.nextFocus = Powerup.FIRE_SELECTED;
        } else if (this.flipflopPowerAchieved) {
            this.nextFocus = Powerup.FLIPFLOP_SELECTED;
        } else {
            return false;
        }
    }
    return true;
};

Powerup.prototype.handleDown = function () {
    this.nextFocus = 0;
    if (this.currentFocus == -1) {
        if (this.flipflopPowerAchieved) {
            this.nextFocus = Powerup.FLIPFLOP_SELECTED;
        } else if (this.firePowerAchieved) {
            this.nextFocus = Powerup.FIRE_SELECTED;
        } else if (this.shufflerPowerAchieved) {
            this.nextFocus = Powerup.SHUFFLER_SELECTED;
        }
        return true;
    }
    if (this.currentFocus == Powerup.FLIPFLOP_SELECTED) {
        if (this.firePowerAchieved) {
            this.nextFocus = Powerup.FIRE_SELECTED;
        } else if (this.shufflerPowerAchieved) {
            this.nextFocus = Powerup.SHUFFLER_SELECTED;
        } else {
            return false;
        }
    }
    if (this.currentFocus == Powerup.FIRE_SELECTED) {
        if (this.shufflerPowerAchieved) {
            this.nextFocus = Powerup.SHUFFLER_SELECTED;
        } else {
            return false;
        }
    }
    if (this.currentFocus == Powerup.SHUFFLER_SELECTED) {
        return false;
    }
    return true;
};


Powerup.prototype.isPowerAchieved = function () {
    return this.flipflopPowerAchieved || this.firePowerAchieved || this.shufflerPowerAchieved;
};

Powerup.prototype.isPowerSelected = function () {
    return this.isFlipFlopSelected() || this.isFireSelected() || this.isShufflerSelected();
};

Powerup.prototype.isFlipFlopSelected = function () {
    //return true;
    return (this.powerSelected === Powerup.FLIPFLOP_SELECTED);
};

Powerup.prototype.isFireSelected = function () {
    return (this.powerSelected === Powerup.FIRE_SELECTED);
};

Powerup.prototype.isShufflerSelected = function () {
    return (this.powerSelected === Powerup.SHUFFLER_SELECTED);
};

Powerup.prototype.focus = function () {
    var ctx, left, top, width, height;
    ctx = this.layer;
    left = Powerup.LEFT;
    top = Powerup.TOP;
    width = this.swap_disabled.width;
    height = this.swap_disabled.height;
    this.div.empty();
    this.addImage(this.div.selector, this.powerups_holder, 0, 0, 1);

    if ((this.flipflopPowerAchieved && (this.currentFocus === 0 || (this.nextFocus === 0 && this.currentFocus == Powerup.FLIPFLOP_SELECTED))) || (this.nextFocus == Powerup.FLIPFLOP_SELECTED)) {
        if (this.isFlipFlopSelected()) {
            this.drawFlipFlop(Powerup.POWER_PRESSED);
        } else {
            this.drawFlipFlop(Powerup.POWER_ROLLOVER);
        }
        this.currentFocus = Powerup.FLIPFLOP_SELECTED;
		//this.divShuffler.focus();
        if (this.firePowerAchieved) {
            this.drawFire(Powerup.POWER_ACTIVATED);
        } else {
            this.drawFire();
        }

        if (this.shufflerPowerAchieved) {
            this.drawShuffler(Powerup.POWER_ACTIVATED);
        } else {
            this.drawShuffler();
        }

    } else if ((this.firePowerAchieved && (this.currentFocus === 0 || (this.nextFocus === 0 && this.currentFocus == Powerup.FIRE_SELECTED))) || (this.nextFocus == Powerup.FIRE_SELECTED)) {
        if (this.flipflopPowerAchieved) {
            this.drawFlipFlop(Powerup.POWER_ACTIVATED);
        } else {
            this.drawFlipFlop();
        }
        if (this.isFireSelected()) {
            this.drawFire(Powerup.POWER_PRESSED);
        } else {
            this.drawFire(Powerup.POWER_ROLLOVER);
        }

        if (this.shufflerPowerAchieved) {
            this.drawShuffler(Powerup.POWER_ACTIVATED);
        } else {
            this.drawShuffler();
        }
        this.currentFocus = Powerup.FIRE_SELECTED;
    } else if ((this.shufflerPowerAchieved && (this.currentFocus === 0 || (this.nextFocus === 0 && this.currentFocus == Powerup.SHUFFLER_SELECTED))) || (this.nextFocus == Powerup.SHUFFLER_SELECTED)) {

        if (this.flipflopPowerAchieved) {
            this.drawFlipFlop(Powerup.POWER_ACTIVATED);
        } else {
            this.drawFlipFlop();
        }

        if (this.firePowerAchieved) {
            this.drawFire(Powerup.POWER_ACTIVATED);
        } else {
            this.drawFire();
        }
        if (this.isShufflerSelected()) {
            this.drawShuffler(Powerup.POWER_PRESSED);
        } else {
            this.drawShuffler(Powerup.POWER_ROLLOVER);
        }
        this.currentFocus = Powerup.SHUFFLER_SELECTED;

    }
    this.animatePowerStatus();
	
};

Powerup.prototype.updatePowerup = function (tripletCount) {
    if (this.timer) {
        this.timer.reset(this);
    }
    this.score += tripletCount;
    console.log('incrementScore' + this.score);
    console.log('incrementScore' + this.score / Powerup.POWER_POINTS);
    if (this.score < Powerup.POWER_POINTS) {
        if (this.focusOn == 1) {
            this.focus();
        } else {
            this.update();
        }
    }
    return this.updatePowerAchieved();
};


Powerup.prototype.timerPause = function () {
    console.log('powerup pause');
	if(!this.timer.isPaused){
		if (this.timer) {
			this.timer.pause();
		}
		//if(this.flipflopPowerAchieved || this.isFlipFlopSelected()){

		this.board.level.levelAnimation.stopAllPowerAchieved();
		this.board.level.levelAnimation.stopPowerActivated();
		this.timer.isPaused = true;
		this.timer.isResumed = false;
	}
};

Powerup.prototype.timerResume = function () {
    console.log('powerup resume');
	if(!this.timer.isResumed){
		var levelAnimation = this.board.level.levelAnimation;
		if (this.timer) {
			this.timer.resume();
		}
		if (this.flipflopPowerAchieved) {
			this.flipflopAnimator = levelAnimation.animatePowerAchieved(this.divFlipFlopAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.FLIPFLOP_ANIMATION_TOP]);
		}
		if(this.firePowerAchieved){
			this.fireAnimator = levelAnimation.animatePowerAchieved(this.divFireAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.FIRE_ANIMATION_TOP]);
		}
		if(this.shufflerPowerAchieved){
			this.shufflerAnimator = levelAnimation.animatePowerAchieved(this.divShuffleAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.SHUFFLER_ANIMATION_TOP]); //424
		}
		if(this.isFlipFlopSelected()){
			levelAnimation.animatePowerActivated(this.divFlipFlopAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.FLIPFLOP_ANIMATION_TOP]);
		}else if(this.isFireSelected()){
			levelAnimation.animatePowerActivated(this.divFireAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.FIRE_ANIMATION_TOP]);
		}
		this.timer.isPaused = false;
		this.timer.isResumed = true;
	}
};

Powerup.prototype.decrementScore = function (sender) {

    if (sender && sender.score > 0) {
        if (sender.timer) {
            sender.timer.reset(sender);
        }
        sender.score -= 1;
        if (sender.focusOn == 1) {
            sender.focus();
        } else {
            sender.update();
        }
    }

    // console.log('decrementScore' +sender.score );
};

Powerup.prototype.animatePowerStatus = function () {
    var percentScoreGain = this.score / Powerup.POWER_POINTS;

    var clipHeight = ((Powerup.POWER_ICON_HEIGHT / 2) * percentScoreGain);
    console.debug("clipHeight : " + clipHeight);
    var newHeight = ((Powerup.POWER_ICON_HEIGHT / 2) - clipHeight);
    console.debug('newHeight : ' + newHeight);

    if (!this.flipflopPowerAchieved && clipHeight) {
        //this.layer.drawImage( this.swap_fill ,0, newHeight, this.swap_fill.width , clipHeight, 15, (Powerup.FLIPFLOP_TOP +Powerup.POWER_ICON_HEIGHT+10 - (clipHeight*2)) ,this.swap_fill.width*2,clipHeight*2 );
        //$('#div-flip-flop-power-up').css( 'backgroundImage', 'url(' + this.swap_fill.src + ')' );
        //$('#div-flip-flop-power-up').css( 'height', clipHeight + 'px' );
    } else if (!this.firePowerAchieved && clipHeight) {
        //this.layer.drawImage( this.flame_fill ,0, newHeight, this.flame_fill.width , clipHeight, 15, (Powerup.FIRE_TOP +Powerup.POWER_ICON_HEIGHT +10 - (clipHeight*2)) ,this.flame_fill.width*2,clipHeight*2 );
    } else if (!this.shufflerPowerAchieved && clipHeight) {
        //this.layer.drawImage( this.shuffle_fill ,0, newHeight, this.shuffle_fill.width , clipHeight, 15, (Powerup.SHUFFLER_TOP +Powerup.POWER_ICON_HEIGHT +10 - (clipHeight*2)) ,this.shuffle_fill.width*2,clipHeight*2 );
    }
};

Powerup.prototype.updatePowerAchieved = function () {
    var flagPowerUpdated, levelAnimation;
    flagPowerUpdated = false;
    levelAnimation = this.board.level.levelAnimation;
    //gameBoardSelector = this.board.screenDiv.selector;
   // posleft = Powerup.LEFT + 11;

    while (this.score >= Powerup.POWER_POINTS) {
        if (!this.flipflopPowerAchieved) {
            this.flipflopPowerAchieved = true;
            this.board.level.flashBubbleTip("Game Tips.FlipFlopReady");
            this.flipflopAnimator = this.board.level.levelAnimation.animatePowerAchieved(this.divFlipFlopAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.FLIPFLOP_ANIMATION_TOP]); //[115,222]//[124,262]
        } else if (!this.firePowerAchieved) {
            this.firePowerAchieved = true;
            this.board.level.flashBubbleTip("Game Tips.FireReady");
            this.fireAnimator = this.board.level.levelAnimation.animatePowerAchieved(this.divFireAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.FIRE_ANIMATION_TOP]); //343
        } else if (!this.shufflerPowerAchieved) {
            this.shufflerPowerAchieved = true;
            this.board.level.flashBubbleTip("Game Tips.ShufflerReady");
            this.shufflerAnimator = this.board.level.levelAnimation.animatePowerAchieved(this.divShuffleAnimation.selector, [Powerup.ANIMATION_LEFT, Powerup.SHUFFLER_ANIMATION_TOP]); //424
        }
        this.score -= Powerup.POWER_POINTS;
        if (this.focusOn == 1) {
            this.focus();
        } else {
            this.update();
        }
        flagPowerUpdated = true;
    }
    return flagPowerUpdated;
}; //Powerup.prototype.updatePowerAchieved()

Powerup.prototype.initImages = function () {
    var powerup, image;
    powerup = this;
    _.each(Powerup.gameImageNames, function (imageName) {
        image = LoadingScreen.gal.get(Powerup.GAME_IMAGE_DIRECTORY + imageName + Powerup.IMAGE_PATH_SUFFIX);
        powerup[replaceAll(imageName, '-', '_')] = image;
    });
}; //DangerBar.prototype.initImages

Powerup.prototype.drawFlipFlop = function (state) {
    this.divFlipFlop.empty();
    this.divFlipFlop.css('border', 'none');
    this.addImage(this.divFlipFlop.selector, this.swap_disabled, 0, 0, 2);
    if (state == Powerup.POWER_ACTIVATED || state == Powerup.POWER_ROLLOVER || state == Powerup.POWER_PRESSED) {
        if (state == Powerup.POWER_ROLLOVER || state == Powerup.POWER_PRESSED) {
            this.divFlipFlop.css('border', '1px solid red;');
			this.divFlipFlopAnimation.focus();
        }
        this.addImage(this.divFlipFlop.selector, this.swap_fill, 0 + Powerup.LEFT_ADJUSTMENT, Powerup.TOP_ADJUSTMENT, 2);
    }
}; //Powerup.prototype.drawFlipFlop()

Powerup.prototype.drawFire = function (state) {
    this.divFireUp.empty();
    this.divFireUp.css('border', 'none');
    this.addImage(this.divFireUp.selector, this.flame_disabled, 0, 0, 2);
    if (state == Powerup.POWER_ACTIVATED || state == Powerup.POWER_ROLLOVER || state == Powerup.POWER_PRESSED) {
        if (state == Powerup.POWER_ROLLOVER || state == Powerup.POWER_PRESSED) {
            this.divFireUp.css('border', '1px solid red;');
			this.divFireAnimation.focus();
        }
        this.addImage(this.divFireUp.selector, this.flame_fill, 0 + Powerup.LEFT_ADJUSTMENT, Powerup.TOP_ADJUSTMENT, 2);
    }
}; //Powerup.prototype.drawFire()

Powerup.prototype.drawShuffler = function (state) {
    this.divShuffler.empty();
    this.divShuffler.css('border', 'none');
    this.addImage(this.divShuffler.selector, this.shuffle_disabled, 0, 0, 2);
    if (state == Powerup.POWER_ACTIVATED || state == Powerup.POWER_ROLLOVER || state == Powerup.POWER_PRESSED) {
        if (state == Powerup.POWER_ROLLOVER || state == Powerup.POWER_PRESSED) {
            this.divShuffler.css('border', '1px solid red;');
			this.divShuffleAnimation.focus();
        }
        this.addImage(this.divShuffler.selector, this.shuffle_fill, 0 + Powerup.LEFT_ADJUSTMENT, Powerup.TOP_ADJUSTMENT, 2);
    }
}; //Powerup.prototype.drawShuffler()

Powerup.prototype.update = function () {
    this.div.empty();
    this.addImage(this.div.selector, this.powerups_holder, 0, 0, 1);
    if (this.flipflopPowerAchieved) {
        this.drawFlipFlop(Powerup.POWER_ACTIVATED);
    } else {
        this.drawFlipFlop();
    }
    if (this.firePowerAchieved) {
        this.drawFire(Powerup.POWER_ACTIVATED);
    } else {
        this.drawFire();
    }
    if (this.shufflerPowerAchieved) {
        this.drawShuffler(Powerup.POWER_ACTIVATED);
    } else {
        this.drawShuffler();
    }
    this.animatePowerStatus();
}; //Powerup.prototype.update()

Powerup.prototype.addImage = function (parentElementSelector, sprite, left, top, magnificationFactor) {
    var image;
    image = new Image();
    image.src = sprite.src;
    image.width = sprite.naturalWidth * magnificationFactor;
    image.height = sprite.naturalHeight * magnificationFactor;
    image.style.position = 'absolute';
    image.style.left = left + 'px';
    image.style.top = top + 'px';
    $(parentElementSelector).append(image);
    return image;
}; //Powerup.prototype.addImage()

Powerup.prototype.showTip = function () {
    if (!this.flipflopPowerAchieved && !this.firePowerAchieved && !this.shufflerPowerAchieved) {
        this.board.level.flashBubbleTip("Game Tips.FlipFlopNotReady");
    } else if (!this.firePowerAchieved) {
        this.board.level.flashBubbleTip("Game Tips.FireNotReady");
    } else if (!this.shufflerPowerAchieved) {
        this.board.level.flashBubbleTip("Game Tips.ShufflerNotReady");
    }
};