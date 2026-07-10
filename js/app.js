const map = L.map('map')
    .setView([52.3676,4.9041],12);
loadSavedRoute();
L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
 attribution:'OpenStreetMap'
}
).addTo(map);


let marker;
let bikeArrow;
let windControl;
let windLegend;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine;


// Démarrage


