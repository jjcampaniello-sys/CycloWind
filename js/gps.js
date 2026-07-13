// GPS
//console.log("gps.js chargé");
let currentHeading = 0;
//------------------
function startGPS() {

    if (!navigator.geolocation) {
        alert("GPS non supporté");
        return;
    }

    navigator.geolocation.watchPosition(
        onPositionUpdate,
        errorHandler,
        {
            enableHighAccuracy: true
        }
    );
}
//--------------
function errorHandler(error) {

    alert("Impossible d'accéder à votre position");

    document.getElementById("destination").placeholder =
        "Activer la localisation pour continuer";
}
//-----------
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
        font-size:28px;
        color:blue;">
        ➤
        </div>
        `,

        iconSize:[35,35],
        iconAnchor:[17,17]

    });


    bikeArrow.setIcon(icon);
}
function getLocation(){

   // navigator.geolocation.getCurrentPosition(
//--------------------------------------------------------
navigator.geolocation.watchPosition(
    onPositionUpdate,
    errorHandler,
    {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
    }
);
//--------------------------------------   
function onPositionUpdate(position) {
document.getElementById("destination").disabled = false;
document.getElementById("destination").placeholder = "Entrer une destination";
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log("Position live :", lat, lon);

    updateUserMarker(lat, lon);

    followRoute(lat, lon);
}
 //-----------------------  
function followRoute(lat, lon) {

    if (!window.currentRoute) return;

    let closestPoint = null;
    let minDist = Infinity;

    window.currentRoute.forEach(point => {

        const dx = point.lat - lat;
        const dy = point.lng - lon;

        const dist = dx*dx + dy*dy;

        if (dist < minDist) {
            minDist = dist;
            closestPoint = point;
        }
    });

    if (closestPoint) {
        moveMarkerOnRoute(closestPoint);
    }
}
 //------------------------   
function moveMarkerOnRoute(point) {

    if (!window.userMarker) return;

    window.userMarker.setLatLng([point.lat, point.lng]);
}
//-----------------
        function(position){

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

         const rideDirection = currentHeading;


            if(marker){
                map.removeLayer(marker);
            }


            marker =
            L.marker([lat,lon])
            .addTo(map)
            .bindPopup("Vous êtes ici")
            .openPopup();



            if(bikeArrow){
                map.removeLayer(bikeArrow);
            }


            const icon =
L.divIcon({

    className: "bike-icon",

    html:
    `
    <div style="
    transform:rotate(${rideDirection}deg);
    font-size:28px;
    color:blue;">
    ➤
    </div>
    `,

    iconSize:[35,35],
    iconAnchor:[17,17]

});



            bikeArrow =
            L.marker(
                [lat,lon],
                {icon:icon}
            )
            .addTo(map);



            map.setView(
                [lat,lon],
                19
            );


            getWind(
                lat,
                lon,
                rideDirection
            );

        },


        function(error){

            alert(
            "GPS impossible : " + error.message
            );

        },


        {
            enableHighAccuracy:true,
            timeout:10000
        }

    );
    startCompass();

}
