/**
 * Created by Jerome Renaux (jerome.renaux@gmail.com) on 25-02-18.
 */
var Game = {};

var controls;

Game.preload = function(){
    Game.scene = this; // Handy reference to the scene (alternative to `this` binding)
    this.load.image('tileset', 'assets/gridtiles.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    // player animations atlas
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');
};

Game.create = function(){

    Game.camera = this.cameras.main;
    Game.camera.setBounds(0, 0, 16*20, 16*20);

    // var hero = this.add.image(16,16,'player');
    var hero = this.add.sprite(48, 48, 'player');
    // this.add.sprite(48, 48, 'player');
    // this.add.sprite(32, 48, 'player');
    hero.setDepth(1);
    hero.setOrigin(0,0);
    Game.camera.startFollow(hero);
    Game.player = hero;
    console.log(Game.player);
    // Display map
    Game.map = Game.scene.make.tilemap({ key: 'map'});
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    var tiles = Game.map.addTilesetImage('tiles', 'tileset');
    Game.map.createStaticLayer(0, tiles, 0,0);

    this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNames('player', {prefix: 'sprite', start: 0, end: 0}),
    frameRate: 10,
    repeat: -1
    });

    game.anims.create({
    key: 'walkDown',
    frames: game.anims.generateFrameNames('player', {prefix: 'sprite', start: 1, end: 6}),
    frameRate: 10,
    repeat: -1
    });

    game.anims.create({
        key: 'walkLeft',
        frames: game.anims.generateFrameNames('player', {prefix: 'sprite', start: 7, end: 12}),
        frameRate: 10,
        repeat: -1
    });

    game.anims.create({
        key: 'walkRight',
        frames: game.anims.generateFrameNames('player', {prefix: 'sprite', start: 13, end: 18}),
        frameRate: 10,
        repeat: -1
    });

    game.anims.create({
        key: 'walkUp',
        frames: game.anims.generateFrameNames('player', {prefix: 'sprite', start: 19, end: 24}),
        frameRate: 10,
        repeat: -1
    });
     console.log(this);

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
    console.log(Game.player);
    Game.player.anims.play('walkLeft');
};

Game.update = function(){

  if (controls.left.isDown)
  {
      this.player.body.setVelocityX(-100);
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
      // Game.player.body.setVelocityX(0);
      // Game.player.body.setVelocityY(0);
      // Game.player.anims.play('idle', true);
  }


};
