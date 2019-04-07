import MathUtil from "../../utils/Math";
import Point from "../Point";
import Position from "../Position";
import Rectangle, {RectanglePosition, RectangleSize} from "../Rectangle";
import {ComplexShape} from "../Shape";

export default class Star implements ComplexShape {

    private static readonly MAX_SPIKES = 5000;

    private readonly _radiusFraction: number;

    private _points: Point[] = [];

    private _spikes: number;

    private _lastSize: RectangleSize;

    private _lastPosition?: Position;

    private _lastSpikes?: number;

    public constructor(spikes?: number, radiusFraction?: number) {
        this._spikes = spikes || 5;
        this._spikes = MathUtil.clamp(this._spikes, 2, Star.MAX_SPIKES);
        this._radiusFraction = radiusFraction || 0.5;

        this._lastSpikes = this._spikes;
        this._lastSize = {width: 0, height: 0};
    }

    public get points(): Point[] {
        return this._points;
    }

    public get spikes(): number {
        return this._spikes;
    }

    public set spikes(spikes: number) {
        this._spikes = spikes;
    }

    public calculatePoints(position: Position, size: RectangleSize): Point[] {
        if (position.equals(this._lastPosition)
            && size.width === this._lastSize.width && size.height === this._lastSize.height
            && this._spikes === this._lastSpikes) {
            return this._points;
        }

        const points: Point[] = [];

        const rect: Rectangle = new Rectangle(position.x, position.y, size.width, size.height);
        const center: Point = rect.getPoint(RectanglePosition.CENTER);

        const len: number = Math.min(size.width, size.height);
        let rot: number = Math.PI / 2 * 3;
        const step: number = Math.PI / this.spikes;

        for (let i = 0; i < this.spikes; i++) {
            // Outer spike point
            points.push(new Point(
                position.x + Math.cos(rot) * len,
                position.y + Math.sin(rot) * len,
            ));
            rot += step;

            // Inner spike point
            points.push(new Point(
                position.x + Math.cos(rot) * len * this._radiusFraction,
                position.y + Math.sin(rot) * len * this._radiusFraction,
            ));
            rot += step;
        }

        // Temp variables
        this._lastPosition = position.clone();
        this._lastSize.width = size.width;
        this._lastSize.height = size.height;
        this._lastSpikes = this.spikes;

        this._points = points;
        return points;
    }

}
