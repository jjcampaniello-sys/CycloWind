alert(typeof searchDestination);
alert("search.js chargé");
window.destination = null;

async function searchDestination() {
    if (!window.currentPosition) {
        console.log("Position GPS en cours de récupération...");
        return;
    }

    const query = document.getElementById("destination").value;
    const box = document.getElementById("suggestions");

    let cleanedQuery = query.trim();

    // Si l'utilisateur n'a pas mis de virgule, on aide Photon
    if (!cleanedQuery.includes(",")) {
        cleanedQuery = cleanedQuery.replace(
            /^(.+?\d+)\s+(.*)$/,
            "$1, $2"
        );
    }

    if (query.length < 3) {
        box.innerHTML = "";
        return;
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanedQuery)}&limit=5&lang=fr`;

    const response = await fetch(url);
    const data = await response.json();

    box.innerHTML = "";

    data.features.forEach((place) => {
        const item = document.createElement("div");
        item.className = "suggestion";

        item.innerHTML =
            (place.properties.housenumber || "") +
            " " +
            (place.properties.street || place.properties.name || "") +
            "<br>" +
            (place.properties.city || "") +
            " " +
            (place.properties.country || "");

        item.onclick = function () {
            window.destination = {
                lat: place.geometry.coordinates[1],
                lon: place.geometry.coordinates[0]
            };

            document.getElementById("destination").value = item.innerText;
            box.innerHTML = "";

            console.log("Destination choisie :", window.destination);
        };

        box.appendChild(item);
    });
}
