// Direction segment route

function getSegmentDirection(p1, p2){
    const dy = p2[0] - p1[0];
    const dx = p2[1] - p1[1];
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if(angle < 0){
        angle += 360;
    }

    return angle;
}

async function getAlternativeRoute(start, endLat, endLon) {
   const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU5N2JkNDJjYTM5MzRjYTFhODQ1MTE2YjViNmQ2ZGJjIiwiaCI6Im11cm11cjY0In0=";

    const url = "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson";
  
    // Configuration pour demander des routes alternatives à l'API
    const body = {
        coordinates: [
            [start.lng, start.lat],
            [endLon, endLat]
        ],
        alternative_routes: {
            target_count: 3,    // Demande jusqu'à 2 routes alternatives max
            share_factor: 0.6,  // Niveau de ressemblance max autorisé entre les routes (0.6 = 60%)
            weight_factor: 1.4  // L'alternative peut être au maximum 1.4 fois plus longue
        }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return data; // On retourne tout l'objet de données qui contient désormais TOUTES les routes
}

function calculateWindScore(latlngs){
    let totalCost = 0;
    let count = 0;

    for(let i = 0; i < latlngs.length - 1; i++){
        const direction = getSegmentDirection(
            latlngs[i],
            latlngs[i+1]
        );

        const cost = windCost(
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

    if(windGain > 3 && alternativeTime < normalTime * 1.2){
        return "alternative";
    }

    return "normal";
}
function calculateWindGain(scoreNormal, scoreAlternative){

    if(scoreNormal <= 0){
        return 0;
    }

    const gain =
    ((scoreNormal - scoreAlternative) / scoreNormal) * 100;

    return Math.max(0, gain);

}
function drawWindRoute(latlngs){
    for(let i = 0; i < latlngs.length - 1; i++){
        const direction = getSegmentDirection(
            latlngs[i],
            latlngs[i+1]
        );

        const cost = windCost(
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
            color: "gray",
            weight: 5
        }
    ).addTo(window.routeGroup);

    routeLayers.push(line);
}

// Calcul trajet
async function getRoute(){
    alert("getRoute démarré");
    if(!window.userPosition){
        alert("Définissez votre position d'abord");
        return;
    }
    
    if(!window.destination){
        alert("Choisissez une destination dans la liste");
        return;
    }
    
    const start = {   
        lat: window.userPosition[0],
        lng: window.userPosition[1]
    };
    
    alert("Départ : " + start.lat + " / " + start.lng);
    const endLat = window.destination.lat;
    const endLon = window.destination.lon;
    
    // 1. On récupère TOUTES les routes calculées (la principale + les alternatives)
    const allRoutesData = await getAlternativeRoute(start, endLat, endLon);
    
    if (!allRoutesData.features || allRoutesData.features.length === 0) {
        alert("Aucun itinéraire trouvé");
        return;
    }

    // 2. Extraction de la route normale (la première de la liste d'ORS)
    const normalFeature = allRoutesData.features[0];
    const coordsNormal = normalFeature.geometry.coordinates;
    const latlngsNormal = coordsNormal.map(point => [point[1], point[0]]);

    // 3. Extraction de la route alternative (la deuxième, s'il y en a une)
    let latlngsAlternative = latlngsNormal; // Par défaut s'il n'y a pas d'alternative
    let alternativeFeature = normalFeature;

    if (allRoutesData.features.length > 1) {
        alternativeFeature = allRoutesData.features[1];
        const coordsAlt = alternativeFeature.geometry.coordinates;
        latlngsAlternative = coordsAlt.map(point => [point[1], point[0]]);
        // OPTIONNEL : On dessine aussi la route alternative en Gris pour qu'elle apparaisse !
        drawGrayRoute(latlngsAlternative);
    } else {
        console.log("L'API n'a pas pu générer de route alternative viable pour ce trajet.");
    }

    // Sauvegarde de la route actuelle globale (format objets)
    window.currentRoute = latlngsNormal.map(p => ({ lat: p[0], lng: p[1] }));

    // Récupération de la météo du vent
    const firstDir = getSegmentDirection(latlngsNormal[0], latlngsNormal[1]);
    await getWind(start.lat, start.lng, firstDir);
    
    // 4. On dessine la route normale en couleur selon le vent
    drawWindRoute(latlngsNormal);

    // 5. Calcul et comparaison des scores face au vent
    const normalScore = calculateWindScore(latlngsNormal);
    const alternativeScore = calculateWindScore(latlngsAlternative);

    // Formatage des objets pour correspondre à votre fonction chooseBestRoute
    const routesArrayMock = [{ duration: normalFeature.properties.summary.duration }];
    const alternativeMock = { duration: alternativeFeature.properties.summary.duration };

       // ... (votre code existant au-dessus reste identique)

    const choice = chooseBestRoute(
        routesArrayMock[0],
        alternativeMock,
        normalScore,
        alternativeScore
    );

    const windGain = calculateWindGain(normalScore, alternativeScore);

    let recommendation = choice === "alternative" && allRoutesData.features.length > 1
        ? "🌱 CycloWind recommande l'alternative"
        : "🚴 CycloWind recommande ce trajet";

    // Affichage des statistiques dans le HTML
    document.getElementById("windInfo").innerHTML = `
        ${recommendation}
        <br>
        🌬️ Impact vent : ${alternativeScore.toFixed(1)}
        <br>
        📉 Gain estimé : ${windGain.toFixed(0)} %
    `;

    // --- LOGIQUE DU BOUTON TOGGLE ET DE LA COLORATION DYNAMIQUE ---
    const toggleBtn = document.getElementById("toggleRouteBtn");
    
    // Si l'API a bien renvoyé deux routes, on affiche le bouton
    if (allRoutesData.features.length > 1) {
        toggleBtn.style.display = "block";
        let showingAlternative = false;

        // On écoute le clic sur le bouton
        toggleBtn.onclick = function() {
            // 1. On nettoie les tracés précédents sur la carte
            window.routeGroup.clearLayers();
            routeLayers = []; // On vide le tableau de suivi des calques

            if (!showingAlternative) {
                // L'utilisateur veut voir l'alternative -> On la trace AVEC les couleurs du vent !
                drawWindRoute(latlngsAlternative);
                toggleBtn.innerText = "Voir la route normale";
                showingAlternative = true;
            } else {
                // L'utilisateur revient à la route normale -> On la retrace en couleur
                drawWindRoute(latlngsNormal);
                toggleBtn.innerText = "Voir la route alternative";
                showingAlternative = false;
            }
        };
    } else {
        // Pas d'alternative trouvée par l'API, on cache le bouton
        toggleBtn.style.display = "none";
    }

    window.drawWindRoute = drawWindRoute;
};
