class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('bg', 'assets/sprites/background.png');
        this.load.image('card', 'assets/sprites/card.png');
        this.load.image('card1', 'assets/sprites/card1.png');
        this.load.image('card2', 'assets/sprites/card2.png');
        this.load.image('card3', 'assets/sprites/card3.png');
        this.load.image('card4', 'assets/sprites/card4.png');
        this.load.image('card5', 'assets/sprites/card5.png');
    }

    create() {
        this.timeout = config.timeout;
        this.createTimer();
        this.createBackGround();
        this.createText();
        this.createCards();
        this.start();
    }

    start() {
        this.timeout = config.timeout;
        this.openedCard = null;
        this.openedCardCount = 0;
        this.initCards();
    }

    initCards() {
        let positions = this.getCardPosition();
        this.cards.forEach(card => {
            let position = positions.pop();
            card.close();
            card.setPosition(position.x, position.y);
        })
    }

    onTimerTick() {
        this.timeOutText.setText('Time: ' + this.timeout);
        if (this.timeout <= 0) {
            this.start();
        } else {
            --this.timeout;
        }
    }


    createTimer() {
        this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });
    }

    createBackGround() {
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    }

    createText() {
        this.timeOutText = this.add.text(15, 330, "", {
            font: '26px Arial',
            fill: '#ffffff'
        })
    }

    createCards() {
        this.cards = [];
        for (let value of config.cards) {
            for (let i = 0; i < 2; i++) {
                this.cards.push(new Card(this, value));
            }
        }

        this.input.on("gameobjectdown", this.onCardClicked, this);
    }

    onCardClicked(pointer, card) {
        if (card.opened) {
            return false;
        }
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                this.openedCard = null;
                ++this.openedCardCount;
            } else {
                this.openedCard.close();
                this.openedCard = card;
            }
        } else {
            this.openedCard = card;

        }
        card.open();
        if (this.openedCardCount === this.cards.length / 2) {
            this.start();
        }
    }

    getCardPosition() {
        let positions = [];
        let cardMargin = 4;
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + cardMargin;
        let cardHeight = cardTexture.height + cardMargin;
        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                positions.push({
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                });
            }
        }
        return Phaser.Utils.Array.Shuffle(positions);
    }
}