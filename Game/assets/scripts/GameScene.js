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

        this.load.audio('theme', 'assets/sounds/theme.mp3');
        this.load.audio('card', 'assets/sounds/card.mp3');
        this.load.audio('complete', 'assets/sounds/complete.mp3');
        this.load.audio('success', 'assets/sounds/success.mp3');
        this.load.audio('timeout', 'assets/sounds/timeout.mp3');
    }

    createSounds() {
        this.sounds = {
            card: this.sound.add('card'),
            theme: this.sound.add('theme'),
            complete: this.sound.add('complete'),
            success: this.sound.add('success'),
            timeout: this.sound.add('timeout'),
        };
        this.sounds.theme.play({ volume: 0.1 });
    }

    create() {
        this.timeout = config.timeout;
        this.createSounds();
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
        this.showCards();
    }

    initCards() {
        let positions = this.getCardPosition();

        this.cards.forEach(card => {
            card.init(positions.pop());
        });
    }

    showCards() {
        this.cards.forEach(card => {
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay
            });
        });
    }

    onTimerTick() {
        this.timeOutText.setText('Time: ' + this.timeout);
        if (this.timeout <= 0) {
            this.sounds.timeout.play({ volume: 1 });
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
        this.sounds.card.play({ volume: 1 });
        if (this.openedCard) {
            if (this.openedCard.value === card.value) {
                this.sounds.success.play();
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
            this.sounds.complete.play({ volume: 1 });
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
        let delayCount = 0;

        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                positions.push({
                    delay: ++delayCount * 100,
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                });
            }
        }
        return Phaser.Utils.Array.Shuffle(positions);
    }
}