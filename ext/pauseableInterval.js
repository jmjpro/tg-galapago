// see @Tyler Whitehouse's answer at http://stackoverflow.com/a/11196395/567525
function PauseableInterval(sender, func, delay, funcStatus, delayStatus){
    this.func = func;
    this.delay = delay;
    this.funcStatus = funcStatus;
    this.delayStatus = delayStatus;
	this.caller = sender;
    this.triggerSetAt = new Date().getTime();
    this.triggerTime = this.triggerSetAt + this.delay;
   // console.log('initial delay '+delay + ' now '+new Date().getTime());
    this.i = window.setInterval( this.func, this.delay ,sender );
    if( this.hasStatusInterval() ) {
        this.iStatus = window.setInterval( this.funcStatus, this.delayStatus, sender );
    }
    this.t_restart = null;
    this.paused_timeLeft = 0;
    this.getTimeLeft = function(){
        var now = new Date();
        return this.delay - ((now - this.triggerSetAt) % this.delay);
    };
    this.pause = function(){
        this.paused_timeLeft = this.getTimeLeft();
        //console.log('pause  time left : '+this.paused_timeLeft +' now : '+new Date().getTime());
        window.clearInterval(this.i);
        this.i = null;
        if( this.hasStatusInterval() ) {
            window.clearInterval(this.iStatus);
            this.iStatus = null;
        }
    };
    this.reset = function(sender){
        window.clearInterval(this.i);
        this.i = null;
        this.i = window.setInterval(this.func, this.delay,sender);

        if( this.hasStatusInterval() ) {
            window.clearInterval(this.iStatus);
            this.iStatus = null;
            this.iStatus = window.setInterval( this.funcStatus, this.delayStatus, sender );
        }
    };
    this.restart = function(sender){
        sender.i = window.setInterval(sender.func, sender.delay,this.caller);
        if( this.hasStatusInterval() ) {
            sender.iStatus = window.setInterval( sender.funcStatus, sender.delayStatus, this.caller );
        }
    };
    this.callAndRestart = function(sender){
      var pauseableInterval;
      pauseableInterval = sender;
      pauseableInterval.restart(pauseableInterval)
      //console.log('callAndRestart function called : ' +' now : '+new Date().getTime());
      pauseableInterval.func(pauseableInterval.caller);
      
      if( pauseableInterval.hasStatusInterval() ) {
        pauseableInterval.funcStatus(pauseableInterval.caller);
      }
    };
    this.resume = function(){
        if (this.i === null){
           // console.log('resume  time left : '+this.paused_timeLeft +' now : '+new Date().getTime());
            this.i = window.setTimeout(this.callAndRestart, this.paused_timeLeft, this);
        }

    };
    this.clearInterval = function(){
           window.clearInterval(this.i);
           if( this.hasStatusInterval() ) {
            window.clearInterval(this.iStatus);
           }
    };
	this.isRunning = function(){
		if(this.i !== null)
			return true;
		return false;
	};
} //function PauseableInterval()

PauseableInterval.prototype.hasStatusInterval = function() {
    if( this.funcStatus && this.delayStatus ) {
        return true;
    }
    else {
        return false;
    }
};
