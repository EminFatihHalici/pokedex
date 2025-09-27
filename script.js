function onloadFunc() {
    loadPokemon();
}

const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

async function loadPokemon() {
    try {

        let response = await fetch(BASE_URL);
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Failure", error);
    }
}