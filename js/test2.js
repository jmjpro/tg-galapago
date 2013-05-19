var CREATURE_ANIMATION_DELAY_MS = 125;

function load() {
  var imgArray, layer;
  imgArray = [
    '/res/img/creatures/level_01/Cyclops_Crab_01.bmp',
    '/res/img/creatures/level_01/Electric_Cha_Toad_01.bmp'];

  imgpreload(imgArray, function( images ) {
    var stage, layer;

    stage = new Kinetic.Stage({
      container: 'canvas-main',
      width: 1024,
      height: 768
    });
    layer = new Kinetic.Layer();

    creatures = setupCreatures(layer, images);

    stage.add(layer);
  });
} //load()

function setupCreatures(layer, images) {
  var creature, creatures;

  CREATURE_BORDER_COLOR = '#d3d3d3';
  CREATURE_BORDER_WIDTH = 2;
  CREATURE_BORDER_RADIUS = 3;

  x = 0;
  repeat = 2;

  for( var imageIt = 0; imageIt < images.length; imageIt++ ) {
    console.debug(images[imageIt].src);

    for( var i=0; i < repeat; i++ ) {
      creature = new Kinetic.Image({
        name: 'one',
        x: x,
        y: 10,
        image: images[imageIt],
        width: images[imageIt].width,
        height: images[imageIt].height
      });

      border = new Kinetic.Rect({
          x: x - CREATURE_BORDER_WIDTH,
          y: 10 - CREATURE_BORDER_WIDTH,
          width: images[imageIt].width + CREATURE_BORDER_WIDTH,
          height: images[imageIt].height + CREATURE_BORDER_WIDTH,
          stroke: CREATURE_BORDER_COLOR,
          strokeWidth: CREATURE_BORDER_WIDTH,
          cornerRadius: CREATURE_BORDER_RADIUS
        });
      // add the shape to the layer
      layer.add(border);
      layer.add(creature);

      creature.on('mouseover', function(evt) {
        console.debug('creature mouseover');
        border.attrs.stroke = 'yellow';
        layer.draw();
      });
      x += images[imageIt].width + 5;
    }
  }

  return creature;
} //setupCreatures()

/* begin Creature class */
function Creature() {
  var creatureType;
  var cell;
}

Creature.prototype.cycle = function() {
  setTimeout(function() {
    creature.setImage(images[1]);
    layer.draw();
  }, CREATURE_ANIMATION_DELAY_MS);

  setTimeout(function() {
    creature.setImage(images[2]); 
    layer.draw();
  }, CREATURE_ANIMATION_DELAY_MS * 2);
};
/* end Creature class */