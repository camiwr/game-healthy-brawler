const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas");
const faseMenu = document.getElementById("faseMenu");
const startButton = document.getElementById("startButton");
const ctx = canvas.getContext("2d");

const canvasWidth = 1024
const canvasHeight = 576

canvas.width = canvasWidth
canvas.height = canvasHeight

const desiredFPS = 120; // The desired frames per second
const frameTime = 1000 / desiredFPS; // The time per frame in milliseconds

const retryButton = document.getElementById("retryButton");
const backToMenuButton = document.getElementById("backToMenuButton");

let prevTime = performance.now();
let lag = 0;

let vidaAtual = 5;
const vidaMaxima = 5;

retryButton.addEventListener("click", () => {
    vidaAtual = vidaMaxima;
    document.getElementById("gameOverScreen").style.display = "none";
    iniciarFase1(); // Ou você pode guardar a fase atual em uma variável
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

function animate() {
    const currentTime = performance.now();
    const elapsed = currentTime - prevTime;
    prevTime = currentTime;
    lag += elapsed;

    handleControls();

    while (lag >= frameTime) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        background.update();
        player.update();
        //player2.update();

        lag -= frameTime;
    }

    window.requestAnimationFrame(animate);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";

    // Barra de vida
    desenharBarraDeVida();
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
    // Para de animar (você pode adicionar um flag se quiser)
    document.getElementById("gameOverScreen").style.display = "block";
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