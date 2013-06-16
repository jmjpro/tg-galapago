define([
  'chai',
  'js/game.js',
  'ext/lodash.min'
], function(chai) { 

var expect = chai.expect;


describe('MatrixUtil', function(){
  

  describe('#isSameDimensions', function(){
    it('should return true when the two matrixes have same dimension', function(){
	  expect(true).to.equal(MatrixUtil.isSameDimensions([[],[]],[[],[]]));
	  expect(true).to.equal(MatrixUtil.isSameDimensions(  [
	                                                        [[],[]] , [[],[]],
														  ]	,
	                                                      [
	                                                        [[],[]] , [[],[]],
														  ]));
	// columns counts are equal and last column's row count is unequal.
	   expect(false).to.equal(MatrixUtil.isSameDimensions(  [
	                                                        [[],[]] , [[],[]],
														  ]	,
	                                                      [
	                                                        [[],[]] , [[]],
														  ]));
    })
  });
  
  
    describe('#getNeighborCoordinates', function(){
    it('should return Neighbor Coordinates by adding up the distance coordinaes', function(){
	  expect([4,7]).to.eql(MatrixUtil.getNeighborCoordinates([5,6],[-1,1]));
	  expect([7,8]).to.eql(MatrixUtil.getNeighborCoordinates([5,6],[2,2]));
	  expect([2,9]).to.eql(MatrixUtil.getNeighborCoordinates([5,6],[-3,3]));
	  expect([1,2]).to.eql(MatrixUtil.getNeighborCoordinates([5,6],[-4,-4]));
    })
    });
  
    describe('#getNeighborsAbovePoint', function(){
    it('should return Neighbor Coordinates above the given coordinaes in that column', function(){
	  expect([[5,5],[5,4],[5,3],[5,2],[5,1],[5,0]]).to.eql(MatrixUtil.getNeighborsAbovePoint([5,6]));
	
    })
    });
	
		
	describe('#getNeighborsAbovePoints', function(){
    it('should return Neighbor Coordinates above the given coordinaes in that column', function(){	 
	  expect([[4,2],[4,1],[4,0],[5,2],[5,1],[5,0],[6,2],[6,1],[6,0]]).to.eql(MatrixUtil.getNeighborsAbovePoints([[4,3],[5,3],[6,3]]));	  
	  expect([[4,2],[4,1],[4,0]]).to.eql(MatrixUtil.getNeighborsAbovePoints([[4,3],[4,4],[4,5]]));	
    })
    });
	
    describe('#isVerticalPointSet', function(){
    it('should return true if coordinates belongs to same column', function(){
	  expect(false).to.eql(MatrixUtil.isVerticalPointSet([[4,3],[5,3],[6,3]]));	  
	  expect(true).to.eql(MatrixUtil.isVerticalPointSet([[4,3],[4,4],[4,5]]));	
    })
    });
	
	
	
	describe('#getHighestPoint', function(){
    it('should return coordinates of the highest row ', function(){
	  expect([4,0]).to.eql(MatrixUtil.getHighestPoint([[4,2],[4,1],[4,0]]));	  	  
    })
    });
	
	
 	describe('#lowerPointByNRows', function(){
    it('should return coordinates by adjusting in row with given distance', function(){
	  expect([4,4]).to.eql(MatrixUtil.lowerPointByNRows([4,2],2));	  	  
    })
    });
	
	
 /*	describe('#getFirstNRowPoints', function(){
    it('depending on the number of rows N in the input verticalPoints,return the points in the first N rows of the column that holds those points', function(){
	  expect([[4,9],[4,10],[4,11]]).to.eql(MatrixUtil.getFirstNRowPoints([[4,8],[4,7],[4,6]],9));	  	  
    })
    });*/
	
	describe('#getFirstNRowPoints', function(){
    it('should return first N  point when the coordinates belongs to single column', function(){
      var points = [[6,3],[6,4],[6,5]];
      var expectedPoints = [[6,2],[6,1],[6,0]];
      var startIndex = 0;
      var returnedPoints = MatrixUtil.getFirstNRowPoints(points, startIndex);
       expect(returnedPoints).to.eql(expectedPoints);
    })
  }) 
	
	describe('#getNFirstRowPoints', function(){
    it('depending on the number of columns N in the input horizontalPoints,return the points in the first row of those N columms', function(){
	  expect([[5,0],[6,0],[7,0]]).to.eql(MatrixUtil.getNFirstRowPoints([[5,8],[6,8],[7,8]],9));	  	  
    })
    });

	describe('#pointsArrayToString', function(){
    it('convert array into String', function(){
	  expect('[[5,8], [6,8], [7,8]]').to.equal(MatrixUtil.pointsArrayToString([[5,8],[6,8],[7,8]]));	  	  
    })
    });
	
	describe('#coordinatesToString', function(){
    it('convert coordinate into String', function(){
	  expect('[5,8]').to.equal(MatrixUtil.coordinatesToString([5,8]));	  	  
    })
    });
	
	describe('#getChangingPoints', function(){
    it('determine the points that are about to change once the pointTriplet is removed', function(){
	  expect([[4,3],[5,3],[6,3],[4,2],[4,1],[4,0],[5,2],[5,1],[5,0],[6,2],[6,1],[6,0]]).to.eql(MatrixUtil.getChangingPoints([[4,3],[5,3],[6,3]]));	  	  
    })
    });

})


});
