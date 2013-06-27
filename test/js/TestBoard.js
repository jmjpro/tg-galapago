define([
  'chai',
  'game',
  'lodash',
  'js/CommonUtil',
  ], function(chai) { 

	var expect = chai.expect;

	describe('Board', function(){
		describe('#getVerticalPointsSetsForHorizontalMatch', function(){
			it('should return vertical point sets for horizontal match', function(){
				
				var expectedCoordinatesArray = [
					[[4,5]],
					[[5,5]],
					[[6,5]],
					[[7,5]],
					[[8,5]]
				];
				var tileSets = [[getTile([4,5]),getTile([6,5]),getTile([5,5]),getTile([8,5]),getTile([7,5])]];
				var returnedCoordinatesArray = Board.getVerticalPointsSets(tileSets);
			 	expect(returnedCoordinatesArray).to.eql(expectedCoordinatesArray);
			});
		});
		describe('#getVerticalPointsSetsForVerticalMatch', function(){
			it('should return vertical point sets for vertical match', function(){
				
				var expectedCoordinatesArray = [
					[[6,3],[6,4],[6,5],[6,6],[6,7]]
				];
				var tileSets = [[getTile([6,4]),getTile([6,6]),getTile([6,5]),getTile([6,3]),getTile([6,7])]];
				var returnedCoordinatesArray = Board.getVerticalPointsSets(tileSets);
			 	expect(returnedCoordinatesArray).to.eql(expectedCoordinatesArray);
			})
		});
		describe('#getVerticalPointsSetsForHorizontalVerticalAndCocoonMatch', function(){
			it('should return vertical point sets for horizontal, vertical and cocoon match', function(){
				
				var expectedCoordinatesArray = [
					[[3,5]],
					[[4,4],[4,5],[4,6]],
					[[5,3]],
					[[5,5],[5,6]],
					[[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8]],
					[[7,4],[7,5]],
					[[7,7]],
					[[8,4],[8,5],[8,6]],
					[[9,5]]
				];
				var tileSets = [[getTile([6,4]),getTile([6,6]),getTile([6,5]),getTile([6,3]),getTile([6,7])],
								[getTile([4,5]),getTile([6,5]),getTile([5,5]),getTile([8,5]),getTile([7,5])],
								[getTile([6,2]),getTile([6,8]),getTile([3,5]),getTile([9,5])
								,getTile([5,3]),getTile([7,4]),getTile([5,6]),getTile([7,7])
								,getTile([4,4]),getTile([4,6]),getTile([8,6]),getTile([8,4])]
				];
				var returnedCoordinatesArray = Board.getVerticalPointsSets(tileSets);
			 	expect(returnedCoordinatesArray).to.eql(expectedCoordinatesArray);
			})
		});
		describe('#getVerticalPointsSetsRandomTiles', function(){
			it('should return vertical point sets for horizontal, vertical and cocoon match', function(){
				
				var expectedCoordinatesArray = [
					[[4,0]],
					[[4,7]]
				];
				var tileSets = [[getTile([4,0]),getTile([4,7])]];
				var returnedCoordinatesArray = Board.getVerticalPointsSets(tileSets);
			 	expect(returnedCoordinatesArray).to.eql(expectedCoordinatesArray);
			})
		});
	})

});
