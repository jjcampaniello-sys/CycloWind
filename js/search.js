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

            data.features.forEach(place => {

                const name = place.properties.name || "Lieu";
                const city = place.properties.city || "";
                const full = name + " " + city;

                const div = document.createElement("div");

                div.innerHTML = full;

                div.style.padding = "10px";
                div.style.cursor = "pointer";

                div.onclick = function(){

                    // 🔥 STOCKER DESTINATION
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
