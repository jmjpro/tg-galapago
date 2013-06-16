require.config({
	baseUrl: '',
   paths: {
    mocha: 'ext/mocha',
    chai: 'ext/chai',
    lodash: '../ext/lodash.min',
    game: '../js/game',
  }
});

require([
  'require', 'mocha'
],
function(require)  {

  mocha.setup('bdd');

  require([
    'js/TestMatrixUtil.js',
  ], function() {
    mocha.run();
  });
});