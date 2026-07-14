// gps.js

let currentHeading = 0;
let bikeArrow = null;

// ----------------------------
// Démarrage GPS automatique
// ----------------------------

function startGPS(){

    if(!navigator.geolocation){
        console.error("GPS non disponible");
        return;
    }

    navigator.geolocation.watchPosition(
        onPositionUpdate,
        function(error){
            console.error("Erreur GPS : " + error.message);
        },
        {
            enableHighAccuracy:true,
            maximumAge:1000,
            timeout:10000
        }
    );
}

// ----------------------------
// Boussole téléphone
// ----------------------------

function startCompass(){

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

    console.log("Position GPS reçue :", lat, lon);

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
        map.setView([lat, lon], 17);
        console.log("Map centered on user position");
    } else {
        console.warn("Map not available yet");
    }
}

// ----------------------------
// Création / déplacement flèche
// ----------------------------

function updateBikeArrowPosition(lat, lon){

    if(!bikeArrow){
        if(typeof map === 'undefined' || !map){
            console.warn("Map not available, cannot add marker");
            return;
        }
        
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
        console.log("Bike arrow marker created at", lat, lon);
    }
    else{
        bikeArrow.setLatLng([lat, lon]);
        updateBikeArrow();
        console.log("Bike arrow position updated to", lat, lon);
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
