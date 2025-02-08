//funcio per llegir el fitxer noms.txt i retorna la llista de noms
export async function ReadNameFile() {
    let options;
    try {
        //S'utilitza await per asegurar que el codig no segueix sense haber llegit el fitxer
        const response = await fetch('noms.txt');
        const data = await response.text();
        //Es separa la informació rebuda
        options = data.split('\n');
    } catch (error) {
        document.getElementById("noms-content").textContent = "No s'ha pogut carregar el fitxer.";
        console.error("Error al carregar el fitxer:", error);
    }
    return options;
}