const retryBtn = document.getElementById("retryBtn");

if (retryBtn) {
    retryBtn.addEventListener("click", () => {
        // Try to reload the main OS
        window.location.href = "index.html";
    });
}

// Optional: if connection comes back while on offline page, auto-redirect
window.addEventListener("online", () => {
    window.location.href = "index.html";
});
