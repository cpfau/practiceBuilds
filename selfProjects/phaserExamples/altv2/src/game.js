var Game = {};


var map;
var player;
var cursors;
var groundLayer, obstacleLayer;
var text;
var score = 0;
var marker;
var controls;

Game.preload = function() {
    Game.scene = this; // Handy reference to the scene (alternative to `this` binding)
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/alterraMap.json');
    // tiles in spritesheet
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 16, frameHeight: 16});
    // player animations
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');
}

Game.create = function() {



    // Handles the clicks on the map to make the character move
    // this.input.on('pointerup',Game.handleClick);

    //Display map
    Game.map = Game.scene.make.tilemap({key: 'map'});

    // Pull and arrange tiles from tileset (first param is filename in Tiled, second is the key used in preload)
    // tiles for the ground layer
    var tiles = Game.map.addTilesetImage('tiles','tiles');
    // create the ground layer & obstacle layer
    Game.map.createStaticLayer(0, tiles, 0, 0);
    // obstacleLayer = Game.map.createStaticLayer('obstacles', groundTiles, 0, 0);

    // Set up the game camera
    Game.camera = this.cameras.main;
    // set bounds so the camera won't go outside the game world
    Game.camera.setBounds(0, 0, Game.map.widthInPixels, Game.map.heightInPixels);
    // make the camera follow the player
    // Game.camera.startFollow(player);

    // Marker that will follow the mouse
    Game.marker = this.add.graphics();
    Game.marker.lineStyle(2, 0x000000, 1);
    Game.marker.strokeRect(0, 0, Game.map.tileWidth, Game.map.tileHeight);




    // set the boundaries of our game world
    // this.physics.world.bounds.width = groundLayer.width;
    // this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite
    player = this.physics.add.sprite(200, 200, 'player');

    // don't go out of the map
    player.setCollideWorldBounds(true);

    // ### Pathfinding stuff ###
    // Initializing the pathfinder
    Game.finder = new EasyStar.js();

    console.log(Game.map);

    // We create the 2D array representing all the tiles of our map
    var grid = [];
    for(var y = 0; y < Game.map.height; y++){
        var col = [];
        for(var x = 0; x < Game.map.width; x++){
            // In each cell we store the ID of the tile, which corresponds
            // to its index in the tileset of the map ("ID" field in Tiled)
            col.push(Game.getTileID(x,y));
        }
        grid.push(col);
    }
    Game.finder.setGrid(grid);


    var tileset = Game.map.tilesets[0];
    var properties = tileset.tileProperties;
    var acceptableTiles = [];

    // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
    // and see what properties have been entered in Tiled.
    for(var i = tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
        if(!properties.hasOwnProperty(i)) {
            // If there is no property indicated at all, it means it's a walkable tile
            acceptableTiles.push(i+1);
            continue;
        }
        if(!properties[i].collide) acceptableTiles.push(i+1);
        if(properties[i].cost) Game.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
    }
    Game.finder.setAcceptableTiles(acceptableTiles);








    // player walk animation
    this.anims.create({
        key: 'walkDown',
        frames: this.anims.generateFrameNames('player', {prefix: 'sprite', start: 1, end: 6}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkLeft',
        frames: this.anims.generateFrameNames('player', {prefix: 'sprite', start: 7, end: 12}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkRight',
        frames: this.anims.generateFrameNames('player', {prefix: 'sprite', start: 13, end: 18}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkUp',
        frames: this.anims.generateFrameNames('player', {prefix: 'sprite', start: 19, end: 24}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'sprite1'}],
        frameRate: 10,
    });



    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };
    controls = new Phaser.Cameras.Controls.Fixed(controlConfig);

}

Game.update = function(time, delta) {

  var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

  // Rounds down to nearest tile
  var pointerTileX = Game.map.worldToTileX(worldPoint.x);
  var pointerTileY = Game.map.worldToTileY(worldPoint.y);
  Game.marker.x = Game.map.tileToWorldX(pointerTileX);
  Game.marker.y = Game.map.tileToWorldY(pointerTileY);
  Game.marker.setVisible(!Game.checkCollision(pointerTileX,pointerTileY));


  controls.update(delta);

  // console.log("X Coordinates:" + marker.playerPositionX + " Y Coordinates:" + marker.playerPositionY);
  // console.log("X HERE!!!" + player.body.x);
  // console.log("Y Here!!!" + player.body.y);

  // value: function snapToGrid() {
  //           this.gridPosition = {
  //               x: Math.round(this.sprite.x / this.world.gridSize.x),
  //               y: Math.round(this.sprite.y / this.world.gridSize.y)
  //           };
  //           this.sprite.x = this.world.gridSize.x * this.gridPosition.x;
  //           this.sprite.y = this.world.gridSize.y * this.gridPosition.y;

  // marker.playerPositionX = Math.floor(Math.floor(player.body.x) / 16);
  // marker.playerPositionY = Math.floor(Math.floor(player.body.y) / 16);
  // var gridPosition = new Phaser.Geom.Point(0, 0);
  // console.log(gridPosition);



  if (controls.left.isDown)
  {
      player.body.setVelocityX(-100);
      player.anims.play('walkLeft', true); // walk left
      player.flipX = false;

  }
  else if (controls.right.isDown)
  {
      player.body.setVelocityX(100);
      player.anims.play('walkRight', true);
      player.flipX = false;
  }
  else if (controls.up.isDown)
  {
      player.body.setVelocityY(-100);
      player.anims.play('walkUp', true);
      player.flipX = false;
  }
  else if (controls.down.isDown)
  {
      player.body.setVelocityY(100);
      player.anims.play('walkDown', true);
      player.flipX = false;
  } else {
      player.body.setVelocityX(0);
      player.body.setVelocityY(0);
      player.anims.play('idle', true);
  }

}

Game.checkCollision = function(x,y){
    var tile = Game.map.getTileAt(x, y);
    return tile.properties.collide == true;
};

Game.getTileID = function(x,y){
    var tile = Game.map.getTileAt(x, y);
    return tile.index;
};

Game.handleClick = function(pointer){
    var x = Game.camera.scrollX + pointer.x;
    var y = Game.camera.scrollY + pointer.y;
    var toX = Math.floor(x/16);
    var toY = Math.floor(y/16);
    var fromX = Math.floor(Game.player.x/16);
    var fromY = Math.floor(Game.player.y/16);
    console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

    Game.finder.findPath(fromX, fromY, toX, toY, function( path ) {
        if (path === null) {
            console.warn("Path was not found.");
        } else {
            console.log(path);
            Game.moveCharacter(path);
        }
    });
    Game.finder.calculate(); // don't forget, otherwise nothing happens
};

Game.moveCharacter = function(path){
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    var tweens = [];
    for(var i = 0; i < path.length-1; i++){
        var ex = path[i+1].x;
        var ey = path[i+1].y;
        tweens.push({
            targets: Game.player,
            x: {value: ex*Game.map.tileWidth, duration: 200},
            y: {value: ey*Game.map.tileHeight, duration: 200}
        });
    }

    Game.scene.tweens.timeline({
        tweens: tweens
    });
};
