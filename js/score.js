/* begin class Score */
Score.FONT_SIZE = '30px';
Score.FONT_NAME = 'Calibri';
Score.X = 500;
Score.Y = 60;
Score.COLOR = 'cyan';
Score.MAX_WIDTH = 100;
Score.MAX_HEIGHT = 25;
Score.NUMBER_OF_TILES_CONSTITUTES_A_MATCH = 3;
Score.MATCHED_TILES_POINTS = 100;
Score.ADDITIONAL_MATCHED_TILES_POINTS = 100;
Score.MULTIPLIER_GOLD = 3;

function Score(){
}

Score.consolidateScores = function(scoreEvents){
	var score;
	score = 0;
	if( scoreEvents && scoreEvents.length > 0 ) {
		_.each(scoreEvents, function(scoreEvent) {
				score += scoreEvent.score();
		});
	}
	return score;
}

/* end class Score */

function ScoreEvent(totalTilesMatched, totalGoldTilesMatched, chainReactionCounter){
	this.totalTilesMatched = totalTilesMatched;
	this.totalGoldTilesMatched = totalGoldTilesMatched;
	this.chainReactionCounter = chainReactionCounter; 
}

ScoreEvent.prototype.score= function() {
	var score = 0;
	if(this.totalTilesMatched >= Score.NUMBER_OF_TILES_CONSTITUTES_A_MATCH){
		score += Score.MATCHED_TILES_POINTS;
	}
	if(this.totalTilesMatched > Score.NUMBER_OF_TILES_CONSTITUTES_A_MATCH){
		score += (this.totalTilesMatched - Score.NUMBER_OF_TILES_CONSTITUTES_A_MATCH) * Score.ADDITIONAL_MATCHED_TILES_POINTS;
	}
	if(this.totalGoldTilesMatched > 0){
		score *= Score.MULTIPLIER_GOLD; 
	}
	if(this.chainReactionCounter > 0){
		score *= this.chainReactionCounter;
	}
	return score;
}