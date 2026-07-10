const map = L.map('map')
    .setView([52.3676,4.9041],12);


if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(

        function(position){

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            map.setView(
                [lat,lon],
                15
            );

        },

        function(){

            console.log("GPS indisponible");

        }

    );

}

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
 attribution:'OpenStreetMap'
}
).addTo(map);

function clearRoute(){

    localStorage.removeItem("cyclowind_route");


    if(routeLine){

        map.removeLayer(routeLine);
        routeLine = null;

    }


    document.getElementById("windInfo").innerHTML =
    "🚴 Aucun trajet calculé";


}
let marker;
let bikeArrow;
let windControl;
let windLegend;

let currentWindDirection = 0;
let currentWindSpeed = 0;
let routeLine;


// Démarrage


