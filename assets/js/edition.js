

function afficherModeEdition() {
    if (sessionStorage.connexToken) {
        console.log("ok");

        const bannerEdition = document.createElement("div")
        bannerEdition.classList = "edition";
        bannerEdition.innerHTML = 
            '<p><a href="#modale" class="modale-js"><i class="fa-solid fa-pen-to-square"></i>Mode Edition</a></p>';
        document.body.prepend(bannerEdition);

        document.querySelector(".edition").style.display = "flex";
        document.querySelector("header").style.marginTop = "100px";
        document.querySelector("#portfolio h2").style.display = "block";

        document.querySelector(".connexion").innerText = "logout";
    }
};

afficherModeEdition();

