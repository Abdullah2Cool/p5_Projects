"use-strict";

let aspectRatio = 2.0 / 3.0;

let Grid = [];
let scale;
let cols, rows;
let resolution;
let sampleSize;
let xOff = 100000;
let yOff = 100000;
let angle = 0;
let speed = 1;
let player;
let up, down, left, right;
let changes = {};
let ctrl = false;

function setup() {
    let div = document.getElementById("terrain_generation");
    let w = floor(div.clientWidth);
    let canvas = createCanvas(w - 16, floor(w * aspectRatio) - 16);
    canvas.parent("terrain_generation");

    scale = floor(width / height * 9);
    cols = floor(width / scale) + 1;
    rows = floor(cols * aspectRatio);

    sampleSize = scale * 2;
    resolution = 170;

    for (let y = 0; y < rows; y++) {
        Grid[y] = [];
        for (let x = 0; x < cols; x++) {
            Grid[y][x] = new Tile(x, y, scale, getData(x, y));
        }
    }

    player = new Player(Grid[floor(rows / 2)][floor(cols / 2)].x, Grid[floor(rows / 2)][floor(cols / 2)].y, scale, scale * 2);
    // smooth()
}


function draw() {
    background(51);
    noStroke();


    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            Grid[y][x].setData(getData(x + xOff, y + yOff));
        }
    }

    let offset = floor(player.length / scale);
    up = checkMove(0, offset);
    down = checkMove(1, offset);
    left = checkMove(2, offset);
    right = checkMove(3, offset);

    if (keyIsDown(65) && left) {
        xOff -= speed;
    } else if (keyIsDown(68) && right) {
        xOff += speed;
    } else if (keyIsDown(87) && up) {
        yOff -= speed;
    } else if (keyIsDown(83) && down) {
        yOff += speed;
    }

    angle += 0.002;
    resolution = sin(angle) * 255 + 80;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            Grid[y][x].show();
        }
    }

    // fill(0);
    // text(frameRate(), 10, 10, 100, 100);

    ctrl = keyIsDown(17);

    player.show();
}

function mouseDragged() {
    if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        let mX = floor(mouseX / scale);
        let mY = floor(mouseY / scale);

        console.log(mX + ", " + mY);
        let key = getKey(Grid[mY][mX].x + xOff, Grid[mY][mX].y + yOff);
        if (!ctrl) {
            changes[key] = 1;
        } else {
            delete changes[key]
        }
    }
}

function getData(x, y) {

    if (changes[getKey(x, y)]) return {type: 3, color: color(255, 0, 255)};

    let n = noise(x / sampleSize, y / sampleSize) * 255;
    let type = 0;
    let c = color(255, 0, 255);


    if (n < 80) {
        c = getColor(n, 0, 102, 255);
        type = 3
    } else {
        c = getColor(n, 51, 204, 51);
    }

    return {type: type, color: c};

}


function getColor(n, r, g, b) {
    let t = n - (n % resolution);
    let depth = 100;
    let u = (n / depth);
    return color(r * u + t, g * u + t, b * u + t);
}

function checkMove(dir, offset) {

    if (dir === 0) { // up
        let nCount = 0;
        for (let j = 0; j < offset; j++) {
            let x = player.x + j;
            let y = player.y - 1;
            if (!isMovable(x, y)) {
                Grid[y][x].color = color(255, 0, 0);
                nCount++
            }
        }
        return nCount === 0;
    }

    if (dir === 1) { // down
        let nCount = 0;
        for (let j = 0; j < offset; j++) {
            let x = player.x + j;
            let y = player.y + offset;
            if (!isMovable(x, y)) {
                Grid[y][x].color = color(255, 0, 0);
                nCount++
            }
        }
        return nCount === 0;
    }

    if (dir === 2) { // left
        let nCount = 0;
        for (let j = 0; j < offset; j++) {
            let x = player.x - 1;
            let y = player.y + j;
            if (!isMovable(x, y)) {
                Grid[y][x].color = color(255, 0, 0);
                nCount++
            }
        }
        return nCount === 0;

    }

    if (dir === 3) { // right
        let nCount = 0;
        for (let j = 0; j < offset; j++) {
            let x = player.x + offset;
            let y = player.y + j;
            if (!isMovable(x, y)) {
                Grid[y][x].color = color(255, 0, 0);
                nCount++
            }
        }
        return nCount === 0;
    }
}

function isMovable(x, y) {
    return Grid[y][x].type !== 3;
}

function getKey(x, y) {
    return x + "." + y;
}

function windowResized() {
    let div = document.getElementById("terrain_generation");
    let w = div.clientWidth;
    resizeCanvas(w - 16, w * aspectRatio - 16);
}
