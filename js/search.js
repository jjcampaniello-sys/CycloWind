alert("search.js chargé");

window.destination = null;

function searchDestination(){

    const query = document.getElementById("destination").value;

    if(query.length < 3) return;

    console.log("Recherche lancée :", query);

    fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=fr`)
        .then(res => res.json())
        .then(data => {
            console.log("Résultats :", data);
           // alert("Résultats reçus !");
        })
        .catch(err => {
            console.error("Erreur fetch :", err);
        });
}
