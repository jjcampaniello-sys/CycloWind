let marker;
let bikeArrow;
let windControl;
let windLegend;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine = null;
let routeLayers = [];

alert ("App.js appelé V0")
const map = L.map('map')
    .setView([52.3676,4.9041],12);


L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
 attribution:'OpenStreetMap'
}
).addTo(map);

window.routeGroup = L.layerGroup();
window.routeGroup.addTo(map);

function clearRoute(){

    localStorage.removeItem("cyclowind_route");


    if(window.routeGroup){

        window.routeGroup.clearLayers();

    }


    destination = null;


    document.getElementById("destination").value = "";


    document.getElementById("windInfo").innerHTML =
    "🚴 Aucun trajet calculé";

}

//-------------------------------------
window.addEventListener("load", function(){
  startGPS();
alert("Lancement GPS");
      startCompass();
});
//----------------------------------------

// Démarrage


