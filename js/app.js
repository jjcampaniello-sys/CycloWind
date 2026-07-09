const map = L.map('map').setView([52.3676, 4.9041], 12);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenStreetMap'
    }
).addTo(map);


// Variables globales
let currentWindDirection = 0;
let currentWindSpeed = 0;

let marker;
let bikeArrow;
let windControl;
let windLegend;
let routeLine;


// Analyse du vent
function windEffect(rideDirection, windDirection) {

    let angle = Math.abs(rideDirection - windDirection);

    if (angle > 180) {
        angle = 360 - angle;
    }

    if (angle < 45) {
        return "💨 Vent de face";
    }

    if (angle > 135) {
        return "🚴 Vent favorable";
    }

    return "↔️ Vent latéral";
}


// Coût du vent
function windCost(roadDirection, windDirection, windSpeed) {

    let angle = Math.abs(roadDirection - windDirection);

    if (angle > 180) {
        angle = 360 - angle;
    }

    if (angle < 45) {
        return windSpeed * 2;
    }

    if (angle < 135) {
        return windSpeed * 0.5;
    }

    return 0;
}


// Récupération météo
async function getWind(lat, lon, rideDirection) {

    try {

        const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m%2Cwind_direction_10m`;

        const response = await fetch(url);
        const data = await response.json();

        currentWindSpeed = data.current.wind_speed_10m;
        currentWindDirection = data.current.wind_direction_10m;


        if (windControl) {
            map.removeControl(windControl);
        }


        windControl = L.control({
            position: "topright"
        });


        windControl.onAdd = function() {

            const div = L.DomUtil.create(
                "div",
                "wind-box"
            );


            div.innerHTML = `
            <div class="wind-arrow"
            style="transform:rotate(${currentWindDirection + 180}deg)">
            ➤
            </div>

            <div>
            ${currentWindSpeed} km/h<br>
            ${windEffect(
                rideDirection,
                currentWindDirection
            )}
            </div>
            `;


            return div;
        };


        windControl.addTo(map);


    }
    catch(error) {

        console.log(error);
        alert("Erreur récupération du vent");
    }
}



// Légende
function addWindLegend() {

    if (windLegend) {
        map.removeControl(windLegend);
    }


    windLegend = L.control({
        position:"bottomleft"
    });


    windLegend.onAdd = function() {

        const div = L.DomUtil.create("div");


        div.style.background="white";
        div.style.padding="10px";
        div.style.borderRadius="10px";
        div.style.fontSize="16px";


        div.innerHTML =
        `
        🟢 Vent favorable<br>
        🟠 Vent latéral<br>
        🔴 Vent de face
        `;


        return div;
    };


    windLegend.addTo(map);
}



// Direction segment route
function getSegmentDirection(p1,p2){

    const dy = p2[0]-p1[0];
    const dx = p2[1]-p1[1];


    let angle =
    Math.atan2(dy,dx)*(180/Math.PI);


    if(angle<0){
        angle+=360;
    }


    return angle;
}



// Calcul trajet
async function getRoute(){

    if(!marker){
        alert("Définissez votre position d'abord");
        return;
    }


    const start = marker.getLatLng();


    const endLat = start.lat + 0.02;
    const endLon = start.lng + 0.02;


    const url =
    `https://router.project-osrm.org/route/v1/bicycle/${start.lng},${start.lat};${endLon},${endLat}?overview=full&geometries=geojson`;


    const response = await fetch(url);

    const data = await response.json();


    const coords =
    data.routes[0].geometry.coordinates;


    const latlngs =
    coords.map(point=>[
        point[1],
        point[0]
    ]);



    let totalCost=0;
    let count=0;



    for(let i=0;i<latlngs.length-1;i++){


        const p1=latlngs[i];
        const p2=latlngs[i+1];


        const direction =
        getSegmentDirection(p1,p2);



        const cost =
        windCost(
            direction,
            currentWindDirection,
            currentWindSpeed
        );


        totalCost += cost;
        count++;



        let color;


        if(cost>20){
            color="red";
        }
        else if(cost>8){
            color="orange";
        }
        else{
            color="green";
        }



        L.polyline(
            [p1,p2],
            {
                color:color,
                weight:6
            }
        ).addTo(map);

    }



    map.fitBounds(latlngs);


    addWindLegend();



    const avgCost =
    totalCost/count;



    document.getElementById("windInfo").innerHTML=
    `
    🌬️ Impact du vent : ${avgCost.toFixed(1)}<br>
    🚴 Effort estimé
    `;

}



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
