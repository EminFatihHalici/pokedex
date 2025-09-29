const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

function onloadFunc() {
    loadPokemon();
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

async function loadPokemon() {  //fetche basis url nur mit den ersten 20
    try {
        let response = await fetch(BASE_URL);
        let data = await response.json();
        let pokemonList = data.results;
        console.log("List loaded:", data);

        for (let i = 0; i < pokemonList.length; i++) {
            let pokemon = pokemonList[i];
            renderPokemonCard(pokemon);
        }

    } catch (error) {
        console.error("Failure", error);
        return [];
    }
}

async function renderPokemonCard(pokemon) {
    let id = pokemon.url.split("/")[pokemon.url.split("/").length - 2];
    let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    let details = await getPokemonDetails(pokemon);

    let container = document.getElementById("pokemonContainer");
    container.innerHTML += `
        <div class="col pokemon-card">
            <div class="p-2 text-center shadow-sm rounded-3" style="background-color:${details.bgColor}" data-url="${pokemon.url}">
                <img class="pokemon-image mx-auto d-block" src="${imgUrl}" alt="${pokemon.name}" loading="lazy">
                <h5 class="card-title text-capitalize">${pokemon.name}</h5>
                <p>ID: ${id}</p>
                <p>Typ: ${details.types.join(", ")}</p>
            </div>
        </div>
    `;
}

async function getPokemonDetails(pokemon) {
    let response = await fetch(pokemon.url);
    let data = await response.json();

    let types = [];
    if (data.types) {
        for (let i = 0; i < data.types.length; i++) {
            if (data.types[i].type && data.types[i].type.name) {
                types.push(data.types[i].type.name);
            }
        }
    }

    let mainType = types[0];
    let bgColor = typeColors[mainType] || "#AAA";

    return {
        types, bgColor
    };
}
