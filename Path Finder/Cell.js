class Cell {
    constructor(x, y, size) {
        this.nG = 0;
        this.h = 0;
        this.f = 0;
        this.x = x;
        this.y = y;
        this.size = size;
        this.neighbors = [];
        this.bObstacle = false;
        this.parentCell = null;
        this.color = color(39, 37, 38);
    }

    show() {
        if (this.bObstacle) {
            fill(242, 1, 10);
        } else {
            // noFill();
            fill(this.color);
        }
        rect(this.x * this.size, this.y * this.size, this.size, this.size);
        this.f = this.nG + this.h;
    }

    reset() {
        this.nG = 0;
        this.f = 0;
        this.h = 0;
        this.parentCell = null;
        this.neighbors.splice(0, this.neighbors.length);
    }
}