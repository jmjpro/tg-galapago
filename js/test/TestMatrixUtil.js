define([
  'chai',
  'js/game.js',
  'ext/lodash.min'
], function(chai) { 


var assert = chai.assert;

 describe('MatrixUtil.getHighestPoint', function(){
    it('should return highest point when the coordinates belongs to single column', function(){
    	var points = [[6,4],[6,5],[6,3]];
	 	assert.equal(points[2],MatrixUtil.getHighestPoint(points));
    })
  })

});
