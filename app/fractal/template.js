// INIT
var unitsize = 480*parseFloat(document.getElementById('tzoom').value)/100;
var bordersize = (480-unitsize)/2;
var squareId;
var functList;
var stage;
var back;

function init() {
unitsize = 480*parseFloat(document.getElementById('tzoom').value)/100;
bordersize = (480-unitsize)/2;
functList = []
squareId = 0;
stage = new Kinetic.Stage({
    container: 'container',
    width: 480,
    height: 480,
});
var blayer = new Kinetic.Layer();
var unit = new Kinetic.Line({
    points: [bordersize, bordersize, bordersize, (unitsize+bordersize), (unitsize+bordersize), (unitsize+bordersize), (unitsize+bordersize), bordersize, bordersize, bordersize],
    stroke: 'black',
    strokeWidth: 2,
    draggable: true,
    dashArray: [10, 10]
});

back = new Kinetic.Rect({
          x: 0,
            y: 0,
            width: 480,
            height: 480,
        });

back.on("mousedown", function() {
  var mouseXY = stage.getPointerPosition();
      var canvasX = mouseXY.x-100;
      var canvasY = mouseXY.y-100;
      newsquare({x:canvasX,y:canvasY});
    makeFunction();
});

blayer.add(unit);
blayer.add(back);
stage.add(blayer);
}
init();

function render(){
  if (document.getElementById("liveP").checked){
  loads = document.getElementById('loads');
  loads.innerHTML='Rendering...';
  rend();
  }
}

function distance(p1, p2) {
        return Math.sqrt( Math.pow( p1.x - p2.x , 2) + Math.pow( p1.y - p2.y,2 ) );
}

/*
function slope(p1, p2) { return (p1.x - p2.x)/(p1.y-p2.y); }
function intercept(slope, p1) { return (p1.y - slope*p1.x);}
function squareCenter(square) {
    var p1 = square.v1.attrs;
    var p2 = square.v3.attrs;
    var p3 = square.v2.attrs;
    var p4 = square.v4.attrs;
    
    var m1 = slope(p1, p2);
    var b1 = intercept(m1, p1);
    var m2 = slope(p3, p4);
    var b2 = intercept(m2, p3);
    var xl = ((b2-b1) / (m1-m2));
    var yl = (m1 * xl + b1 );
    return { x: xl, y:yl }
    return { x: ((b2-b1) / (m1-m2)) , y : m1 * x + b1 }
}
*/

function movevert(vert, xoff,yoff) {
        vert.setX(vert.attrs.x + xoff);
        vert.setY(vert.attrs.y + yoff);
        vert.lastpos = {x:vert.attrs.x+xoff, y:vert.attrs.y+yoff};
}

function rotvert(vert, center, angle) {


        vert.setX(vert.attrs.x + xoff);
        vert.setY(vert.attrs.y + yoff);
        vert.lastpos = {x:vert.attrs.x+xoff, y:vert.attrs.y+yoff};
}

function updateSquare(square) {
        v1x = square.v1.attrs.x - square.attrs.x;
        v1y = square.v1.attrs.y - square.attrs.y;
        v2x = square.v2.attrs.x - square.attrs.x;
        v2y = square.v2.attrs.y - square.attrs.y;
        v3x = square.v3.attrs.x - square.attrs.x;
        v3y = square.v3.attrs.y - square.attrs.y;
        v4x = square.v4.attrs.x - square.attrs.x;
        v4y = square.v4.attrs.y - square.attrs.y;
        square.points([v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y, v1x, v1y]);
}

function makeFunction() {
  ifs=[];
  var totalarea=0;
  var darea=0;
  for (var i=0; i<functList.length;i++) {
    square=functList[i]
  var area = 0.5 * distance(square.v1.attrs, square.v3.attrs)/unitsize * distance(square.v2.attrs, square.v4.attrs)/unitsize;
  totalarea+=area;
  }
  for (var i=0; i<functList.length;i++) {
    square=functList[i]
  v1x = (-bordersize+(square.v1.attrs.x ))/unitsize;
  v1y = ((unitsize+bordersize)-(square.v1.attrs.y ))/unitsize;
  v2x = (-bordersize+(square.v2.attrs.x ))/unitsize;
  v2y = ((unitsize+bordersize)-(square.v2.attrs.y ))/unitsize;
  v3x = (-bordersize+(square.v3.attrs.x ))/unitsize;
  v3y = ((unitsize+bordersize)-(square.v3.attrs.y ))/unitsize;
  v4x = (-bordersize+(square.v4.attrs.x ))/unitsize;
  v4y = ((unitsize+bordersize)-(square.v4.attrs.y ))/unitsize;

  m1x = (v1x-v2x);
  m1y = (v1y - v2y);
  m2x = (v3x-v2x);
  m2y = (v3y - v2y);

  area = (0.5 * distance(square.v1.attrs, square.v3.attrs)/unitsize * distance(square.v2.attrs, square.v4.attrs)/unitsize)/totalarea;
  darea+=area

  //document.getElementById('output').innerHTML =  m2x + ' &nbsp; ' + m1x + ' &nbsp; ' + v2x + '<br /> ' + m2y + ' &nbsp;' + m1y + '&nbsp; ' + v2y;
  f1=[[m2x,m1x],[m2y,m1y]];
  f2=[[v2x],[v2y]];
  ifs.push([f1, f2, area]);
  }
}

function newsquare(p1, p2, p3, p4) {
    if (!p2) {
      p2 = {x: p1.x, y: p1.y+unitsize/2};
      p3 = {x: p1.x+unitsize/2, y: p1.y+unitsize/2};
      p4 = {x: p1.x+unitsize/2, y: p1.y};
    }
    var size = unitsize/2;
    var layer = new Kinetic.Layer();
    var c1 = new Kinetic.Circle(p1);
    var c2 = new Kinetic.Circle(p2);
    var c3 = new Kinetic.Circle(p3);
    var c4 = new Kinetic.Circle(p4);
    verts=[c1,c2,c3,c4]
    for (var i = 0; i < 4; i++) {
        verts[i].radius(12);
        verts[i].stroke('black');
        verts[i].fill('#f38630');
        verts[i].opacity(0.2);
        verts[i].strokeWidth(4);
        verts[i].draggable(true);
        verts[i].listening(true);
        verts[i].lastpos = {x:verts[i].attrs.x, y:verts[i].attrs.y};
        verts[i].anchor=false;
    }
    verts[0].opacity(0.8);
    c1.n1=c4;c1.n2=c2;
    c2.n1=c3;c2.n2=c1;
    c3.n1=c2;c3.n2=c4;
    c4.n1=c1;c4.n2=c3;

        v1x = p1.x - p1.x;
        v1y = p1.y - p1.y;
        v2x = p2.x - p1.x;
        v2y = p2.y - p1.y;
        v3x = p3.x - p1.x;
        v3y = p3.y - p1.y;
        v4x = p4.x - p1.x;
        v4y = p4.y - p1.y;
        pointL = [v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y, v1x, v1y];


    var square = new Kinetic.Line({
        fill: '#4ECDC4',
        points: pointL,
        stroke: 'black',
        draggable: true,
        opacity: 0.9,
        strokeWidth: 8,
        closed: true,
        x: p1.x,
        y: p1.y,
    });
    square.v1 = c1; square.v2 = c2; square.v3 = c3; square.v4 = c4;
    square.lastpos = square.getPosition();
    square.id = squareId;
    square.angle=0;

    layer.add(square);
    layer.add(c1);
    layer.add(c2);
    layer.add(c3);
    layer.add(c4);
    stage.add(layer);
    
    //DRAG SQAURE - UPDATE VERTS
    square.on("dragmove", function() {
        xoff=square.getPosition().x - square.lastpos.x;
        yoff=square.getPosition().y - square.lastpos.y;
        movevert(square.v1, xoff, yoff);
        movevert(square.v2, xoff, yoff);
        movevert(square.v3, xoff, yoff);
        movevert(square.v4, xoff, yoff);


      square.lastpos = square.getPosition();
      layer.moveToTop()
    last = layer;
        sqare.rotate(1);
    });
    square.on("mouseup", function() {
      makeFunction();
      render();
    });
    square.on("mousedown", function() {
      layer.moveToTop()
    last = layer;
    });

    
    //DRAG VERTICE - UPDATE SQUARE
    layer.get('Circle').on("dragmove", function() {

      var toolMenu = document.getElementById("tool-menu");
      var tool = toolMenu.options[toolMenu.selectedIndex].value;
      

      
      if (tool=='scale'){
         lastpos=this.lastpos;

         mx=this.attrs.x-lastpos.x;
         my=this.attrs.y-lastpos.y;
         /*
         mag = distance(this.attrs, lastpos);

         var n2vector={};
         n2vector.theta = square.angle;
         n2vector.mag = Math.cos(square.angle + Math.atan(my/mx))*mag || 0;
         var n1vector={};
         n1vector.theta = Math.PI/2 - square.angle;
         n1vector.mag = Math.sin(square.angle + Math.atan(my/mx))*mag || 0;

         n1vector.y =Math.round(1000*  n1vector.mag*Math.sin(n1vector.theta))/1000;
         n1vector.x = Math.round(1000* n1vector.mag*Math.cos(n1vector.theta))/1000;
         n2vector.y = Math.round(1000 * n2vector.mag*Math.sin(n2vector.theta))/1000;
         n2vector.x = -Math.round(1000* n2vector.mag*Math.cos(n2vector.theta))/1000;
         n1vector={x:0,y:my};
         n2vector={x: mx,y: 0};
          */

         //this.n1.attrs.y += my;
         //this.n2.attrs.x += mx;
         movevert(this.n1, 0,my);
         movevert(this.n2, mx,0);
         this.lastpos={x:this.attrs.x,y:this.attrs.y};
         this.n1.lastpos={x:this.n1.attrs.x,y:this.n1.attrs.y};
      }
      if (tool=='shear'){
         lastpos=this.lastpos;
         my=this.attrs.x-lastpos.x
         mx=this.attrs.y-lastpos.y
         //this.n1.attrs.y += my;
         //this.n2.attrs.x += mx;
         movevert(this.n1, my, 0);
         movevert(this.n2, 0, mx);
         this.lastpos={x:this.attrs.x,y:this.attrs.y};
         this.n1.lastpos={x:this.n1.attrs.x,y:this.n1.attrs.y};
      }
      if (tool=='rotate'){
        if (!this.anchor){this.anchor=this.lastpos}

        var mouseXY = stage.getPointerPosition();
        var mouse = {x: mouseXY.x, y: mouseXY.y};

        var width = distance( square.v2.lastpos, square.v3.lastpos);
        var height = distance( square.v2.lastpos, square.v1.lastpos)
        var center = {x: (width)/2 + square.attrs.x, y: (height)/2 + square.attrs.y};

        var angle = 0, sp = this.lastpos, mp = center;
        var p = mouse;
        var sAngle = Math.atan2((sp.y-mp.y),(sp.x - mp.x));
        var pAngle = Math.atan2((p.y-mp.y),(p.x - mp.x));        

        angle = (pAngle - sAngle) * 180/Math.PI / 100;
        square.angle += angle

        //var angle = distance(this.anchor, mouse) * (Math.PI/180)/20 * direction;

        //Vert 1
        var vert=square.v1
        var x=vert.lastpos.x;
        var y=vert.lastpos.y;
        var newX = center.x + (x-center.x)*Math.cos(angle) - (y-center.y)*Math.sin(angle);
        var newY = center.y + (x-center.x)*Math.sin(angle) + (y-center.y)*Math.cos(angle);
        vert.setX(newX);
        vert.setY(newY);
        vert.lastpos = {x:newX, y:newY};

        //Vert 2
        var vert=square.v2
        var x=vert.lastpos.x;
        var y=vert.lastpos.y;
        var newX = center.x + (x-center.x)*Math.cos(angle) - (y-center.y)*Math.sin(angle);
        var newY = center.y + (x-center.x)*Math.sin(angle) + (y-center.y)*Math.cos(angle);
        vert.setX(newX);
        vert.setY(newY);
        vert.lastpos = {x:newX, y:newY};

        //Vert 3
        var vert=square.v3
        var x=vert.lastpos.x;
        var y=vert.lastpos.y;
        var newX = center.x + (x-center.x)*Math.cos(angle) - (y-center.y)*Math.sin(angle);
        var newY = center.y + (x-center.x)*Math.sin(angle) + (y-center.y)*Math.cos(angle);
        vert.setX(newX);
        vert.setY(newY);
        vert.lastpos = {x:newX, y:newY};

        //Vert 4
        var vert=square.v4
        var x=vert.lastpos.x;
        var y=vert.lastpos.y;
        var newX = center.x + (x-center.x)*Math.cos(angle) - (y-center.y)*Math.sin(angle);
        var newY = center.y + (x-center.x)*Math.sin(angle) + (y-center.y)*Math.cos(angle);
        vert.setX(newX);
        vert.setY(newY);
        vert.lastpos = {x:newX, y:newY};

      }


      updateSquare(square);
      layer.moveToTop();
    last = layer;
    squareId+=1;
    });

    layer.get('Circle').on("mouseup", function() {
      this.anchor=false;
      makeFunction();
      render();
    });
    square.on("mousedown", function() {
      layer.moveToTop()
    last = layer;
    });

    last = layer;
    layer.square=square;
    updateSquare(square);
    functList.push(square);
    return square;
}

//CREATE NEW BOX
//newsquare({x:bordersize+0,y:unitsize/2+bordersize-0},false,false,false);
//newsquare({x:bordersize+110,y:unitsize/2+bordersize-unitsize/2},false,false,false);
//newsquare({x:bordersize+unitsize/2,y:unitsize/2+bordersize-0},false,false,false);
//makeFunction();


window.addEventListener("keydown", checkKeyPressed, false);

function deleter() {
    functList.splice(functList.indexOf(last.square),1);
    last.remove();
    last=false;
    makeFunction();
    render();
}

function checkKeyPressed(e) {
  if (e.keyCode == "8" && last!=false) {
    deleter();
  }
}

function findVert4(v1, v2, v3) {
  xoff = v3.x-v2.x;
  yoff = v3.y-v2.y;
  v4 = { x : v1.x + xoff, y:v1.y + yoff}
  return v4
}

function templ(newIfs) {
  init();
  for (var i=0; i<newIfs.length; i++) {
    fn = newIfs[i];
    v2 = {x: (parseFloat(fn[1][0]))*unitsize + bordersize, y: unitsize-((parseFloat(fn[1][1]))*unitsize - bordersize )};
    v3 = {x: (parseFloat(fn[0][0][0]) + parseFloat(fn[1][0]))*unitsize + bordersize, y:unitsize - ( (parseFloat(fn[0][1][0]) +parseFloat(fn[1][1]))*unitsize - bordersize)};
    v1 = {x: (parseFloat(fn[0][0][1]) + parseFloat(fn[1][0]))*unitsize + bordersize, y: unitsize - ((parseFloat(fn[0][1][1]) +parseFloat(fn[1][1]))*unitsize - bordersize)};
    v4 = findVert4(v1, v2, v3);
    sq = newsquare(v1,v2,v3,v4);
  }
  ifs=newIfs;
  rend();
}
templ(ifs);
