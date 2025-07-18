const defaultObjectSpritePath = "public/assets/objects/square.svg"

class Sprite {
    constructor({ position, velocity, source, scale, offset, sprites }) {
        this.position = position
        this.velocity = velocity

        this.scale = scale || 1
        this.image = new Image()
        this.image.src = source || defaultObjectSpritePath
        this.width = this.image.width * this.scale
        this.height = this.image.height * this.scale

        this.width = this.image.width * this.scale
        this.height = this.image.height * this.scale

        this.offset = offset || {
            x: 0,
            y: 0
        }

        this.sprites = sprites || {
            idle: {
                src: this.image.src,
                totalSpriteFrames: 1,
                framesPerSpriteFrame: 1
            }
        }

        const firstSpriteKey = Object.keys(this.sprites)[0];
        this.currentSprite = this.sprites[firstSpriteKey];

        this.totalSpriteFrames = this.currentSprite?.totalSpriteFrames || 1;
        this.framesPerSpriteFrame = this.currentSprite?.framesPerSpriteFrame || 1;

        this.currentSpriteFrame = 0;
        this.elapsedTime = 0;

    }

    setSprite(sprite) {
        if (this.sprites[sprite]) {
            this.currentSprite = this.sprites[sprite];
        } else {
            this.currentSprite = this.sprites.idle || this.sprites["idle_down"];
        }

        this.currentSpriteFrame = 0;
        this.elapsedTime = 0;
    }

    loadSprite() {
        if (!this.currentSprite) {
            console.warn("currentSprite está undefined em loadSprite()");
            return;
        }

        // Se já estiver carregada, não recarrega
        if (this.image.src === this.currentSprite.src) return;

        const newImage = new Image();
        newImage.onload = () => {
            this.image = newImage;

            this.totalSpriteFrames = this.currentSprite.totalSpriteFrames;
            this.framesPerSpriteFrame = this.currentSprite.framesPerSpriteFrame;

            this.width = newImage.width * this.scale;
            this.height = newImage.height * this.scale;
        };

        newImage.src = this.currentSprite.src;
    }

    draw() {
        if (!this.image || this.totalSpriteFrames <= 0) return;
        this.loadSprite();

        ctx.imageSmoothingEnabled = false;

        ctx.save();

        const frameWidth = this.image.width / this.totalSpriteFrames;
        const hasRow = this.currentSprite?.row !== undefined;
        const rowIndex = hasRow ? this.currentSprite.row : 0;
        const frameHeight = hasRow
            ? this.image.height / 3
            : this.image.height;

        const flip = this.facing === "right" ? -1 : 1;

        const drawX = this.position.x - cameraOffsetX + this.offset.x;
        const drawY = this.position.y + this.offset.y;

        // Centraliza o sprite ao inverter horizontalmente
        ctx.translate(
            drawX + (flip === -1 ? frameWidth * this.scale : 0),
            drawY
        );
        ctx.scale(flip, 1);

        ctx.drawImage(
            this.image,
            this.currentSpriteFrame * frameWidth,
            rowIndex * frameHeight,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth * this.scale,
            frameHeight * this.scale
        );

        ctx.restore();
    }


    animate() {
        this.elapsedTime += 1

        if (this.elapsedTime >= this.framesPerSpriteFrame) {
            this.currentSpriteFrame += 1

            if (this.currentSpriteFrame >= this.totalSpriteFrames) {
                this.currentSpriteFrame = 0
            }

            this.elapsedTime = 0
        }

    }

    update() {
        this.draw()
        this.animate()
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        attackBox,
        sprites,
        scale
    }) {
        super({
            position,
            velocity,
            scale,
            sprites
        })

        this.velocity = velocity

        this.attackBox = attackBox || {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 125,
            height: 50
        }

        this.isAttacking
        this.attackCooldown = 500
        this.onAttackCooldown
        this.facing = "right";
        this.isHit = false;
        this.hitTimer = 0;
        this.hitDuration = 450; // milissegundos


        this.lastKeyPressed
        this.onGround
    }

    receiveHit() {
        this.isHit = true;
        this.hitTimer = Date.now();
    };

    applyMovement() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y < MAP_Y_MIN) {
            this.position.y = MAP_Y_MIN;
            this.velocity.y = 0;
        }
        if (this.position.y + this.height > MAP_Y_MAX) {
            this.position.y = MAP_Y_MAX - this.height;
            this.velocity.y = 0;
        }

        this.attackBox.position.x = this.position.x;
        this.attackBox.position.y = this.position.y;
    }


    update() {
        this.applyMovement()
        this.loadSprite()
        this.draw()
        this.animate()
    }

    draw() {
        const frameWidth = this.image.width / this.totalSpriteFrames;
        const frameHeight = this.image.height;
        const isCurrentlyHit = this.isHit && Date.now() - this.hitTimer < this.hitDuration;

        ctx.save();

        if (isCurrentlyHit) {
            ctx.globalAlpha = 0.6;
            ctx.filter = "brightness(2)";
        }

        ctx.imageSmoothingEnabled = false;

        // Flip horizontal se estiver virado para a direita
        const flip = this.facing === "right" ? -1 : 1;
        const drawX = this.position.x - cameraOffsetX;
        const drawY = this.position.y;

        ctx.translate(
            drawX + (flip === -1 ? frameWidth * this.scale : 0),
            drawY
        );
        ctx.scale(flip, 1);

        ctx.drawImage(
            this.image,
            this.currentSpriteFrame * frameWidth, // frame origem X
            0,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth * this.scale,
            frameHeight * this.scale
        );

        ctx.restore();

        if (!isCurrentlyHit) {
            this.isHit = false;
        }
    }




    attack() {
        if (this.onAttackCooldown || this.isAttacking) return;

        this.isAttacking = true;
        this.onAttackCooldown = true;

        const direction = this.facing || "right";
        const spriteKey = `attacking_${direction}`;

        if (this.sprites[spriteKey]) {
            this.setSprite(spriteKey);
        } else {
            console.warn("Sprite de ataque não encontrado:", spriteKey);
            this.setSprite("idle");
        }

        setTimeout(() => {
            this.isAttacking = false;
        }, 400);

        setTimeout(() => {
            this.onAttackCooldown = false;
        }, this.attackCooldown);
    }


}

class Enemy extends Fighter {
    constructor(options) {
        super(options);
        this.health = 1;
        this.speed = 1.0;
        this.isDead = false;
        this.canDamage = true;
        this.damageCooldown = 1000;
        this.dropFruitBasket = options.dropFruitBasket || false;
    }

    update() {
        if (this.isDead) {
            if (!this.deathTimerStarted) {
                this.setSprite("death");
                this.currentSpriteFrame = 0;
                this.deathTimerStarted = true;

                setTimeout(() => {
                    this.shouldBeRemoved = true;
                }, 400);
            }

            this.velocity.x = 0;
            this.velocity.y = 0;
        } else{
            this.moveTowardPlayer();
            this.tryAttackPlayer();
        }
        super.update();
    }

    moveTowardPlayer() {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 10) {
            this.velocity.x = (dx / dist) * this.speed;
            this.velocity.y = (dy / dist) * this.speed;
            this.setSprite("running");

            // Inverte o sprite quando andar para a direita
            if (this.velocity.x > 0) {
                this.facing = "left";
            } else if (this.velocity.x < 0) {
                this.facing = "right";
            }
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.setSprite("idle_down");
        }
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            this.setSprite("death");
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

    tryAttackPlayer() {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 40 && this.canDamage) {
            simularDano();
            this.canDamage = false;

            setTimeout(() => {
                this.canDamage = true;
            }, this.damageCooldown);
        }
    }
}

class Background {
    constructor(imagePath) {
        this.image = new Image();
        this.image.src = imagePath;
        this.width = 4000;
        this.height = 576;
    }

    update() {
        const repeatCount = Math.ceil(MAP_WIDTH / this.width) + 1;

        for (let i = 0; i < repeatCount; i++) {
            ctx.drawImage(
                this.image,
                i * this.width - cameraOffsetX,
                0,
                this.width,
                this.height
            );
        }
    }
}

const player = new Fighter({
    position: { x: 100, y: 300 },
    velocity: { x: 0, y: 10 },
    scale: 6,
    sprites: {
        idle_down: {
            src: "public/assets/player/FrontIdle.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 10
        },
        idle_up: {
            src: "public/assets/player/BackIdle.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 10
        },
        idle_left: {
            src: "public/assets/player/SideIdle.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 10
        },
        idle_right: {
            src: "public/assets/player/SideIdle.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 10
        },
        walk_down: {
            src: "public/assets/player/FrontRun.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 10
        },
        walk_up: {
            src: "public/assets/player/BackRun.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 10
        },
        walk_left: {
            src: "public/assets/player/SideRun.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 10
        },
        walk_right: {
            src: "public/assets/player/SideRun.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 10
        },
        attacking_down: {
            src: "public/assets/player/FrontAttack.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 8
        },
        attacking_up: {
            src: "public/assets/player/BackAttack.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 8
        },
        attacking_left: {
            src: "public/assets/player/SideAttack.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 8
        },
        attacking_right: {
            src: "public/assets/player/SideAttack.png",
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 8
        }
    }
});



