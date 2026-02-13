const adminLoginForm = document.getElementById("adminLoginForm");
const adminError = document.getElementById("adminError");
const adminDashboard = document.getElementById("adminDashboard");
const adminSessionInfo = document.getElementById("adminSessionInfo");

const ADMIN_USER = "admin";
const ADMIN_PASS = "loyal";

function showError(msg) {
    if (!adminError) return;
    adminError.textContent = msg;
    adminError.classList.remove("hidden");
}

function hideError() {
    if (!adminError) return;
    adminError.classList.add("hidden");
}

function loginSuccess(username) {
    if (adminLoginForm) adminLoginForm.classList.add("hidden");
    if (adminDashboard) adminDashboard.classList.remove("hidden");
    const time = new Date().toLocaleString();
    if (adminSessionInfo) {
        adminSessionInfo.textContent = `Logged in as "${username}" at ${time}. Session is local only (demo mode).`;
    }
}

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        hideError();

        const username = document.getElementById("username")?.value.trim();
        const password = document.getElementById("password")?.value;

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            loginSuccess(username);
        } else {
            showError("Invalid credentials.");
        }
    });
}
