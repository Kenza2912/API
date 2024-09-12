// Initialiser la carte et la centrer sur Elan Formation
let map = L.map('map').setView([47.744396940072285, 7.29399345466279], 14); // Centré par défaut

// Ajouter une couche de tuiles OpenStreetMap (voir doc : https://leafletjs.com/examples/quick-start/)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const inputCP = document.querySelector(".cp");
const selectVille = document.querySelector(".ville");
let villesData = []; // Stocker les données des villes
let marker; // Stocker le marqueur

// Ajoute un écouteur d'événement "input" pendant la saisie au champ de code postal
inputCP.addEventListener("input", () => {
    let codePostal = inputCP.value;
    selectVille.innerHTML = null

    // Appel à l'API pour obtenir les communes
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=region,nom,code,codesPostaux,codeRegion,centre&format=json&geometry=center`)

        //Convertit la réponse en format JSON
        .then(response => response.json())
        .then(communes => {
            villesData = communes; 
            console.log('Données récupérées : ', villesData); // Affiche les données pour voir si elles sont correctes

            // Ajouter les options dans la liste déroulante
            communes.forEach(ville => {
                let option = document.createElement("option");
                option.value = ville.code; 
                option.textContent = ville.nom; 
                //aJOUTE L'option à la liste de la sélection de ville
                selectVille.appendChild(option);
            });
        })
        
});

// Fonction pour mettre à jour la carte lors de la sélection d'une ville
selectVille.addEventListener("change", () => {
    let selectedVille = villesData.find(ville => ville.code === selectVille.value); // Trouver la ville sélectionnée
    console.log('Ville sélectionnée : ', selectedVille); // Afficher la ville sélectionnée dans la console

    // Vérifier si les coordonnées de la ville sont disponibles
    if (selectedVille && selectedVille.centre) {
        let lat = selectedVille.centre.coordinates[1];
        let lon = selectedVille.centre.coordinates[0];
        console.log('Coordonnées récupérées : ', lat, lon);

        // Centrer la carte sur la ville sélectionnée
        map.setView([lat, lon], 14);

        // Supprimer le marqueur précédent s'il existe
        if (marker) {
            map.removeLayer(marker);
        }

        // Ajouter un nouveau marqueur
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${selectedVille.nom}</b>`)
            .openPopup(); 

    } else {
        console.warn("Aucune coordonnée disponible pour cette ville. Ville : ", selectedVille);
        alert(`Les coordonnées pour ${selectedVille.nom} ne sont pas disponibles.`);
        map.setView([47.744396940072285, 7.29399345466279], 14); 
    }
});
