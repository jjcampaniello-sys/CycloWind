const map = L.map('map').setView([52.3676, 4.9041], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenStreetMap'
    }
).addTo(map);

let windMarker;
let marker;
async function getWind(lat, lon) {

    const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m`;

    const response = await fetch(url);
    const data = await response.json();

    const speed = data.current.wind_speed_10m;
    const direction = data.current.wind_direction_10m;

    alert(
        "Vent : " + speed + " km/h\nDirection : " + direction + "°"
    );
}
    } else {
        alert("GPS non disponible");
    }
}

// Fonction GPS
function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                if (marker) {
                    map.removeLayer(marker);
                }

                marker = L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup("Vous êtes ici")
                    .openPopup();

                // Zoom automatique
                 map.flyTo([lat, lon], 18, {
                    animate: true,
                    duration: 1.5
                });
getWind(lat, lon);
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
