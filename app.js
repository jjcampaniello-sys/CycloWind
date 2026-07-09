const map = L.map('map').setView([52.3676, 4.9041], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenStreetMap'
    }
).addTo(map);
let currentWindDirection = 0;
let currentWindSpeed = 0;
let marker;
let bikeArrow;
let windControl;
let windMarker;
let windLegend;
let routeLine;

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

        currentWindSpeed = speed;
        currentWindDirection = direction;

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


    } catch (error) {

        alert("Erreur récupération du vent : " + error.message);
        console.log(error);
    }
}



function addWindLegend() {

    if (windLegend) {
        map.removeControl(windLegend);
    }

    windLegend = L.control({position: "bottomleft"});

    windLegend.onAdd = function() {

        const div = L.DomUtil.create("div");

        div.style.background = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "10px";
        div.style.fontSize = "16px";

        div.innerHTML = `
        🟢 Vent favorable<br>
        🟠 Vent latéral<br>
        🔴 Vent de face
        `;

        return div;
    };

    windLegend.addTo(map);
}
    }catch (error) {
    alert("Erreur récupération du vent : " + error.message);
    console.log(error);
}    
    // Fonction itinéraire
let routeLine;
function getSegmentDirection(p1, p2) {

    const dy = p2[0] - p1[0];
    const dx = p2[1] - p1[1];

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle < 0) {
        angle += 360;
    }

    return angle;
}
async function getRoute() {

    if (!marker) {
        alert("Définissez votre position d'abord");
        return;
    }

    const start = marker.getLatLng();

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

  for (let i = 0; i < latlngs.length - 1; i++) {

    const p1 = latlngs[i];
    const p2 = latlngs[i + 1];

    const segmentDirection = getSegmentDirection(p1, p2);

   const windDirection = currentWindDirection;
const windSpeed = currentWindSpeed;

    const cost = windCost(
        segmentDirection,
        windDirection,
        windSpeed
    );


    let color;

    if (cost > 20) {
        color = "red";       // vent de face fort
    } 
    else if (cost > 8) {
        color = "orange";    // vent latéral
    } 
    else {
        color = "green";     // vent favorable
    }


    L.polyline([p1, p2], {
        weight: 6,
        color: color
    }).addTo(map);
}

    map.fitBounds(latlngs);
addWindLegend();

    // Analyse du vent sur le trajet
    let totalCost = 0;
    let totalSegments = 0;

    for (let i = 0; i < latlngs.length - 1; i++) {

        const p1 = latlngs[i];
        const p2 = latlngs[i + 1];

        const segmentDirection = getSegmentDirection(p1, p2);

        const windDirection = currentWindDirection;
const windSpeed = currentWindSpeed;

        const cost = windCost(
            segmentDirection,
            windDirection,
            windSpeed
        );

        totalCost += cost;
        totalSegments++;
    }

    const avgCost = totalCost / totalSegments;

   document.getElementById("windInfo").innerHTML =
`
🌬️ Impact du vent : ${avgCost.toFixed(1)}<br>
🚴 Effort estimé
`;
}
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
