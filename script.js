function onloadFunc() {
    loadPokemon();
    let searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        searchPokemon();
    });
}

let typeColors = {
    grass: "#78C850",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    bug: "#A8B820",
    normal: "#A8A878",
    poison: "#A040A0",
    ground: "#E0C068",
    fairy: "#EE99AC",
    fighting: "#C03028",
    psychic: "#F85888",
    rock: "#B8A038",
    ghost: "#705898",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0"
};
let offset = 0;
let allPokemons = [];
let currentIndex = 0;

function closeBigCard(event) {
    if (!event || event.target.id === "bigCard") {
        document.getElementById("bigCard").classList.add("d_none");
        document.body.classList.remove("noscroll");
    }
}

function dialogPrevention(event) {
    event.stopPropagation();
}

function formatTypes(types) {
    let arr = Array.isArray(types) ? types : types.split(",");
    return renderTypes(arr);
}

function nextCard() {
    if (currentIndex < allPokemons.length - 1) {
        currentIndex++;
        showBigCardByIndex(currentIndex);
    }
}

function prevCard() {
    if (currentIndex > 0) {
        currentIndex--;
        showBigCardByIndex(currentIndex);
    }
}

function searchPokemon() {
    let input = getSearchInput();
    let container = document.getElementById('pokemonContainer');
    let loadBtn = document.getElementById('loadMoreBtn');
    if (input.length === 0) { renderAllPokemons(allPokemons); loadBtn.style.display = "block"; return; }
    if (input.length < 3) { showAlert("🔎 Please enter at least 3 letters", "info"); loadBtn.style.display = "none"; return; }
    let filtered = filterPokemons(input);
    if (filtered.length === 0) { showAlert("❌ No Pokemon found", "danger"); loadBtn.style.display = "none"; return; }
    renderAllPokemons(filtered);
}

function getSearchInput() {
    return document.getElementById('searchInput').value.toLowerCase().trim();
}

function showAlert(msg, type) {
    document.getElementById('pokemonContainer').innerHTML =
        `<div class="alert alert-${type} text-center w-75 mx-auto mt-5 shadow-sm"
              style="font-size: clamp(1rem, 4vw, 1.5rem)">${msg}</div>`;
}

function filterPokemons(input) {
    return allPokemons.filter(p => p.name.toLowerCase().includes(input));
}

function openCardById(id) {
    let container = document.getElementById('overlay');
    let pokemonIndex = allPokemons.findIndex(p => p.id === id);
    if (pokemonIndex === -1) return;
    currentIndex = pokemonIndex;
    showBigCardByIndex(currentIndex);
    container.style.display = 'flex';
}