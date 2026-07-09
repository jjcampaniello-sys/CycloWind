let destination = null;

async function searchDestination(){

    const query =
    document.getElementById("destination").value;

    if(!query){
        alert("Entrez une destination");
        return;
    }


    const url =
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;


    const response = await fetch(url);

    const results = await response.json();


    if(results.length === 0){
        alert("Aucune destination trouvée");
        return;
    }


    let choice = prompt(
        results.map((r,index)=>
        `${index}: ${r.display_name}`
        ).join("\n")
    );


    const selected = results[choice];


    destination = {
        lat: parseFloat(selected.lat),
        lon: parseFloat(selected.lon)
    };


    alert(
        "Destination choisie :\n" +
        selected.display_name
    );

}
