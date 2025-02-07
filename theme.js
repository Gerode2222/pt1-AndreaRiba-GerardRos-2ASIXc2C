const button = document.getElementById("themeToggle");
const body = document.body;
console.log(document.getElementById("themeToggle"));
console.log(document.body);

// Comprovar tema guardat en localStorage
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
    button.innerText = "☀️ Modo Claro";
}

button.addEventListener("click", () => {
    console.log("Botón clickeado");

    if (body.classList.contains("dark-theme")) {
        console.log("Modo Oscuro → Claro");
        body.classList.replace("dark-theme", "light-theme");
        button.innerText = "🌙 Modo Oscuro";
        localStorage.setItem("theme", "light");
    } else {
        console.log("Modo Claro → Oscuro");
        body.classList.replace("light-theme", "dark-theme");
        button.innerText = "☀️ Modo Claro";
        localStorage.setItem("theme", "dark");
    }
});
