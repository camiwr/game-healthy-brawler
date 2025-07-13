// Background exclusivo da fase 1
const background = new Background("../assets/background/bg-city.jpeg");

// Itens e inimigos da fase 1
function iniciarFase1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";

    mostrarIntroDaFase("1", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vidaAtual = vidaMaxima;

        items = [];
        enemies = [];
        fruitBasketSpawned = false;

        // 🍎 Itens da fase 1
        items.push(new Item({ position: { x: 600, y: 400 }, type: "apple" }));
        items.push(new Item({ position: { x: 1300, y: 500 }, type: "apple" }));
        items.push(new Item({ position: { x: 1000, y: 380 }, type: "hamburguer" }));
        items.push(new Item({ position: { x: 1500, y: 420 }, type: "hamburguer" }));

        // 👾 Inimigos da fase 1
        enemies.push(
            new Enemy({
                position: { x: 1800, y: 400 },
                velocity: { x: 0, y: 0 },
                scale: 2.5,
                sprites: {
                    idle_down: {
                        src: "../assets/enemies/slime_idle.png",
                        totalSpriteFrames: 4,
                        framesPerSpriteFrame: 10
                    },
                    running: {
                        src: "../assets/enemies/slime_run.png",
                        totalSpriteFrames: 6,
                        framesPerSpriteFrame: 7
                    },
                    death: {
                        src: "../assets/enemies/slime_die.png",
                        totalSpriteFrames: 5,
                        framesPerSpriteFrame: 10
                    }
                }
            }),
            new Enemy({
                position: { x: 2200, y: 500 },
                velocity: { x: 0, y: 0 },
                scale: 2.5,
                sprites: {
                    idle_down: {
                        src: "../assets/enemies/slime_idle.png",
                        totalSpriteFrames: 4,
                        framesPerSpriteFrame: 10
                    },
                    running: {
                        src: "../assets/enemies/slime_run.png",
                        totalSpriteFrames: 6,
                        framesPerSpriteFrame: 7
                    },
                    death: {
                        src: "../assets/enemies/slime_die.png",
                        totalSpriteFrames: 5,
                        framesPerSpriteFrame: 10
                    }
                }
            }),
            new Enemy({
                position: { x: 5000, y: 420 },
                dropFruitBasket: true,
                velocity: { x: 0, y: 0 },
                scale: 2.5,
                sprites: {
                    idle_down: {
                        src: "../assets/enemies/slime_idle.png",
                        totalSpriteFrames: 4,
                        framesPerSpriteFrame: 10
                    },
                    running: {
                        src: "../assets/enemies/slime_run.png",
                        totalSpriteFrames: 6,
                        framesPerSpriteFrame: 7
                    },
                    death: {
                        src: "../assets/enemies/slime_die.png",
                        totalSpriteFrames: 5,
                        framesPerSpriteFrame: 10
                    }
                }
            })
        );

        animate();
    });
}
