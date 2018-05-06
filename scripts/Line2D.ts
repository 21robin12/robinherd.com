class Line2D {

    private a: number;
    private b: number;
    private c: number;

    constructor(p1: Point2D, p2: Point2D) {
        // y = mx + c
        var m = (p2.y - p1.y) / (p2.x - p1.y);
        var c = p2.y - (m * p2.x);

        // y = mx + c
        // 0 = mx + c - y
        // 0 = ax + c + by "standard form"
        this.a = m;
        this.b = -1;
        this.c = c;
    }

    public distanceTo(p: Point2D) {
        return Math.abs(this.a * p.x + this.b * p.y + this.c) / Math.sqrt(this.a * this.a + this.b * this.b);
    }
}