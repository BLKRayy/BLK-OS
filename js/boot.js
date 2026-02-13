window.addEventListener("load", () => {
    const bootScreen = document.getElementById("boot-screen");
    const app = document.getElementById("app");
    const bootSound = new Audio("assets/sounds/boot.mp3");

    // Try to play immediately
    bootSound.volume = 0.6;
    bootSound.play().catch(() => {
        // If blocked, play after user interacts
        const unlock = () => {
            bootSound.play();
            document.removeEventListener("click", unlock);
        };
        document.addEventListener("click", unlock);
    });

    setTimeout(() => {
        bootScreen.classList.add("hidden");
        app.classList.remove("hidden");
        document.body.classList.remove("boot-active");
    }, 3200);
});
