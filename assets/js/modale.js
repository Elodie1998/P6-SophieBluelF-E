
let modale = null;//fait que modale n'existe pas
const selecteurFocusable = "button, a, input, textarea";
let focusables = [];
let elementAvantFocus = null;

const ouvrirModale = function (e) {
    e.preventDefault();
    modale = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modale.querySelectorAll(selecteurFocusable));
    // console.log(focusables);
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
async function supprTravaux(event) {
    console.log(event);
    const id = event.target.dataset.projet; //ID du projet à suppr
    const supprApi = "http://localhost:5678/api/works/";
    const token = sessionStorage.connexToken;
    // console.log("Token : ", token);
    // console.log("ID à suppr : ", id);

    let reponseRecu = await fetch (supprApi + id, {
        method: "DELETE",
        headers: { Authorization:"Bearer " + token}
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
        console.log("ID du projet à suppr : ", id);
        console.log("Essaye de trouver l'élément ac l'ID :", "projet-" + id);
        const projetElement = document.getElementById("projet-" + id);// Vérifie ID corr à celui du projet
        const galleryElement = document.getElementById("gallery-" + id);

        console.log("Element trouvé :", projetElement);
        if (projetElement) {
            projetElement.remove(); //suppr l'element du DOM
            console.log("Projet supprimé avec succès.");
        } else {
            console.log("Element non trouvé pr l'ID : projet-" + id); //Averti si élément n'st pas trouvé
        }
        if (galleryElement) {
            galleryElement.remove(); //suppr l'element du DOM
            console.log("Projet supprimé avec succès.");
        } else {
            console.log("Element non trouvé pr l'ID : gallery-" + id); //Averti si élément n'st pas trouvé
        }
    }
}

// Modale ajout photo

const ajouterPhotoInput = document.getElementById("modaleButtonJs");
ajouterPhotoInput.addEventListener("click", revenirModaleSuppr);
const flecheGaucheModale = document.querySelector(".fleche-gauche-modale");
flecheGaucheModale.addEventListener("click", revenirModaleSuppr);

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

        const categorySelect = document.getElementById("selectionCategories");
        categories.forEach(category => {
            const option = document.createElement('option');
            option.innerHTML = category.name; // Définit le texte de l'option
            categorySelect.appendChild(option); // Ajoute l'option au menu déroulant
        })

    } catch (erreur) {//si erreur
        console.log("Il y a eu un problème :", erreur);// affiche erreur ds console
    }
}
recuperationCategories();//appel pr recup catégories dispo via API

function validerAjoutPhoto(event) {

    document.getElementById("titre").value = "";
    document.getElementById("selectionCategories").value = "";
    
    // récupération image sélectionnée
    const inputImage = document.getElementById("file");
    let file; // déclaration en dehors de l'écouteur de changement

    // Pr écoute l'événement de changement sur le fichier
    inputImage.addEventListener("change", function(event) {
        file = event.target.files[0]; // Prend le 1er fichier sélectionné
        if(file) {
            const lire = new FileReader();// création d'1 nouvelle instance de FileReader

            // Définir le comportement 1 fois le fichier lu
            lire.onload = function(e) {
                const img = document.getElementById("apercu");// Affichage de l'image ds balise img
                img.src = e.target.result; // chemin de l'image sélectionnée
                img.alt = "Apercu de l'image";
                img.style.display = "block"; // affiche l'image
                // document.getElementById("affichage-photo").appendChild(img);
                document.querySelector(".photo-ajoutee").style.display = "none"; //masque éléments pr afficher l'image
            };

            // Lire le fichier comme 1 URL de données
            lire.readAsDataURL(file);// lit le fichier c URL de données pr afficher img ds sa balise
        } else {
            alert("Vous devez sélectionner une image au format JPG ou PNG uniquement.")
        }
    });
  
    const inputTitre = document.getElementById("titre");
    let valeurTitre = "";
    let categorieSelectionee = "";
  
    document.getElementById("selectionCategories").addEventListener("change", function () {
        categorieSelectionee = this.value;
    });
  
    inputTitre.addEventListener("input", function () {
      valeurTitre = inputTitre.value;
    });
  
    const formulaireAjoutPhoto = document.getElementById("ajoutPhotoFormulaire");
  
    formulaireAjoutPhoto.addEventListener("submit", async (event) => {
      event.preventDefault();

      //Pr vérifier si ts les champs st remplis
      const nouvelleImage = document.getElementById("apercu").required;
      console.log(nouvelleImage);
      if (nouvelleImage && valeurTitre && categorieSelectionee) {
        const formData = new FormData();
  
        formData.append("file", file);// Pr l'ajout du fichier
        formData.append("titre", valeurTitre);// Pr l'ajout du titre
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
                console.log(resultat);
            } else {
                const boiteErreur = document.createElement("div");
                boiteErreur.classList.add("erreur");
                boiteErreur.innerHTML = "Il y a eu une erreur.";
                document.getElementById("ajoutPhotoFormulaire").prepend(boiteErreur); 

                const texteErreur = await reponse.text();
                console.error("Erreur : ", texteErreur);
                document.getElementById("ajoutPhotoFormulaire").prepend(boiteErreur);
            }
      } catch (erreur) {
        console.error("Une erreur est survenue : ", erreur);
        const boiteErreur = document.createElement("div");
        boiteErreur.classList.add("erreur");
        boiteErreur.innerHTML = "Il y a eu une erreur de connexion.";
        document.getElementById("ajoutPhotoFormulaire").prepend(boiteErreur);
      }
    } else {
        alert("Veuillez remplir tous les champs.");
    }
    });
  }

  document.querySelector(".ajout-photo").addEventListener("click", function() {
    validerAjoutPhoto();
});

// fonction bouton valider ajout photo