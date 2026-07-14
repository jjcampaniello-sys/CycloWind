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




// ----------------------------
// Réception position GPS
// ----------------------------


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
