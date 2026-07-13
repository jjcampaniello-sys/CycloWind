alert("search.js chargé");
window.destination = null;
//let destination = null;
//let routeLine = null;
//let routeLayers=[];
alert(typeof destination);
//------------------------
async function searchDestination()
if (!window.currentPosition) {
    alert("Position GPS en cours de récupération...");
    return;
}
//--------------
async function searchDestination() {

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
    const url =
`https://photon.komoot.io/api/?q=${encodeURIComponent(cleanedQuery)}&limit=5&lang=fr`;
//const url =
//`https://corsproxy.io/?https://photon.komoot.io/api/?q=${encodeURIComponent(cleanedQuery)}&limit=5&lang=fr&osm_tag=addr:*`;
   //const url =
       // `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanedQuery)}&limit=5&lang=fr&osm_tag=addr:*`;

   const response = await fetch(url);

//alert("Réponse serveur : " + response.status);

const data = await response.json();

//alert("Résultats reçus : " + data.features.length);

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

            console.log("Destination choisie :", destination);
        };

        box.appendChild(item);
    });
}
