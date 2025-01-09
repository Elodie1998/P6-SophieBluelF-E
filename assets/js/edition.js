

function afficherModeEdition() {
    // const token = sessionStorage.getItem("connexToken");
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
    } /*else {
        document.querySelector(".edition").style.display = "none";
    };*/
};

afficherModeEdition();

let modale = null;

const ouvrirModale = function (e) {
    e.preventDefault();

    const cible = document.querySelector(e.target.getAttribute("href"));
    console.log("cible : ", cible);

    cible.style.display = null;
    cible.removeAttribute("aria-hidden");
    cible.setAttribute("aria-modal", "true");
    modale = cible;
    modale.addEventListener("click", fermerModale);
    modale.querySelector(".fermer-modale-js").addEventListener("click", fermerModale);
};

const fermerModale = function (e) {
    if (modale === null) return;
    e.preventDefault();
    modale.style.display = "none";
    modale.setAttribute("aria-hidden", "true");
    modale.removeAttribute("aria-modal");
    modale.removeEventListener("click", fermerModale);
    modale.querySelector(".fermer-modale-js").removeEventListener("click", fermerModale);
    modale = null;
}

document.querySelectorAll(".modale-js").forEach((a) => {
    a.addEventListener("click", ouvrirModale);
});