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

    console.log("Position :", lat, lon);

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

    map.setView([lat, lon], 17);
}

// ----------------------------
// Création / déplacement flèche
// ----------------------------

function updateBikeArrowPosition(lat, lon){

    if(!bikeArrow){
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
    }
    else{
        bikeArrow.setLatLng([lat, lon]);
        updateBikeArrow();
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
// Lancement automatique
// ----------------------------

window.addEventListener("load", function(){
    startGPS();
    startCompass();
});