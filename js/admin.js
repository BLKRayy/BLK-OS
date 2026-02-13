function loginSuccess(username) {
    adminLoginForm.classList.add("hidden");
    adminDashboard.classList.remove("hidden");

    adminDashboard.style.animation = "dashFade 0.6s ease forwards";

    const time = new Date().toLocaleString();
    adminSessionInfo.textContent = `Logged in as "${username}" at ${time}.`;
}
