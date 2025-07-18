function iniciarFase4() {
    background = new Background("public/assets/background/bg-boss.png"); 
    mostrarIntroDaFase("4", () => {
        vidaAtual = vidaMaxima;
        items = [];
        enemies = [];
        projectiles = [];
        fruitBasketSpawned = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 🍎 Itens da fase 4
        items.push(new Item({ position: { x: 3000, y: 400 }, type: "hamburguer" }));
        items.push(new Item({ position: { x: 2300, y: 500 }, type: "apple" }));
        items.push(new Item({ position: { x: 2500, y: 460 }, type: "apple" }));
        items.push(new Item({ position: { x: 2600, y: 380 }, type: "hamburguer" }));
        items.push(new Item({ position: { x: 1700, y: 450 }, type: "hamburguer" }));
        items.push(new Item({ position: { x: 3200, y: 340 }, type: "hamburguer" }));
        

        const boss = new Boss({
            position: { x: 2200, y: 420 },
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
                    framesPerSpriteFrame: 6
                }
            }
        });

        enemies.push(boss); // boss entra como único inimigo da fase
    });
    animate();
}