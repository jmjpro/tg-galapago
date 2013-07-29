/* begin class Score */
Score.FONT_SIZE = '26';
Score.FONT_NAME = 'JungleFever';
Score.X = 500;
Score.Y = 60;
Score.COLOR = 'rgb(255,255,255)';
Score.MAX_WIDTH = 100;
Score.MAX_HEIGHT = 25;
Score.NUMBER_OF_TILES_CONSTITUTES_A_MATCH = 3;
Score.MATCHED_TILES_POINTS = 100;
Score.ADDITIONAL_MATCHED_TILES_POINTS = 100;
Score.MULTIPLIER_GOLD_OR_BLOCKED_TILE_MATCH = 3;
Score.MATCHED_COCOON_TILES_POINTS = 100;
Score.TILE_HIT_BY_LIGTNING_STRIKE_POINTS = 100;
Score.TILE_REMOVED_BY_SUPER_FRIEND_POINTS = 100;
Score.FIREPOWER_POERUP_USED_POINTS = 100;
Score.BONUS_FRENZY_CREATURE_POINTS = 50;
Score.BONUS_FRENZY_POWERUP_MULTIPLIER = 4;
Score.LEVEL_COMPLETE_TIME_BONUS_DIVISOR = 10;

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
	console.info( "increasing score by " + score );
	return score;
}

/* end class Score */

/* begin class ScoreEvent */
function ScoreEvent(totalTilesMatched,
					totalGoldTilesMatched,
					totalBlockedTilesMatched,
					totalCocoonTilesMatched,
					totalNonEmptyTilesHitByLightning,
					totalNonEmptyTilesRemoveBySuperFriend,
					chainReactionCounter){
	this.totalTilesMatched = totalTilesMatched;
	this.totalGoldTilesMatched = totalGoldTilesMatched;
	this.totalBlockedTilesMatched = totalBlockedTilesMatched;
	this.totalCocoonTilesMatched = totalCocoonTilesMatched;
	this.totalNonEmptyTilesHitByLightning = totalNonEmptyTilesHitByLightning;
	this.totalNonEmptyTilesRemoveBySuperFriend = totalNonEmptyTilesRemoveBySuperFriend;
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
	if(this.totalCocoonTilesMatched > 0){
		score += Score.MATCHED_COCOON_TILES_POINTS;
	}
	if(this.totalNonEmptyTilesHitByLightning > 0){
		score += this.totalNonEmptyTilesHitByLightning * Score.TILE_HIT_BY_LIGTNING_STRIKE_POINTS;
	}
	if(this.totalNonEmptyTilesRemoveBySuperFriend > 0){
		score += this.totalNonEmptyTilesRemoveBySuperFriend * Score.TILE_REMOVED_BY_SUPER_FRIEND_POINTS;
	}
	if(this.totalGoldTilesMatched > 0 || this.totalBlockedTilesMatched > 0){
		score *= Score.MULTIPLIER_GOLD_OR_BLOCKED_TILE_MATCH; 
	}
	if(this.chainReactionCounter > 0){
		score *= this.chainReactionCounter;
	}
	return score;
}
/* end class Score */