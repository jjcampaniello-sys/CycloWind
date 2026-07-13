// Direction segment route
//let routeLine = null;
//let routeLayers = [];
alert("Début route.js");
function getSegmentDirection(p1,p2){

    const dy = p2[0]-p1[0];
    const dx = p2[1]-p1[1];

//console.log(
//"Profil vélo choisi :",
//profile
//);
    
    let angle =
    Math.atan2(dy,dx)*(180/Math.PI);

    if(angle<0){
        angle+=360;
    }

    return angle;
}
async function getAlternativeRoute(start, endLat, endLon) {

    const apiKey = "TA_CLE_API_ICI";


    const url =
    "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson";


    const body = {

        coordinates: [

            [start.lng, start.lat],

            [endLon, endLat]

        ]

    };


    const response = await fetch(
        url,
        {
            method:"POST",

            headers:{
                "Authorization":apiKey,
                "Content-Type":"application/json"
            },

            body:JSON.stringify(body)

        }
    );


    const data = await response.json();


    const coords =
    data.features[0].geometry.coordinates;


    return {

        geometry:{
            coordinates:coords
        },

        duration:
        data.features[0].properties.summary.duration

    };

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

       const line = L.polyline(
    [latlngs[i], latlngs[i+1]],
    {
        color: color,
        weight: 6
    }
).addTo(window.routeGroup);


routeLayers.push(line);
    }
}
function drawGrayRoute(latlngs){

   const line = L.polyline(
    latlngs,
    {
        color:"gray",
        weight:5
    }
).addTo(window.routeGroup);


routeLayers.push(line);

}
//----------------------------------------------------------------------------------------------------------
// Calcul trajet
async function getRoute(){

    if(!marker){
        alert("Définissez votre position d'abord");
        return;
    }
    if(!destination){
    alert("Choisissez une destination dans la liste");
    return;
}
    alert("Calcul trajet lancé");
    
//const profile = getBikeProfile();
    const start = marker.getLatLng();
//console.log("Position départ :", start);
//console.log("Destination :", destination);
 const endLat = destination.lat;
const endLon = destination.lon;
const alternative = await getAlternativeRoute(
    start,
    endLat,
    endLon
);
    
alert("Route alternative récupérée");
    
console.log("Route alternative :", alternative);

const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU5N2JkNDJjYTM5MzRjYTFhODQ1MTE2YjViNmQ2ZGJjIiwiaCI6Im11cm11cjY0In0=";

const orsUrl =
"https://api.openrouteservice.org/v2/directions/cycling-regular/geojson";

const body = {
    coordinates: [
        [start.lng, start.lat],
        [endLon, endLat]
    ]
};

const response = await fetch(orsUrl, {
    method: "POST",
    headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
});

alert("Réponse ORS reçue");

const data = await response.json();

alert("Données ORS reçues");

// ⚠️ ORS format différent
const coords = data.features[0].geometry.coordinates;

// ⚠️ On recrée un "routes" compatible avec ton code
const routes = [{
    geometry: {
        coordinates: coords
    }
}];
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
    
    alert("Coordonnées trajet OK : " + latlngs.length);
    
    drawWindRoute(latlngs);
    //alert("Dessin trajet lancé");
const normalScore =
calculateWindScore(latlngs);

const alternativeScore =
calculateWindScore(altLatlngs);

//console.log(
//"Trajet actuel :",
//normalScore.toFixed(1)
//);

//console.log(
//"Alternative :",
//alternativeScore.toFixed(1)
//);
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
//console.log("Choix CycloWind :", choice);   
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

//localStorage.setItem("cyclowind_route", JSON.stringify(routeData));
    window.drawWindRoute = drawWindRoute;
      
}


