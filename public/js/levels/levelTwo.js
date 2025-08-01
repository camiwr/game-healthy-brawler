
function iniciarFase2() {
    background = new Background("public/assets/background/bg-park.jpg");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";

    mostrarIntroDaFase("2", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vidaAtual = vidaMaxima;

        items = [];
        enemies = [];
        fruitBasketSpawned = false;

        // 🥦 Itens da fase 2
        items.push(new Item({ position: { x: 800, y: 460 }, type: "donut" }));
        items.push(new Item({ position: { x: 2400, y: 400 }, type: "carrot" }));
        items.push(new Item({ position: { x: 1400, y: 460 }, type: "donut" }));
        items.push(new Item({ position: { x: 1900, y: 440 }, type: "carrot" }));
        items.push(new Item({ position: { x: 3000, y: 440 }, type: "carrot" }));



        // 👾 Inimigos da fase 2
        enemies.push(
            new Enemy({
                position: { x: 2400, y: 420 },
                velocity: { x: 0, y: 0 },
                scale: 2.5,
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
                position: { x: 2800, y: 400 },
                velocity: { x: 0, y: 0 },
                scale: 2.5,
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
                position: { x: 3200, y: 400 },
                velocity: { x: 0, y: 0 },
                scale: 2.5,
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
                position: { x: 5000, y: 500 },
                dropFruitBasket: true,
                velocity: { x: 0, y: 0 },
                scale: 2.5,
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
