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

let prevTime = performance.now();
let lag = 0;


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
}

  function iniciarFase(fase) {
    if (fase === "1") iniciarFase1();
  }
  
  function iniciarFase1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Fase 1: Jardim das Frutas 🍎", 220, 100);
    animate();
  }



