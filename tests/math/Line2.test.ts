/**
 * Unit test suite for Line2 class.
 *
 * This file is part of the GameIndus engine.
 * This file is used by Jest to test the engine.
 *
 * @copyright Copyright (c) 2019, Maxime Malgorn
 * @author Maxime Malgorn <maxime.malgorn@laposte.net>
 * @since 2.0.0
 */

import Line2 from "../../src/math/Line2";
import Vector2 from "../../src/math/Vector2";

const beginX = 10;
const beginY = 15;
const endX = 30;
const endY = 40;

let line: Line2;

beforeEach(() => {
    line = new Line2(new Vector2(beginX, beginY), new Vector2(endX, endY));
});

test("should create a valid line", () => {
    expect(line.begin.x).toBe(beginX);
    expect(line.begin.y).toBe(beginY);
    expect(line.end.x).toBe(endX);
    expect(line.end.y).toBe(endY);

    const emptyLine = new Line2();
    expect(emptyLine.begin.x).toBe(0);
    expect(emptyLine.begin.y).toBe(0);
    expect(emptyLine.end.y).toBe(0);
    expect(emptyLine.end.y).toBe(0);
});

test("should calculate the slope", () => {
    expect(line.slope).toBe(1.25);
    expect(line.slopeVector.x).toBeCloseTo(0.62);
    expect(line.slopeVector.y).toBeCloseTo(0.78);
});

test("should calculate the intercept", () => {
    expect(line.intercept).toBe(2.5);
});

test("should calculate the distance to a point", () => {
    const point = new Vector2(30, 50);
    expect(line.distanceToPoint(point)).toBeCloseTo(6.25);
});

test("should find a point on a line", () => {
    const pointA = line.findPointAtX(20);
    const pointB = line.findPointAtY(30);

    expect(pointA.x).toBe(20);
    expect(pointA.y).toBe(27.5);
    expect(pointB.x).toBe(22);
    expect(pointB.y).toBe(30);
});
