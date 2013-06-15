define([
  'chai',
  'js/game.js',
  'ext/lodash.min'
], function(chai) { 

	var expect = chai.expect;

	describe('MatrixUtil.getHighestPoint', function(){
		it('should return highest point when the coordinates belongs to single column', function(){
			var points = [[6,4],[6,5],[6,3]];
		 	expect(points[2]).to.equal(MatrixUtil.getHighestPoint(points));
		})
	})

	describe('MatrixUtil.getFirstNRowPoints', function(){
		it('should return first N  point when the coordinates belongs to single column', function(){
			var points = [[6,3],[6,4],[6,5]];
			var expectedPoints = [[6,2],[6,1],[6,0]];
			var startIndex = 0;
			var returnedPoints = MatrixUtil.getFirstNRowPoints(points, startIndex);
		 	expect(returnedPoints).to.eql(expectedPoints);
		})
	})

});
