const gamesGrid = document.getElementById("gamesGrid");
const featuredTitle = document.getElementById("featuredTitle");
const featuredDesc = document.getElementById("featuredDesc");
const playFeatured = document.getElementById("playFeatured");
const searchInput = document.getElementById("searchInput");
const categoryList = document.getElementById("categoryList");
const recentList = document.getElementById("recentList");
const favoritesList = document.getElementById("favoritesList");
const statusText = document.getElementById("statusText");
const pingText = document.getElementById("pingText");
const storageText = document.getElementById("storageText");
const fpsText = document.getElementById("fpsText");
const uptimeText = document.getElementById("uptimeText");

let games = [];
let filteredGames = [];
let featuredGame = null;
let lastFrameTime = performance.now();
let uptimeStart = Date.now();

function loadGames() {
    fetch("games.json")
        .then(res => res.json())
        .then(data => {
            games = data;
            filteredGames = [...games];
            renderGames();
            pickFeatured();
            updateRecent();
            updateFavorites();
        })
        .catch(err => {
            console.error("Error loading games.json", err);
            featuredTitle.textContent = "Error loading games";
            featuredDesc.textContent = "Check games.json or your connection.";
        });
}

function renderGames() {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = "";

    filteredGames.forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumb">
            <div class="game-body">
                <div class="game-title">${game.title}</div>
                <div class="game-desc">${game.description}</div>
                <div class="game-meta">
                    <span>${game.category}</span>
                    <div>
                        <button class="btn-ghost btn-sm play-btn">Play</button>
                        <button class="btn-ghost btn-sm fav-btn">★</button>
                    </div>
                </div>
            </div>
        `;

        card.querySelector(".play-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            openGame(game);
        });

        card.querySelector(".fav-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(game);
        });

        card.addEventListener("click", () => openGame(game));

        gamesGrid.appendChild(card);
    });
}

function pickFeatured() {
    if (!games.length) return;
    featuredGame = games[0];
    featuredTitle.textContent = featuredGame.title;
    featuredDesc.textContent = featuredGame.description;
    playFeatured.classList.remove("hidden");
    playFeatured.onclick = () => openGame(featuredGame);
}

function openGame(game) {
    if (!game || !game.url) return;
    window.open(game.url, "_blank");
    addRecent(game);
}

function addRecent(game) {
    const key = "blkos_recent";
    let recent = JSON.parse(localStorage.getItem(key) || "[]");
    recent = recent.filter(g => g.id !== game.id);
    recent.unshift({ id: game.id, title: game.title });
    if (recent.length > 8) recent.pop();
    localStorage.setItem(key, JSON.stringify(recent));
    updateRecent();
}

function updateRecent() {
    if (!recentList) return;
    const key = "blkos_recent";
    let recent = JSON.parse(localStorage.getItem(key) || "[]");
    recentList.innerHTML = "";
    recent.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.title;
        recentList.appendChild(li);
    });
}

function toggleFavorite(game) {
    const key = "blkos_favorites";
    let favs = JSON.parse(localStorage.getItem(key) || "[]");
    const exists = favs.find(g => g.id === game.id);
    if (exists) {
        favs = favs.filter(g => g.id !== game.id);
    } else {
        favs.unshift({ id: game.id, title: game.title });
    }
    localStorage.setItem(key, JSON.stringify(favs));
    updateFavorites();
}

function updateFavorites() {
    if (!favoritesList) return;
    const key = "blkos_favorites";
    let favs = JSON.parse(localStorage.getItem(key) || "[]");
    favoritesList.innerHTML = "";
    favs.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.title;
        favoritesList.appendChild(li);
    });
}

function applyFilters() {
    const query = (searchInput?.value || "").toLowerCase();
    const activeCategory = categoryList?.querySelector(".active")?.dataset.category || "all";

    filteredGames = games.filter(game => {
        const matchesSearch =
            game.title.toLowerCase().includes(query) ||
            game.description.toLowerCase().includes(query);
        const matchesCategory =
            activeCategory === "all" || game.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    renderGames();
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        applyFilters();
    });
}

if (categoryList) {
    categoryList.addEventListener("click", (e) => {
        const li = e.target.closest("li");
        if (!li) return;
        categoryList.querySelectorAll("li").forEach(el => el.classList.remove("active"));
        li.classList.add("active");
        applyFilters();
    });
}

// Diagnostics
function updatePing() {
    const start = performance.now();
    fetch(window.location.href, { method: "HEAD", cache: "no-store" })
        .then(() => {
            const ping = Math.round(performance.now() - start);
            if (pingText) pingText.textContent = `${ping} ms`;
        })
        .catch(() => {
            if (pingText) pingText.textContent = "-- ms";
        });
}

function updateStorage() {
    try {
        const used = JSON.stringify(localStorage).length;
        const kb = Math.round(used / 1024);
        if (storageText) storageText.textContent = `${kb} KB used`;
    } catch (e) {
        if (storageText) storageText.textContent = "N/A";
    }
}

function trackFPS(now) {
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    const fps = Math.round(1000 / delta);
    if (fpsText) fpsText.textContent = `${fps}`;
    requestAnimationFrame(trackFPS);
}

function updateUptime() {
    const diff = Math.floor((Date.now() - uptimeStart) / 1000);
    if (uptimeText) uptimeText.textContent = `${diff}s`;
}

// Online/offline
function updateOnlineStatus() {
    if (!statusText) return;
    if (navigator.onLine) {
        statusText.textContent = "Online";
        statusText.style.color = "#7CFC00";
    } else {
        statusText.textContent = "Offline";
        statusText.style.color = "#ff4b6e";
    }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// Init
document.addEventListener("DOMContentLoaded", () => {
    updateOnlineStatus();
    loadGames();
    updatePing();
    updateStorage();
    setInterval(updatePing, 15000);
    setInterval(updateStorage, 20000);
    setInterval(updateUptime, 1000);
    requestAnimationFrame(trackFPS);
});
