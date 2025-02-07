function updateCurrentTime() {
    const now = new Date();
    document.getElementById("current-time").textContent = now.toLocaleTimeString("ca-ES");
}
setInterval(updateCurrentTime, 1000);

let timerOn = false;

document.getElementById("start-timer").addEventListener("click", function() {
    let inputHours = parseInt(document.getElementById("horas").value, 10);
    let inputMins = parseInt(document.getElementById("minutos").value, 10);
    let inputSegs = parseInt(document.getElementById("segundos").value, 10);
    let endTime = document.getElementById("end-time").value;

    let horaExactaOption = document.getElementById("exacta").checked;
    let tempsFaltaOption = document.getElementById("falta").checked;
    console.log(horaExactaOption);
    console.log(tempsFaltaOption);

    if(timerOn){
        return;
    }

    let targetTime;
    let remainingTime;
    let targetTimeInMins;
    let nowTimeInMinutes;
    let now = new Date();


    if (endTime && horaExactaOption) {
        let [hours, minutes] = endTime.split(":");
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        if(now > targetTime){
            hours = hours + 24;
            targetTimeInMins = (hours * 60) + minutes;
            nowTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        }
    } else if((inputHours || inputMins || inputSegs) && tempsFaltaOption){
        nowTimeInSecs = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
        targetTimeInSecs = nowTimeInSecs + (inputHours * 3600) + (inputMins * 60) + inputSegs;
        nowTimeInMinutes = nowTimeInSecs / 60;
        targetTimeInMins = targetTimeInSecs / 60;
    }
    else{
        alert("Introdueix un temps o una hora de finalització!");
        return;
    }
    remainingTime = Math.max(0, Math.floor((targetTimeInMins - nowTimeInMinutes)* 60));
    timerOn = true;

    let timerInterval = setInterval(() => {
        remainingTime -= 1;

        let hours = Math.floor(remainingTime / 3600);
        let minutes = Math.floor((remainingTime % 3600) / 60);
        let seconds = remainingTime % 60;

        document.getElementById("time-remaining").textContent = `${hours}:${minutes}:${seconds}`;

        if (remainingTime === 0) {
            clearInterval(timerInterval);
            let sound = new Audio(document.getElementById("alarm-sound").value);
            sound.play();
            timerOn = false;
            document.getElementById("time-remaining").textContent = `00:00:00`;
        }
        else if(!timerOn){
            clearInterval(timerInterval);
            timerOn = false;
            document.getElementById("time-remaining").textContent = `00:00:00`;
        }
    }, 1000);
});

document.getElementById("clear-timer").addEventListener("click", function(){
    timerOn = false;
});

