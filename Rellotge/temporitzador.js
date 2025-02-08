//Actualitza la hora del rellotge
function updateCurrentTime() {
    const now = new Date();
    document.getElementById("current-time").textContent = now.toLocaleTimeString("ca-ES");
}
//Fa que cada segon s'executi la funcio d'actualitzar el rellotge
setInterval(updateCurrentTime, 1000);

//variable per treure el temporitzador
let timerOn = false;

//funcio que s'executa quan apretes el boto de temporitzador
document.getElementById("start-timer").addEventListener("click", function() {
    //agafar el temps de l'opció de sumar hores, minuts o segons
    let inputHours = parseInt(document.getElementById("horas").value, 10);
    let inputMins = parseInt(document.getElementById("minutos").value, 10);
    let inputSegs = parseInt(document.getElementById("segundos").value, 10);
    //agafar el temps de l'opció hora exacta
    let endTime = document.getElementById("end-time").value;

    //Variables per escollir la opció del temporitzador
    let horaExactaOption = document.getElementById("exacta").checked;
    let tempsFaltaOption = document.getElementById("falta").checked;
    console.log(horaExactaOption);
    console.log(tempsFaltaOption);

    //comprovar que no hi ha cap temporitzador en marxa
    if(timerOn){
        return;
    }

    let targetTime;
    let remainingTime;
    let targetTimeInMins;
    let nowTimeInMinutes;
    let now = new Date();

    //Calcul del temps depenent de l'opció a més de confirmar que les dades son correctes
    if (endTime && horaExactaOption) {
        //obtenir els valor de les hores i minuts i el temps actual
        let [hours, minutes] = endTime.split(":");
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        //Si el temps escollit es menor que el actual s'incrmenten 24 per fer el dia següent
        if(now > targetTime){
            hours = hours + 24;
        }
        //temps total en minuts
        targetTimeInMins = (hours * 60) + minutes;
        nowTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    } 
    else if((inputHours || inputMins || inputSegs) && tempsFaltaOption){
        //Pasar el temps a segons per sumar els que s'asignin
        nowTimeInSecs = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
        targetTimeInSecs = nowTimeInSecs + (inputHours * 3600) + (inputMins * 60) + inputSegs;
        //Pasar el temps a minuts per els calculs
        nowTimeInMinutes = nowTimeInSecs / 60;
        targetTimeInMins = targetTimeInSecs / 60;
    }
    else{
        alert("Introdueix un temps o una hora de finalització!");
        return;
    }

    //calcul del temps que queda de temporitzador
    remainingTime = Math.max(0, Math.floor((targetTimeInMins - nowTimeInMinutes)* 60));
    timerOn = true;

    //interval que s'executa cada segon reduint el temps 1 segon
    let timerInterval = setInterval(() => {
        remainingTime -= 1;

        let hours = Math.floor(remainingTime / 3600);
        let minutes = Math.floor((remainingTime % 3600) / 60);
        let seconds = remainingTime % 60;

        document.getElementById("time-remaining").textContent = `${hours}:${minutes}:${seconds}`;

        if (remainingTime === 0) {
            //Codig que para el cronometre en cas d'arribar a 0 i soni un so
            clearInterval(timerInterval);
            let sound = new Audio(document.getElementById("alarm-sound").value);
            sound.play();
            timerOn = false;
            document.getElementById("time-remaining").textContent = `00:00:00`;
        }
        else if(!timerOn){
            //Parar el cronometre al apretar el botó
            clearInterval(timerInterval);
            timerOn = false;
            document.getElementById("time-remaining").textContent = `00:00:00`;
        }
    }, 1000);
});

//Funcio per parar el temporitzador
document.getElementById("clear-timer").addEventListener("click", function(){
    timerOn = false;
});

