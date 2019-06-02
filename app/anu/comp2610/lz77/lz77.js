function lz77En() {
  $('#demo').html(lz77Encode($('#myText').val(),$('#myWindow').val()));
}

function lz77Encode(string,w) {
    var wind = []
    var code="";
    while(string!="") {
      var letter = string.charAt(0);

      var maxind=0;
      var max=0;
      for(var i=wind.length-1;i>=0;i--) {
        ind=0;
        while(ind<string.length && wind[(i+ind)%wind.length]==string[ind]) {
          ind++;
        }
        if(ind>maxind) {
          maxind=ind;
          max=wind.length-i;
        }
      }
      if(maxind==0) {
        code+="(0,"+letter+")";
        string = string.substr(1);
        if(wind.length<w) {
          wind.push(letter);
        } else {
          for(var i=0;i<wind.length-1;i++) {
            wind[i]=wind[i+1];
          }
          wind[wind.length-1]=letter;
        }
      }
      else {
        code+="(1,"+max+","+maxind+")";
        for(var j=0;j<maxind;j++) {
          letter=string.charAt(0);
          string = string.substr(1);
          if(wind.length<w) {
            wind.push(letter);
          } else {
            for(var i=0;i<wind.length-1;i++) {
              wind[i]=wind[i+1];
            }
            wind[wind.length-1]=letter;
          }
        }
      }
    }
    return code;
}


function lz77De() {
  $('#demo').html(lz77Decode($('#myText1').val(),$('#myWindow1').val()));
}

function lz77Decode(string,w) {
    var wind = []
    var code="";
    return code;
  }
