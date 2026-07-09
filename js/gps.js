// GPS
console.log("gps.js chargé");
function getLocation(){


    navigator.geolocation.getCurrentPosition(

        function(position){


            const lat =
            position.coords.latitude;


            const lon =
            position.coords.longitude;


            const rideDirection =
            position.coords.heading || 0;



            if(marker){
                map.removeLayer(marker);
            }



            marker =
            L.marker([lat,lon])
            .addTo(map)
            .bindPopup("Vous êtes ici");



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
                `

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


        function(){
            alert("GPS impossible");
        },


        {
            enableHighAccuracy:true
        }

    );
const map = L.map('map').setView([52.3676, 4.9041], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenStreetMap'
    }
).addTo(map);


}

