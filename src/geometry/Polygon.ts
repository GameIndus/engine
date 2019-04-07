import Point from "./Point";

export default class Polygon {

    private _area: number;

    private _points: Point[];

    public constructor(points?: Point[]) {
        this._area = 0;
        this._points = [];

        if (points) {
            this.setTo(points);
        }
    }

    public get area(): number {
        return this._area;
    }

    public get points(): Point[] {
        return this._points;
    }

    public contains(x: number, y: number): boolean {
        let inside = false;

        for (let i = -1, j = this._points.length - 1; ++i < this._points.length; j = i) {
            const ix = this._points[i].x;
            const iy = this._points[i].y;

            const jx = this._points[j].x;
            const jy = this._points[j].y;

            if (((iy <= y && y < jy) || (jy <= y && y < iy)) && (x < (jx - ix) * (y - iy) / (jy - iy) + ix)) {
                inside = !inside;
            }
        }

        return inside;
    }

    private setTo(points: Point[]): Polygon {
        this._area = 0;
        this._points = [];

        // Calculate the lowest Y boundary
        let lowY = Number.MAX_VALUE;

        for (const p of points) {
            this._points.push(p);
            if (p.y < lowY) {
                lowY = p.y;
            }
        }

        // Calculate area of the polygon
        this._area = this.calculateArea(lowY);

        return this;
    }

    private calculateArea(lowY: number): number {
        let p1: Point;
        let p2: Point;
        let avgHeight: number;
        let width: number;
        let area: number = 0;

        for (let i = 0, len = this.points.length; i < len; i++) {
            p1 = this.points[i];

            if (i === len - 1) {
                p2 = this.points[0];
            } else {
                p2 = this.points[i + 1];
            }

            avgHeight = ((p1.y - lowY) + (p2.y - lowY)) / 2;
            width = p1.x - p2.x;

            area += avgHeight * width;
        }

        return area;
    }

}
