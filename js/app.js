let marker;
let bikeArrow;
let windControl;
let windLegend;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine;
let routeLayers = [];

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


    // Effacer le trajet affiché
    if(window.routeLayers){

        routeLayers.forEach(layer=>{
            map.removeLayer(layer);
        });

        routeLayers = [];

    }


    // Effacer la destination sélectionnée
    destination = null;


    // Vider la barre de recherche
    document.getElementById("destination").value = "";


    // Message
    document.getElementById("windInfo").innerHTML =
    "🚴 Aucun trajet calculé";

}



// Démarrage


