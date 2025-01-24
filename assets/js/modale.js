
let modale = null;//fait que modale n'existe pas
const selecteurFocusable = "button, a, input, textarea";
let focusables = [];
let elementAvantFocus = null;

const ouvrirModale = function (e) {
    e.preventDefault();
    modale = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modale.querySelectorAll(selecteurFocusable));
    console.log(focusables);
    elementAvantFocus = document.querySelector(':focus');
    focusables[0].focus();
    modale.style.display = null;//retire valeur display none pr display flex (css)
    modale.removeAttribute("aria-hidden");//retire class => modale n'est plus cachée
    modale.setAttribute("aria-modal", "true");
    modale.addEventListener("click", fermerModale);
    modale.querySelector(".modale-js-fermer").addEventListener("click", fermerModale);//click bouton modale ouvre modale
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
    console.log(e.key);
    if (e.key === "Escape" || e.key === "Esc") {
        fermerModale(e);
    }
    if (e.key == "Tab" && modale !== null) {
        focusDsModale(e);
    }
})

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
        console.log("fait");
    } else {
        modaleAffichee.style.display = "block";
        modaleAjout.style.display = "none";
        console.log("toggle");
    }
}

// récupération image sélectionnée
document.getElementById("file").addEventListener("change", function(event) {
    const file = event.target.files[0]; // Prend le 1er fichier sélectionné
    if(file) {
        const lire = new FileReader();// création d'1 nouvelle instance de FileReader

        // Définir le comportement 1 fois le fichier lu
        lire.onload = function(e) {
            const apercu = document.getElementById("apercu");// Affichage de l'image ds balise img
            apercu.src = e.target.result; // chemin de l'image sélectionnée
            apercu.style.display = "block"; // affiche l'image
        };

        // Lire le fichier comme 1 URL de données
        lire.readAsDataURL(file);// lit le fichier c URL de données pr afficher img ds sa balise
    }
})