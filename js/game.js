const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas");
const faseMenu = document.getElementById("faseMenu");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  menu.style.display = "none";
  faseMenu.style.display = "block";
});

// Evento para escolher fase
document.querySelectorAll(".faseBtn").forEach(button => {
  button.addEventListener("click", () => {
    const faseSelecionada = button.dataset.fase;
    faseMenu.style.display = "none";
    canvas.style.display = "block";
    iniciarFase(faseSelecionada);
  });
});

function iniciarFase(fase) {
  // Aqui começa a lógica da fase selecionada
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText(`Fase ${fase} carregando...`, 280, 300);
}
