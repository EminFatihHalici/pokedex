async function renderPokemonCard(pokemon) {
    let id = pokemon.url.split("/")[pokemon.url.split("/").length - 2];
    let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    let details = await getPokemonDetails(pokemon);
    allPokemons.push({
        id, name: pokemon.name, imgUrl,
        types: details.types,
        bgColor: details.bgColor,
        url: pokemon.url
    });
    let index = allPokemons.length - 1;
    let container = document.getElementById("pokemonContainer");
    container.innerHTML += getPokemonCardHTML(allPokemons[index]);
}

function renderTypes(types) {
    let html = "";
    for (let i = 0; i < types.length; i++) {
        let type = types[i];
        let color = typeColors[type] || "#AAA";
        html += `<span class="pokemon-type" style="background-color:${color}">${type}</span>`;
    }
    return html;
}

function renderStat(name, value, color) {
    let percent = Math.min(value, 100);
    return `
         <div class="mb-2">
           <div class="d-flex justify-content-between">
                <small><strong>${name}</strong></small>
                <small>${value}</small>
            </div>
            <div class="progress rounded-pill" style="height: 12px;">
                <div class="progress-bar bg-${color}" role="progressbar" style="width: ${percent}%"></div>
            </div>
        </div>
    `;
}

function renderAllPokemons(list) {
    let container = document.getElementById('pokemonContainer');
    container.innerHTML = '';
    list.forEach(p => container.innerHTML += getPokemonCardHTML(p));
}