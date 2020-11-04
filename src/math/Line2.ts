import Vector2 from './Vector2'

/**
 * Class representing a 2D line.
 * A 2D line is a segment between two points in a 2d plane.
 *
 * This file is part of the GameIndus engine.
 *
 * @copyright Copyright (c) 2019, Maxime Malgorn
 * @author Maxime Malgorn <maxime.malgorn@laposte.net>
 * @since 2.0.0
 */
export default class Line2 {
    /**
     * Represents the starting point of the line
     */
    public begin: Vector2

    /**
     * Represents the ending point of the line
     */
    public end: Vector2

    /**
     * Construct a 2d line
     * @param begin Starting point of the line
     * @param end Ending point of the line
     */
    constructor(begin?: Vector2, end?: Vector2) {
        this.begin = begin || Vector2.Zero
        this.end = end || Vector2.Zero
    }

    /**
     * Return the length of the line segment in pixels
     */
    public get length(): number {
        return this.begin.distance(this.end)
    }

    /**
     * Return the slope of this line.
     * Its a number that describes both the direction and the steepness of the line.
     * @see https://en.wikipedia.org/wiki/Slope
     */
    public get slope(): number {
        return (this.end.y - this.begin.y) / (this.end.x - this.begin.x)
    }

    /**
     * Return the slope of the line in the form of a vector
     */
    public get slopeVector(): Vector2 {
        return this.end
            .clone()
            .sub(this.begin)
            .scale(1 / this.length)
    }

    /**
     * Return the y-value of the point where it crosses the y-axis for a line.
     * @see https://www.mathopenref.com/coordintercept.html
     */
    public get intercept(): number {
        return this.begin.y - this.slope * this.begin.x
    }

    /**
     * Find the distance from the line to a point.
     * @see https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
     * @param point Point to check the distance with.
     */
    public distanceToPoint(point: Vector2): number {
        const dx = this.end.x - this.begin.x
        const dy = this.end.y - this.begin.y
        const factor = this.end.x * this.begin.y - this.end.y * this.begin.x
        return Math.abs(dy * point.x - dx * point.y + factor) / this.length
    }

    /**
     * Find a point on the line given a X value.
     * @param x The known X value of the target point.
     * @return A new point found on the line with a calculated Y.
     */
    public findPointAtX(x: number): Vector2 {
        return new Vector2(x, this.slope * x + this.intercept)
    }

    /**
     * Find a point on the line given a Y value.
     * @param y The known Y value of the target point.
     * @return A new point found on the line with a calculated X.
     */
    public findPointAtY(y: number): Vector2 {
        return new Vector2((y - this.intercept) / this.slope, y)
    }
}
