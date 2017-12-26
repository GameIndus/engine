class Polygon {

    public constructor(points?: Point[]) {
        if (points) this.setTo(points);
    }

    private _area: number;

    public get area(): number {
        return this._area;
    }

    private _points: Point[];

    public get points(): Point[] {
        return this._points;
    }


    public contains(x: number, y: number): boolean {
        let inside = false;

        for (var i = -1, j = this._points.length - 1; ++i < this._points.length; j = i) {
            let ix = this._points[i].x;
            let iy = this._points[i].y;

            let jx = this._points[j].x;
            let jy = this._points[j].y;

            if (((iy <= y && y < jy) || (jy <= y && y < iy)) && (x < (jx - ix) * (y - iy) / (jy - iy) + ix))
                inside = !inside;
        }

        return inside;
    }

    private setTo(points: Point[]): Polygon {

        this._area = 0;
        this._points = [];

        // Calculate the lowest Y boundary
        let lowY = Number.MAX_VALUE;

        for (let i = 0; i < points.length; i++) {
            let p = points[i];

            this._points.push(p);
            if (p.y < lowY) lowY = p.y;
        }

        // Calculate area of the polygon
        this.calculateArea(lowY);

        return this;
    }

    private calculateArea(lowY: number): number {
        let p1: Point;
        let p2: Point;
        let avgHeight: number;
        let width: number;

        for (let i = 0, len = this.points.length; i < len; i++) {

            p1 = this.points[i];

            if (i == len - 1) p2 = this.points[0];
            else p2 = this.points[i + 1];

            avgHeight = ((p1.y - lowY) + (p2.y - lowY)) / 2;
            width = p1.x - p2.x;

            this._area += avgHeight * width;
        }

        return this.area;
    }

}