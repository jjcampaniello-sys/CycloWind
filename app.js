const map = L.map('map').setView([52.3676, 4.9041], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenStreetMap'
    }
).addTo(map);
let marker;
let bikeArrow;
let windControl;
let windMarker;

function windEffect(rideDirection, windDirection) {

    let angle = Math.abs(rideDirection - windDirection);

    if (angle > 180) {
        angle = 360 - angle;
    }

    if (angle < 45) {
        return "💨 Vent de face";
    }

    if (angle > 135) {
        return "🚴 Vent favorable";
    }

    return "↔️ Vent latéral";
}
function windCost(roadDirection, windDirection, windSpeed) {

    let angle = Math.abs(roadDirection - windDirection);

    if (angle > 180) {
        angle = 360 - angle;
    }

    // vent de face
    if (angle < 45) {
        return windSpeed * 2;
    }

    // vent latéral
    if (angle < 135) {
        return windSpeed * 0.5;
    }

    // vent arrière
    return 0;
}
async function getWind(lat, lon, rideDirection) {

    try {

        const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m%2Cwind_direction_10m`;

        const response = await fetch(url);

        const data = await response.json();

        const speed = data.current.wind_speed_10m;
        const direction = data.current.wind_direction_10m;
       
const effect = windEffect(rideDirection, direction);

       if (windControl) {
    map.removeControl(windControl);
}

windControl = L.control({position: "topright"});

windControl.onAdd = function() {

    const div = L.DomUtil.create("div", "wind-box");

    div.innerHTML = `
        <div class="wind-arrow"
             style="transform: rotate(${direction + 180}deg)">
             ➤
        </div>
        <div>
             ${speed} km/h<br>
${effect}
        </div>
    `;

    return div;
};

windControl.addTo(map);


    }catch (error) {
    alert("Erreur récupération du vent : " + error.message);
    console.log(error);
}
}
    // Fonction itinéraire
let routeLine;

async function getRoute() {

    if (!marker) {
        alert("Définissez votre position d'abord");
        return;
    }

    const start = marker.getLatLng();

    // Destination test (à remplacer ensuite)
    const endLat = start.lat + 0.02;
    const endLon = start.lng + 0.02;


    const url =
    `https://router.project-osrm.org/route/v1/bicycle/${start.lng},${start.lat};${endLon},${endLat}?overview=full&geometries=geojson`;


    const response = await fetch(url);
    const data = await response.json();

    const coords = data.routes[0].geometry.coordinates;


    const latlngs = coords.map(point => [
        point[1],
        point[0]
    ]);


    if (routeLine) {
        map.removeLayer(routeLine);
    }


    routeLine = L.polyline(latlngs, {
        weight: 5
    }).addTo(map);


    map.fitBounds(routeLine.getBounds());
}
// Fonction GPS
function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const rideDirection = position.coords.heading || 0;
                if (bikeArrow) {
    map.removeLayer(bikeArrow);
}

const bikeIcon = L.divIcon({
    className: "bike-arrow",
    html: `
        <div style="
            transform: rotate(${rideDirection}deg);
            font-size:50px;
            color:blue;">
            ➤
        </div>
    `,
    iconSize: [50,50]
});

bikeArrow = L.marker([lat, lon], {
    icon: bikeIcon
}).addTo(map);

                if (marker) {
                    map.removeLayer(marker);
                }
                
marker = L.marker([lat, lon])
    .addTo(map)
    .bindPopup("Vous êtes ici");

                // Zoom automatique
               map.setView([lat, lon], 19);
getWind(lat, lon, rideDirection);
            },

            function(error) {
                alert("Impossible d'obtenir votre position GPS");
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
 } else {
        alert("GPS non disponible");
    }
}
