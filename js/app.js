const map = L.map('map')
    .setView([52.3676,4.9041],12);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
 attribution:'OpenStreetMap'
}
).addTo(map);
function loadSavedRoute(){

    const saved =
    localStorage.getItem("cyclowind_route");


    if(!saved){
        return;
    }


    const route =
    JSON.parse(saved);


    if(!route.coords){
        return;
    }


    drawWindRoute(route.coords);


    map.fitBounds(route.coords);


    document.getElementById("windInfo").innerHTML =
    `
    🚴 Trajet sauvegardé
    <br>
    🌬️ Vent : ${route.wind.toFixed(1)}
    `;

}
function clearRoute(){
    localStorage.removeItem("cyclowind_route");
    location.reload();
}
let marker;
let bikeArrow;
let windControl;
let windLegend;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine;


// Démarrage


