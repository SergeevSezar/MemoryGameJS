let scene = new Phaser.Scene('Game')

scene.preload = function() {
    this.load.image('bg', 'assets/sprites/background.png');
};

scene.create = function() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
};

let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: scene
};

let game = new Phaser.Game(config);