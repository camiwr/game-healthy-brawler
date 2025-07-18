const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas");
const faseMenu = document.getElementById("faseMenu");
const startButton = document.getElementById("startButton");
const retryButton = document.getElementById("retryButton");
const backToMenuButton = document.getElementById("backToMenuButton");
const ctx = canvas.getContext("2d");
const canvasWidth = 1024;
const canvasHeight = 576;
const desiredFPS = 120;
const frameTime = 1000 / desiredFPS;
const vidaMaxima = 5;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let items = [];
let enemies = [];
let projectiles = [];
let animFrameId;
let background;
let faseIniciada = false;
let cameraOffsetX = 0;
let lastEnemy = null;
let lag = 0;
let vidaAtual = 5;
let jogoTravado = false;
let fruitBasketSpawned = false;
let prevTime = performance.now();

startButton.addEventListener("click", () => {
    menu.style.display = "none";
    faseMenu.style.display = "block";
});


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
                if (!enemy.isDead && checkCollision(proj, enemy) && proj.owner !== enemy){
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
        enemies.forEach(enemy => {
            if (enemy && typeof enemy.update === "function") {
                enemy.update();
            }
        });


        // Remove inimigos mortos
        enemies = enemies.filter(enemy => !enemy.shouldBeRemoved);

        // Subtrai tempo acumulado
        lag -= frameTime;

    }

    // Chama o próximo frame
    window.requestAnimationFrame(animate);

    // Desenha barra de vida do jogador
    desenharBarraDeVida();
}

function spawnFruitBasket(position) {
    const cesta = new FruitBasket({
        position: {
            x: position.x,
            y: position.y
        },
    });

    cesta.onCollect = () => {
        showVictoryScreen();
    };

    items.push(cesta);
    fruitBasketSpawned = true;
}

function spawnCrown(position) {
    const crown = new CrownDrop(position);
    items.push(crown);
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
    if (fase === "1") iniciarFase1();
    else if (fase === "2") iniciarFase2();
}

function desenharBarraDeVida() {
    // Imagens dos corações
    const heartFull = new Image();
    heartFull.src = "public/assets/ui/heart.png";
    const heartEmpty = new Image();
    heartEmpty.src = "public/assets/ui/heartBlack.png";

    const x = 24;
    const y = 24;
    const heartSize = 28;
    const spacing = 8;

    // Fundo simples com leve sombra e bordas arredondadas
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#d32f2f";
    ctx.shadowBlur = 4;
    const rectX = x - 14;
    const rectY = y - 10;
    const rectW = vidaMaxima * (heartSize + spacing) + 18;
    const rectH = heartSize + 18;
    const radius = 18;
    ctx.beginPath();
    ctx.moveTo(rectX + radius, rectY);
    ctx.lineTo(rectX + rectW - radius, rectY);
    ctx.quadraticCurveTo(rectX + rectW, rectY, rectX + rectW, rectY + radius);
    ctx.lineTo(rectX + rectW, rectY + rectH - radius);
    ctx.quadraticCurveTo(rectX + rectW, rectY + rectH, rectX + rectW - radius, rectY + rectH);
    ctx.lineTo(rectX + radius, rectY + rectH);
    ctx.quadraticCurveTo(rectX, rectY + rectH, rectX, rectY + rectH - radius);
    ctx.lineTo(rectX, rectY + radius);
    ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Desenha corações
    for (let i = 0; i < vidaMaxima; i++) {
        const img = i < vidaAtual ? heartFull : heartEmpty;
        ctx.save();
        ctx.shadowColor = "#d32f2f";
        ctx.shadowBlur = 4;
        ctx.drawImage(
            img,
            x + i * (heartSize + spacing),
            y,
            heartSize,
            heartSize
        );
        ctx.restore();
    }

    // Opcional: texto discreto
    ctx.save();
    ctx.font = "bold 18px Fredoka, sans-serif";
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.8;
    ctx.fillText("Vidas", x - 10, y + heartSize + 16);
    ctx.restore();

    if (vidaAtual === 0) {
        mostrarGameOver();
    }
}


function simularDano() {
    if (vidaAtual > 0) {
        vidaAtual--;
        console.log("Dano! Vida restante:", vidaAtual);
        player.receiveHit();
    }
}

function mostrarGameOver() {
    document.getElementById("gameOverScreen").style.display = "block";
    jogoTravado = true;
}

function mostrarTutorialIntro(onFecharTutorial) {
    const tutorialContainer = document.getElementById("tutorialIntro");
    const tutorialTexto = document.getElementById("tutorialTexto");
    const tutorialBtn = document.getElementById("tutorialBtn");
    const tutorialImg = document.createElement("img");
    tutorialImg.id = "tutorialImg";
    tutorialImg.alt = "Cesta de frutas";
    tutorialImg.style.margin = "-10px";
    const pularBtn = document.getElementById("pularTutorialBtn");
    const tutorialTitulo = document.getElementById("tutorialTitulo");

    // Garante que a imagem só seja adicionada uma vez
    if (!document.getElementById("tutorialImg")) {
        tutorialTitulo.parentNode.insertBefore(tutorialImg, tutorialTitulo.nextSibling);
    }

    const instrucoes = [
        "🕹️ Use as setas ou W, A, S, D para se mover<br>⚔️ Use Z ou Espaço para atacar",
        "💖 Você começa com 5 vidas!<br>🍎 Colete frutas para ganhar vidas extras!<br>🍔 Evite comidas não saudáveis para não perder vidas!",
        "👾 Combata TODOS os inimigos para avançar de fase e vencer!"
    ];

    let index = 0;
    tutorialTexto.innerHTML = instrucoes[index];
    tutorialImg.src = "public/assets/items/fruitBasket.png";
    tutorialBtn.textContent = "Próximo";
    tutorialContainer.style.display = "flex";

    tutorialBtn.onclick = () => {
        index++;
        if (index < instrucoes.length) {
            tutorialTexto.innerHTML = instrucoes[index];
            if (index === instrucoes.length - 1) {
                tutorialBtn.textContent = "Entendi!";
            }
        } else {
            fecharTutorial();
        }
    };

    pularBtn.onclick = fecharTutorial;

    function fecharTutorial() {
        tutorialContainer.style.display = "none";
        if (typeof onFecharTutorial === "function") {
            onFecharTutorial();
            console.log("Tutorial fechado");
        }
    }
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
    introImg.src = "public/assets/cientista/cientista.png";
    introBtn.textContent = "Próximo";
    introContainer.style.display = "flex";
    introBtn.onclick = () => {
        index++;
        if (index < falas.length) {
            introTexto.textContent = falas[index];
            if (index === 1) {
                introImg.src = "public/assets/cientista/cientista-doce.png";
            }
            if (index === falas.length - 1) {
                introBtn.textContent = "Entendi!";
            }
        } else {
            introContainer.style.display = "none";
            introBtn.textContent = "Próximo";
            introImg.src = "public/assets/cientista/cientista.png";
            // Só mostra o tutorial na fase 1
            if (fase === "1") {
                mostrarTutorialIntro(onFechar);
            } else if (typeof onFechar === "function") {
                onFechar();
            }
        }
    };
}
