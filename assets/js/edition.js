

function afficherModeEdition() {
    if (sessionStorage.connexToken) {

        const bannerEdition = document.createElement("div")
        bannerEdition.classList = "edition";
        bannerEdition.innerHTML = 
            '<p><i class="fa-solid fa-pen-to-square"></i>Mode Edition</p>';
        document.body.prepend(bannerEdition);// Pr ajout de la div créée tt en haut de la page html

        document.querySelector(".edition").style.display = "flex";
        document.querySelector("header").style.marginTop = "100px";

        document.querySelector(".connexion").innerText = "logout";

        const lienModale = document.querySelector(".modale-js").style.display = "block";
        lienModale.classList = "modifier-lien";
        document.body.prepend(lienModale); // Pr ajout de la div créée tt en haut de balise ac comme class modale-js

        const filtreCacher = document.querySelector(".div-conteneur");
        filtreCacher.style.display = "none";
        document.querySelector(".modifier").style.marginBottom = "90px";
    }
};

afficherModeEdition();


document.querySelector(".connexion").addEventListener("click", function () {// Au click du lien Logout
    sessionStorage.removeItem("connexToken");// Token récupéré retiré

    window.location.href = "index.html";// revenir à la pahe html sans le mode édition
});