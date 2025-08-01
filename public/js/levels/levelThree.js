
function iniciarFase3() {
    background = new Background("public/assets/background/bg-agua.png");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";

    mostrarIntroDaFase("3", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vidaAtual = vidaMaxima;

        items = [];
        enemies = [];
        fruitBasketSpawned = false;

        // 🥦 Itens da fase 3
        items.push(new Item({ position: { x: 800, y: 400 }, type: "apple" }));
        items.push(new Item({ position: { x: 1400, y: 460 }, type: "hamburguer" }));
        items.push(new Item({ position: { x: 1900, y: 440 }, type: "apple" }));

        // 👾 Inimigos da fase 3
        enemies.push(
            new Enemy({
                position: { x: 2400, y: 420 },
                velocity: { x: 0, y: 0 },
                scale: 3,
                sprites: {
                    idle_down: {
                        src: "public/assets/enemies/slime_idle.png",
                        totalSpriteFrames: 4,
                        framesPerSpriteFrame: 10
                    },
                    running: {
                        src: "public/assets/enemies/slime_run.png",
                        totalSpriteFrames: 6,
                        framesPerSpriteFrame: 7
                    },
                    death: {
                        src: "public/assets/enemies/slime_die.png",
                        totalSpriteFrames: 5,
                        framesPerSpriteFrame: 10
                    }
                }
            }),

            new Enemy({
                position: { x: 2900, y: 420 },
                velocity: { x: 1, y: 0 },
                scale: 3,
                sprites: {
                    idle_down: {
                        src: "public/assets/enemies/slime_idle.png",
                        totalSpriteFrames: 4,
                        framesPerSpriteFrame: 10
                    },
                    running: {
                        src: "public/assets/enemies/slime_run.png",
                        totalSpriteFrames: 6,
                        framesPerSpriteFrame: 7
                    },
                    death: {
                        src: "public/assets/enemies/slime_die.png",
                        totalSpriteFrames: 5,
                        framesPerSpriteFrame: 10
                    }
                }
            }),
            new Enemy({
                position: { x: 4200, y: 500 },
                dropFruitBasket: true,
                velocity: { x: 0, y: 0 },
                scale: 3.0,
                sprites: {
                    idle_down: {
                        src: "public/assets/enemies/slime_idle.png",
                        totalSpriteFrames: 4,
                        framesPerSpriteFrame: 10
                    },
                    running: {
                        src: "public/assets/enemies/slime_run.png",
                        totalSpriteFrames: 6,
                        framesPerSpriteFrame: 7
                    },
                    death: {
                        src: "public/assets/enemies/slime_die.png",
                        totalSpriteFrames: 5,
                        framesPerSpriteFrame: 10
                    }
                }
            })
        );
    });
    
    animate();
}
