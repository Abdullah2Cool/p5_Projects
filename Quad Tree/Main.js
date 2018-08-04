"use-strict";

let aspectRatio = 2.0 / 3.0;

let boundary;
let qt;
let allPoints = [];
let searchRange;
let rangePoints = [];
let bShowBackground = true;
let bShowTree = false;
let bDrawRange = false;

function setup() {
    let div = document.getElementById("quad_tree");
    let w = floor(div.clientWidth);
    let canvas = createCanvas(w - 32, floor(w * aspectRatio) - 32);
    canvas.parent("quad_tree");

    boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    qt = new QuadTree(boundary, 4);

    for (let i = 0; i < 500; i++) {
        let pt = new Point(random(width), random(height), random(2, 5));
        allPoints.push(pt);
    }

    searchRange = new Rectangle(0, 0, boundary.w / 10, boundary.h / 10);

}

function draw() {
    if (bShowBackground) background(51);

    for (let i = 0; i < allPoints.length; i++) {
        let pt = allPoints[i];
        qt.insert(pt);
        pt.update();
        pt.show();
    }

    for (let i = 0; i < allPoints.length; i++) {
        let pt = allPoints[i];
        searchRange.x = pt.position.x;
        searchRange.y = pt.position.y;
        let otherPoints = qt.query(searchRange, []);
        for (let j = 0; j < otherPoints.length; j++) {
            let other = otherPoints[j];
            if (pt !== other) {
                pt.collide(other);
            }
        }
    }

    if (bDrawRange) {
        bShowBackground = true;
        drawRange();
    }

    // fill(255);
    // textSize(20);
    // text(frameRate(), 60, 60, 60, 60);


    // console.log(frameRate())

    if (bShowTree) {
        bShowBackground = true;
        qt.show();
    }
    qt.reset();
}

function drawRange() {
    searchRange.x = mouseX;
    searchRange.y = mouseY;

    rangePoints = qt.query(searchRange, []);

    for (let i = 0; i < rangePoints.length; i++) {
        let pt = rangePoints[i];
        fill(0, 255, 0);
        ellipse(pt.position.x, pt.position.y, pt.radius * 2, pt.radius * 2);
    }

    rectMode(CENTER);
    stroke(0, 255, 0);
    noFill();
    rect(searchRange.x, searchRange.y, searchRange.w * 2, searchRange.h * 2);
}

function keyPressed() {
    if (key === "B") {
        bShowBackground = !(bShowBackground);
    }
    if (key === "T") {
        bShowTree = !(bShowTree);
    }
    if (key === "R") {
        bDrawRange = !(bDrawRange);
    }
}

function windowResized() {
    let div = document.getElementById("quad_tree");
    let w = floor(div.clientWidth);
    resizeCanvas(w - 32, floor(w * aspectRatio) - 32);
}