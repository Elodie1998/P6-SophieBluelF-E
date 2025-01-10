
let modale = null;
const selecteurFocusable = "button, a, input, textarea";
let focusables = [];
let elementAvantFocus = null;

const ouvrirModale = function (e) {
    e.preventDefault();
    modale = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modale.querySelectorAll(selecteurFocusable));
    elementAvantFocus = document.querySelector(':focus');
    focusables[0].focus();
    modale.style.display = null;
    modale.removeAttribute("aria-hidden");
    modale.setAttribute("aria-modal", "true");
    modale.addEventListener("click", fermerModale);
    modale.querySelector(".modale-js-fermer").addEventListener("click", fermerModale);
    modale.querySelector(".modale-js-arreter").addEventListener("click", arreterPropagation);
};

const fermerModale = function (e) {
    if (modale === null) return;
    if (elementAvantFocus !== null) elementAvantFocus.focus();
    e.preventDefault();
    modale.style.display = "none";
    modale.setAttribute("aria-hidden", "true");
    modale.removeAttribute("aria-modal");
    modale.removeEventListener("click", fermerModale);
    modale.querySelector(".modale-js-fermer").removeEventListener("click", fermerModale);
    modale.querySelector(".modale-js-arreter").removeEventListener("click", arreterPropagation);

    modale = null;
}

const arreterPropagation = function (e) {
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