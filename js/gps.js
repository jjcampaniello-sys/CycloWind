// gps.js

let currentHeading = 0;
let bikeArrow = null; // Remis en local/global propre si non défini dans app.js
let gpsWatchId = null;

// 🔥 NOUVEL ÉTAT GLOBAL : Faux par défaut, passe à vrai au clic sur Démarrer
window.isNavigating = false; 

alert("GPS démarre");

function startGPS(){
    if(!navigator.geolocation){
        alert("GPS non disponible");
        return;
    }

    gpsWatchId = navigator.geolocation.watchPosition(
        onPositionUpdate,
        function(error){
            alert("Erreur GPS : " + error.message);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
        }
    );
}

function startCompass(){
    window.addEventListener("deviceorientation", function(event){
        if(event.alpha !== null){
            currentHeading = 360 - event.alpha;
            updateBikeArrow();
        }
    }, true);
}

function onPositionUpdate(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // STOCKAGE GLOBAL
    window.userPosition = [lat, lon];
    console.log("Position stockée :", window.userPosition);

    if(!window.map){
        console.error("map NON prête");
        return;
    }

    updateBikeArrowPosition(lat, lon);

    // 🔥 CORRECTIF CRITIQUE : On ne recentre et zoom à 17 QUE si la navigation est active !
    if (window.isNavigating) {
        window.map.setView([lat, lon], 17);
    }
}

function updateBikeArrowPosition(lat, lon){
    if(!bikeArrow){
        bikeArrow = L.marker([lat, lon], {
            icon: L.divIcon({
                className: "bike-icon",
                html: `
                <div style="transform:rotate(${currentHeading}deg); font-size:32px; color:blue;">
                ➤
                </div>`,
                iconSize:,
                iconAnchor: [20, 20]
            })
        }).addTo(window.map);
    } else {
        bikeArrow.setLatLng([lat, lon]);
        updateBikeArrow();
    }
}

function updateBikeArrow(){
    if(!bikeArrow) return;

    const icon = L.divIcon({
        className: "bike-icon",
        html: `
        <div style="transform:rotate(${currentHeading}deg); font-size:32px; color:blue;">
        ➤
        </div>`,
        iconSize:,
        iconAnchor: [20, 20]
    });

    bikeArrow.setIcon(icon);
}
