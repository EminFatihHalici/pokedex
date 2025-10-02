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

let offset = 0;

async function loadPokemon() {  //fetche basis url nur mit den ersten 20
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        let data = await response.json();
        let pokemonList = data.results;

        for (let i = 0; i < pokemonList.length; i++) {
            let pokemon = pokemonList[i];
            renderPokemonCard(pokemon);
        }

        offset += 20;

    } catch (error) {
        console.error("Failure", error);
        return [];
    }
}

async function renderPokemonCard(pokemon) {
    let id = pokemon.url.split("/")[pokemon.url.split("/").length - 2];
    let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    let details = await getPokemonDetails(pokemon);

    let typeHtml = renderTypes(details.types);

    let container = document.getElementById("pokemonContainer");
    container.innerHTML += `
        <div class="col pokemon-card">
        <div class="card p-2 text-center shadow-sm rounded-3 position-relative" 
             style="background-color:${details.bgColor}" data-url="${pokemon.url}"
             onclick="showBigCard('${id}', '${pokemon.name}', '${imgUrl}', '${details.types.join(",")}', '${details.bgColor}', '${pokemon.url}')">
            <span class="pokemon-id position-absolute top-0 end-0 m-2">#${id}</span>
            <img class="pokemon-image mx-auto d-block" src="${imgUrl}" alt="${pokemon.name}" loading="lazy">
            <h5 class="card-title text-capitalize">${pokemon.name}</h5>
            <div class="pokemon-types">${typeHtml}</div>
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

async function getPokemonStats(pokemonUrl) {
    let response = await fetch(pokemonUrl);
    let data = await response.json();

    let stats = {};
    data.stats.forEach(s => {
        stats[s.stat.name] = s.base_stat;
    });
    return stats;
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

async function loadMorePokemon() {
    document.getElementById("overlay").style.display = "flex";
    await loadPokemon();
    setTimeout(() => {
        document.getElementById("overlay").style.display = "none";
    }, 500);
}

function closeBigCard(event) {
    if (!event || event.target.id === "bigCard") {
        document.getElementById("bigCard").classList.add("d_none");
        document.body.classList.remove("noscroll");
    }
}

function dialogPrevention(event) {
    event.stopPropagation();
}

async function showBigCard(id, name, imgUrl, types, bgColor, url) {
    let typeArray = Array.isArray(types) ? types : types.split(",");
    let typeHtml = renderTypes(typeArray);

    let stats = await getPokemonStats(url);
    let statsHtml = `
        ${renderStat("HP", stats.hp, "success")}
        ${renderStat("Attack", stats.attack, "danger")}
        ${renderStat("Defense", stats.defense, "primary")}
        ${renderStat("Sp. Atk", stats["special-attack"], "warning")}
        ${renderStat("Sp. Def", stats["special-defense"], "info")}
        ${renderStat("Speed", stats.speed, "dark")}
    `;

    document.getElementById("bigCardTemplate").innerHTML = `
    <div class="card p-4 text-center shadow-lg rounded-3 position-relative" style="background-color:${bgColor}">
            <span class="pokemon-id position-absolute top-0 end-0 m-2">#${id}</span>
            <img class="pokemon-image mx-auto d-block" src="${imgUrl}" alt="${name}">
            <h2 class="text-capitalize">${name}</h2>
            <div class="pokemon-types">${typeHtml}</div>

            <h4 class="mb-2">Stats</h4>
            <div class="text-start">${statsHtml}</div>
           
        </div>
    `;
    document.getElementById("bigCard").classList.remove("d_none");
    document.body.classList.add("noscroll");

}


function renderStat(name, value, color) {
    let percent = Math.min(value, 100);
    return `
        <div class="mb-2">
            <small><strong>${name}:</strong> ${value}</small>
            <div class="progress" style="height: 12px;">
                <div class="progress-bar bg-${color}" role="progressbar" style="width: ${percent}%"></div>
            </div>
        </div>
    `;
}