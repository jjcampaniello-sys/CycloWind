// gps.js

let currentHeading = 0;
let bikeArrow = null;
let gpsWatchId = null;
    alert("GPS loading");
// ----------------------------
// Démarrage GPS automatique
// ----------------------------

function startGPS(){
    alert("startGPS called");
navigator.geolocation.getCurrentPosition(
    (pos)=>alert("GPS OK"),
    (err)=>alert("GPS ERROR: " + err.message)
);
    if(!navigator.geolocation){
        alert("GPS non disponible");
        return;
    }

    // Stop previous watch if exists
    if(gpsWatchId){
        navigator.geolocation.clearWatch(gpsWatchId);
    }

    gpsWatchId = navigator.geolocation.watchPosition(
        onPositionUpdate,
        function(error){
            let msg = "Erreur GPS : ";
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    msg += "Permission refusée";
                    break;
                case error.POSITION_UNAVAILABLE:
                    msg += "Position indisponible";
                    break;
                case error.TIMEOUT:
                    msg += "Timeout";
                    break;
                default:
                    msg += error.message;
            }
            alert(msg);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000
        }
    );
    
    alert("GPS watchPosition started");
}

// ----------------------------
// Boussole téléphone
// ----------------------------

function startCompass(){
    alert("startCompass called");
    
    window.addEventListener(
        "deviceorientation",
        function(event){
            if(event.alpha !== null){
                currentHeading = 360 - event.alpha;
                updateBikeArrow();
            }
        },
        true
    );
}

// ----------------------------
// Réception position GPS
// ----------------------------

function onPositionUpdate(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    alert("Position GPS reçue:\nLat: " + lat.toFixed(4) + "\nLon: " + lon.toFixed(4) + "\nAccuracy: " + accuracy.toFixed(0) + "m");

    window.currentPosition = {
        lat: lat,
        lon: lon
    };

    updateBikeArrowPosition(lat, lon);

    const input = document.getElementById("destination");

    if(input){
        input.disabled = false;
        input.placeholder = "Entrer une destination";
    }

    if(typeof updateUserMarker === "function"){
        updateUserMarker(lat, lon);
    }

    // Center map on user position
    if(typeof map !== 'undefined' && map){
        try {
            map.setView([lat, lon], 17);
            alert("Map centered on GPS position");
        } catch(e) {
            alert("Error centering map: " + e.message);
        }
    } else {
        alert("Map not available");
    }
}

// ----------------------------
// Création / déplacement flèche
// ----------------------------

function updateBikeArrowPosition(lat, lon){
    alert("Creating marker at: " + lat.toFixed(4) + ", " + lon.toFixed(4));

    if(!bikeArrow){
        if(typeof map === 'undefined' || !map){
            alert("Map not available, cannot add marker");
            return;
        }
        
        try {
            bikeArrow = L.marker(
                [lat, lon],
                {
                    icon: L.divIcon({
                        className: "bike-icon",
                        html: `
                            <div style="
                            transform:rotate(${currentHeading}deg);
                            font-size:32px;
                            color:blue;">
                            ➤
                            </div>
                        `,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    })
                }
            ).addTo(map);
            alert("Bike arrow marker created successfully");
        } catch(e) {
            alert("Error creating marker: " + e.message);
        }
    }
    else{
        bikeArrow.setLatLng([lat, lon]);
        updateBikeArrow();
        alert("Bike arrow position updated");
    }
}

// ----------------------------
// Rotation flèche
// ----------------------------

function updateBikeArrow(){

    if(!bikeArrow){
        return;
    }

    const icon = L.divIcon({
        className: "bike-icon",
        html: `
            <div style="
            transform:rotate(${currentHeading}deg);
            font-size:32px;
            color:blue;">
            ➤
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    bikeArrow.setIcon(icon);
}

// ----------------------------
// Wait for page load to start GPS
// ----------------------------

window.addEventListener("load", function(){
    alert("Page load event fired - checking map...");
    // Small delay to ensure map is ready
    setTimeout(function(){
        if(typeof map !== 'undefined' && map){
            alert("Map is ready, starting GPS");
            startGPS();
            startCompass();
        } else {
            alert("Map still not ready");
        }
    }, 500);
});
