const search = document.getElementById("search");
const results = document.getElementById("results");
const selectedList = document.getElementById("selectedGames");
const saveBtn = document.getElementById("saveBtn");
const userSection = document.getElementById("userSection");
const serverInfo = document.getElementById("serverInfo");

let selectedGames = [];

// ==========================
// Current Server
// ==========================

const params = new URLSearchParams(window.location.search);

const guildId = params.get("guildId");
const guildName = params.get("guildName");

// ==========================
// Check Login Status
// ==========================

async function checkLogin() {

    const res = await fetch("/auth/me");
    const data = await res.json();

    if (!data.loggedIn) {

        userSection.innerHTML = `
            <a href="/auth/discord">
                <button>Login with Discord</button>
            </a>
        `;

        search.disabled = true;
        saveBtn.disabled = true;

        return;

    }

    userSection.innerHTML = `
        <p>👤 Logged in as <b>${data.user.username}</b></p>

        <a href="/auth/logout">
            <button>Logout</button>
        </a>
    `;

    if (guildId && guildName) {

        serverInfo.innerHTML = `
            <p>
                🏠 <b>Updating games for</b><br>
                ${decodeURIComponent(guildName)}
            </p>
        `;

    }

    search.disabled = false;
    saveBtn.disabled = false;

}

checkLogin();

// ==========================
// Search Games
// ==========================

search.addEventListener("input", async () => {

    const query = search.value.trim();

    if (query.length < 2) {

        results.innerHTML = "";
        return;

    }

    const res = await fetch(`/api/search-games?q=${encodeURIComponent(query)}`);

    const games = await res.json();

    results.innerHTML = "";

    games.forEach(game => {

        const div = document.createElement("div");

        div.className = "result";

        div.innerText = game.name;

        div.onclick = () => addGame(game);

        results.appendChild(div);

    });

});

// ==========================
// Add Game
// ==========================

function addGame(game) {

    if (selectedGames.find(g => g.id === game.id)) {

        alert("Game already selected");

        return;

    }

    if (selectedGames.length >= 3) {

        alert("Maximum 3 games");

        return;

    }

    selectedGames.push(game);

    renderSelected();

    search.value = "";

    results.innerHTML = "";

}

// ==========================
// Render Selected Games
// ==========================

function renderSelected() {

    selectedList.innerHTML = "";

    selectedGames.forEach((game, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            ${game.name}
            <button onclick="removeGame(${index})">❌</button>
        `;

        selectedList.appendChild(li);

    });

}

// ==========================
// Remove Game
// ==========================

function removeGame(index) {

    selectedGames.splice(index, 1);

    renderSelected();

}

window.removeGame = removeGame;

// ==========================
// Save Games
// ==========================

saveBtn.onclick = async () => {

    if (!guildId) {

        alert("Please open this page using the Discord Community Hub.");

        return;

    }

    if (selectedGames.length === 0) {

        alert("Select at least one game.");

        return;

    }

    const response = await fetch("/api/save-games", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            guildId,

            guildName,

            games: selectedGames

        })

    });

    const data = await response.json();

    alert(data.message);

};