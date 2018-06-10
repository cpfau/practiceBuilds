/**
 * Created by Jerome Renaux (jerome.renaux@gmail.com) on 25-02-18.
 */
var config = {
    type: Phaser.AUTO,

    width: 16*20,
    height: 16*20,
    parent: 'game',
    scene: [Game],
    pixelArt: true,
    zoom: 3,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
};

var game = new Phaser.Game(config);
