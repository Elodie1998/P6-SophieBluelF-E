
const bannerEdition = document.createElement("div")
const lienModale = document.querySelector(".modale-js")
const filtreCacher = document.querySelector(".div-conteneur");

function afficherModeEdition() {
    if (sessionStorage.connexToken) {
        
        bannerEdition.classList = "edition";
        bannerEdition.innerHTML = 
            '<p><i class="fa-solid fa-pen-to-square"></i>Mode Edition</p>';
        document.body.prepend(bannerEdition);// Pr ajout de la div créée tt en haut de la page html

        document.querySelector(".edition").style.display = "flex";
        document.querySelector("header").style.marginTop = "100px";

        document.querySelector(".connexion").innerText = "logout";

        lienModale.style.display = "";
        lienModale.classList.add("modifier-lien");

        filtreCacher.style.display = "none";
        document.querySelector(".modifier").style.marginBottom = "90px";
    } else {
        document.querySelector(".edition").style.display = "none";
        document.querySelector("header").style.marginTop = "";
        document.querySelector(".connexion").innerText = "login";
        lienModale.style.display = "";
        lienModale.classList.remove("modifier-lien");
        filtreCacher.style.display = "flex";
        document.querySelector(".modifier").style.marginBottom = "";
    }
};

afficherModeEdition();


document.querySelector(".connexion").addEventListener("click", function () {// Au click du lien Logout
    sessionStorage.removeItem("connexToken");// Token récupéré retiré

    document.querySelector(".edition").style.display = "none";
    document.querySelector("header").style.marginTop = "";
    document.querySelector(".connexion").innerText = "login";
    document.querySelector(".modale-js").style.display = "";
    document.querySelector(".modale-js").classList.remove("modifier-lien");
    document.querySelector(".div-conteneur").style.display = "flex";
    document.querySelector(".modifier").style.marginBottom = "";
});