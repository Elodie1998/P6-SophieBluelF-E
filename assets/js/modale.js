
let modale = null;//fait que modale n'existe pas
const selecteurFocusable = "button, a, input, textarea, select";
let focusables = [];
let elementAvantFocus = null;

const ouvrirModale = function (e) {
    e.preventDefault();
    modale = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modale.querySelectorAll(selecteurFocusable));
    elementAvantFocus = document.querySelector(':focus');
    focusables[0].focus();
    modale.style.display = null;//retire valeur display none pr display flex (css)
    modale.removeAttribute("aria-hidden");//retire class => modale n'est plus cachée
    modale.setAttribute("aria-modal", "true");
    modale.addEventListener("click", fermerModale);
    modale.querySelectorAll(".modale-js-fermer").forEach((e) => e.addEventListener("click", fermerModale));

    modale.querySelector(".modale-js-arreter").addEventListener("click", arreterPropagation);
};

const fermerModale = function (e) {
    if (modale === null) return;
    if (elementAvantFocus !== null) elementAvantFocus.focus();
    e.preventDefault();
    modale.style.display = "none";//pr remasquer la modale
    modale.setAttribute("aria-hidden", "true");
    modale.removeAttribute("aria-modal");
    modale.removeEventListener("click", fermerModale);
    modale.querySelector(".modale-js-fermer").removeEventListener("click", fermerModale);//click bouton modale ferme modale
    modale.querySelector(".modale-js-arreter").removeEventListener("click", arreterPropagation);// click en dehors de modale ferme modale

    modale = null;
}

const arreterPropagation = function (e) {//fonction permet de fermet modale en cliquant en dehors de cette modale
    e.stopPropagation();
}

const focusDsModale = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modale.querySelector(':focus'));
    console.log(index);
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
}

document.querySelectorAll(".modale-js").forEach((a) => {
    a.addEventListener("click", ouvrirModale);
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        fermerModale(e);
    }
    if (e.key == "Tab" && modale !== null) {
        focusDsModale(e);
    }
})

//fonction suppression

async function supprTravaux(id) {
    let projetSuppr = []; // Tableau pr stocker IDs des projets suppr
    const supprApi = "http://localhost:5678/api/works/";
    const token = sessionStorage.connexToken;

    let reponseRecu = await fetch (supprApi + id, {
        method: "DELETE",
        headers: {
            Authorization:"Bearer " + token
        }
    });

    console.log("Réponse du serveur : ", reponseRecu);

    if (!reponseRecu.ok) {
        const texteErreur = document.createElement("div");
        texteErreur.innerHTML = "Vous n'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.";
        texteErreur.classList.add("erreur");

        document.querySelector(".modale-projet-conteneur").prepend(texteErreur);//ajout message erreur au début modale 
    } else {
        //Suppr fait  - MAJ interface utilisateur
        //Récup et suppr du DOM l'élément projet correspondant
        projetSuppr.push(id); // Pr ajouter ID à la fin de la liste des projets suppr
        console.log(`Projet avec ID ${id} suppr avec succès.`);

        // Retirer l'élément  du DOM
        const projetElement = document.getElementById(`projet-${id}`);
        if (projetElement) {
            projetElement.remove();
        }

        // Pr recharger les projets afin de MAJ l'interface et la modale
        await rechargerProjets(); // Pr recharger liste des projets afin de refléter changements
        console.log("Projet supprimé jusqu'à présent : ", projetSuppr);
        window.location.href  = "index.html"; //PROBLEME URGENT : A ENLEVER (PR SUPPR SANS RAFRACHISSEMENT)
        console.log("Le projet a bien été supprimé.");
    }
}

async function rechargerProjets() {
    const token = sessionStorage.connexToken;
    try {
        let reponse = await fetch("http://localhost:5678/api/works", {
           // method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token 
            }
        });

        if (reponse.ok) {            
            // Pr vider les galeries existantes
            const galerie = document.querySelector(".gallery");
            const galerieModale = document.querySelector(".modale-gallery");
            galerie.innerHTML = "";
            galerieModale.innerHTML = "";
            // fermerModale(e);
        } else {
            console.error("Erreur lors du chargement des projets : ", reponse.status);
        }
    } catch (erreur) {
        console.error("Une erreur est survenue : ", erreur);
    }
}

// Modale ajout photo

document.getElementById("modaleBouton").addEventListener("click", revenirModaleSuppr); // bouton "ajouter une photo" modale suppr
document.querySelector(".fleche-gauche-modale").addEventListener("click", revenirModaleSuppr); // flèche modale ajout pr revenir à modale suppr
document.querySelector(".revenir-modale-suppr").addEventListener("click", revenirModaleSuppr); // croix pr fermer modale

// Variables pr titre, catégorie et fichier img
let valeurTitre = "";
let categorieSelectionee = "";
let file;

const selectionCategories = document.getElementById("selectionCategories");

function revenirModaleSuppr() {
    const modaleAffichee = document.getElementById("modaleSuppr");
    const modaleAjout = document.getElementById("modaleAjout");

    if (modaleAffichee.style.display === "block" || modaleAffichee.style.display === "") {
        modaleAffichee.style.display = "none";
        modaleAjout.style.display = "block";
    } else {
        modaleAffichee.style.display = "block";
        modaleAjout.style.display = "none";
    }
}

// Récup catégories de l'API au menu déroulant
async function recuperationCategories() {
    try {
        const reponseC = await fetch("http://localhost:5678/api/categories");//requête API recup catégories, attend promesse pr continuer
        if (!reponseC.ok) {//si réponse API différent de "ok"
            throw new Erreur("Erreur lors de la récupération des données");//erreur levée
        }

        const categories = await reponseC.json();// Convertion réponse en JSON, accès + facilement données

        categories.forEach(category => {
            const option = document.createElement("option");
            option.innerHTML = category.name; // Définit le texte des options
            option.value = category.id;// Donne l'identifiant de chaque option à la valeur des options 
            selectionCategories.appendChild(option); // Ajoute les options au menu déroulant
        })

    } catch (erreur) {//si erreur
        console.log("Il y a eu un problème :", erreur);// affiche erreur ds console
    }
}
recuperationCategories();//appel pr recup catégories dispo via API

// Fonction bouton valider ajout photo

function validerAjoutPhoto() {

    //Réinitialisation des champs du formualaire
    document.getElementById("titre").value = "";
    document.getElementById("selectionCategories").value = "";
    document.getElementById("file").value = "";
    
    // récupération image sélectionnée
    const inputImage = document.getElementById("file");
    // let file; // déclaration en dehors de l'écouteur de changement

    // Pr retirer l'ancien écouteur avant d'en ajouter un nveau
    inputImage.removeEventListener("change", imageChange);

    // Pr écoute l'événement de changement sur le fichier
    inputImage.addEventListener("change", imageChange);

    // Fonction pr écouter changements de catégorie
    selectionCategories.removeEventListener("change", categorieChange);
    selectionCategories.addEventListener("change", categorieChange);

    // Pr écouter changements de titre
    const inputTitre = document.getElementById("titre");
    inputTitre.removeEventListener("input", titreInput);
    inputTitre.addEventListener("input", titreInput);

    // Pr soumettre formulaire
    const formulaireAjoutPhoto = document.getElementById("ajoutPhotoForm");
    formulaireAjoutPhoto.removeEventListener("submit", soumissionFormulaire);
    formulaireAjoutPhoto.addEventListener("submit", soumissionFormulaire);
}

function titreInput() {
        valeurTitre = document.getElementById("titre").value;
        console.log("Titre du projet : ", valeurTitre);
        verifierChamps(); // Pr vérif champs à chaque saisie
}
            
function categorieChange() {
        categorieSelectionee = this.value;
        console.log("Catégorie sélectionnée : ", categorieSelectionee);
        verifierChamps(); // Pr vérif champs à chaque saisie
}

function imageChange(event) {
    file = event.target.files[0]; // Prend le 1er fichier sélectionné

    if (file) {
        const lire = new FileReader();// création d'1 nouvelle instance de FileReader

        // Définir le comportement 1 fois le fichier lu
        lire.onload = function(e) {
            const img = document.getElementById("apercu");// Affichage de l'image ds balise img
            img.src = e.target.result; // chemin de l'image sélectionnée
            img.alt = "Apercu de l'image";
            img.style.display = "block"; // affiche l'image
            document.querySelector(".photo-ajoutee").style.display = "none"; //masque éléments pr afficher l'image
        };

        // Lire le fichier comme 1 URL de données
        lire.readAsDataURL(file);// lit le fichier c URL de données pr afficher img ds sa balise
    } else {
        alert("Vous devez sélectionner une image au format JPG ou PNG uniquement.")
    }
    // verifierChamps();
}

async function soumissionFormulaire(event) {
    event.preventDefault(); //empêche le rechargement automatique de la page

    if (file && valeurTitre && categorieSelectionee) {
        const buttonAjoutCouleur = document.querySelector(".succes-ajout-photo");
        const formData = new FormData();
        formData.append("image", file);// Pr l'ajout du fichier
        formData.append("title", valeurTitre);// Pr l'ajout du titre
        formData.append("category", categorieSelectionee);// Pr l'ajout de la catégorie
  
        const token = sessionStorage.connexToken;
  
        if (!token) {
          console.error("Token d'authentification manquant.");
          return;
        }

        try {
            let reponse = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { 
                    Accept: "application/json",
                    Authorization: "Bearer " + token 
                },
                body: formData
            });

            if (reponse.ok) {
                let resultat = await reponse.json();

                // Pr ajout du nveau travail aux galeries sans recharger la page
                ajouterTravailGaleries(resultat);
                revenirModaleSuppr();
                
                // Pr réinitialiser les champs et la couleur du bouton submit
                document.querySelector(".photo-ajoutee").style.display = "block";
                document.getElementById("apercu").style.display = "none";
                document.getElementById("titre").value = "";
                selectionCategories.value = "";
            } else {
                afficherErreur(reponse);
            }
        } catch (erreur) {
        console.error("Une erreur est survenue : ", erreur);
        afficherErreurConnexion();
        }
    } else {
        alert("Veuillez remplir tous les champs.");
    }
    fermerModale(event);
}; 

function verifierChamps() {
    if (file && valeurTitre && categorieSelectionee) {
        return true;
    } else {
        return false;
    }
}

function ajouterTravailGaleries(resultat) {
    const galerie = document.querySelector(".gallery");
    const galerieModale = document.querySelector(".modale-gallery");

    const nouveauTravail = document.createElement("figure");
    nouveauTravail.innerHTML = `
        <img src=${resultat.imageUrl} alt=${resultat.title}>
		<figcaption>${resultat.title}</figcaption>
    `;

    const nouveauTravailModale = document.createElement("figure");
    nouveauTravailModale.innerHTML = `
        <div class="modale-projet-conteneur" id="projet-${resultat.id}">
            <img src="${resultat.imageUrl}" alt="${resultat.title}">
            <i data-projet="${resultat.id}" class="fa-solid fa-trash-can affiche-poubelle"></i>
        </div>
    `;

    galerie.appendChild(nouveauTravail);
    galerieModale.appendChild(nouveauTravailModale);
}

function afficherErreur(reponse) {
    const boiteErreur = document.createElement("div");
    boiteErreur.classList.add("erreur");
    boiteErreur.innerHTML = "Il y a eu une erreur.";
    document.getElementById("ajoutPhotoForm").prepend(boiteErreur); 

    reponse.texte().then(texteErreur => {
        console.error("Erreur : ", texteErreur);
        boiteErreur.innerHTML += `<p>${texteErreur}</p>`;
    });
}

function afficherErreurConnexion() {
    const boiteErreur = document.createElement("div");
    boiteErreur.classList.add("erreur");
    boiteErreur.innerHTML = "Il y a eu une erreur de connexion.";
    document.getElementById("ajoutPhotoForm").prepend(boiteErreur);
}

document.querySelector(".ajout-photo").addEventListener("click", function() {
    validerAjoutPhoto();
});

const fields = document.querySelectorAll("input, select");
fields.forEach(input => {
    input.addEventListener("focusout", (e) => {
        console.log(e.target);
        if(verifierChamps()) {
            document.getElementById("addPicture").style.backgroundColor = "#1D6154";
            document.getElementById("addPicture").style.cursor = "pointer";
            document.getElementById("addPicture").addEventListener("mouseenter", () => {
                document.getElementById("addPicture").style.backgroundColor = "#0E2F28";
            });
            document.getElementById("addPicture").addEventListener("mouseout", () => {
                document.getElementById("addPicture").style.backgroundColor = "";
            });
        } else {
            document.getElementById("addPicture").style.backgroundColor = "#A7A7A7";
            document.getElementById("addPicture").style.cursor = "";
        }
        console.log(verifierChamps(), file, valeurTitre, categorieSelectionee);
    });
});

// window.addEventListener("load", verifierChamps);
window.addEventListener("load", (e) => {
    console.log(e.target);
    if(verifierChamps()) {
        document.getElementById("addPicture").style.backgroundColor = "#1D6154";
        document.getElementById("addPicture").style.cursor = "pointer";
     } else {
        document.getElementById("addPicture").style.backgroundColor = "#A7A7A7";
        document.getElementById("addPicture").style.cursor = "";
    }
});