const bossProjectileSprites = [
    "public/assets/items/hamburguer.png",
    "public/assets/items/donot.png",
];


class Boss {
    constructor({ position, sprites, scale = 5 }) {
        this.position = position;
        this.velocity = { x: 0, y: 0 };
        this.scale = scale;
        this.sprites = sprites;
        this.image = new Image();
        this.setSprite("running");
        this.health = 15;
        this.maxHealth = 15;
        this.speed = 1.2;
        this.attackInterval = 3000;
        this.lastAttackTime = 0;
        this.isDead = false;
        this.shouldBeRemoved = false;
        this.frameIndex = 0;
        this.elapsed = 0;
        this.width = 64;
        this.height = 64;
        this.dropCrown = true;
        this.facingLeft = false; 
        this.isAttacking = false; 
    }

    setSprite(name) {
        const sprite = this.sprites[name];
        if (!sprite) return;

        this.currentSprite = sprite;
        this.image.src = sprite.src;
        this.totalFrames = sprite.totalSpriteFrames;
        this.frameDelay = sprite.framesPerSpriteFrame;
        this.frameIndex = 0;
        this.elapsed = 0;
    }

    update() {
        if (this.isDead) {
            this.velocity = { x: 0, y: 0 };
            this.setSprite("death");

            setTimeout(() => {
                this.shouldBeRemoved = true;
                if (this.dropCrown) spawnCrown(this.position);
            }, 600);
        } else {
            this.moveTowardPlayer();

            const now = Date.now();
            if (!this.isAttacking && now - this.lastAttackTime > this.attackInterval) {
                this.attack();
                this.lastAttackTime = now;
            }
        }

        this.animate();
        this.draw();
        this.drawHealthBar();
    }

    moveTowardPlayer() {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const dist = Math.hypot(dx, dy);

        // Atualiza direção
        this.facingLeft = player.position.x < this.position.x;

        if (dist > 10) {
            this.velocity.x = (dx / dist) * this.speed;
            this.velocity.y = (dy / dist) * this.speed;
            if (!this.isAttacking) this.setSprite("running");
        } else {
            this.velocity = { x: 0, y: 0 };
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

attack() {
    this.isAttacking = true;
    this.setSprite("attack");

    // Sorteia o sprite do projétil
    const sprite = bossProjectileSprites[
        Math.floor(Math.random() * bossProjectileSprites.length)
    ];

    // Solta o projectile no início da animação de ataque
    setTimeout(() => {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const dist = Math.hypot(dx, dy);

        const velocity = {
            x: dx / dist,
            y: dy / dist
        };

        const fire = new BossProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height / 2
            },
            velocity,
            owner: this,
            imageSrc: sprite // 🆕 imagem sorteada
        });

        projectiles.push(fire);
    }, 100);

    // Volta para running após animação de ataque
    setTimeout(() => {
        this.isAttacking = false;
        this.setSprite("running");
    }, 600);
}


    takeDamage() {
        this.health--;
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
        }
    }

    animate() {
        this.elapsed++;
        if (this.elapsed >= this.frameDelay) {
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
            this.elapsed = 0;
        }
    }

    draw() {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        const frameWidth = this.image.width / this.totalFrames;
        const scaledWidth = frameWidth * this.scale;
        const scaledHeight = this.image.height * this.scale;

        const drawX = this.position.x - cameraOffsetX;
        const drawY = this.position.y;

        if (!this.facingLeft) {
            // Espelha horizontalmente para olhar para a direita
            ctx.translate(drawX + scaledWidth, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                this.frameIndex * frameWidth,
                0,
                frameWidth,
                this.image.height,
                0,
                0,
                scaledWidth,
                scaledHeight
            );
        } else {
            // Direção normal (esquerda, sem flip)
            ctx.translate(drawX, drawY);
            ctx.drawImage(
                this.image,
                this.frameIndex * frameWidth,
                0,
                frameWidth,
                this.image.height,
                0,
                0,
                scaledWidth,
                scaledHeight
            );
        }

        ctx.restore();
    }


    drawHealthBar() {
        const barWidth = 180;
        const barHeight = 20;
        const x = canvas.width - barWidth - 20;
        const y = 20;

        ctx.fillStyle = "black";
        ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

        ctx.fillStyle = "red";
        ctx.fillRect(x, y, barWidth * (this.health / this.maxHealth), barHeight);

        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, barWidth, barHeight);
    }
}

class BossProjectile {
    constructor({ position, velocity, owner, imageSrc }) {
        this.position = { ...position };
        this.velocity = velocity;
        this.owner = owner;
        this.image = new Image();
        this.image.src = imageSrc; // agora usa imagem personalizada
        this.scale = 2;
        this.width = 16 * this.scale;
        this.height = 16 * this.scale;
        this.speed = 4;
        this.shouldBeRemoved = false;
    }

    update() {
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;

        // desenha
        ctx.save();
        ctx.drawImage(
            this.image,
            this.position.x - cameraOffsetX,
            this.position.y,
            this.width,
            this.height
        );
        ctx.restore();

        // colisão com jogador
        const playerWidth = (player.image.width / player.totalSpriteFrames) * player.scale;
        const playerHeight = player.image.height * player.scale;

        const hit =
            this.position.x < player.position.x + playerWidth &&
            this.position.x + this.width > player.position.x &&
            this.position.y < player.position.y + playerHeight &&
            this.position.y + this.height > player.position.y;

        if (hit) {
            simularDano();
            this.shouldBeRemoved = true;
        }

        // fora da tela
        if (
            this.position.x + this.width < cameraOffsetX ||
            this.position.x > cameraOffsetX + canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y > canvas.height
        ) {
            this.shouldBeRemoved = true;
        }
    }
}


class CrownDrop  {
    constructor(position) {
        this.position = position;
        this.image = new Image();
        this.image.src = "public/assets/objects/crown.png"; 
        this.scale = 2;
        this.width = 16 * this.scale;
        this.height = 16 * this.scale;
        this.collected = false;
    }

    update() {
        if (this.collected) return;

        this.draw();

        if (checkItemCollision(this)) {
            this.collect();
        }
    }

    draw() {
        ctx.save();
        ctx.drawImage(
            this.image,
            this.position.x - cameraOffsetX,
            this.position.y,
            this.width,
            this.height
        );
        ctx.restore();
    }

    collect() {
        this.collected = true;
        showVictoryScreen();
    }
}
