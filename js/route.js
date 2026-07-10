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
function chooseBestRoute(normalRoute, alternativeRoute, normalScore, alternativeScore){

    const normalTime = normalRoute.duration;
    const alternativeTime = alternativeRoute.duration;


    // avantage vent
    const windGain = normalScore - alternativeScore;


    // l'alternative est intéressante si :
    // - elle améliore fortement le vent
    // - et ajoute moins de 20% de temps

    if(
        windGain > 3 &&
        alternativeTime < normalTime * 1.2
    ){
        return "alternative";
    }


    return "normal";
}
// 3 - Nouvelle fonction couleur trajet
function drawWindRoute(latlngs){

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

        let color;

        if(cost > 20){
            color = "red";
        }
        else if(cost > 8){
            color = "orange";
        }
        else{
            color = "green";
        }

        L.polyline(
            [latlngs[i], latlngs[i+1]],
            {
                color: color,
                weight: 6
            }
        ).addTo(map);
    }
}
function drawGrayRoute(latlngs){

    L.polyline(
        latlngs,
        {
            color:"gray",
            weight:5
        }
    ).addTo(map);

}
//----------------------------------------------------------------------------------------------------------
// Calcul trajet
async function getRoute(){

    if(!marker){
        alert("Définissez votre position d'abord");
        return;
    }


    const start = marker.getLatLng();

 const endLat = destination.lat;
const endLon = destination.lon;
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
    drawWindRoute(latlngs);  
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
 const choice = chooseBestRoute(
    routes[0],
    alternative,
    normalScore,
    alternativeScore
);
if(choice === "alternative"){

    drawGrayRoute(latlngs);
    drawWindRoute(altLatlngs);

}
else{

    drawGrayRoute(altLatlngs);
    drawWindRoute(latlngs);

}
console.log("Choix CycloWind :", choice);   
document.getElementById("windInfo").innerHTML +=
`
<br>Route test : ${normalScore.toFixed(1)}
<br>Alternative : ${alternativeScore.toFixed(1)}
`;    
  
    let totalCost=0;
    let count=0;

    map.fitBounds(latlngs);


    addWindLegend();

    const avgCost = normalScore;

 const normalEffort =
normalScore < 8 ? "Facile" :
normalScore < 15 ? "Moyen" :
"Difficile";


const alternativeEffort =
alternativeScore < 8 ? "Facile" :
alternativeScore < 15 ? "Moyen" :
"Difficile";

let recommendation =
choice === "alternative"
?
"🌱 CycloWind recommande l'alternative"
:
"🚴 CycloWind recommande le trajet actuel";


document.getElementById("windInfo").innerHTML =
`
${recommendation}

<br>
🌬️ Actuel : ${normalScore.toFixed(1)}
<br>
🌱 CycloWind : ${alternativeScore.toFixed(1)}
`;
// 💾 Sauvegarde du trajet
const routeData = {
    coords: latlngs,
    wind: normalScore,
    altWind: alternativeScore,
    recommendation: recommendation
};

localStorage.setItem("cyclowind_route", JSON.stringify(routeData));
    window.drawWindRoute = drawWindRoute;
}


