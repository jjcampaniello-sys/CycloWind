// Variables globales
let currentWindDirection = 0;
let currentWindSpeed = 0;

let marker;
let bikeArrow;
let windControl;
let windLegend;
let routeLine;



// GPS
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

}

