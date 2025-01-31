

function afficherModeEdition() {
    if (sessionStorage.connexToken) {

        const bannerEdition = document.createElement("div")
        bannerEdition.classList = "edition";
        bannerEdition.innerHTML = 
            '<p><i class="fa-solid fa-pen-to-square"></i>Mode Edition</p>';
        document.body.prepend(bannerEdition);

        document.querySelector(".edition").style.display = "flex";
        document.querySelector("header").style.marginTop = "100px";
        //document.querySelector("#portfolio h2").style.display = "block";

        document.querySelector(".connexion").innerText = "logout";

        const lienModale = document.querySelector(".modale-js").style.display = "block";
        lienModale.classList = "modifier-lien";
        document.body.prepend(lienModale);
    }
};

afficherModeEdition();


document.querySelector(".connexion").addEventListener("click", function () {
    sessionStorage.removeItem("connexToken");

    window.location.href = "index.html";
});