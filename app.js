const map = L.map('map').setView([52.3676, 4.9041], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenStreetMap'
    }
).addTo(map);


let marker;


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

                map.setView([lat, lon], 15);
            }
        );

    } else {
        alert("GPS non disponible");
    }
}
