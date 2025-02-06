async function recuperationTravaux(filtre) { //opé asynchrones (tps), await gère promesses + facilement; filtre = catégorie spé
    document.querySelector(".gallery").innerHTML = "";//vide gallery avant chargement nveaux travaux
    document.querySelector(".modale-gallery").innerHTML = "";//vide gallery de modale suppr avant chargement nveaux travaux
    try { // requête API
        const reponseT = await fetch("http://localhost:5678/api/works");//requête API recup travaux, attend promesse pr continuer
        if (!reponseT.ok) {//si réponse API différent de "ok"
            throw new Erreur("Erreur lors de la récupération des données");//erreur levée
        }
        const travaux = await reponseT.json(); // Convertion réponse en JSON, accès + facilement données
        //Condition plus concise avec opérateur ternaire : op ternaire ? si oui, renvoie exp : si non, renvoie exp
        const travauxAFiltrer = filtre ? travaux.filter((info) => info.categoryId === filtre) : travaux;

        travauxAFiltrer.forEach(travail => {
            obtenirProjet(travail);
            obtenirProjetModale(travail);
        });

        //Ecouteur pr suppression par les icônes poubelles
        const iconePoubelle = document.querySelectorAll(".fa-trash-can");
        console.log(iconePoubelle);
        iconePoubelle.forEach((e) => {
            e.addEventListener("click", (event) => {
                console.log(event);
                const id = event.target.dataset.projet;
                console.log(id);
                if (id) {
                    supprTravaux(id);
                } else {
                    console.error("ID du projet non défini.");
                }
            });
        });

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
    const projetModale = document.createElement("figure");
    projetModale.id = `projet-${info.id}`;
    projetModale.innerHTML = `<div class="modale-projet-conteneur">
                                <img src="${info.imageUrl}" alt="${info.title}">
                                <figcaption>${info.title}</figcaption>
                                <i data-projet="${info.id}" class="fa-solid fa-trash-can affiche-poubelle"></i>
                              </div>`;
    document.querySelector(".modale-gallery").appendChild(projetModale); //ajout figure à la fin de la modale
}

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
    console.log(info);//afficher ttes les catégories ss forme d'objets
    const divConteneur = document.createElement("div");//creation elements div pr chaque catégorie
    divConteneur.className = info.name;//attribution nom de classe aux div créés (catégorie)
    divConteneur.addEventListener("click", () => recuperationTravaux(info.id));//gestion d'événement qui appelle recuperationTravaux ac pr paramètre  celui qui contient les infos sur projets 
    divConteneur.addEventListener("click", (event) => filtreBascule(event));
    document.querySelector(".tous").addEventListener("click", (event) => filtreBascule(event));
    divConteneur.innerHTML = `${info.name}`;//texte pr afficher entre les balises ouvrantes & fermantes des div créés
    document.querySelector(".div-conteneur").appendChild(divConteneur);//lie le parent dt classe est div-conteneur aux div créés
}

function filtreBascule(event) {
    const conteneur = document.querySelector(".div-conteneur");
    Array.from(conteneur.children).forEach((child) =>
        child.classList.remove("filtre-selectionne")
    );
    event.target.classList.add("filtre-selectionne");
}

document.querySelector(".tous").addEventListener("click", () => recuperationTravaux());//ajout événement aux btns ac classe "tous" pr appeler fction recuperationTravaux() sans filtrer, afficher ts les projets