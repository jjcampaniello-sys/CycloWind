export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    // 🔑 Colle bien ta VRAIE clé OpenRouteService ici !
    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjliNTU2YzljMDI0YTA1MTlkMjU5YzdkZDM3MzY0YzQzNGIyN2VjYzZhZWQ3YzVkMzk5NmNjNTM4IiwiaCI6Im11cm11cjY0In0"; 
    const url = "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json, application/geo+json; charset=utf-8"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        // Si ORS renvoie un code d'erreur (ex: 401, 400, 429), on transmet les détails
        if (!response.ok) {
            return res.status(response.status).json({
                error: "Erreur reçue d'OpenRouteService",
                details: data
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Erreur interne Vercel : " + error.message });
    }
}
