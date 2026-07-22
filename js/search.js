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

            const uniqueAddresses = new Set();

            data.features.forEach(place => {

                // 1. Extraction des composants de l'adresse depuis l'API Photon
                const name = place.properties.name || "";
                const housenumber = place.properties.housenumber || ""; // 🔥 Récupère le numéro de rue si disponible
                const city = place.properties.city || "";

                // 2. Construction intelligente de l'adresse :
                // Si l'API renvoie un numéro de rue et que le nom de la rue ne le contient pas déjà, on l'ajoute au début
                let full = "";
                if (housenumber && !name.includes(housenumber)) {
                    full = housenumber + " " + name + " " + city;
                } else {
                    full = name + " " + city;
                }

                // Nettoyage des espaces doubles si un champ est vide
                full = full.replace(/\s+/g, ' ').trim();

                // Gestion de secours si le texte est vide
                if (!full) full = "Lieu inconnu";

                // Sécurité anti-doublons
                if (uniqueAddresses.has(full)) {
                    return; 
                }
                uniqueAddresses.add(full);

                const div = document.createElement("div");
                div.innerHTML = full;
                div.style.padding = "10px";
                div.style.cursor = "pointer";

                div.onclick = function(){
                    // Stockage des coordonnées GPS précises associées au numéro de rue
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
        });
}
