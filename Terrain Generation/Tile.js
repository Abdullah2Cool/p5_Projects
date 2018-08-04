class Tile {
    constructor(x, y, size, data) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = data.color;
        this.type = data.type;
    }

    show() {
        fill(this.color);
        rect(this.x * this.size, this.y * this.size, this.size, this.size);
    }

    setData(data) {
        this.color = data.color;
        this.type = data.type;
    }

}