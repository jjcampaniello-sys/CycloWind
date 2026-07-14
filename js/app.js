let marker;
let bikeArrow;
let windControl;
let windLegend;
let map;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine = null;
let routeLayers = [];

alert("app.js loading...");

// Initialize map immediately when script loads
window.addEventListener("load", function(){

    alert("app.js loaded");

    map = L.map('map').setView([52.3676, 4.9041], 12);

    L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: 'OpenStreetMap' }
    ).addTo(map);

    window.routeGroup = L.layerGroup().addTo(map);

});

function clearRoute(){
    localStorage.removeItem("cyclowind_route");

    if(window.routeGroup){
        window.routeGroup.clearLayers();
    }

    window.destination = null;

    document.getElementById("destination").value = "";

    document.getElementById("windInfo").innerHTML =
    "🚴 Aucun trajet calculé";
}
