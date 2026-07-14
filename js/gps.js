// gps.js

alert("gps.js chargé");


let currentHeading = 0;
let bikeArrow = null;


// ----------------------------
// Démarrage GPS automatique
// ----------------------------

function startGPS(){

    alert("startGPS appelé");


    if(!navigator.geolocation){

        alert("GPS non disponible");
        return;

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



// ----------------------------
// Boussole téléphone
// ----------------------------

function startCompass(){

    window.addEventListener(

        "deviceorientation",

        function(event){


            if(event.alpha !== null){

                currentHeading =
                360 - event.alpha;


                updateBikeArrow();

            }


        },

        true

    );

}



// ----------------------------
// Réception position GPS
// ----------------------------

function onPositionUpdate(position){


    alert("Position reçue");


    const lat =
    position.coords.latitude;


    const lon =
    position.coords.longitude;



    console.log(
        "Position :",
        lat,
        lon
    );



    window.currentPosition = {

        lat:lat,
        lon:lon

    };



    updateBikeArrowPosition(
        lat,
        lon
    );



    const input =
    document.getElementById("destination");


    if(input){

        input.disabled = false;

        input.placeholder =
        "Entrer une destination";

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



// ----------------------------
// Création / déplacement flèche
// ----------------------------



// ----------------------------
// Rotation flèche
// ----------------------------





// ----------------------------
// Lancement automatique
// ----------------------------

window.addEventListener(

"load",

function(){


    alert("Lancement automatique GPS");


    startGPS();


    startCompass();


});
