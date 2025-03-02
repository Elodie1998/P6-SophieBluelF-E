async function ajoutListenerAuthentification() {
    
    const authentification = document.getElementById("connexionform");
    
    authentification.addEventListener("submit", async function (event) {
        event.preventDefault();//empêche rechargement page
        
        const utilisateur = {// récupération des valeurs des 2 champs
            email : document.getElementById("email").value,
            password : document.getElementById("password").value
        }

        console.log(utilisateur);
    
    const chargeUtile = JSON.stringify(utilisateur); // convertion objet utilisateur en JSON
    
    // Création d'une connection
    const reponseRecu = await fetch ("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body:chargeUtile
    });

    console.log(reponseRecu);

    if(!reponseRecu.ok) {//si erreur d'authentification
        let texteErreur = document.querySelector("#connexionform .erreur");

        if(texteErreur) {//si existe déjà, MAJ (message non répété)
            texteErreur.innerHTML = "La connexion n'a pas pu être établie.";

        } else {//Si n'existe pas déjà, en crée 1 
            texteErreur = document.createElement("div");
            texteErreur.innerHTML = "La connexion n'a pas été établie.";
            texteErreur.classList.add("erreur");
            document.getElementById("connexionform").prepend(texteErreur);//ajout message erreur au début form
        } 
    } else {
            //ajout traitement après connexion réussie
        const resultat = await reponseRecu.json();

        console.log(resultat);

        const token = resultat.token;

        sessionStorage.setItem("connexToken", token);
        console.log("Token récupéré : ", token);

        window.location.href = "index.html";//redirige utilisateur vers page d'accueil
        }
    
    });
    
}

ajoutListenerAuthentification();

