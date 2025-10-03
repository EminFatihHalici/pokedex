function getPokemonCardHTML(p) {
    let typeHtml = renderTypes(p.types);
    return `
        <div class="col pokemon-card">
            <div class="card p-2 text-center shadow-sm rounded-3 position-relative" 
                style="background-color:${p.bgColor}" data-url="${p.url}"
                onclick="showBigCard('${p.id}', '${p.name}', '${p.imgUrl}', '${p.types.join(",")}', '${p.bgColor}', '${p.url}')">
                <span class="pokemon-id position-absolute top-0 end-0 m-2">#${p.id}</span>
                <img class="pokemon-image mx-auto d-block" src="${p.imgUrl}" alt="${p.name}" loading="lazy">
                <h5 class="card-title text-capitalize">${p.name}</h5>
                <div class="pokemon-types">${typeHtml}</div>
            </div>
        </div>
    `;
}