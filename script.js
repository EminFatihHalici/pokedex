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

async function loadPokemon() {  //fetche basis url nur mit den ersten 20
       try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
        let data = await response.json();
        for (let i = 0; i < data.results.length; i++) {
            await renderPokemonCard(data.results[i]);
        }
        offset += 20;
    } catch (error) {
        console.error("Failure", error);
    }
}

async function renderPokemonCard(pokemon) {
    let id = pokemon.url.split("/")[pokemon.url.split("/").length - 2];
    let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    let details = await getPokemonDetails(pokemon);
    allPokemons.push({
        id,name: pokemon.name,imgUrl,
        types: details.types,
        bgColor: details.bgColor,
        url: pokemon.url
    });
    let index = allPokemons.length - 1;
    let container = document.getElementById("pokemonContainer");
    container.innerHTML += getPokemonCardHTML(allPokemons[index]);
}

async function getPokemonDetails(pokemon) {
    let response = await fetch(pokemon.url);
    let data = await response.json();
    let types =data.types?.map(t => t.type?.name).filter(Boolean) || [];
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

async function showBigCard(id,name,imgUrl,types,bgColor,url){
    let typeHtml = formatTypes(types);
    let statsHtml = await formatStats(url);
    document.getElementById("bigCardTemplate").innerHTML =
        buildBigCardHTML({id,name,imgUrl,bgColor,typeHtml,statsHtml});
    document.getElementById("bigCard").classList.remove("d_none");
    document.body.classList.add("noscroll");
}

function formatTypes(types){
    let arr = Array.isArray(types)?types:types.split(",");
    return renderTypes(arr);
}

async function formatStats(url){
    let s = await getPokemonStats(url);
    return `
      ${renderStat("HP",s.hp,"success")}
      ${renderStat("Attack",s.attack,"danger")}
      ${renderStat("Defense",s.defense,"primary")}
      ${renderStat("Special Atk",s["special-attack"],"warning")}
      ${renderStat("Special Def",s["special-defense"],"info")}
      ${renderStat("Speed",s.speed,"dark")}
    `;
}

async function showBigCardByIndex(index) {
    currentIndex = index;
    let p = allPokemons[index];
    await showBigCard(p.id, p.name, p.imgUrl, p.types, p.bgColor, p.url);
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

function nextCard() {
    currentIndex = (currentIndex + 1) % allPokemons.length;
    showBigCardByIndex(currentIndex);
}

function prevCard() {
    currentIndex = (currentIndex - 1 + allPokemons.length) % allPokemons.length;
    showBigCardByIndex(currentIndex);
}

function searchPokemon(){
    const input = getSearchInput();
    const container = document.getElementById('pokemonContainer');
    const loadBtn = document.getElementById('loadMoreBtn');
    if(input.length===0){ renderAllPokemons(allPokemons); loadBtn.style.display="block"; return; }
    if(input.length<3){ showAlert("🔎 Please enter at least 3 letters","info"); loadBtn.style.display="none"; return; }
    const filtered = filterPokemons(input);
    if(filtered.length===0){ showAlert("❌ No Pokemon found","danger"); loadBtn.style.display="none"; return; }
    renderAllPokemons(filtered);
}

function getSearchInput(){
    return document.getElementById('searchInput').value.toLowerCase().trim();
}

function showAlert(msg,type){
    document.getElementById('pokemonContainer').innerHTML =
        `<div class="alert alert-${type} text-center w-75 mx-auto mt-5 shadow-sm"
              style="font-size: clamp(1rem, 4vw, 1.5rem)">${msg}</div>`;
}

function filterPokemons(input){
    return allPokemons.filter(p=>p.name.toLowerCase().includes(input));
}

function renderAllPokemons(list) {
    const container = document.getElementById('pokemonContainer');
    container.innerHTML = '';

    list.forEach(p => {
        container.innerHTML += getPokemonCardHTML(p);
    });
}