// Boot sequence logic
window.addEventListener("load", () => {
    const bootScreen = document.getElementById("boot-screen");
    const app = document.getElementById("app");
    const bootSound = new Audio("assets/sounds/boot.mp3");

    try {
        bootSound.volume = 0.6;
        bootSound.play().catch(() => {
            // Ignore autoplay block
        });
    } catch (e) {}

    setTimeout(() => {
        if (bootScreen) bootScreen.classList.add("hidden");
        if (app) app.classList.remove("hidden");
        document.body.classList.remove("boot-active");
    }, 3200);
});
