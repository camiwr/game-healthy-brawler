function iniciarFase4() {
    background = new Background("public/assets/background/bg-boss.png"); 
    mostrarIntroDaFase("4", () => {
        vidaAtual = vidaMaxima;
        items = [];
        enemies = [];
        projectiles = [];
        fruitBasketSpawned = false;

        const boss = new Boss({
            position: { x: 3200, y: 420 },
            scale: 5,
            sprites: {
                running: {
                    src: "public/assets/enemies/boss-run.png",
                    totalSpriteFrames: 8,
                    framesPerSpriteFrame: 7
                },
                attack: {
                    src: "public/assets/enemies/boss-atack.png",
                    totalSpriteFrames: 8,
                    framesPerSpriteFrame: 6
                },
                death: {
                    src: "public/assets/enemies/boss-dead.png",
                    totalSpriteFrames: 5,
                    framesPerSpriteFrame: 8
                }
            }
        });

        enemies.push(boss); // boss entra como único inimigo da fase
    });
    animate();
}