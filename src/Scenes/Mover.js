class Movement extends Phaser.Scene {
    constructor() {
        super("moveScene");
        this.my = {sprite: {}};

        this.my.sprite.bullet = [];
        this.my.sprite.frogs = [];  
        this.my.sprite.snakes = [];
        this.maxBullets = 10;           
        this.bulletCooldown = 15;        
        this.bulletCooldownCounter = 0;
        this.directions = ["up", "down", "left", "right"];
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("playerBody", "alienYellow_badge1.png");
        this.load.image("blast", "flame.png");
        this.load.image("snake", "snake.png");
        this.load.image("frog", "frog.png");
        this.load.image("poison", "particle_green.png");
        this.load.image("lives", "alienYellow.png");

        this.load.audio("playerHit", "impactBell_heavy_003.ogg");
        this.load.audio("playerShoot", "impactPlank_medium_002.ogg");
        this.load.audio("enemyShoot", "impactPlate_light_000.ogg");
        this.load.audio("enemyHit", "impactWood_medium_000.ogg");
        this.load.audio("finishJingle", "jingles_STEEL02.ogg");
    }

    create() {
        let my = this.my;
        this.cameras.main.setBackgroundColor("#90ee90");
        my.sprite.body = this.add.sprite(500, 700, "playerBody");

        for (let i=0; i < this.maxBullets; i++) {
            // create a sprite which is offscreen and invisible
            my.sprite.bullet.push(this.add.sprite(-100, -100, "blast"));
            my.sprite.bullet[i].setScale(0.5);
            my.sprite.bullet[i].visible = false;
        }

        for (let j = 0; j < 2; j++) {
            my.sprite.frogs.push(this.add.sprite(-100, 100, "frog"));
            my.sprite.frogs[j].setScale(0.5);
            my.sprite.frogs[j].visible = false;
        }

        for (let j = 0; j < 2; j++) {
            my.sprite.snakes.push(this.add.sprite(-100, 100, "snake"));
            my.sprite.snakes[j].setScale(0.5);
            my.sprite.snakes[j].visible = false;
        }

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 10;
        this.bulletSpeed = 25;

        this.playerHit = this.sound.add("playerHit");
        this.playerShoot = this.sound.add("playerShoot");
        this.enemyShoot = this.sound.add("enemyShoot");
        this.enemyHit = this.sound.add("enemyHit");
        this.finishJingle = this.sound.add("finishJingle");

        this.startRound = true;       
        this.frogHopTimer = 0;
        this.snakeChangeTimer = 0;
    }
    
    update() {
        let my = this.my;
        this.bulletCooldownCounter--;
        this.frogHopTimer++;
        this.snakeChangeTimer++;

        if (this.startRound == true) {
            this.startRound = false;

            this.frogHopTimer = 0;
            this.frogMode = [];
            my.sprite.frogs.push(this.add.sprite(-100, 100, "frog"));
            my.sprite.frogs[my.sprite.frogs.length - 1].visible = false;
            my.sprite.frogs[my.sprite.frogs.length - 1].setScale(0.5);
            for (let i = 0; i < my.sprite.frogs.length; i++) {
                my.sprite.frogs[i].visible = true;
                if (Math.round(Math.random()) == 1) {
                    my.sprite.frogs[i].x = game.config.width - 100;
                    this.frogMode[i] = -1;
                } else {
                    my.sprite.frogs[i].x = 100;
                    this.frogMode[i] = 1;
                }
                my.sprite.frogs[i].y = (Math.random() * (game.config.height - 400)) + 50;
                for(let frog of my.sprite.frogs) {
                    if (frog.visible == true && frog != my.sprite.frogs[i]) {
                        if (this.collides(frog, my.sprite.frogs[i])) {
                            i--;
                            break;
                        }
                    }
                }
            }

            this.snakeChangeTimer = 0;
            this.snakeDirection = [];
            my.sprite.snakes.push(this.add.sprite(-100, 100, "snake"));
            my.sprite.snakes[my.sprite.snakes.length - 1].visible = false;
            my.sprite.snakes[my.sprite.snakes.length - 1].setScale(0.5);
            for (let i = 0; i < my.sprite.snakes.length; i++) {
                my.sprite.snakes[i].visible = true;
                this.snakeDirection[i] = this.directions[Math.round(Math.random()*2)+1];
                if (this.snakeDirection[i] == "left") {
                    my.sprite.snakes[i].x = game.config.width - 100;
                    my.sprite.snakes[i].y = (Math.random() * (game.config.height - 400)) + 100;
                } else if (this.snakeDirection[i] == "right") {
                    my.sprite.snakes[i].x = 100;
                    my.sprite.snakes[i].y = (Math.random() * (game.config.height - 400)) + 100;
                } else {
                    my.sprite.snakes[i].x = Math.random() * ((game.config.width - 100) - 100) + 100;
                    my.sprite.snakes[i].y = 100
                }

                for (let snake of my.sprite.snakes) {
                    if (snake.visible == true && snake != my.sprite.snakes[i]) {
                        if (this.collides(snake, my.sprite.snakes[i])) {
                            i--;
                            break;
                        }
                    }
                }
            }
        }

        for (let j = 0; j < my.sprite.frogs.length; j++) {
            if (my.sprite.frogs[j].visible) {
                my.sprite.frogs[j].x -= Math.max(Math.abs(5 * Math.abs(Math.sin(this.frogHopTimer/10)/2)) - 1, 0) * this.frogMode[j] * 5;
                if (my.sprite.frogs[j].x < 100 || my.sprite.frogs[j].x > game.config.width - 100) {
                    this.frogMode[j] *= -1;
                }
            }
        }

        for (let j = 0; j < my.sprite.snakes.length; j++) {
            if (my.sprite.snakes[j].visible) {
                if (this.snakeDirection[j] == "up" && my.sprite.snakes[j].y < 100) {
                    this.snakeDirection[j] = this.directions[Math.round(Math.random()*3)];
                    j--;
                    continue;
                } else if (this.snakeDirection[j] == "left" && my.sprite.snakes[j].x < 100) {
                    this.snakeDirection[j] = this.directions[Math.round(Math.random()*3)];
                    j--;
                    continue;
                } else if (this.snakeDirection[j] == "right" && my.sprite.snakes[j].x > game.config.width - 100) {
                    this.snakeDirection[j] = this.directions[Math.round(Math.random()*3)];
                    j--;
                    continue;
                } else if (this.snakeDirection[j] == "down" && my.sprite.snakes[j].y > game.config.height - 300) {
                    this.snakeDirection[j] = this.directions[Math.round(Math.random()*3)];
                    j--;
                    continue;
                } else {
                    if (this.snakeDirection[j] == "up") {
                        my.sprite.snakes[j].y -= 5;
                    } else if (this.snakeDirection[j] == "down") {
                        my.sprite.snakes[j].y += 5;
                    } else if (this.snakeDirection[j] == "left") {
                        my.sprite.snakes[j].x -= 5;
                    } else {
                        my.sprite.snakes[j].x += 5;
                    }
                }
            }
        }

        if (this.snakeChangeTimer%25 == 0) {
            for (let j = 0; j < my.sprite.snakes.length; j++) {
                this.snakeDirection[j] = this.directions[Math.round(Math.random()*3)]; 
            }
        }

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
                        this.playerShoot.play();
                        break;
                    }
                }
            }
            
        }
        
        for (let bullet of my.sprite.bullet) {
            if (bullet.visible) {
                bullet.y -= this.bulletSpeed;
            }
            for (let frog of my.sprite.frogs) {
                if (frog.visible == true) {
                    if (this.collides(frog, bullet)) {
                        bullet.y = -100;
                        frog.visible = false;
                        frog.x = -100;
                    }
                } 
            }
            
            if (bullet.y < -(bullet.displayHeight/2)) {
                bullet.visible = false;
            }
            
        }

    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) {
            return false;
        }
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) {
            return false;
        }
        return true;
    }
}