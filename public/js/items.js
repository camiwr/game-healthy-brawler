class Item {
    constructor({ position, type }) {
        this.position = position;
        this.type = type;
        this.collected = false;

        this.width = 32;
        this.height = 32;
        this.scale = 1.0;

        this.image = new Image();
        switch (type) {
            case "apple":
                this.image.src = "public/assets/items/melancia.png";
                break;
            case "hamburguer":
                this.image.src = "public/assets/items/hmaburguer.png";
                break;
            case "banana":
                this.image.src = "public/assets/items/banana.png";
                break;
            case "carrot":
                this.image.src = "public/assets/items/carrot.png";
                break;

            case "alface":
                this.image.src = "public/assets/items/alface.png";
                this.width = 42;
                this.height = 52;
                break;
            case "cola":
                this.image.src = "public/assets/items/cocacola.png";
                this.width = 32;
                this.height = 52;
                break;
            case "donut":
                this.image.src = "public/assets/items/donot.png";   
                this.width = 32;
                this.height = 32;   
                break;
            default:
                this.image.src = "public/assets/items/apple.png";
        }
    }

    collect() {
        if (this.collected) return;
        this.collected = true;

        if (this.type === "apple") {
            if (vidaAtual < vidaMaxima) vidaAtual++;
        } else if (this.type === "hamburguer") {
            simularDano();
        } else if (this.type === "banana") {
            if (vidaAtual < vidaMaxima) vidaAtual++;
            if (vidaAtual > vidaMaxima) vidaAtual = vidaMaxima;
        } else if (this.type === "carrot") {
            if (vidaAtual < vidaMaxima) vidaAtual++;
            if (vidaAtual > vidaMaxima) vidaAtual = vidaMaxima;
        } else if (this.type === "cola") {
            simularDano();
        } else if (this.type === "alface") {
            if (vidaAtual < vidaMaxima) vidaAtual++;
            if (vidaAtual > vidaMaxima) vidaAtual = vidaMaxima;
        } else if (this.type === "donut") {
            simularDano();
        }
    }

    draw() {
        if (this.collected) return;

        ctx.drawImage(
            this.image,
            this.position.x - cameraOffsetX,
            this.position.y,
            this.width * this.scale,
            this.height * this.scale
        );
    }

    update() {
        this.draw();
    }
}


class FruitBasket extends Sprite {
    constructor({ position }) {
        super({
            position,
            source: "public/assets/items/fruitBasket.png",
            scale: 0.5
        });
        this.width = 16;
        this.height = 16;
        this.collected = false;
    }

    collect() {
        this.collected = true;
        this.onCollect?.();
    }

    update() {
        if (this.collected) return;
        this.draw();
    }
}

class Projectile extends Sprite {
    constructor({ position, velocity }) {
        super({
            position,
            velocity,
            scale: 1.5,
            sprites: {
                idle: {
                    src: "public/assets/effects/ball.png",
                    totalSpriteFrames: 1,
                    framesPerSpriteFrame: 1
                }
            }
        });

        this.speed = 5;
        this.shouldBeRemoved = false;

        this.frameWidth = 16;
        this.frameHeight = 16;
        this.width = this.frameWidth * this.scale;
        this.height = this.frameHeight * this.scale;

        console.log("🔥 Fireball criada em:", position);
    }

    update() {
        this.loadSprite();
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;

        // Verifica se saiu da tela
        if (
            this.position.x + this.width < cameraOffsetX ||
            this.position.x > cameraOffsetX + canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y > canvas.height
        ) {
            this.shouldBeRemoved = true;
            console.log("🧊 Fireball removida (fora da tela)");
        }

        this.draw();
        this.animate();
    }

    draw() {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        ctx.translate(this.position.x - cameraOffsetX, this.position.y);

        ctx.drawImage(
            this.image,
            this.currentSpriteFrame * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            0,
            0,
            this.width,
            this.height
        );

        ctx.restore();
    }
}