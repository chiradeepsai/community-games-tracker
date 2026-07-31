const search = document.getElementById("search");
const results = document.getElementById("results");
const selectedList = document.getElementById("selectedGames");
const saveBtn = document.getElementById("saveBtn");

let selectedGames = [];

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

function renderSelected() {

    selectedList.innerHTML = "";

    selectedGames.forEach(game => {

        const li = document.createElement("li");

        li.innerText = game.name;

        selectedList.appendChild(li);

    });

}

saveBtn.onclick = async () => {

    const response = await fetch("/api/save-games", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            games: selectedGames

        })

    });

    const data = await response.json();

    alert(data.message);

};