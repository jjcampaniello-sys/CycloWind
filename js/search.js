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

            // Filtre invisible pour mémoriser les adresses uniques textuelles
            const uniqueAddresses = new Set();

            data.features.forEach(place => {

                // 1. Récupération des composants de l'adresse
                const name = place.properties.name || "";
                const housenumber = place.properties.housenumber || ""; 
                const city = place.properties.city || "";

                // 2. Construction de l'adresse (s'adapte si le numéro est absent !)
                let full = "";
                if (housenumber && !name.includes(housenumber)) {
                    full = housenumber + " " + name + " " + city;
                } else {
                    full = name + " " + city;
                }

                // Nettoyage des espaces multiples
                full = full.replace(/\s+/g, ' ').trim();

                if (!full) full = "Lieu inconnu";

                // 3. Sécurité anti-doublon textuel
                if (uniqueAddresses.has(full)) {
                    return; // Ignore les répétitions confuses (ex: doublons de quartiers)
                }
                uniqueAddresses.add(full);

                // 4. Création de l'élément HTML cliquable
                const div = document.createElement("div");
                div.innerHTML = full;
                div.style.padding = "10px";
                div.style.cursor = "pointer";

                div.onclick = function(){
                    // 🔥 RÉPARÉ ICI : Indexation correcte du tableau Photon [Longitude (0), Latitude (1)]
                    window.destination = {
                        lat: place.geometry.coordinates[1],
                        lon: place.geometry.coordinates[0]
                    };

                    document.getElementById("destination").value = full;
                    container.innerHTML = "";
                    console.log("Destination choisie :", window.destination);
                };

                container.appendChild(div);
            });
        })
        .catch(err => console.error("Erreur de recherche d'adresse :", err));
}
