function arithmeticEn() {
  $('#demo').html(arithmeticEncode($('#myText').val()));
}

function arithmeticEncode(string) {
    var code="";
    u=0;
    v=1;
    x="";
    b="0.";
    A=['a','b'];
    m=[1,1];
    p=[0.5,0.5];
    F=cumulative(p);
    while(string!="") {
      letter = string.charAt(0);
      console.log(letter);
      x+=letter;
      string = string.substr(1);
      ii=A.indexOf(letter);
      u=u+(v-u)*F[ii];
      v=u+(v-u)*F[ii+1];
      bd=longest(b,u,v);
      code+=bd;
      b=b+bd;
    }
    return code;
}

function die(p) {
  
}

function tobase2(n) {
  precision = 0;
  b="0."
  while(precision<100) {
    precision++;

    n*=2;
    nw=Math.floor(n);
    n=n-nw;
    b+=nw.toString();
    if(n==0) {
      break;
    }
  }
  return b;
}


function tobase10(b) {
  n=0;
  i=-1;
  b=b.substr(2);
  while(b!="" || parseInt(b,2)==0) {
    bi=b.charAt(0);
    b=b.substr(1);
    bi=parseInt(bi,2);
    n+=Math.pow(2,i)*bi;
    i--;
  }
  return n
}

function longest(b,u,v) {
  bd="";
  l=b.length;
  ub=tobase2(u);
  vb=tobase2(v);

  while(true) {
    bdn=bd+(ub+"00000000000")[l++];
    if(tobase10(b+bd+"0")<=u&&tobase10(b+bdn+"1")>=v) {
      bd=bdn;
    }
    else {
      break
    }
  }

  return bd;
}


function cumulative(p) {
  F = [0,p[0]];
  for(var i=1;i<p.length;i++) {
    F[i+1]=F[i]+p[i];
  }
  return F;
}


function arithmeticDe() {
  $('#demo').html(arithmeticDecode($('#myText1').val(),$('#myWindow1').val()));
}

function arithmeticDecode(string,w) {
    var code="";
    return code;
  }
