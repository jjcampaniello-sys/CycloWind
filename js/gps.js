// GPS
console.log("gps.js chargé");
let currentHeading = 0;
function startCompass(){

    window.addEventListener(
        "deviceorientation",
        function(event){

            if(event.alpha !== null){

                currentHeading = 360 - event.alpha;

            }

        },
        true
    );

}
function getLocation(){

    navigator.geolocation.getCurrentPosition(

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
