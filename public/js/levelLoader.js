document.querySelectorAll(".faseBtn").forEach(button => {
    button.addEventListener("click", () => {
        const fase = button.dataset.fase;

        faseMenu.style.display = "none";
        canvas.style.display = "block";

        if (fase === "1") iniciarFase1();
        else if (fase === "2") iniciarFase2();
        else if (fase === "3") iniciarFase3();
        else if (fase === "4") iniciarFase4();
    });
});
