let marker;
let bikeArrow;
let windControl;
let windLegend;
let map;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine = null;
let routeLayers = [];

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error("Map element not found");
        return false;
    }

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
    
    console.log("Map initialized successfully");
    return true;
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - Initializing map");
    if(initializeMap()){
        // GPS will start automatically when map is ready
        console.log("Map ready, GPS will start via gps.js load event");
    }
});
