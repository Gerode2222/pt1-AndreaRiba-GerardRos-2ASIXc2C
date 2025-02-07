export async function ReadNameFile() {
    let options;
    try {
        const response = await fetch('noms.txt');
        const data = await response.text();
        options = data.split('\n');
    } catch (error) {
        document.getElementById("noms-content").textContent = "No s'ha pogut carregar el fitxer.";
        console.error("Error al carregar el fitxer:", error);
    }
    return options;
}