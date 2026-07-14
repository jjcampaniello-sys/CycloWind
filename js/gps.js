// gps.js

alert("gps.js chargé");

let currentHeading = 0;
let bikeArrow = null;

function startGPS(){

    alert("startGPS appelé");

    if(!navigator.geolocation){

        alert("GPS non disponible");
        return;
    }

function startCompass(){

    window.addEventListener(
        "deviceorientation",
        function(event){

            if(event.alpha !== null){

                currentHeading = 360 - event.alpha;

                updateBikeArrow();

            }

        },
        true
    );

}
    navigator.geolocation.watchPosition(

        onPositionUpdate,

        function(error){

            alert(
                "Erreur GPS : " + error.message
            );

        },

        {
            enableHighAccuracy:true,
            maximumAge:1000,
            timeout:10000
        }

    );

}



function onPositionUpdate(position){

    alert("Position reçue");

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;


    console.log(
        "Position :",
        lat,
        lon
    );


    window.currentPosition = {
        lat:lat,
        lon:lon
    };
if(!bikeArrow){

    bikeArrow = L.marker(
        [lat,lon],
        {
            icon:L.divIcon({

                className:"bike-icon",

                html:
                `
                <div style="
                font-size:32px;
                color:blue;">
                ➤
                </div>
                `,

                iconSize:[40,40],
                iconAnchor:[20,20]

            })
        }
    )
    .addTo(map);

}
else{

    bikeArrow.setLatLng(
        [lat,lon]
    );

}

    const input =
    document.getElementById("destination");


    if(input){

        input.disabled=false;

        input.placeholder =
        "Entrer une destination";

    }
function updateBikeArrow(){

    if(!bikeArrow){
        return;
    }


    const icon = L.divIcon({

        className:"bike-icon",

        html:
        `
        <div style="
        transform:rotate(${currentHeading}deg);
        font-size:32px;
        color:blue;">
        ➤
        </div>
        `,

        iconSize:[40,40],
        iconAnchor:[20,20]

    });


    bikeArrow.setIcon(icon);

}

    if(typeof updateUserMarker === "function"){

        updateUserMarker(
            lat,
            lon
        );

    }


    map.setView(
        [lat,lon],
        17
    );

}



window.addEventListener(
"load",
function(){

    alert("Lancement automatique GPS");

    startGPS();

    startCompass();

});
