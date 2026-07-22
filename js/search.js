alert("search.js chargé");

window.destination = null;

function searchDestination(){

    const query = document.getElementById("destination").value;

    if(query.length < 3) return;

    fetch(`https://komoot.io{encodeURIComponent(query)}&limit=5&lang=fr`)
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById("suggestions");
            container.innerHTML = "";

            // Filtre invisible pour mémoriser les adresses affichées
            const uniqueAddresses = new Set();

            data.features.forEach(place => {

                // 1. Récupération des pièces de l'adresse
                const name = place.properties.name || "";
                const housenumber = place.properties.housenumber || ""; 
                const city = place.properties.city || "";

                // 2. Construction de la chaîne textuelle
                let full = "";
                if (housenumber && !name.includes(housenumber)) {
                    full = housenumber + " " + name + " " + city;
                } else {
                    full = name + " " + city;
                }

                // Nettoyage des espaces en trop
                full = full.replace(/\s+/g, ' ').trim();

                if (!full) full = "Lieu inconnu";

                // 3. Sécurité anti-doublon textuel
                if (uniqueAddresses.has(full)) {
                    return; 
                }
                uniqueAddresses.add(full);

                // 4. Création de l'élément visuel
                const div = document.createElement("div");
                div.innerHTML = full;
                div.style.padding = "10px";
                div.style.cursor = "pointer";

                div.onclick = function(){
                    // 🔥 REPARÉ ICI : Indexation exacte du tableau Photon [Longitude, Latitude]
                    window.destination = {
                        lat: place.geometry.coordinates[1],
                        lon: place.geometry.coordinates[0]
                    };

                    document.getElementById("destination").value = full;
                    container.innerHTML = "";
                    console.log("Destination précise choisie :", window.destination);
                };

                container.appendChild(div);
            });
        })
        .catch(err => console.error("Erreur de recherche Photon :", err));
}
