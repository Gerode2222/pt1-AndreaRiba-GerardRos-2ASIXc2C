import { ReadNameFile } from "./names.js";

var options = ["", "","", ""];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinTime = 0;
var spinTimeTotal = 0;
var spinAngleStart = 0;


var ctx;

document.getElementById("names").addEventListener("click", GetNames);
document.getElementById("spin").addEventListener("click", spin);

//Rebem els noms del name.js i es realitza la funció per dibuixar la ruleta amb els noms del fitxer
async function GetNames(){
    options = await ReadNameFile();
    //Es calcula l'arc que ha de tenir cada segment depenent de la quantitat de noms
    arc = Math.PI / (options.length / 2);
    drawRouletteWheel(options);
}

//Funcio que es realitza per obtenir el color obtenint el hexadecimal de RGB 
function byte2Hex(n) {
  //Aquesta string te els valord de hexadecimal per posició (0=0, A=10...)
  var nybHexString = "0123456789ABCDEF";
  //Variables per obtenir els dos digits del hexadecimal amb un & es fa el AND bit a bit
  var high = (n >> 4) & 0x0F;
  var low = n & 0x0F;
  return nybHexString[high] + nybHexString[low];
}

//Retorna el color RGB a pertir del hexadecimal
function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

//Retorna el color de cada segment
function getColor(item, maxitem) {
  //Punt mig de la variació de color
  var center = 128;
  //Limit del color (128+127 = 255 i 128-127 = 1)
  var width = 127;
  //Determina la frecuencia de cada color depenent del número de segments, quant més petit més es diferencien els colors
  var frequency = Math.PI*2/maxitem;
  
  //Calcul per cada valor de RGB
  var red   = Math.sin(frequency*item+2) * width + center;
  var green = Math.sin(frequency*item+0) * width + center;
  var blue  = Math.sin(frequency*item+4) * width + center;
  
  return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
  //Primer agafar el element canvas que s'utilitza per dibuixar la ruleta i els seus elements
  var canvas = document.getElementById("canvas");
  //Comprovem si es pot agafar el context del canvas per poder dibuixar
  if (canvas.getContext) {
    //Determinar caracteristiquyes de la ruleta com el radi exterior i interior
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    //Agafar el contexte per dibuixar i fer un clear per netejar el que hi hagi anteriorment
    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    //Caracteristiques de les lineas
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    //Font dels textos
    ctx.font = 'bold 12px Helvetica, Arial';

    //Bucle que itera per cada nom
    for(var i = 0; i < options.length; i++) {
      //Es calcula l'angle de cada segment i el seu color depenent de la quantitat de noms i la seva posició a la llista
      var angle = startAngle + i * arc;
      ctx.fillStyle = getColor(i, options.length);

      //Dibuixa el segment amb el seu color especificat anteriorment
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();

      //Es posen els noms especificant la seva rotacio i posició
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Com es dibuixa la fletxa, primer es determina el tema per determinar un color
    if (body.classList.contains("dark-theme")) {
      ctx.fillStyle = "white";
    } 
    else {
    ctx.fillStyle = "black";
    }
    //Comença el dibuix de la fletxa, pasant per cada posició tenint en compte el diametre de la ruleta
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    //Es pinta el color de la fletxa amb el determinat anteriorment
    ctx.fill();
  }
}

function spin() {
  //Determina una variacio en el angle d'inici i el temps de rotació per augmentar la aleatorietat
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

window.rotateWheel = function(){
  //Va augmentant el temps en cada bucle fins arribar al temps màxim establert
  spinTime += 30;
  //Para la ruleta en cas que es superi el temps total
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

//Funcio al parar la ruleta
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  //Calcul per saber el guanyador
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  //Escriure el nom del guanyador
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
  //Audio
  let sound = new Audio("sound3.mp3");
  sound.play();
}

//Calcula una nova rotació per anar fent-la més lenta
function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}
 //Dibuix inicial de la ruleta perque no quedi un forat blanc
drawRouletteWheel();