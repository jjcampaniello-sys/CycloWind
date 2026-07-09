// Création de la carte
const map = L.map('map').setView([52.3676, 4.9041], 12);

// Fond de carte OpenStreetMap
L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenStreetMap'
    }
).addTo(map);

// Position test
L.marker([52.3676, 4.9041])
    .addTo(map)
    .bindPopup("CycloWind")
    .openPopup();
