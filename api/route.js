export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    // 🔑 Colle ta VRAIE clé OpenRouteService
    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjliNTU2YzljMDI0YTA1MTlkMjU5YzdkZDM3MzY0YzQzNGIyN2VjYzZhZWQ3YzVkMzk5NmNjNTM4IiwiaCI6Im11cm11cjY0In0"; 
    
    // 📍 URL officielle HeiGIT
    const url = "https://api.heigit.org/ors/v2/directions/cycling-regular/geojson";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                // 💡 Les jetons JWT (qui commencent par ey...) nécessitent "Bearer " devant
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json, application/geo+json; charset=utf-8"
            },
            body: JSON.stringify(req.body)
        });

        // Récupération de la réponse brute
        const rawText = await response.text();

        // Si la réponse n'est pas OK (statut HTTP 4xx ou 5xx)
        if (!response.ok) {
            return res.status(response.status).json({
                error: `Erreur HeiGIT (${response.status})`,
                details: rawText // Affiche le contenu exact du message
            });
        }

        // Si tout est OK, on parse le JSON
        const data = JSON.parse(rawText);
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Erreur serveur : " + error.message });
    }
}
