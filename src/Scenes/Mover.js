class Movement extends Phaser.Scene {
    constructor() {
        super("moveScene");
        this.my = {sprite: {}};

        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           
        this.bulletCooldown = 15;        
        this.bulletCooldownCounter = 0;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("playerBody", "alienYellow_badge1.png");
        this.load.image("sword", "flame.png");
        this.load.audio("playerHit", "impactBell_heavy_003.ogg");
        this.load.audio("playerShoot", "impactPlank_medium_002.ogg");
    }

    create() {
        let my = this.my;
        my.sprite.body = this.add.sprite(500, 700, "playerBody");

        for (let i=0; i < this.maxBullets; i++) {
            // create a sprite which is offscreen and invisible
            my.sprite.bullet.push(this.add.sprite(-100, -100, "sword"));
            my.sprite.bullet[i].setScale(0.5);
            my.sprite.bullet[i].visible = false;
        }

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 10;
        this.bulletSpeed = 25;
    }
    
    update() {
        let my = this.my;
        this.bulletCooldownCounter--;

        if (this.aKey.isDown) {
            if (my.sprite.body.x > (my.sprite.body.displayWidth/2)) {
                my.sprite.body.x -= this.playerSpeed;
            }
        }

        if (this.dKey.isDown) {
            if (my.sprite.body.x < (game.config.width - (my.sprite.body.displayWidth/2))) {
                my.sprite.body.x += this.playerSpeed;
            }
        }

        if (this.spaceKey.isDown) {
            if (this.bulletCooldownCounter < 0) {
                for (let bullet of my.sprite.bullet) {
                    if (!bullet.visible) {
                        bullet.x = my.sprite.body.x;
                        bullet.y = my.sprite.body.y - (bullet.displayHeight/2);
                        bullet.visible = true;
                        this.bulletCooldownCounter = this.bulletCooldown;
                        break;
                    }
                }
            }
            
        }
        
        for (let bullet of my.sprite.bullet) {
            if (bullet.visible) {
                bullet.y -= this.bulletSpeed;
            }
            if (bullet.y < -(bullet.displayHeight/2)) {
                bullet.visible = false;
            }
        }

    }
}