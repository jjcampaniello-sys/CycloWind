let destination = null;


async function searchDestination(){

    const query =
    document.getElementById("destination").value;


    const box =
    document.getElementById("suggestions");


    if(query.length < 3){
        box.innerHTML = "";
        return;
    }


    const url =
`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Netherlands")}&limit=5&addressdetails=1`;


    const response =
    await fetch(url);


    const results =
    await response.json();


    box.innerHTML = "";


    results.forEach((place)=>{


        const item =
        document.createElement("div");


        item.className="suggestion";


        item.innerHTML =
        place.display_name;


        item.onclick = function(){


            destination = {

                lat: parseFloat(place.lat),

                lon: parseFloat(place.lon)

            };


            const input =
document.getElementById("destination");

input.value = place.display_name;

input.dataset.lat = place.lat;
input.dataset.lon = place.lon;

box.innerHTML="";

            console.log(
            "Destination choisie :",
            destination
            );

        };

        box.appendChild(item);

    });

}
