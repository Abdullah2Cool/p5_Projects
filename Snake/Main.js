"use-strict";

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let aspectRatio = 2.0 / 3.0;
let scale, speed = 5;
let tail = [];
let tailSize = 0, foodValue = 4;

let snakeX, snakeY, pSnakeX, pSnakeY, dir;
let foodX, foodY;

let snakeColor, foodColor, tailColor;

function setup() {
    let div = document.getElementById("snake");
    let w = floor(div.clientWidth);
    let canvas = createCanvas(w - 32, floor(w * aspectRatio) - 32);
    canvas.parent("snake");

    scale = floor(width / height * 12);
    snakeX = 4;
    snakeY = 4;
    dir = 1;
    foodX = floor(random(scale, width) / scale) - 1;
    foodY = floor(random(scale, height) / scale) - 1;

    snakeColor = color(0, 255, 0);
    foodColor = color(255, 0, 0);
    tailColor = color(random(255), random(255), random(255));

    noStroke();
}

function draw() {
    background(51);

    // draw the tail
    for (let i = 0; i < tail.length; i++) {
        let p = tail[i];
        // fill(tailColor * i / tailSize);
        fill(red(tailColor) * i / tailSize + 80, green(tailColor) * i / tailSize + 80, blue(tailColor) * i / tailSize + 80);
        rect(p.x * scale, p.y * scale, scale, scale);
    }

    // draw the food
    fill(foodColor);
    rect(foodX * scale, foodY * scale, scale, scale);

    //draw snakeHead
    fill(snakeColor);
    rect(snakeX * scale, snakeY * scale, scale, scale);

    if (frameCount % speed === 0) {
        // wrap around walls
        if (snakeX > width / scale) snakeX = 0;
        if (snakeX < 0) snakeX = floor(width / scale);
        if (snakeY > height / scale) snakeY = 0;
        if (snakeY < 0) snakeY = floor(height / scale);

        pSnakeX = snakeX;
        pSnakeY = snakeY;

        while (tail.length < tailSize) {
            tail.push(new Pair(pSnakeX, pSnakeY));
        }

        if (dir === 0) {
            snakeY--;
        } else if (dir === 1) {
            snakeY++;
        } else if (dir === 2) {
            snakeX--;
        } else if (dir === 3) {
            snakeX++;
        }

        if (tail.length > 0) {
            let pX, pY;
            pX = pSnakeX;
            pY = pSnakeY;
            for (let i = tail.length - 1; i >= 0; i--) {
                let current = tail[i];
                let ppx = current.x;
                let ppy = current.y;
                current.x = pX;
                current.y = pY;
                pX = ppx;
                pY = ppy;
            }
        }

        for (let i = tail.length - 1; i >= 0; i--) {
            let p = tail[i];
            // hitting yourself
            if (snakeX === p.x && snakeY === p.y) {
                tailColor = color(random(255), random(255), random(255));
                tail.splice(0, i);
                tailSize = tail.length;
                break;
            }
        }

        // grab food
        if (floor(snakeX) === floor(foodX) && floor(snakeY) === floor(foodY)) {
            tailSize += foodValue;
            foodX = floor(random(scale, width) / scale) - 1;
            foodY = floor(random(scale, height) / scale) - 1;
        }
    }
}

function keyPressed() {
    if (key === "W" && dir !== 1) {
        dir = 0;
    } else if (key === "S" && dir !== 0) {
        dir = 1;
    } else if (key === "A" && dir !== 3) {
        dir = 2;
    } else if (key === "D" && dir !== 2) {
        dir = 3;
    }
}

function windowResized() {
    let div = document.getElementById("snake");
    let w = floor(div.clientWidth);
    resizeCanvas(w - 32, floor(w * aspectRatio) - 32);
}