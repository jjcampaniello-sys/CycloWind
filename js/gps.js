// GPS
console.log("gps.js chargé");

function getLocation(){

    navigator.geolocation.getCurrentPosition(

        function(position){

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const rideDirection =
            position.coords.heading || 0;


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

                html:
                `
                <div style="
                transform:rotate(${rideDirection}deg);
                font-size:50px;
                color:blue;">
                ➤
                </div>
                `,

                iconSize:[50,50]

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

}
