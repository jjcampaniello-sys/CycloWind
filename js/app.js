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
const mapElement = document.getElementById('map');
if (!mapElement) {
    alert("ERROR: Map element not found!");
} else {
    alert("Map element found, initializing...");
    
    try {
        map = L.map('map')
            .setView([52.3676, 4.9041], 12);

        L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: 'OpenStreetMap'
            }
        ).addTo(map);

        window.routeGroup = L.layerGroup();
        window.routeGroup.addTo(map);
        
        alert("Map initialized successfully!");
    } catch(e) {
        alert("Error initializing map: " + e.message);
    }
}

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
