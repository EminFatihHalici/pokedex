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

        for (let i = 0; i< pokemonList.length; i++) {
            let pokemon = pokemonList[i];
            renderPokemonCard(pokemon);
        }
        
    } catch (error) {
        console.error("Failure", error);
        return [];
    }
}