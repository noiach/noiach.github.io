// Simulates coral growth
// Code re-implemented from C to Javascript by noiach, 2017
// Original license:

/* coral, by "Frederick G.M. Roeber" <roeber@netscape.com>, 15-jul-97.
 *
 * Permission to use, copy, modify, distribute, and sell this software and its
 * documentation for any purpose is hereby granted without fee, provided that
 * the above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation.  No representations are made about the suitability of this
 * software for any purpose.  It is provided "as is" without express or 
 * implied warranty.
 */

var R = function (n) {
    var r = Math.floor(Math.random() * n);
    return r;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function transition(index, p, n, c) {
    p = Math.min(p, 1);
    var r = 0;
    var x = Math.floor((n - 1) * 0.99999999 * (1 - p));
    var np = (0.99999999 * p * (n - 1)) % 1;
    return Math.floor(c[x][index] * np + c[x + 1][index] * (1 - np));
}

Hack.prototype.getPixel = function (x, y) {
    cell = Math.floor((y * this.width + x) / this.cs);
    bit = (y * this.width + x) - cell * this.cs;
    return (this.cells[cell] & (2 << bit)) > 0;
}
Hack.prototype.getAlive = function (x, y) {
    cell = Math.floor((y * this.width + x) / this.cs);
    bit = (y * this.width + x) - cell * this.cs;
    return (this.coloredCells[cell] & (2 << bit)) > 0;
}
Hack.prototype.setPixel = function (x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) { } else {
        //this.cells[x][y] = 1;
        cell = Math.floor((y * this.width + x) / this.cs);
        bit = (y * this.width + x) - cell * this.cs;
        this.cells[cell] |= (2 << bit);
    }
}
Hack.prototype.setAlive = function (x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

    cell = Math.floor((y * this.width + x) / this.cs);
    bit = (y * this.width + x) - cell * this.cs;
    this.coloredCells[cell] |= (2 << bit);
}
Hack.prototype.drawPixel = function (x, y) {
    this.drawn++;
    /*
    var id = this.context.createImageData(1,1); // only do this once per page
    var d  = id.data;                        // only do this once per page
    d[0]   = 255;
    d[1]   = 255;
    d[2]   = 9;
    d[3]   = 255;
    this.context.putImageData( id, x, y );   
    */

    this.context.fillStyle = "rgba(" +
        transition(0, this.drawn / this.maxwalkers, this.ncolors, this.colors) + "," +
        transition(1, this.drawn / this.maxwalkers, this.ncolors, this.colors) + "," +
        transition(2, this.drawn / this.maxwalkers, this.ncolors, this.colors) + "," +
        (255 / 255) + ")";
    this.context.fillRect(this.pixel * x, this.pixel * y, this.pixel, this.pixel);
}

Hack.prototype.inBlock = function (x, y) {
    var lh = bitmap.length;
    var lw = bitmap[0].length;
    var ny = y - Math.round((this.canvas.height - lh * this.pixel) / 2 / this.pixel);
    var nx = x - Math.round((this.canvas.width - lw * this.pixel) / 2 / this.pixel);
    if (nx < lw && ny < lh && nx >= 0 && ny >= 0) {
        return bitmap[ny][nx] == 1;
    }
    return false;
}

Hack.prototype.configure = function () {
    config = this.config;
    this.canvas = document.getElementById(config.canvasId);
    this.canvas.width = window.innerWidth + 4;
    this.canvas.height = window.innerHeight + 4;

    this.pixel = this.config.pixel;
    this.height = Math.floor(this.canvas.height / this.pixel);
    this.width = Math.floor(this.canvas.width / this.pixel);

    this.context = this.canvas.getContext('2d');
    this.scaleX = Math.floor(this.canvas.width / this.width);
    this.scaleY = Math.floor(this.canvas.height / this.height);

    // Colors
    this.ncolors = config.colors;
    this.colors = []
    for (var i = 0; i < this.ncolors; i++) {
        a1 = R(256);
        a2 = R(256);
        if (config.density < 100) {
            a3 = Math.floor(255 - (a1 + a2) / 2);
        } else {
            a3 = R(100);
        }
        this.colors[i] = shuffleArray([a1, a2, a3]);

        var cols = document.getElementsByClassName('color-' + i);
        for (let j = 0; j < cols.length; j++) {
            console.log(j);
            cols[j].style.color = 'rgba(' + this.colors[i].join(",") + ")";
            cols[j].style.borderColor = 'rgba(' + this.colors[i].join(",") + ")";
        }
    }
    if (this.ncolors == 1) {
        this.colors[1] = this.colors[0];
    }

    // Density
    this.density = config.density;
    this.total_pixels = (this.width - 2) * (this.height - 2);
    this.nwalkers = Math.floor(this.total_pixels * config.density / 100);
    this.drawn = 0;
    this.maxwalkers = this.nwalkers;
    this.walkers = [];
    for (var i = 0; i < this.nwalkers; i++) {
        this.walkers[i] = {
            x: R(this.width),
            y: R(this.height)
        };
    }

    //cell size
    this.cs = 29
    this.cells = [];
    for (var i = 0; i < (1 + Math.floor(this.height * this.width) / this.cs); i++) {
        this.cells[i] = 0;
    }

    this.coloredCells = [];
    for (var i = 0; i < (1 + Math.floor(this.height * this.width) / this.cs); i++) {
        this.coloredCells[i] = 0;
    }

    this.seeds = config.seeds;
    for (var i = 0; i < this.seeds; i++) {
        var x, y;
        var safe = 0;
        do {
            x = 2 + R(this.width - 2);
            y = 2 + R(this.height - 2);
            safe++;
        } while ((this.getPixel(x, y) || this.inBlock(x, y)) && safe < 100);

        this.setPixel((x - 1), (y - 1));
        this.setPixel(x, (y - 1));
        this.setPixel((x + 1), (y - 1));
        this.setPixel((x - 1), y);
        this.setAlive(x, y);
        this.setPixel((x + 1), y);
        this.setPixel((x - 1), (y + 1));
        this.setPixel(x, (y + 1));
        this.setPixel((x + 1), (y + 1));
        this.drawPixel(x, y);
    }

}

Hack.prototype.restart = function () {
    clearTimeout(hack.timeout);
    clearInterval(hack.interval);
    start();
}

function Hack(config) {
    // Used for lingering
    this.timeout;
    // Used for each frame
    this.interval;
    this.config = config;
}



var t = 0.0;
var m = 1;

var lastLoop = new Date;
var runner = function () {

    if (hack.drawn >= hack.maxwalkers) {
        clearInterval(hack.interval);
        hack.timeout = setTimeout(start, hack.config.linger * 1000);
        return;
    }
    var i = 0;
    for (var i = 0; i < hack.nwalkers; i++) {
        var x = hack.walkers[i].x;
        var y = hack.walkers[i].y;
        var outofbounds = (x <= 0 || x >= hack.width - 1 || y <= 0 || y >= hack.height - 1);
        if (hack.getPixel(x, y) && (!hack.getAlive(x, y) || hack.density < 100) && !outofbounds && !hack.inBlock(x,
            y)) {

            hack.drawPixel(x, y);

            // Mark all the surrounding pixels to become black
            hack.setPixel(x - 1, y - 1);
            hack.setPixel(x, y - 1);
            hack.setPixel(x + 1, y - 1);
            hack.setPixel(x - 1, y);
            hack.setAlive(x, y);
            hack.setPixel(x + 1, y);
            hack.setPixel(x - 1, y + 1);
            hack.setPixel(x, y + 1);
            hack.setPixel(x + 1, y + 1);

            if (hack.density < 100) {
                // One less walker
                hack.nwalkers--;

                // Move last walker to this position
                hack.walkers[i].x = hack.walkers[hack.nwalkers].x;
                hack.walkers[i].y = hack.walkers[hack.nwalkers].y;
            }

        } else {

            do {
                switch (R(4)) {
                    case 0:
                        if (hack.walkers[i].x <= 1) continue;
                        if (hack.inBlock(x - 1, y)) continue;
                        hack.walkers[i].x--;
                        break;
                    case 1:
                        if (hack.walkers[i].x >= (hack.width - 2)) continue;
                        if (hack.inBlock(x + 1, y)) continue;
                        hack.walkers[i].x++;
                        break;
                    case 2:
                        if (hack.walkers[i].y <= 1) continue;
                        if (hack.inBlock(x, y - 1)) continue;
                        hack.walkers[i].y--;
                        break;
                    default:
                        if (hack.walkers[i].y >= (hack.height - 2)) continue;
                        if (hack.inBlock(x, y + 1)) continue;
                        hack.walkers[i].y++;
                        break;
                }
            } while (0);

        }
    }

}

var options = {
    canvasId: 'myCanvas',
    pixel: 3,
    colors: 3,
    density: 30,
    seeds: 40,
    linger: 3,
    background: "#000000",
}


function blockEvent(event) {
    event.stopPropagation();
}


var hack;
window.onload = function () {
    hack = new Hack(options);

    setTimeout(start(), 0);
};

var start = function () {
    // 30 FPS
    hack.configure();
    if ((hack.width < bitmap[0].length || hack.height < bitmap.length) && hack.pixel > 1) {
        options.pixel--;
        hack.configure();
    }
    if ((hack.width < bitmap[0].length || hack.height < bitmap.length) && hack.pixel > 1) {
        options.pixel--;
        hack.configure();
    }
    hack.interval = setInterval(runner, 33);
}