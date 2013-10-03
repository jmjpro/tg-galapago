ImageCollage.CREATURE_COORDINATES = [
	{"cell": [0, 0, 46, 46]},
	{"cell": [46, 0, 46, 46]},
	{"cell": [92, 0, 46, 46]}
]

ImageCollage.CREATURE_COORDINATES_JSON = JSON.stringify(ImageCollage.CREATURE_COORDINATES);

ImageCollage.CREATURE_ROLLOVER_COORDINATES = [
	{"cell": [0, 0, 46, 46]},
	{"cell": [46, 0, 46, 46]},
	{"cell": [92, 0, 46, 46]},
	{"cell": [138, 0, 46, 46]},
	{"cell": [184, 0, 46, 46]}
]

ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON = JSON.stringify(ImageCollage.CREATURE_ROLLOVER_COORDINATES);

ImageCollage.CREATURE_JUMP_COORDINATES = [
	{"cell": [11, 0, 46, 92]},
	{"cell": [79, 0, 46, 92]},
	{"cell": [147, 0, 46, 92]},
	{"cell": [215, 0, 46, 92]},
	{"cell": [283, 0, 46, 92]}
]

ImageCollage.CREATURE_JUMP_COORDINATES_JSON = JSON.stringify(ImageCollage.CREATURE_JUMP_COORDINATES);

ImageCollage.COLLAGE_ARRAY = {
	"collage/main-menu-1.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 305, 60], "id": "main-menu/button-change-player-selected.png"},
			{"cell": [0, 60, 305, 60], "id": "main-menu/button-change-player-regular.png"},
			{"cell": [305, 0, 165, 60], "id": "main-menu/button-options-selected.png"},
			{"cell": [305, 60, 165, 60], "id": "main-menu/button-options-regular.png"}
		]
	},
	"collage/main-menu-2.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 234, 165], "id": "main-menu/button-timed-selected.png"},
			{"cell": [0, 165, 234, 165], "id": "main-menu/button-timed-regular.png"},
			{"cell": [0, 330, 234, 165], "id": "main-menu/button-relaxed-selected.png"},
			{"cell": [0, 495, 234, 165], "id": "main-menu/button-relaxed-regular.png"}
		]
	},
	"collage/arrows.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 25, 25], "id": "main-menu/arrow-left.png"},
			{"cell": [0, 25, 25, 25], "id": "main-menu/arrow-right.png"}
		]
	},
	'collage/dialog-buttons.png':{
		'imageCoordinateArray': [
		
			{'cell': [0,0,180,44], 'id': 'dialog/button-disabled.png'},
			{'cell': [0,44,180,44], 'id': 'dialog/button-regular.png'},
			{'cell': [10,98,180,44], 'id': 'dialog/button-hilight.png'}
		]
	},
	"collage/dialog-arrow-buttons.png":{
		"imageCoordinateArray": [
			{"cell": [98, 0, 33, 34], "id": "dialog/arrow-button-up-hilight.png"},
			{"cell": [131, 0, 33, 34], "id": "dialog/arrow-button-up-disable.png"},
			{"cell": [164, 0, 33, 34], "id": "dialog/arrow-button-down-hilight.png"},
			{"cell": [197, 0, 33, 34], "id": "dialog/arrow-button-down-disable.png"}
		]
	},
	"collage/keypad-buttons.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 1, 1], "id": "dialog/keypad-button-1.png"}
		]
	},
	"collage/map-board-1.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 36, 39], "id": "screen-map/level-stars-silver.png"},
			{"cell": [40, 0, 36, 39], "id": "screen-map/level-stars-gold.png"},
			{"cell": [80, 0, 40, 35], "id": "screen-map/green-v.png"},
			{"cell": [120, 0, 29, 34], "id": "screen-map/level-lock.png"},
			{"cell": [149, 0, 24, 52], "id": "screen-game/bracket-left.png"},
			{"cell": [173, 0, 24, 52], "id": "screen-game/bracket-right.png"}
		]
	},
	"collage/map-board-2.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 19, 284], "id": "screen-game/powerups-holder.png"},
			{"cell": [19, 0, 38, 26], "id": "screen-map/next-level-arrow-down.png"},
			{"cell": [19, 26, 38, 24], "id": "screen-map/next-level-arrow-left-down.png"},
			{"cell": [19, 50, 38, 24], "id": "screen-map/next-level-arrow-right-down.png"},
			{"cell": [19, 74, 30, 24], "id": "screen-map/next-level-arrow-left-up.png"},
			{"cell": [19, 98, 30, 24], "id": "screen-map/next-level-arrow-right-up.png"},
			{"cell": [19, 122, 34, 25], "id": "screen-map/next-level-arrow-left.png"},
			{"cell": [19, 147, 34, 25], "id": "screen-map/next-level-arrow-right.png"},
			{"cell": [19, 172, 27, 22], "id": "screen-map/next-level-arrow-up.png"},
			{"cell": [57, 0, 56, 56], "id": "screen-game/tile-active.png"},
			{"cell": [57, 56, 52, 52], "id": "screen-game/tile-selected.png"},
			{"cell": [57, 108, 46, 46], "id": "screen-game/tile-regular.png"},
			{"cell": [57, 154, 41, 33], "id": "screen-game/item-collected-mark.png"}
		]
	},
	"collage/map-board-buttons.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 150, 55], "id": "screen-map/button-regular.png"},
			{"cell": [150, 0, 150, 55], "id": "screen-map/button-cursor.png"}
		]
	},
	"collage/game-powerup.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 35, 35], "id": "screen-game/flame-disabled.png"},
			{"cell": [0, 35, 19, 19], "id": "screen-game/flame-fill.png"},
			{"cell": [35, 0, 35, 35], "id": "screen-game/swap-disabled.png"},
			{"cell": [19, 35, 19, 19], "id": "screen-game/swap-fill.png"},
			{"cell": [70, 0, 35, 35], "id": "screen-game/shuffle-disabled.png"},
			{"cell": [38, 35, 19, 19], "id": "screen-game/shuffle-fill.png"}
		]
	},
	"collage/gold-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 46, 46], "id": "screen-game/gold/gold-1.png"}
		]
	},
	"collage/heads-mouth-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 60, 62]},
			{"cell": [60, 0, 60, 62]},
			{"cell": [120, 0, 60, 62]},
			{"cell": [180, 0, 60, 62]},
			{"cell": [240, 0, 60, 62]},
			{"cell": [300, 0, 60, 62]},
			{"cell": [360, 0, 60, 62]}
		]
	},
	"collage/heads-eyes-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 552, 21], "id": "collage/heads-right-eyes-strip.png"},
			{"cell": [0, 21, 481, 21], "id": "collage/heads-left-eyes-strip.png"}
		]
	},
	"collage/heads-left-eyes-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 37, 21]},
			{"cell": [37, 0, 37, 21]},
			{"cell": [74, 0, 37, 21]},
			{"cell": [111, 0, 37, 21]},
			{"cell": [148, 0, 37, 21]},
			{"cell": [185, 0, 37, 21]},
			{"cell": [222, 0, 37, 21]},
			{"cell": [259, 0, 37, 21]},
			{"cell": [296, 0, 37, 21]},
			{"cell": [333, 0, 37, 21]},
			{"cell": [370, 0, 37, 21]},
			{"cell": [407, 0, 37, 21]}
		]
	},
	"collage/heads-right-eyes-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 46, 21]},
			{"cell": [46, 0, 46, 21]},
			{"cell": [92, 0, 46, 21]},
			{"cell": [138, 0, 46, 21]},
			{"cell": [184, 0, 46, 21]},
			{"cell": [230, 0, 46, 21]},
			{"cell": [276, 0, 46, 21]},
			{"cell": [322, 0, 46, 21]},
			{"cell": [368, 0, 46, 21]},
			{"cell": [414, 0, 46, 21]},
			{"cell": [460, 0, 46, 21]},
			{"cell": [506, 0, 46, 21]}
		]
	},
	"collage/game-beach-jump-strips.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 340, 92], "id": "creatures/beach/blue-crab-jump-strip.png"},
			{"cell": [0, 92, 340, 92], "id": "creatures/beach/green-turtle-jump-strip.png"},
			{"cell": [0, 184, 340, 92], "id": "creatures/beach/pink-frog-jump-strip.png"},
			{"cell": [0, 276, 340, 92], "id": "creatures/beach/red-starfish-jump-strip.png"},
			{"cell": [0, 368, 340, 92], "id": "creatures/beach/teal-blob-jump-strip.png"},
			{"cell": [0, 460, 340, 92], "id": "creatures/beach/violet-crab-jump-strip.png"},
			{"cell": [0, 552, 340, 92], "id": "creatures/beach/yellow-fish-jump-strip.png"}
		]
	},
	"collage/game-beach-rollover-strips.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 230, 46], "id": "creatures/beach/blue-crab-rollover-strip.png"},
			{"cell": [0, 46, 230, 46], "id": "creatures/beach/green-turtle-rollover-strip.png"},
			{"cell": [0, 92, 230, 46], "id": "creatures/beach/pink-frog-rollover-strip.png"},
			{"cell": [0, 138, 230, 46], "id": "creatures/beach/red-starfish-rollover-strip.png"},
			{"cell": [0, 184, 230, 46], "id": "creatures/beach/teal-blob-rollover-strip.png"},
			{"cell": [0, 230, 230, 46], "id": "creatures/beach/violet-crab-rollover-strip.png"},
			{"cell": [0, 276, 230, 46], "id": "creatures/beach/yellow-fish-rollover-strip.png"}
		]
	},
	"collage/game-forest-jump-strips.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 260, 92], "id": "creatures/forest/blue-beetle-jump-strip.png"},
			{"cell": [0, 92, 260, 92], "id": "creatures/forest/green-butterfly-jump-strip.png"},
			{"cell": [0, 184, 260, 92], "id": "creatures/forest/pink-lizard-jump-strip.png"},
			{"cell": [0, 276, 260, 92], "id": "creatures/forest/red-beetle-jump-strip.png"},
			{"cell": [0, 368, 260, 92], "id": "creatures/forest/teal-bug-jump-strip.png"},
			{"cell": [0, 460, 260, 92], "id": "creatures/forest/violet-moth-jump-strip.png"},
			{"cell": [0, 552, 260, 92], "id": "creatures/forest/yellow-frog-jump-strip.png"}
		]
	},
	"collage/game-forest-rollover-strips.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 230, 46], "id": "creatures/forest/blue-beetle-rollover-strip.png"},
			{"cell": [0, 46, 230, 46], "id": "creatures/forest/green-butterfly-rollover-strip.png"},
			{"cell": [0, 92, 230, 46], "id": "creatures/forest/pink-lizard-rollover-strip.png"},
			{"cell": [0, 138, 230, 46], "id": "creatures/forest/red-beetle-rollover-strip.png"},
			{"cell": [0, 184, 230, 46], "id": "creatures/forest/teal-bug-rollover-strip.png"},
			{"cell": [0, 230, 230, 46], "id": "creatures/forest/violet-moth-rollover-strip.png"},
			{"cell": [0, 276, 230, 46], "id": "creatures/forest/yellow-frog-rollover-strip.png"}
		]
	},
	"collage/game-cave-jump-strips.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 350, 92], "id": "creatures/cave/blue-crystal-jump-strip.png"},
			{"cell": [0, 92, 350, 92], "id": "creatures/cave/green-frog-jump-strip.png"},
			{"cell": [0, 184, 350, 92], "id": "creatures/cave/pink-spike-jump-strip.png"},
			{"cell": [0, 276, 350, 92], "id": "creatures/cave/red-beetle-jump-strip.png"},
			{"cell": [0, 368, 350, 92], "id": "creatures/cave/teal-flyer-jump-strip.png"},
			{"cell": [0, 460, 350, 92], "id": "creatures/cave/violet-lizard-jump-strip.png"},
			{"cell": [0, 552, 350, 92], "id": "creatures/cave/yellow-bug-jump-strip.png"}
		]
	},
	"collage/game-cave-rollover-strips.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 230, 46], "id": "creatures/cave/blue-crystal-rollover-strip.png"},
			{"cell": [0, 46, 230, 46], "id": "creatures/cave/green-frog-rollover-strip.png"},
			{"cell": [0, 92, 230, 46], "id": "creatures/cave/pink-spike-rollover-strip.png"},
			{"cell": [0, 138, 230, 46], "id": "creatures/cave/red-beetle-rollover-strip.png"},
			{"cell": [0, 184, 230, 46], "id": "creatures/cave/teal-flyer-rollover-strip.png"},
			{"cell": [0, 230, 230, 46], "id": "creatures/cave/violet-lizard-rollover-strip.png"},
			{"cell": [0, 276, 230, 46], "id": "creatures/cave/yellow-bug-rollover-strip.png"}
		]
	},
	"collage/superfriends.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 46, 46], "id": "blue-friend"},
			{"cell": [0, 46, 46, 46], "id": "green-friend"},
			{"cell": [0, 92, 46, 46], "id": "pink-friend"},
			{"cell": [0, 138, 46, 46], "id": "red-friend"},
			{"cell": [0, 184, 46, 46], "id": "teal-friend"},
			{"cell": [0, 230, 46, 46], "id": "violet-friend"},
			{"cell": [0, 276, 46, 46], "id": "yellow-friend"}
		]
	},
	"collage/map-start-arrow-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 27, 65]},
			{"cell": [27, 0, 27, 65]},
			{"cell": [54, 0, 27, 65]},
			{"cell": [81, 0, 27, 65]},
			{"cell": [108, 0, 27, 65]},
			{"cell": [135, 0, 27, 65]},
			{"cell": [162, 0, 27, 65]},
			{"cell": [189, 0, 27, 65]},
			{"cell": [216, 0, 27, 65]}
		]
	},
	"collage/map-lava-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 95, 108]},
			{"cell": [95, 0, 95, 108]},
			{"cell": [190, 0, 95, 108]},
			{"cell": [285, 0, 95, 108]},
			{"cell": [380, 0, 95, 108]},
			{"cell": [475, 0, 95, 108]},
			{"cell": [570, 0, 95, 108]},
			{"cell": [665, 0, 95, 108]},
			{"cell": [760, 0, 95, 108]},
			{"cell": [855, 0, 95, 108]},
			{"cell": [950, 0, 95, 108]}
		]
	},
	"collage/game-tile-mark-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 30, 30]},
			{"cell": [0, 30, 30, 30]},
			{"cell": [0, 60, 30, 30]},
			{"cell": [0, 90, 30, 30]},
			{"cell": [0, 120, 30, 30]},
			{"cell": [0, 150, 30, 30]},
			{"cell": [0, 180, 30, 30]}
		]
	},
	"collage/map-bomb-left-one-strip.png":{
		"imageCoordinateArray": [
			 {"cell": [0, 0 ,73 , 105]},
			 {"cell": [73, 0,73 , 105]}, 
			 {"cell": [146, 0,73 , 105]}, 
			 {"cell": [219, 0,73 , 105]}, 
			 {"cell": [292, 0,73 , 105]}, 
			 {"cell": [365, 0,73 , 105]}, 
			 {"cell": [438, 0,73 , 105]},
			 {"cell": [511, 0,73 , 105]}, 
			 {"cell": [584, 0,73 , 105]}, 
			 {"cell": [657, 0,73 , 105]}, 
			 {"cell": [730, 0,73 , 105]}
		]	
	},
	"collage/map-bomb-left-two-strip.png":{
		"imageCoordinateArray": [ 
			 {"cell": [0, 0 , 80 , 121]},
			 {"cell": [80, 0, 80 , 121]}, 
			 {"cell": [160, 0, 80 , 121]}, 
			 {"cell": [240, 0, 80 , 121]}, 
			 {"cell": [320, 0, 80 , 121]}, 
			 {"cell": [400, 0, 80 , 121]}, 
			 {"cell": [480, 0, 80 , 121]},
			 {"cell": [560, 0, 80 , 121]}, 
			 {"cell": [640, 0, 80 , 121]}, 
			 {"cell": [720, 0, 80 , 121]}, 
			 {"cell": [800, 0, 80 , 121]}
		]	
	},
	"collage/map-bomb-mid-strip.png":{
		"imageCoordinateArray": [ 
			 {"cell": [0, 0 , 15.5 , 124]},
			 {"cell": [15.5, 0, 15.5 , 124]}, 
			 {"cell": [31, 0, 15.5 , 124]}, 
			 {"cell": [46.5, 0, 15.5 , 124]}, 
			 {"cell": [62, 0, 15.5 , 124]}, 
			 {"cell": [77.5, 0, 15.5 , 124]}, 
			 {"cell": [93, 0, 15.5 , 124]},
			 {"cell": [108.5, 0, 15.5 , 124]}
		]	
	},
	"collage/map-bomb-right-strip.png":{
		"imageCoordinateArray": [ 
			 {"cell": [0, 0 , 69.27, 98 ]},
			 {"cell": [69.27, 0, 69.27, 98]}, 
			 {"cell": [138.54, 0, 69.27, 98]}, 
			 {"cell": [207.81, 0, 69.27, 98]}, 
			 {"cell": [277.08, 0, 69.27, 98]}, 
			 {"cell": [346.35, 0, 69.27, 98]},
			 {"cell": [415.62, 0, 69.27, 98]}, 
			 {"cell": [484.89, 0, 69.27, 98]}, 
			 {"cell": [554.16, 0, 69.27, 98]}, 
			 {"cell": [623.43, 0, 69.27, 98]}, 
			 {"cell": [692.7, 0, 69.27, 98]}
		]	
	},
	"screen-map/bonfire-strip.png":{
		"imageCoordinateArray": [ 
			 {"cell": [0, 0 ,21 ,36]}, 
			 {"cell": [21, 0,21 ,36]}, 
			 {"cell": [42, 0,21 ,36]}, 
			 {"cell": [63, 0,21 ,36]}, 
			 {"cell": [84, 0,21 ,36]}, 
			 {"cell": [105, 0,21 ,36]}, 
			 {"cell": [126, 0,21 ,36]}, 
			 {"cell": [147, 0,21 ,36]}, 
			 {"cell": [168, 0,21 ,36]}, 
			 {"cell": [189, 0,21 ,36]},
			 {"cell": [210, 0,21 ,36]}, 
			 {"cell": [231, 0,21 ,36]}, 
			 {"cell": [252, 0,21 ,36]}, 
			 {"cell": [273, 0,21 ,36]}, 
			 {"cell": [294, 0,21 ,36]}, 
			 {"cell": [315, 0,21 ,36]}
		]	
	},
	"collage/sparkle-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 146, 122]},
			{"cell": [146, 0, 146, 122]},  
			{"cell": [292, 0, 146, 122]}, 
			{"cell": [438, 0, 146, 122]},  
			{"cell": [584, 0, 146, 122]},
			{"cell": [730, 0, 146, 122]},   
			{"cell": [876, 0, 146, 122]},   
			{"cell": [1022, 0, 146, 122]} 
		]
	},
	"collage/cocoon-removed-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 33, 33]},
			{"cell": [0, 33, 33, 33]},  
			{"cell": [0, 66, 33, 33]}, 
			{"cell": [0, 99, 33, 33]},  
			{"cell": [0, 132, 33, 33]},
			{"cell": [0, 165, 33, 33]},   
			{"cell": [0, 198, 33, 33]},   
			{"cell": [0, 231, 33, 33]},
			{"cell": [0, 264, 33, 33]},
			{"cell": [0, 297, 33, 33]} 
		]
	},
	"collage/powerup-gained-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 48 , 57]}, 
			{"cell": [48, 0, 48 , 57]}, 
			{"cell": [96, 0, 48 , 57]}, 
			{"cell": [144, 0, 48 , 57]}
		]	
	},
	"collage/powerup-activated-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0 ,74 ,75]}, 
			{"cell": [74, 0,74 ,75]}, 
			{"cell": [148, 0,74 ,75]}, 
			{"cell": [222, 0,74 ,75]}, 
			{"cell": [296, 0,74 ,75]}, 
			{"cell": [370, 0,74 ,75]}, 
			{"cell": [444, 0,74 ,75]}
		]		
	},
	"collage/creatures-forest-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 138, 46], "id": "forest/blue-beetle.png"},
			{"cell": [0, 46, 138, 46], "id": "forest/green-butterfly.png"},
			{"cell": [0, 92, 138, 46], "id": "forest/pink-lizard.png"},
			{"cell": [0, 138, 138, 46], "id": "forest/red-beetle.png"},
			{"cell": [0, 184, 138, 46], "id": "forest/teal-bug.png"},
			{"cell": [0, 230, 138, 46], "id": "forest/violet-moth.png"},
			{"cell": [0, 276, 138, 46], "id": "forest/yellow-frog.png"}
		]
	},
	"forest/blue-beetle.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"forest/green-butterfly.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"forest/pink-lizard.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"forest/red-beetle.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"forest/teal-bug.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"forest/violet-moth.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"forest/yellow-frog.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"collage/creatures-beach-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 138, 46], "id": "beach/blue-crab.png"},
			{"cell": [0, 46, 138, 46], "id": "beach/green-turtle.png"},
			{"cell": [0, 92, 138, 46], "id": "beach/pink-frog.png"},
			{"cell": [0, 138, 138, 46], "id": "beach/red-starfish.png"},
			{"cell": [0, 184, 138, 46], "id": "beach/teal-blob.png"},
			{"cell": [0, 230, 138, 46], "id": "beach/violet-crab.png"},
			{"cell": [0, 276, 138, 46], "id": "beach/yellow-fish.png"}
		]
	},
	"beach/blue-crab.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"beach/green-turtle.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"beach/pink-frog.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"beach/red-starfish.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"beach/teal-blob.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"beach/violet-crab.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"beach/yellow-fish.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"collage/creatures-cave-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 138, 46], "id": "cave/blue-crystal.png"},
			{"cell": [0, 46, 138, 46], "id": "cave/green-frog.png"},
			{"cell": [0, 92, 138, 46], "id": "cave/pink-spike.png"},
			{"cell": [0, 138, 138, 46], "id": "cave/red-beetle.png"},
			{"cell": [0, 184, 138, 46], "id": "cave/teal-flyer.png"},
			{"cell": [0, 230, 138, 46], "id": "cave/violet-lizard.png"},
			{"cell": [0, 276, 138, 46], "id": "cave/yellow-bug.png"}
		]
	},
	"cave/blue-crystal.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"cave/green-frog.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"cave/pink-spike.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"cave/red-beetle.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"cave/teal-flyer.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"cave/violet-lizard.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"cave/yellow-bug.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_COORDINATES_JSON)
	},
	"creatures/beach/blue-crab-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/beach/green-turtle-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/beach/pink-frog-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/beach/red-starfish-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/beach/teal-blob-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/beach/violet-crab-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/beach/yellow-fish-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/forest/blue-beetle-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/forest/green-butterfly-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/forest/pink-lizard-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/forest/red-beetle-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/forest/teal-bug-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/forest/violet-moth-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/forest/yellow-frog-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/cave/blue-crystal-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/cave/green-frog-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/cave/pink-spike-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/cave/red-beetle-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/cave/teal-flyer-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/cave/violet-lizard-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/cave/yellow-bug-rollover-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_ROLLOVER_COORDINATES_JSON)
	},
	"creatures/beach/blue-crab-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/beach/green-turtle-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/beach/pink-frog-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/beach/red-starfish-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/beach/teal-blob-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/beach/violet-crab-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/beach/yellow-fish-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/forest/blue-beetle-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/forest/green-butterfly-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/forest/pink-lizard-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/forest/red-beetle-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/forest/teal-bug-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/forest/violet-moth-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/forest/yellow-frog-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/cave/blue-crystal-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/cave/green-frog-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/cave/pink-spike-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/cave/red-beetle-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/cave/teal-flyer-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/cave/violet-lizard-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"creatures/cave/yellow-bug-jump-strip.png":{
		"imageCoordinateArray": JSON.parse(ImageCollage.CREATURE_JUMP_COORDINATES_JSON)
	},
	"collage/game-lightning-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 235, 58]},
			{"cell": [0, 58, 235, 58]},
			{"cell": [0, 166, 235, 58]}
		]
	},
	"collage/game-lightning-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 235, 58]},
			{"cell": [0, 58, 235, 58]},
			{"cell": [0, 166, 235, 58]}
		]
	},
	"collage/game-hint-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 41, 18]},
			{"cell": [0, 18, 41, 18]},
			{"cell": [0, 36, 41, 18]},
			{"cell": [0, 54, 41, 18]},
			{"cell": [0, 72, 41, 18]},
			{"cell": [0, 90, 41, 18]},
			{"cell": [0, 108, 41, 18]},
			{"cell": [0, 126, 41, 18]},
			{"cell": [0, 144, 41, 18]}
		]
	},
	"screen-game/danger-bar-fill-strip.png":{
		"imageCoordinateArray": [
			{"cell": [0, 0, 10, 226]},
			{"cell": [10, 0, 10, 226]},
			{"cell": [20, 0, 10, 226]},
			{"cell": [30, 0, 10, 226]},
			{"cell": [40, 0, 10, 226]}
		]
	},
	"collage/game-danger-bar-crown-and-warning-strip.png": {
		"imageCoordinateArray": [
			{"cell": [0, 0, 17, 12], "id": "screen-game/danger-bar-crown.png"},
			{"cell": [17, 0, 104, 57], "id" : "screen-game/danger-bar-warning-strip.png"}
		]
	},
	"screen-game/danger-bar-warning-strip.png": {
		"imageCoordinateArray": [
			{"cell": [0, 0, 52, 57]},
			{"cell": [52, 0, 52, 57]}
		]
	}
};

/**
 * Assumes a sheet of symmetric images defined by a 1 or 2 dimensional image matrix
 * @class ImageCollage
 * @param {object} collageDescriptor
 * @param {Image|HTMLImageElement} [image]
 * @constructor
 */
function ImageCollage (collageDescriptor, image) {
	var i, id,
		collageId = collageDescriptor.collageId,
		lookUpTable = LoadingScreen.gal.lookupTable;

	if(image){
		this.image = image
	}else{
		this.image = LoadingScreen.gal.get(collageId);
	}
	this.imageCoordinateArray = collageDescriptor.imageCoordinateArray;
	this._canvas = document.createElement('canvas');
	this._ctx = this._canvas.getContext('2d');

	for (i = this.imageCoordinateArray.length - 1; i >= 0; i--) {
		id = this.imageCoordinateArray[i].id;
		id = id || ImageCollage.buildSpriteAssetPath( collageId, i);
		if (typeof lookUpTable[id] === 'undefined' || lookUpTable[id] === null) {
			collageDescriptor.imageCoordinateArray[i].id = id;

			lookUpTable[id] = new Image();
			lookUpTable[id].onload = ImageCollage.makeOnloadFunction(id, lookUpTable[id]);
			this.getImageForCache(lookUpTable[id], i);
		}
	}

	this._ctx = null;
	this._canvas.width = 1;
	this._canvas.height = 1;
	this._canvas = null;
	this.image = null;

	LoadingScreen.gal.release(collageId);
} // ImageCollage constructor

ImageCollage.imagesInWork = 0;

ImageCollage.makeOnloadFunction = function(id, image) {
	ImageCollage.imagesInWork++;
	function f(){
		if(intervalId !== null) {
			if(image.complete && typeof image.naturalWidth !== 'undefined' && image.naturalWidth !== 0) {
				clearInterval(intervalId);
				intervalId = null;
				var childCollageDescriptor = ImageCollage.findByName( id );
				if(childCollageDescriptor) {
					new ImageCollage(childCollageDescriptor);
				}
				ImageCollage.imagesInWork--;

				image = null;
			}
		}
	}
	var intervalId = setInterval(f, 50);
	return f;
};

/**
 * Returns an image object corresponding to the rectangular region in the this.coordinateArray by imageId
 * @param {string} imageId
 * @returns {Image}
 */
ImageCollage.prototype.getImage = function (imageId) {
	return LoadingScreen.gal.lookupTable[imageId];
}; // ImageCollage.prototype.getImage()

/**
 * @private
 * @param {Image|HTMLImageElement} imageContainer
 * @param {integer} index
 */
ImageCollage.prototype.getImageForCache = function (imageContainer, index){
	var imageCoordinate, image, x, y, width, height;

	imageCoordinate = this.imageCoordinateArray[index];
	x = imageCoordinate.cell[0];
	y = imageCoordinate.cell[1];
	width = imageCoordinate.cell[2];
	height = imageCoordinate.cell[3];

	if(!this.image.naturalWidth){
		console.error(this.image.id + ' '  + this.image.naturalWidth);
	}
	//TODO: IGOR: remove this check in the future - this is because of imageCollage description errors!
	if (x + width > this.image.naturalWidth) {
		if (this.image.naturalWidth >= width) {
			x = this.image.naturalWidth - width;
		} else {
			x = 0;
			width = this.image.naturalWidth;
		}
	}
	if (y + height > this.image.naturalHeight) {
		if (this.image.naturalHeight >= height) {
			y = this.image.naturalHeight - height;
		} else {
			y = 0;
			height = this.image.naturalHeight;
		}
	}

	// draw part of collage image to canvas
	this._canvas.width = width;
	this._canvas.height = height;
	this._ctx.drawImage(this.image, x, y, width, height, 0, 0, width, height);

	// create image from canvas
	imageContainer.src = this._canvas.toDataURL("image/png");
	imageContainer.id = imageCoordinate.id;
	//return imageContainer;
}; //ImageCollage.prototype.getImage()

/*
 * Returns an array of image objects corresponding to the rectangular regions in the this.coordinateArray
 * @private
 * @returns {Array.<Image>}

ImageCollage.prototype.getImages = function () {
	var imageCollage, imageArray, id;//, i;
	imageCollage = this;
	imageArray = [];
	//i = 0;
	_.each(this.imageCoordinateArray, function (imageCoordinate) {
		//id = imageCoordinate.id ? imageCoordinate.id : ImageCollage.buildSpriteAssetPath( imageCollage.collageId, i++ );
		id = imageCoordinate.id;
		imageArray.push( imageCollage.getImage(id) );
	});
	return imageArray;
};*/ //ImageCollage.prototype.getImages()

/**
 * @public
 * @static
 * @param {string} collageId
 * @returns {ImageCollage}
 */
ImageCollage.loadByName = function (collageId){
	var imageCollage, collageDescriptor;
	collageDescriptor = ImageCollage.findByName( collageId );
	imageCollage = new ImageCollage( collageDescriptor );
	return imageCollage;
}; //ImageCollage.loadByName()



ImageCollage.findByName = function( collageId ) {
    var result = null;
    if(collageId) {
        result = ImageCollage.COLLAGE_ARRAY[collageId]; // Access by hash, not traversing whole object hierarchy
        if(result) {
            result.collageId = collageId; // TODO: Backward compatibility!!
        }
    }
    return result;
};
 //ImageCollage.findByName()

ImageCollage.buildSpriteAssetPath = function( collageId, i ) {
	return collageId.replace( Level.BLOB_IMAGE_EXTENSION, '_' + (i + 1));
}; //ImageCollage.buildSpriteAssetPath()

ImageCollage.getSprites = function( collageId, degrees ) {
	var collageDescriptor, sprites, sprite, i, spriteAssetPath;
	sprites = [];
	collageDescriptor = ImageCollage.findByName( collageId );
	i = 0;
	if( collageDescriptor ) {
		_.each( collageDescriptor.imageCoordinateArray, function( imageCoordinate ) {
			spriteAssetPath = imageCoordinate.id || ImageCollage.buildSpriteAssetPath( collageId, i++ );
			//spriteAssetPath = imageCoordinate.id;
			sprite = LoadingScreen.gal.get( spriteAssetPath );
			if( sprite ) {
				sprites.push( sprite );
			}
			else {
				throw 'collageId ' + collageId + ' sprite ' + spriteAssetPath + ' not found';
			}
		});
	}
	else {
		throw 'collageId ' + collageId + ' not found'; 
	}
	if( degrees ) {
		sprites = CanvasUtil.rotateImages( sprites );
	}
	return sprites;
}; //ImageCollage.getSprites()