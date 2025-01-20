async function recuperationTravaux(filtre) { //opé asynchrones (tps), await gère promesses + facilement; filtre = catégorie spé
    document.querySelector(".gallery").innerHTML = "";//vide gallery avant chargement nveaux travaux
    try { //tester code = requête API
        const reponseT = await fetch("http://localhost:5678/api/works");//requête API recup travaux, attend promesse pr continuer
        if (!reponseT.ok) {//si réponse API différent de "ok"
            throw new Erreur("Erreur lors de la récupération des données");//erreur levée
        }
        const travaux = await reponseT.json(); // Convertion réponse en JSON, accès + facilement données
        if (filtre) {//si filtre fourni = a 1 valeur
            const estFiltre = travaux.filter((info) => info.categoryId === filtre); //travaux filtrés par catégorie via filter() 
            for (let i = 0; i < estFiltre.length; i++) {//pr chaque travail (filtré)
                obtenirProjet(estFiltre[i]);//appel fonction pr ajouter ce projet ds gallery
                obtenirProjetModale(estFiltre[i]);
            }
        } else {//si filtre n'a pas de valeur = tous les projets
            for (let i = 0; i < travaux.length; i++) {//pr chaque travail (non filtré)
                obtenirProjet(travaux[i]);//tous les projets ajoutés ds gallery sans filtre
                obtenirProjetModale(travaux[i]);
            }   
        }

        //Suppression
        const iconePoubelle = document.querySelectorAll(".fa-trash-can");
        console.log(iconePoubelle);
        iconePoubelle.forEach((e) => 
            e.addEventListener("click", (event) => supprTravaux(event))
        );

    } catch (erreur) { //si erreur
        console.log("Il y a eu un problème :", erreur); // affiche erreur ds console
    }
}
recuperationTravaux();// appel pr récup & afficher tous les projets au chargement page

function obtenirProjet(info) {//info : paramètre qui contient infos sur projets
    const projet = document.createElement("figure");//creation element figure  & titre
    projet.id = `gallery-${info.id}`;
    projet.innerHTML = `<img src=${info.imageUrl} alt=${info.title}>
				<figcaption>${info.title}</figcaption>`;//img & alt + titre

    document.querySelector(".gallery").appendChild(projet); //ajout figure à la fin de l'element gallery
}

function obtenirProjetModale(info) {
    // console.log(info);
    const projetModale = document.createElement("figure");
    projetModale.id = `projet-${info.id}`;
    projetModale.innerHTML = `<div class="modale-projet-conteneur">
                                <img src="${info.imageUrl}" alt="${info.title}">
                                <figcaption>${info.title}</figcaption>
                                <i data-projet="${info.id}" class="fa-solid fa-trash-can affiche-poubelle"></i>
                              </div>`;
    document.querySelector(".modale-gallery").appendChild(projetModale); //ajout figure à la fin de la modale
}

// document.addEventListener("click", function(event) {
//     if (event.target.classList.contains("fa-trash-can")) {
//         console.log("hello");
//     }
// });

async function obtenirCategories() {
    try {
        const reponseC = await fetch("http://localhost:5678/api/categories");//requête API recup catégories, attend promesse pr continuer
        if (!reponseC.ok) {//si réponse API différent de "ok"
            throw new Erreur("Erreur lors de la récupération des données");//erreur levée
        }

        const categories = await reponseC.json();// Convertion réponse en JSON, accès + facilement données
        console.log(categories);//afficher ttes les catégories ds console (Array(3))
        for (let i = 0; i < categories.length; i++) {//pr chaque catégorie
            afficherFiltres(categories[i]);//appel de cette fction 
        }
    } catch (erreur) {//si erreur
        console.log("Il y a eu un problème :", erreur);// affiche erreur ds console
    }
}
obtenirCategories();//appel pr recup catégories dispo via API

function afficherFiltres(info) {
    // console.log(info);//afficher ttes les catégories ss forme d'objets
    const divConteneur = document.createElement("div");//creation elements div pr chaque catégorie
    divConteneur.className = info.name;//attribution nom de classe aux div créés
    divConteneur.addEventListener("click", () => recuperationTravaux(info.id));//gestion d'événement qui appelle recuperationTravaux ac pr paramètre  celui qui contient les infos sur projets 
    divConteneur.innerHTML = `${info.name}`;//texte pr afficher entre les balises ouvrantes & fermantes des div créés
    document.querySelector(".div-conteneur").appendChild(divConteneur);//lie le parent dt classe est div-conteneur aux div créés
}
document.querySelector(".tous").addEventListener("click", () => recuperationTravaux());//ajout événement aux btns ac classe "tous" pr appeler fction recuperationTravaux() sans filtrer, afficher ts les projets

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

// Fonction ajout photo
function modaleAjoutPhoto () {
    document.querySelector(".contenu-modale").innerHTML = 
            `<div class="fermer-modale-conteneur">
				<button class="modale-js-fermer fermer-modale" aria-label = "Fermer la boîte">
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
        	<h1 class="contenu-modale__h1">Ajout photo</h1>
			<div class="ajout-photo-form">
                <form action="#" method="post">
			        <label for="title">Titre</label>
			        <input type="text" name="name" id="name">
			        <label for="category">catégorie</label>
			        <input type="category" name="category" id="category">
			        <input type="submit" value="Valider">
		        </form>
            </div>
			<hr/>
			<div class="modale-button-js">
				<input class="ajout-photo" type="submit" value="Valider">
        	</div>`;
};

const ajouterPhotoInput = document.querySelector(".ajout-photo");
ajouterPhotoInput.addEventListener("click", modaleAjoutPhoto);
