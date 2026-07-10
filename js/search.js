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
    `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;


    const response =
    await fetch(url);


    const data =
    await response.json();


    box.innerHTML="";


    data.features.forEach((place)=>{


        const item =
        document.createElement("div");


        item.className="suggestion";


        item.innerHTML =
        place.properties.name +
        "<br>" +
        (place.properties.city || "") +
        " " +
        (place.properties.country || "");


        item.onclick=function(){


            destination = {

                lat: place.geometry.coordinates[1],

                lon: place.geometry.coordinates[0]

            };
alert(
"Destination choisie :\n" +
destination.lat +
"\n" +
destination.lon
);

            document.getElementById("destination").value =
            item.innerText;


            box.innerHTML="";


            console.log(
                "Destination choisie :",
                destination
            );

        };


        box.appendChild(item);

    });

}

