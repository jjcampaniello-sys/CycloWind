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
`https://router.project-osrm.org/route/v1/bicycle/${start.lng},${start.lat};${endLon},${endLat}?overview=full&geometries=geojson&alternatives=3`;


    const response = await fetch(url);

    const data = await response.json();

const routes = data.routes;
 console.log("Nombre de trajets :", routes.length);   
const coords = routes[0].geometry.coordinates;

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


