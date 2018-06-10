var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [Game],
    parent: 'game',
    pixelArt: true,
    zoom: 3
};

var game = new Phaser.Game(config);
