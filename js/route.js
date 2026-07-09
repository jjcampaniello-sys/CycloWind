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
async function getAlternativeRoute(start, endLat, endLon) {

    const midLat = (start.lat + endLat) / 2;
    const midLon = (start.lng + endLon) / 2 + 0.01;

    const url =
    `https://router.project-osrm.org/route/v1/bicycle/${start.lng},${start.lat};${midLon},${midLat};${endLon},${endLat}?overview=full&geometries=geojson`;


    const response = await fetch(url);

    const data = await response.json();

    return data.routes[0];
}
function calculateWindScore(latlngs){

    let totalCost = 0;
    let count = 0;


    for(let i = 0; i < latlngs.length - 1; i++){

        const direction =
        getSegmentDirection(
            latlngs[i],
            latlngs[i+1]
        );


        const cost =
        windCost(
            direction,
            currentWindDirection,
            currentWindSpeed
        );


        totalCost += cost;
        count++;
    }


    return totalCost / count;
}
//----------------------------------------------------------------------------------------------------------
// Calcul trajet
async function getRoute(){

    if(!marker){
        alert("Définissez votre position d'abord");
        return;
    }


    const start = marker.getLatLng();


    const endLat = start.lat + 0.02;
    const endLon = start.lng + 0.02;
const alternative = await getAlternativeRoute(
    start,
    endLat,
    endLon
);

console.log("Route alternative :", alternative);

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
const altCoords = alternative.geometry.coordinates;

const altLatlngs = altCoords.map(point => [
    point[1],
    point[0]
]);
const normalScore =
calculateWindScore(latlngs);

const alternativeScore =
calculateWindScore(altLatlngs);


console.log(
"Trajet actuel :",
normalScore.toFixed(1)
);

console.log(
"Alternative :",
alternativeScore.toFixed(1)
);
L.polyline(
    altLatlngs,
    {
        color:"blue",
        weight:5
    }
).addTo(map);
   
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


