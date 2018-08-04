"use strict";

let aspectRatio = 2.0 / 3.0;

let Grid = [];
let scale, rows, cols;
let maxDistance = -1;

let obstacleRate = 0.35;
let bDiagonals = false;
let bFound = false;
let nLateralCost = 1;
let nDiagonalCost = 4;
let start, end;
let openList = [], closedList = [], finalPath = [], currentNeighbors = [];
let speed = 2;
let ctrl = false;
let control = 1;
let at_the_moment = 0;


function setup() {
    let div = document.getElementById("path_finder");
    let w = floor(div.clientWidth);
    let canvas = createCanvas(w - 32, floor(w * aspectRatio) - 32);
    canvas.parent("path_finder");

    scale = floor(width / height * 9);
    cols = floor(width / scale) - 2;
    rows = floor(cols * aspectRatio) - 1;


    for (let y = 0; y < rows; y++) {
        Grid[y] = [];
        for (let x = 0; x < cols; x++) {
            Grid[y][x] = new Cell(x, y, scale);
            // if (noise(x / 50, y / 50) < obstacleRate) Grid[y][x].bObstacle = true;
        }
    }

    start = Grid[0][0];
    end = Grid[rows - 1][cols - 1];

    start.bObstacle = false;
    end.bObstacle = false;
    openList.push(start);
    calcHeuristics();

}

function draw() {
    background(255);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            Grid[y][x].show();
        }
    }

    noStroke();

    openList.forEach(function (o) {
        fill(252, 163, 17);
        rect(o.x * scale, o.y * scale, scale, scale);
    });

    closedList.forEach(function (o) {
        fill(229);
        rect(o.x * scale, o.y * scale, scale, scale);
    });

    currentNeighbors.forEach(function (o) {
        fill(255, 255, 0);
        rect(o.x * scale, o.y * scale, scale, scale);
    });

    fill(100, 255, 255);
    rect(start.x * scale, start.y * scale, scale, scale);
    fill(0, 255, 0);
    rect(end.x * scale, end.y * scale, scale, scale);

    if (openList.length !== 0) {
        for (let i = 0; i < speed; i++) {
            // if (at_the_moment < control) {
            if (openList.length === 0) break;
            if (!bFound) {
                findPath()
            }
            //     at_the_moment++;
            // }
        }
        if (bFound) {
            finalPath.forEach(function (o) {
                fill(255, 0, 255);
                rect(o.x * scale, o.y * scale, scale, scale)
            });
        }
    } else {
        console.log("No Solution");
    }


    if (keyIsDown(87)) {
        control++;
    }

    ctrl = keyIsDown(17);
}

function mouseClicked() {
    if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        let x = floor(mouseX / scale);
        let y = floor(mouseY / scale);
        end = Grid[y][x];
        reset();
    }
}

function mouseDragged() {
    if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        let x = floor(mouseX / scale);
        let y = floor(mouseY / scale);
        Grid[y][x].bObstacle = !ctrl;
        reset();
    }
}


function keyPressed() {
    control++;
}

function keyReleased() {
    if (keyCode === 82) {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // Grid[y][x].bObstacle = (noise((x + random(-5, 5)) / 8, (y + random(-5, 5)) / 8) < obstacleRate);
                Grid[y][x].bObstacle = (noise(x + random(1), y + random(1)) < obstacleRate);
            }
        }
        reset();
    }
    if (keyCode === 67) {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                Grid[y][x].bObstacle = false;
            }
        }
        reset();
    }
}

function reset() {
    openList.splice(0, openList.length);
    closedList.splice(0, closedList.length);
    finalPath.splice(0, finalPath.length);
    currentNeighbors.splice(0, currentNeighbors.length);
    bFound = false;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            Grid[y][x].reset();
        }
    }

    start = Grid[0][0];
    Grid[start.y][start.x + 1].bObstacle = false;
    Grid[start.y + 1][start.x + 1].bObstacle = false;
    Grid[start.y + 1][start.x].bObstacle = false;
    start.bObstacle = false;
    end.bObstacle = false;

    start.nG = 0;
    calcHeuristics();
    openList.push(start);
}


function calcHeuristics() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let cell = Grid[y][x];
            let d = pow(cell.x - end.x, 2) + pow(cell.y - end.y, 2);
            cell.h = d;
            if (d > maxDistance) {
                maxDistance = d;
            }
        }
    }
    // for (let y = 0; y < rows; y++) {
    //     for (let x = 0; x < cols; x++) {
    //         let cell = Grid[y][x];
    //         cell.color = color(50 - cell.h / maxDistance * 255);
    //     }
    // }
}

function findPath() {
    let current = openList[0];
    let currentIndex = 0;

    for (let i = 0; i < openList.length; i++) {
        let o = openList[i];
        if (o.f < current.f) {
            current = o;
            currentIndex = i;
        }
    }

    // console.log(`Current: (${current.x} , ${current.y})`);

    if (current === end) {
        bFound = true;
        showPath(current);
        return
    }

    closedList.push(current);
    openList.splice(currentIndex, 1);

    if (current.neighbors.length === 0) {
        let n = getNeighbors(current);
        current.neighbors = n;
        currentNeighbors = n;
    }
    current.neighbors.forEach(function (n) {

    });

    for (let i = 0; i < current.neighbors.length; i++) {
        let n = current.neighbors[i];

        if (closedList.includes(n)) {
            // already checked
            continue;
        }

        if (!openList.includes(n)) {
            openList.push(n);
        }

        if (n.parentCell === null) {
            n.parentCell = current;
            if (n.x !== current.x && n.y !== current.y) {
                n.nG = current.nG + nDiagonalCost;
            } else {
                n.nG = current.nG + nLateralCost;
            }
        }


        let tempG = current.nG + nLateralCost;
        if (n.x !== current.x && n.y !== current.y) {
            tempG = current.nG + nDiagonalCost;
        }
        if (tempG < n.nG) {
            n.parent = current;
            n.nG = tempG;
//                println("Changed Parent")
//                println("Current: (${current.x} , ${current.y}) Neighbor: (${n.x} , ${n.y})")
        }
        // if (tempG > n.nG) continue;


        // This path is the best until now. Record it!
    }
//        }
}


function getNeighbors(myCell) {
    let n = [];
    if (myCell.bObstacle) return n;
    let x = myCell.x;
    let y = myCell.y;

    let up = y - 1;
    let down = y + 1;
    let left = x - 1;
    let right = x + 1;

    let UP = (up >= 0);
    let DOWN = (down <= rows - 1);
    let LEFT = (left >= 0);
    let RIGHT = (right <= cols - 1);

    // console.table({UP: UP, DOWN: DOWN, LEFT: LEFT, RIGHT: RIGHT});

    if (LEFT) {
        if (!Grid[y][left].bObstacle) n.push(Grid[y][left]);
        // console.log(`Left: (${x - 1} , ${y})`)
    }
    if (RIGHT) {
        if (!Grid[y][right].bObstacle) n.push(Grid[y][right]);
        // console.log(`Right: (${x + 1} , ${y})`)
    }
    if (UP) {
        if (!Grid[up][x].bObstacle) n.push(Grid[up][x]);
        // console.log(`Up: (${x} , ${y - 1})`)
    }
    if (DOWN) {
        if (!Grid[down][x].bObstacle) n.push(Grid[down][x]);
        // console.log(`Down: (${x} , ${y + 1})`)
    }
    if (bDiagonals) {
        if (UP && LEFT) {
            if (!Grid[up][left].bObstacle) n.push(Grid[up][left]);
            // console.log(`Up-Left: (${x - 1} , ${y - 1})`)
        }
        if (UP && RIGHT) {
            if (!Grid[up][right].bObstacle) n.push(Grid[up][right]);
            // console.log(`Up-Right: (${x + 1} , ${y - 1})`)
        }

        if (DOWN && LEFT) {
            if (!Grid[down][left].bObstacle) n.push(Grid[down][left]);
            // console.log(`Down-Left: (${x - 1} , ${y + 1})`)
        }
        if (DOWN && RIGHT) {
            if (!Grid[down][right].bObstacle) n.push(Grid[down][right]);
            // console.log(`Down-Right: (${x + 1} , ${y + 1})`)
        }
    }

    return n
}

function showPath(s) {
    let t = s.parentCell;
    console.log("Path Found");
    while (t !== start) {
        finalPath.push(t);
        t = t.parentCell;
    }
}

function windowResized() {
    let div = document.getElementById("path_finder");
    let w = floor(div.clientWidth);
    resizeCanvas(w - 32, floor(w * aspectRatio) - 32);
}