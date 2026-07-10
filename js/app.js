const map = L.map('map')
    .setView([52.3676,4.9041],12);
loadSavedRoute();
L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
 attribution:'OpenStreetMap'
}
).addTo(map);
function loadSavedRoute(){

    const saved = localStorage.getItem("cyclowind_route");

    if(!saved){
        console.log("Aucun trajet sauvegardé");
        return;
    }

    const route = JSON.parse(saved);

    console.log("Trajet chargé :", route);

    drawWindRoute(route.coords);

    document.getElementById("windInfo").innerHTML =
    `
    ${route.recommendation}
    <br><br>
    🌬️ Trajet : ${route.wind.toFixed(1)}
    <br>
    🌱 Alternative : ${route.altWind.toFixed(1)}
    `;
}

let marker;
let bikeArrow;
let windControl;
let windLegend;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine;


// Démarrage


