const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas");
const faseMenu = document.getElementById("faseMenu");
const startButton = document.getElementById("startButton");
const ctx = canvas.getContext("2d");

const canvasWidth = 1024;
const canvasHeight = 576;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const MAP_WIDTH = 5000;
let cameraOffsetX = 0;
let items = [];
let enemies = [];
let lastEnemy = null;
let jogoTravado = false;
let animFrameId;


let fruitBasketSpawned = false;

const desiredFPS = 120;
const frameTime = 1000 / desiredFPS;

const retryButton = document.getElementById("retryButton");
const backToMenuButton = document.getElementById("backToMenuButton");

items.push(new Item({ position: { x: 600, y: 400 }, type: "apple" }));
items.push(new Item({ position: { x: 1300, y: 500 }, type: "apple" }));
items.push(new Item({ position: { x: 1000, y: 380 }, type: "hamburguer" }));
items.push(new Item({ position: { x: 1500, y: 420 }, type: "hamburguer" }));


let prevTime = performance.now();
let lag = 0;
let projectiles = [];

let vidaAtual = 5;
const vidaMaxima = 5;


retryButton.addEventListener("click", () => {
    vidaAtual = vidaMaxima;
    document.getElementById("gameOverScreen").style.display = "none";
    iniciarFase1();
});

backToMenuButton.addEventListener("click", () => {
    vidaAtual = vidaMaxima;
    document.getElementById("gameOverScreen").style.display = "none";
    canvas.style.display = "none";
    faseMenu.style.display = "block";
});

startButton.addEventListener("click", () => {
    menu.style.display = "none";
    faseMenu.style.display = "block";
});

document.querySelectorAll(".faseBtn").forEach(button => {
    button.addEventListener("click", () => {
        const faseSelecionada = button.dataset.fase;
        faseMenu.style.display = "none";
        canvas.style.display = "block";
        iniciarFase(faseSelecionada);
    });
});

function criarInimigos() {
    enemies = [
        new Enemy({
            position: { x: 1300, y: 400 },
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
    ];
}

criarInimigos();


function checkCollision(a, b) {
    const aWidth = a.width || 16;
    const aHeight = a.height || 16;
    const bWidth = b.width * (b.scale || 1);
    const bHeight = b.height * (b.scale || 1);

    return (
        a.position.x < b.position.x + bWidth &&
        a.position.x + aWidth > b.position.x &&
        a.position.y < b.position.y + bHeight &&
        a.position.y + aHeight > b.position.y
    );
}

function checkItemCollision(item) {
    const itemWidth = item.width * (item.scale || 1);
    const itemHeight = item.height * (item.scale || 1);

    const playerX = player.position.x;
    const playerY = player.position.y;
    const playerWidth = (player.image.width / player.totalSpriteFrames) * player.scale;
    const playerHeight = player.image.height * player.scale;

    return (
        playerX < item.position.x + itemWidth &&
        playerX + playerWidth > item.position.x &&
        playerY < item.position.y + itemHeight &&
        playerY + playerHeight > item.position.y
    );
}

function animate() {
    const currentTime = performance.now();
    const elapsed = currentTime - prevTime;
    prevTime = currentTime;

    if (enemies.length > 0) {
        lastEnemy = enemies.reduce((farthest, e) =>
            e.position.x > farthest.position.x ? e : farthest
        );
    }

    lag += elapsed;

    // Processa controles do jogador
    handleControls();

    // Executa atualizações lógicas com base no frameTime
    while (lag >= frameTime) {
        // Limpa a tela
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Atualiza fundo e jogador
        background.update();
        player.update();

        // Atualiza projéteis
        projectiles.forEach(proj => {
            proj.update();

            // Verifica colisão com inimigos
            enemies.forEach(enemy => {
                if (!enemy.isDead && checkCollision(proj, enemy)) {
                    console.log("Fireball acertou um inimigo!");
                    enemy.takeDamage?.();
                    proj.shouldBeRemoved = true;

                    // Se esse inimigo for o último → dropa a cesta
                    if (enemy.dropFruitBasket && !fruitBasketSpawned) {
                        spawnFruitBasket(enemy.position);
                    }

                }
            });
        });

        // Remove projéteis que colidiram ou saíram da tela
        projectiles = projectiles.filter(p => !p.shouldBeRemoved);

        // Atualiza e verifica coleta de itens
        items.forEach(item => {
            item.update();

            if (!item.collected && checkItemCollision(item)) {
                item.collect();
            }
        });

        // Remove itens coletados
        items = items.filter(item => !item.collected);

        // Atualiza inimigos
        enemies.forEach(enemy => enemy.update());


        // Remove inimigos mortos
        enemies = enemies.filter(enemy => !enemy.shouldBeRemoved);

        // Subtrai tempo acumulado
        lag -= frameTime;

        // (Debug visual) Mostra hitbox do player
        const playerWidth = (player.image.width / player.totalSpriteFrames) * player.scale;
        const playerHeight = player.image.height * player.scale;

        ctx.strokeStyle = "red";
        ctx.strokeRect(
            player.position.x - cameraOffsetX,
            player.position.y,
            playerWidth,
            playerHeight
        );
    }

    // Chama o próximo frame
    window.requestAnimationFrame(animate);

    // Exibe contador de itens na tela
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Itens ativos: ${items.length}`, 20, 90);

    // Desenha barra de vida do jogador
    desenharBarraDeVida();
}

// Criação da cesta de frutas (drop final)
function spawnFruitBasket(position) {
    const cesta = new FruitBasket({
        position: {
            x: position.x,
            y: position.y
        }
    });

    cesta.onCollect = () => {
        showVictoryScreen();
    };

    items.push(cesta);
    fruitBasketSpawned = true;
}

function showVictoryScreen() {
    const screen = document.getElementById("victoryScreen");
    if (screen) {
        screen.style.display = "flex";
    }

    animFrameId = requestAnimationFrame(animate);
    jogoTravado = true;

}

function iniciarFase(fase) {
    if (fase === "1")
        iniciarFase1();
}

function iniciarFase1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    mostrarIntroDaFase("1", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vidaAtual = vidaMaxima;
        animate();
    });
}

function desenharBarraDeVida() {
    const coracaoCheio = "❤️";
    const coracaoVazio = "🖤";

    let coracoes = "";
    for (let i = 1; i <= vidaMaxima; i++) {
        coracoes += i <= vidaAtual ? coracaoCheio : coracaoVazio;
    }

    ctx.font = "24px Fredoka, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.fillText("Vidas: " + coracoes, 20, 40);

    if (vidaAtual === 0) {
        mostrarGameOver();
    }

}

function simularDano() {
    if (vidaAtual > 0) {
        vidaAtual--;
        console.log("Dano! Vida restante:", vidaAtual);
    }
}

function mostrarGameOver() {
    document.getElementById("gameOverScreen").style.display = "block";
    jogoTravado = true;
}

function mostrarIntroDaFase(fase, onFechar) {
    const introTexto = document.getElementById("introTexto");
    const introContainer = document.getElementById("faseIntro");
    const introBtn = document.getElementById("introBtn");
    const introImg = document.getElementById("introImg");

    const dialogos = {
        "1": [
            "Olá! Eu sou o sua guia nessa jornada e vou te ajudar a entender como os alimentos influenciam sua saúde!",
            "Você sabia que os alimentos são a nossa principal fonte de energia e que eles influenciam no desenvolvimento saudável do corpo? As frutas, por exemplo, são ricas em vitaminas que fortalecem o sistema imunológico!"
        ],
        "2": [
            "Ei, estou de volta para mais uma dica importante!",
            "Legumes e verduras são fontes incríveis de nutrientes! Eles contêm sais minerais, vitaminas e fibras que ajudam na digestão, fortalecem os ossos e protegem contra doenças."
        ],
        "3": [
            "Você sabia que sem água o corpo perde energia e concentração?",
            "A água hidrata, transporta nutrientes e mantém as células funcionando. Beba água todos os dias!"
        ],
        "4": [
            "Chegamos à reta final!",
            "Com uma alimentação equilibrada — cheia de frutas, legumes, cereais e água — seu corpo estará pronto para qualquer desafio!"
        ]
    };

    const falas = dialogos[fase] || ["Olá!", "Conteúdo não encontrado."];
    let index = 0;

    introTexto.textContent = falas[index];
    introImg.src = "assets/cientista/cientista.png";
    introBtn.textContent = "Próximo >";
    introContainer.style.display = "flex";

    introBtn.onclick = () => {
        index++;

        if (index < falas.length) {
            introTexto.textContent = falas[index];

            // Muda imagem na segunda parte
            if (index === 1) {
                introImg.src = "assets/cientista/cientista-doce.png";
            }

            // Última fala → botão muda para "Entendi!"
            if (index === falas.length - 1) {
                introBtn.textContent = "Entendi!";
            }

        } else {
            introContainer.style.display = "none";
            introBtn.textContent = "Próximo >";
            introImg.src = "assets/cientista/cientista-doce.png";
            onFechar();
        }
    };
}