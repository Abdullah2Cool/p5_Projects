class Point {
    constructor(x, y, radius) {
        this.position = createVector(x, y);
        this.velocity = createVector(random(-5, 5), random(-5, 5));
        this.radius = radius;
        this.color = color(random(255), random(255), random(255), 100);
        this.r = random(255);
        this.g = random(255);
        this.b = random(255);
    }

    show() {
        noStroke();
        fill(255);
        ellipse(this.position.x, this.position.y, this.radius, this.radius);
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    }

    update() {
        this.velocity.limit(4);
        this.position.add(this.velocity);

        if (this.position.x > width) {
            this.velocity.x *= -1;
            // this.position.x = 0;
        } else if (this.position.x < 0) {
            this.velocity.x *= -1;
            // this.position.x = width;
        } else if (this.position.y > height) {
            this.velocity.y *= -1;
            // this.position.y = 0;
        } else if (this.position.y < 0) {
            this.velocity.y *= -1;
            // this.position.y = height;
        }
    }

    collide(other) {
        let dx = other.position.x - this.position.x;
        let dy = other.position.y - this.position.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = other.radius + this.radius;
        if (distance < minDist) {
            let angle = atan2(dy, dx);
            let targetX = this.position.x + cos(angle) * minDist;
            let targetY = this.position.y + sin(angle) * minDist;
            let ax = (targetX - other.position.x) * 0.8;
            let ay = (targetY - other.position.y) * 0.8;
            this.velocity.x -= ax;
            this.velocity.y -= ay;
            other.velocity.x += ax;
            other.velocity.y += ay;
        }
    }
}