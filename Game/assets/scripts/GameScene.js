class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('bg', 'assets/sprites/background.png');
        this.load.image('card', 'assets/sprites/card.png');
    }

    create() {
        this.createBackGround();
        this.createCards();
    }

    createBackGround() {
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    }

    createCards() {
        this.cards = [];
        let positions = this.getCardPosition();

        for (let position of positions) {
            this.cards.push(new Card(this, position));
        }
    }

    getCardPosition() {
        let positions = [];
        let cardMargin = 4;
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + cardMargin;
        let cardHeight = cardTexture.height + cardMargin;
        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2;

        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                positions.push({
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                });
            }
        }
        return positions;
    }
}