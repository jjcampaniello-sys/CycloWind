let destination = null;
let timeout = null;

function searchDestination(){

    clearTimeout(timeout);

    timeout = setTimeout(async () => {

        const query =
        document.getElementById("destination").value;

        const box =
        document.getElementById("suggestions");

        if(query.length < 3){
            box.innerHTML = "";
            return;
        }

       const url =
`https://photon.komoot.io/api/?q=${query}&lat=${userLat}&lon=${userLon}&limit=5`;

        const response = await fetch(url);
        const results = await response.json();

        box.innerHTML = "";

        results.forEach((place)=>{

            const item = document.createElement("div");
            item.className="suggestion";
            item.innerHTML = place.display_name;

            item.onclick = function(){

                destination = {
                    lat: parseFloat(place.lat),
                    lon: parseFloat(place.lon)
                };

                document.getElementById("destination").value =
                place.display_name;

                box.innerHTML="";
            };

            box.appendChild(item);
        });

    }, 300); // ← délai 300ms
}
