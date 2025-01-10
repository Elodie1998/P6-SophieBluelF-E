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
            }
        } else {//si filtre n'a pas de valeur = tous les projets
            for (let i = 0; i < travaux.length; i++) {//pr chaque travail (non filtré)
                obtenirProjet(travaux[i]);//tous les projets ajoutés ds gallery sans filtre
            }   
        }
    } catch (erreur) { //si erreur
        console.log("Il y a eu un problème :", erreur); // affiche erreur ds console
    }
}
recuperationTravaux();// appel pr récup & afficher tous les projets au chargement page

function obtenirProjet(info) {//info : paramètre qui contient infos sur projets
    const projet = document.createElement("figure");//creation element figure  & titre
    projet.innerHTML = `<img src=${info.imageUrl} alt=${info.title}>
				<figcaption>${info.title}</figcaption>`;//img & alt + titre

    document.querySelector(".gallery").appendChild(projet); //ajout figure à la fin de l'element gallery
    
    const projetModale = projet.cloneNode(true); //true pr cloner ts les noeuds enfants = travaux
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
    divConteneur.className = info.name;//attribution nom de classe aux div créés
    divConteneur.addEventListener("click", () => recuperationTravaux(info.id));//gestion d'événement qui appelle recuperationTravaux ac pr paramètre  celui qui contient les infos sur projets 
    divConteneur.innerHTML = `${info.name}`;//texte pr afficher entre les balises ouvrantes & fermantes des div créés
    document.querySelector(".div-conteneur").appendChild(divConteneur);//lie le parent dt classe est div-conteneur aux div créés
}
document.querySelector(".tous").addEventListener("click", () => recuperationTravaux());//ajout événement aux btns ac classe "tous" pr appeler fction recuperationTravaux() sans filtrer, afficher ts les projets