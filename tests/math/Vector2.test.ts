/**
 * Unit test suite for Vector2 class.
 *
 * This file is part of the GameIndus engine.
 * This file is used by Jest to test the engine.
 *
 * @copyright Copyright (c) 2019, Maxime Malgorn
 * @author Maxime Malgorn <maxime.malgorn@laposte.net>
 * @since 2.0.0
 */

import Vector2 from "../../src/math/Vector2";

const X = -40;
const Y = 30;

let vector: Vector2;
let vector2: Vector2;
let vector3: Vector2;

beforeAll(() => {
    vector2 = new Vector2(6, 17);
    vector3 = new Vector2(56.6, -89.8);
});

beforeEach(() => {
    vector = new Vector2(X, Y);
});

test("should create valid specifics vectors", () => {
    vector = Vector2.Zero;
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);

    vector = Vector2.One;
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(1);
});

test("should create a vector from an angle", () => {
    const vectorFromAngle = Vector2.fromAngle(55);
    expect(vectorFromAngle.x).toBe(Math.cos(55));
    expect(vectorFromAngle.y).toBe(Math.sin(55));
});

test("should store basic values", () => {
    expect(vector.x).toBe(X);
    expect(vector.y).toBe(Y);
});

test("should get absolute vector", () => {
    vector.abs();
    expect(vector.x).toBeGreaterThan(0);
    expect(vector.y).toBeGreaterThan(0);
});

test("should add a vector", () => {
    const vx = vector.x;
    const vy = vector.y;

    vector.add(vector2);

    expect(vector.x).toBe(vx + vector2.x);
    expect(vector.y).toBe(vy + vector2.y);
});

test("should calculate a valid angle", () => {
    expect(vector.angle).toBe(Math.atan2(Y, X));
});

test("should ceil the values", () => {
    const decimalVector = vector3.clone().ceil();
    expect(decimalVector.x).toBe(Math.ceil(vector3.x));
    expect(decimalVector.y).toBe(Math.ceil(vector3.y));
});

test("should clamp with min and max vectors" , () => {
    vector.clamp(new Vector2(-30, 5), new Vector2(0, 10));
    expect(vector.x).toBe(-30);
    expect(vector.y).toBe(10);

    vector.clamp(new Vector2(-60, 20), new Vector2(-35, 30));
    expect(vector.x).toBe(-35);
    expect(vector.y).toBe(20);
});

test("should clone itself", () => {
    const clone = vector.clone();
    clone.addScalar(5);

    expect(clone.x).not.toBe(vector.x);
    expect(clone.y).not.toBe(vector.y);
});

test("should copy values from another vector", () => {
    vector.copy(vector2);

    expect(vector.x).toBe(vector2.x);
    expect(vector.y).toBe(vector2.y);
});

test("should calculate the distance from another vector", () => {
    expect(vector.distance(vector2)).toBeCloseTo(47.80);
});

test("should divive by a vector or a scalar", () => {
    let base = vector.clone();

    // Divide with a basic vector
    vector.divide(vector2);
    expect(vector.x).toBe(base.x / vector2.x);
    expect(vector.y).toBe(base.y / vector2.y);

    // Also divide the vector by a scalar
    base = vector.clone();
    vector.divideScalar(4);
    expect(vector.x).toBe(base.x / 4);
    expect(vector.y).toBe(base.y / 4);

    // We should not divide it by zero
    expect(() => vector.divide(Vector2.Zero)).toThrow(RangeError);
    expect(() => vector.divideScalar(0)).toThrow(RangeError);
});

test("should dot with another vector", () => {
    const base = vector.clone();
    expect(vector.dot(vector2)).toBe(base.x * vector2.x + base.y * vector2.y);
});

test("should test vectors equality", () => {
    expect(vector.equals(vector.clone())).toBeTruthy();
    expect(vector.equals(vector2)).toBeFalsy();
});

test("should floor the values", () => {
    const decimalVector = vector3.clone().floor();
    expect(decimalVector.x).toBe(Math.floor(vector3.x));
    expect(decimalVector.y).toBe(Math.floor(vector3.y));
});

test("should test vectors collinearity", () => {
    expect(vector.isCollinearWith(vector.clone().scale(2))).toBeTruthy();
    expect(vector.isCollinearWith(vector.clone().add(new Vector2(5, 7)))).toBeFalsy();
});

test("should test validity of a zero vector", () => {
    expect(Vector2.Zero.isZero()).toBeTruthy();
});

test("should calculate the Manhattan length", () => {
    expect(vector.lengthManhattan).toBe(Math.abs(X) + Math.abs(Y));
});

test("should lerp the values", () => {
    vector.lerp(vector2, 0.8);
    expect(vector.x).toBeCloseTo(-3.20);
    expect(vector.y).toBe(19.6);
});

test("should calculate the magnitude", () => {
    expect(vector.magnitude).toBe(Math.sqrt(X * X + Y * Y));
});

test("should mix with another vector", () => {
    // Check mix with the default amount value
    const mixed = vector.clone().mix(vector2);
    expect(mixed.x).toBe(-17);
    expect(mixed.y).toBe(23.5);

    // Check mix with a custom amount value
    vector.mix(vector2, 0.6);
    expect(vector.x).toBe(-12.4);
    expect(vector.y).toBe(22.2);

    // Check out of range values
    expect(() => vector.mix(vector2, -0.1)).toThrow(RangeError);
    expect(() => vector.mix(vector2, 1.1)).toThrow(RangeError);
});

test("should multiply by another vector", () => {
    const base = vector.clone();
    vector.multiply(vector2);
    expect(vector.x).toBe(base.x * vector2.x);
    expect(vector.y).toBe(base.y * vector2.y);
});

test("should negate a vector", () => {
    const base = vector.clone();
    vector.negate();
    expect(vector.x).toBe(-base.x);
    expect(vector.y).toBe(-base.y);
});

test("should calculate a normal vector", () => {
    const normalVector = vector.normal();
    expect(normalVector.x).toBe(0.6);
    expect(normalVector.y).toBe(0.8);
});

test("should calculate a normalized vector", () => {
    vector.normalize();
    expect(vector.x).toBe(-0.8);
    expect(vector.y).toBe(0.6);
});

test("should create a perpendicular vector", () => {
   const perpendicular = vector.perpendicular();
   expect(perpendicular.x).toBe(vector.y);
   expect(perpendicular.y).toBe(-vector.x);
});

test("should rotate a vector", () => {
    vector.rotate(10);
    expect(vector.x).toBeCloseTo(49.88);
    expect(vector.y).toBeCloseTo(-52.31);
});

test("should rotate a vector around another one", () => {
    vector.rotateAround(vector2, 10);
    expect(vector.x).toBeCloseTo(51.67);
    expect(vector.y).toBeCloseTo(31.12);
});

test("should round the values", () => {
    const decimalVector = vector3.clone().round();
    expect(decimalVector.x).toBe(Math.round(vector3.x));
    expect(decimalVector.y).toBe(Math.round(vector3.y));
});

test("should scale a vector", () => {
    const base = vector.clone();
    vector.scale(5);
    expect(vector.x).toBe(base.x * 5);
    expect(vector.y).toBe(base.y * 5);
});

test("should subtract another vector or a scalar", () => {
    let base = vector.clone();

    vector.sub(vector2);
    expect(vector.x).toBe(base.x - vector2.x);
    expect(vector.y).toBe(base.y - vector2.y);

    base = vector.clone();
    vector.subScalar(5);
    expect(vector.x).toBe(base.x - 5);
    expect(vector.y).toBe(base.y - 5);
});
