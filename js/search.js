alert("search.js chargé");

window.destination = null;

function searchDestination(){

    const query = document.getElementById("destination").value;

    if(query.length < 3) return;

    fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=fr`)
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById("suggestions");
            container.innerHTML = "";

            // 🔥 CORRECTIF : Création d'un Set pour mémoriser les adresses textuelles uniques
            const uniqueAddresses = new Set();

            data.features.forEach(place => {

                const name = place.properties.name || "Lieu";
                const city = place.properties.city || "";
                const full = name + " " + city;

                // 🔥 CORRECTIF : Si la combinaison "Nom Ville" a déjà été ajoutée, on l'ignore
                if (uniqueAddresses.has(full)) {
                    return; // Passe au lieu suivant sans l'ajouter à l'écran
                }

                // Sinon, on l'enregistre dans notre mémoire "Set" et on continue
                uniqueAddresses.add(full);

                const div = document.createElement("div");

                div.innerHTML = full;

                div.style.padding = "10px";
                div.style.cursor = "pointer";

                div.onclick = function(){

                    // STOCKER DESTINATION (Reste inchangé et 100% fonctionnel)
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
        });
}
