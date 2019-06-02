function lz78En() {
  $('#demo').html(lz78Encode($('#myText').val()));
}

function lz78Encode(string) {
    var code="";
    var prev = []
    while(string!="") {
      base = "";
      while(prev.indexOf(base+string.charAt(0))!=-1) {
        base += string.charAt(0);
        string = string.substr(1);
      }
      var ind = prev.indexOf(base)+1;
      last =string.charAt(0);
      base+=last;
      string = string.substr(1);
      prev.push(base);
      code+="("+ind+","+last+")"
    }
    return code;
}


function lz78De() {
  $('#demo').html(lz78Decode($('#myText1').val(),$('#myWindow1').val()));
}

function lz78Decode(string,w) {
    var wind = []
    var code="";
    return code;
  }
