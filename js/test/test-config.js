require.config({
	baseUrl: '',
   paths: {
    mocha: 'ext/mocha',
    chai: 'ext/chai',
    game: 'js/game',
  }
});

require([
  'require', 'mocha'
],
function(require)  {

  mocha.setup('bdd');

  require([
    'js/test/TestMatrixUtil.js',
  ], function() {
    mocha.run();
  });
});