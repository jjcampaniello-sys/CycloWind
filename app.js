const map = L.map('map').setView([52.3676, 4.9041], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenStreetMap'
    }
).addTo(map);
let windControl;
let windMarker;
let marker;
async function getWind(lat, lon) {

    try {

        const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m`;

        const response = await fetch(url);

        const data = await response.json();

        const speed = data.current.wind_speed_10m;
        const direction = data.current.wind_direction_10m;

       if (windControl) {
    map.removeControl(windControl);
}

windControl = L.control({position: "topright"});

windControl.onAdd = function() {

    const div = L.DomUtil.create("div", "wind-box");

    div.innerHTML = `
        <div class="wind-arrow"
             style="transform: rotate(${direction}deg)">
             ➤
        </div>
        <div>
             ${speed} km/h
        </div>
    `;

    return div;
};

windControl.addTo(map);

const windIcon = L.divIcon({
    className: "wind-arrow",
    html: `
        <div style="transform: rotate(${direction}deg); font-size:40px;">
            ➤
        </div>
        <div style="font-size:14px;">
            ${speed} km/h
        </div>
    `,
    iconSize: [60,60]
});

windMarker = L.marker([lat, lon], {
    icon: windIcon
}).addTo(map);
    } catch (error) {

        alert("Erreur récupération du vent");

        console.log(error);
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
 } else {
        alert("GPS non disponible");
    }
}
