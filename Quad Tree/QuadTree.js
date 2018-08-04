class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;

        this.points = [];
        this.NE = null;
        this.NW = null;
        this.SE = null;
        this.SW = null;
        this.bDivided = false;
    }

    insert(p) {
        if (!this.boundary.contains(p)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(p);
            return true;
        } else {
            if (this.bDivided === false) {
                this.subdivide();
                this.bDivided = true;
            }
            if (this.NE.insert(p)) return true;
            if (this.NW.insert(p)) return true;
            if (this.SE.insert(p)) return true;
            if (this.SW.insert(p)) return true;
        }
        return true;

    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        this.NE = new QuadTree(new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2), this.capacity);
        this.NW = new QuadTree(new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2), this.capacity);

        this.SE = new QuadTree(new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2), this.capacity);
        this.SW = new QuadTree(new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2), this.capacity);
    }

    query(range, found) {
        if (!this.boundary.intersects(range)) {
            return found;
        } else {
            for (let i = 0; i < this.points.length; i++) {
                let pt = this.points[i];
                if (range.contains(pt)) {
                    found.push(pt);
                }
            }
            if (this.bDivided) {
                this.NE.query(range, found);
                this.NW.query(range, found);
                this.SE.query(range, found);
                this.SW.query(range, found);
            }

            return found;
        }
    }

    reset() {
        this.points.splice(0, this.points.length);
        if (this.bDivided) {
            this.NE.reset();
            this.NW.reset();
            this.SE.reset();
            this.SW.reset();
        }
        this.bDivided = false;
    }

    show () {
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        if (this.bDivided) {
            this.NE.show();
            this.NW.show();
            this.SE.show();
            this.SW.show();
        }
    }

}