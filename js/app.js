const map = L.map('map')
    .setView([52.3676,4.9041],12);



L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
 attribution:'OpenStreetMap'
}
).addTo(map);

function clearRoute(){

    localStorage.removeItem("cyclowind_route");

    document.getElementById("windInfo").innerHTML =
    "🚴 Aucun trajet calculé";

}

let marker;
let bikeArrow;
let windControl;
let windLegend;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine;


// Démarrage


