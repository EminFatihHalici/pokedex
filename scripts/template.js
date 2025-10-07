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

function buildBigCardHTML({id,name,imgUrl,bgColor,typeHtml,statsHtml}){
    return `
      <div class="card shadow-lg p-4 text-center position-relative mx-auto" style="background-color:${bgColor}; max-width:600px;width:100%;">
        <span class="pokemon-id position-absolute top-0 end-0 m-2">#${id}</span>
        <img class="pokemon-image mx-auto d-block mb-3" src="${imgUrl}" alt="${name}" style="max-height:250px;">
        <h2 class="text-capitalize mb-3">${name}</h2>
        <div class="pokemon-types mb-4 d-flex justify-content-center gap-2">${typeHtml}</div>
        <h4 class="mb-2">Stats</h4>
        <div class="text-start big-card-background">${statsHtml}</div>
        <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-outline-light" onclick="prevCard()">⬅️</button>
            <button class="btn btn-dark" onclick="closeBigCard()">Close</button>
            <button class="btn btn-outline-light" onclick="nextCard()">➡️</button>
        </div>
      </div>
    `;
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