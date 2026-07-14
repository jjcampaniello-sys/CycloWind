// gps.js

alert("gps.js chargé");


let currentHeading = 0;
let bikeArrow = null;
//--------------------
// Démrage Automatique GPS
//----------------

function startGPS(){

    alert("startGPS appelé");

}

window.addEventListener(
"load",
function(){

    alert("Lancement automatique GPS");

    startGPS();

});
navigator.geolocation.watchPosition(
    function(position){

        alert("Position reçue");

        console.log(position);

    },
    function(error){

        alert(error.message);

    }
);

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

