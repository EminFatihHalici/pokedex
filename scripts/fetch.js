async function loadPokemon() {  //fetche basis url nur mit den ersten 20
    try {
        let res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        let data = await res.json();
        for (let i = 0; i < data.results.length; i++) {
            await renderPokemonCard(data.results[i]);
        }
        offset += 20;
        allPokemons.sort((a, b) => Number(a.id) - Number(b.id));
        renderAllPokemons(allPokemons);
    } catch (e) {
        console.error("Failure", e);
    }
}

async function getPokemonDetails(pokemon) {
    let response = await fetch(pokemon.url);
    let data = await response.json();
    let types = data.types?.map(t => t.type?.name).filter(Boolean) || [];
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

async function loadMorePokemon() {
    document.getElementById("overlay").style.display = "flex";
    await loadPokemon();
    setTimeout(() => {
        document.getElementById("overlay").style.display = "none";
    }, 500);
}

async function showBigCard(id, name, imgUrl, types, bgColor, url) {
    let typeHtml = formatTypes(types);
    let statsHtml = await formatStats(url);
    document.getElementById("bigCardTemplate").innerHTML =
        buildBigCardHTML({ id, name, imgUrl, bgColor, typeHtml, statsHtml });
    document.getElementById("bigCard").classList.remove("d_none");
    document.body.classList.add("noscroll");
}

async function formatStats(url) {
    let s = await getPokemonStats(url);
    return `
      ${renderStat("HP", s.hp, "success")}
      ${renderStat("Attack", s.attack, "danger")}
      ${renderStat("Defense", s.defense, "primary")}
      ${renderStat("Special Atk", s["special-attack"], "warning")}
      ${renderStat("Special Def", s["special-defense"], "info")}
      ${renderStat("Speed", s.speed, "dark")}
    `;
}

async function showBigCardByIndex(index) {
    currentIndex = index;
    let p = allPokemons[index];
    await showBigCard(p.id, p.name, p.imgUrl, p.types, p.bgColor, p.url);
}