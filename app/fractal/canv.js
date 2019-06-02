var size = 480*parseFloat(document.getElementById('rzoom').value)/100;
var padd = 480-size;
document.getElementById('canvas').width=480;
document.getElementById('canvas').height=480;



var canvas = document.getElementById('canvas');


function rend() {
  size = 480*parseFloat(document.getElementById('rzoom').value)/100;
  padd = 480-size;
  var canvas = document.getElementById('canvas');
  canvas.width  = canvas.width;
  var canvasWidth  = size;
  var canvasHeight = size;
  var context = canvas.getContext('2d');
  var imageData = context.getImageData(0, 0, canvasWidth+padd, canvasHeight+padd);
  var data = imageData.data;
  var minY = 0;
  var minX = 0;
  var xy=[[1],[1]];
  var npoints = document.getElementById('np').value;
  for(var n = 0; n <npoints; n++) {
    var cprob = 0;
    var nprob = 0;
    
    var r = Math.random()
    for (var i=0; i<ifs.length; i++) {
      ncprob=cprob + ifs[i][2];
      if (r>cprob && r<ncprob){
        xy = p(x(ifs[i][0],xy),ifs[i][1]);
        break;
      }
      cprob=ncprob
    }

    if (xy[0][0]*canvasWidth+padd/2 >= padd+canvasHeight-1 || xy[0][0]*canvasWidth+padd/2<0) {continue;}

    minX = Math.min(minX, xy[0][0]);
    if (n>20){
    var index = ( (canvasHeight - Math.round((xy[1][0])*canvasHeight)+padd/2) * (canvasWidth+padd) + Math.round((xy[0][0])*canvasWidth)+padd/2) * 4;
    data[index]   = 0;    // red
    data[++index] = 0;    // green
    data[++index] = 0;    // blue
    data[++index] = 255;      // alpha
    }
  loads = document.getElementById('loads');
  loads.innerHTML='';
}

context.putImageData(imageData, 0, 0);
}

  var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
if (is_chrome){alert('You appear to be using Chrome. This app is quite slow in Chrome. The number of rendering points has been decreased.'); document.getElementById('np').value = 10000;}
rend();

function savePng() {
var c=document.getElementById("canvas");
var d=c.toDataURL("image/png");
var w=window.open('about:blank','image from canvas');
w.document.write("<img src='"+d+"' alt='from canvas'/>");
}
