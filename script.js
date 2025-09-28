const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

function onloadFunc() {
    loadPokemon();
}

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

function renderPokemonCard(pokemon) {
    let id = pokemon.url.split("/")[pokemon.url.split("/").length - 2];
    let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    let container = document.getElementById("pokemonContainer");
    container.innerHTML += `
        <div class="col">
            <div class="card p-2 text-center shadow-sm" data-url="${pokemon.url}">
                <img src="${imgUrl}" alt="${pokemon.name}" loading="lazy">
                <h5 class="card-title text-capitalize">${pokemon.name}</h5>
                <p>ID: ${id}</p>
            </div>
        </div>
    `;
}

