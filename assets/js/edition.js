

function afficherModeEdition() {
    const token = sessionStorage.getItem("connexToken");
    console.log(token);
    if (token) {
        console.log("ok");

        document.querySelector(".edition").style.display = "flex";
        document.querySelector("header").style.marginTop = "120px";
    } else {
        document.querySelector(".edition").style.display = "none";
    }
};

window.onload = afficherModeEdition;