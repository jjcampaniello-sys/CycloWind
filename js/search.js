alert("search.js chargé");
window.destination = null;

function searchDestination(){

    const query = document.getElementById("destination").value;

    if(query.length < 3) return;

    console.log("Recherche lancée");

    fetch(`https://photon.komoot.io/api/?q=${query}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert("Résultats reçus !");
        });
}
//const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU5N2JkNDJjYTM5MzRjYTFhODQ1MTE2YjViNmQ2ZGJjIiwiaCI6Im11cm11cjY0In0=";
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
