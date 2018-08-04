class Player {
    constructor(x, y, size, length) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.length = length;
    }

    show() {
        fill(0, 0, 0);
        rect(this.x * this.size, this.y * this.size, this.length, this.length);
    }
}