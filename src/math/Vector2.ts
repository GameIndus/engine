/**
 * Class representing a 2D vector. A 2D vector is an ordered pair of numbers (labeled x and y).
 * It can represents a point in space or a direction and a length across a plane.
 *
 * This file is part of the GameIndus engine.
 *
 * @copyright Copyright (c) 2019, Maxime Malgorn
 * @author Maxime Malgorn <maxime.malgorn@laposte.net>
 * @since 2.0.0
 */
export default class Vector2 {

    /**
     * A (0, 0) vector
     */
    public static get Zero(): Vector2 {
        return new Vector2().zero();
    }

    /**
     * A (1, 1) vector
     */
    public static get One(): Vector2 {
        return new Vector2(1, 1);
    }

    /**
     * Create a 2d vector from an angle across a plane.
     * @param angle Angle to apply to create the vector.
     */
    public static fromAngle(angle: number): Vector2 {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    /**
     * X property of the 2d vector
     */
    public x: number;

    /**
     * Y property of the 2d vector
     */
    public y: number;

    /**
     * Construct a new 2d vector with initial values
     * @param x initial X value
     * @param y initial Y value
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Calculate the magnitude of the vector.
     */
    public get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Calculate the Manhattan length (taxicab metric) of the vector.
     * @see https://en.wikipedia.org/wiki/Taxicab_geometry
     */
    public get lengthManhattan(): number {
        return Math.abs(this.x) + Math.abs(this.y);
    }

    /**
     * Calculate the angle of the vector.
     * The result will be between -PI and PI (included).
     */
    public get angle(): number {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Absolute X and Y properties of the vector.
     */
    public abs(): Vector2 {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }

    /**
     * Add a vector to this one.
     * @param vector Vector to add. It will NOT be modified.
     */
    public add(vector: Vector2): Vector2 {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Add a scalar to the vector.
     * @param scalar Number to add at X and Y properties. It can be positive or negative.
     */
    public addScalar(scalar: number): Vector2 {
        this.x += scalar;
        this.y += scalar;
        return this;
    }

    /**
     * Ceil X and Y properties of this vector.
     */
    public ceil(): Vector2 {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    /**
     * Clamp X and Y properties between two vectors.
     * @param min Vector used for minimum properties.
     * @param max Vector used for maximum properties.
     */
    public clamp(min: Vector2, max: Vector2): Vector2 {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
    }

    /**
     * Clone this vector an these properties.
     */
    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    /**
     * Copy properties of another vector into this one.
     * @param vector Vector to copy
     */
    public copy(vector: Vector2): Vector2 {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    /**
     * Calculate the distance between another vector and this one.
     * @param vector Vector to take for the calculation.
     */
    public distance(vector: Vector2): number {
        const dx: number = this.x - vector.x;
        const dy: number = this.y - vector.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Divide this vector by another one.
     * @param vector Vector to divide with. Properties of this vector cannot be equal to zero.
     * @throws RangeError Error throwed if vector properties are equal to zero.
     */
    public divide(vector: Vector2): Vector2 {
        if (vector.x === 0 || vector.y === 0) {
            throw new RangeError("Cannot divide the vector by a zero one.");
        }

        this.x /= vector.x;
        this.y /= vector.y;
        return this;
    }

    /**
     * Divide this vector by a scalar.
     * @param scalar Number to divide both properties of this vector. It cannot be equal to zero.
     * @throws RangeError Error throwed if the scalar is equal to zero.
     */
    public divideScalar(scalar: number): Vector2 {
        if (scalar === 0) {
            throw new RangeError("Cannot divide the vector by zero.");
        }

        return this.scale(1 / scalar);
    }

    /**
     * Perform a dot product with another vector.
     * @param vector Vector to dot.
     */
    public dot(vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * Check the equality between this vector and another one.
     * @param vector Vector to check.
     */
    public equals(vector: Vector2): boolean {
        return this.x === vector.x && this.y === vector.y;
    }

    /**
     * Floor X and Y properties of this vector.
     */
    public floor(): Vector2 {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    /**
     * Check the collinearity of this vector and another one.
     * @param vector Vector to check.
     */
    public isCollinearWith(vector: Vector2): boolean {
        return this.x * vector.y === this.y * vector.x;
    }

    /**
     * Check if this vector contains zero properties.
     */
    public isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    /**
     * Linearly interpolates between this vector and another one by a value.
     * @param vector Vector to interpolate with.
     * @param alpha The interpolant. Clamped to the range [0, 1].
     */
    public lerp(vector: Vector2, alpha: number) {
        this.x += (vector.x - this.x) * alpha;
        this.y += (vector.y - this.y) * alpha;
        return this;
    }

    /**
     * Mix this vector with another one by a value.
     * @param vector Vector to mix with.
     * @param amount The percentage of mixin. Clamped to the range [0, 1].
     */
    public mix(vector: Vector2, amount: number = 0.5): Vector2 {
        if (amount < 0 || amount > 1) {
            throw new RangeError("amount must be between 0 and 1.");
        }

        this.x = (1 - amount) * this.x + amount * vector.x;
        this.y = (1 - amount) * this.y + amount * vector.y;
        return this;
    }

    /**
     * Multiply this vector by another one.
     * @param vector Vector to multiply with.
     */
    public multiply(vector: Vector2): Vector2 {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }

    /**
     * Negate this vector
     */
    public negate(): Vector2 {
        return this.scale(-1);
    }

    /**
     * Returns the normal vector to this one.
     * @see https://en.wikipedia.org/wiki/Normal_(geometry)
     */
    public normal(): Vector2 {
        return this.perpendicular().normalize();
    }

    /**
     * Normalize the vector.
     * @see http://www.fundza.com/vectors/normalize/
     */
    public normalize(): Vector2 {
        return this.divideScalar(this.magnitude);
    }

    /**
     * Return a NEW vector which is perpendicular to this one.
     */
    public perpendicular(): Vector2 {
        return new Vector2(this.y, -this.x);
    }

    /**
     * Rotate this vector.
     * @param angle Rotate this vector by this number.
     */
    public rotate(angle: number): Vector2 {
        this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return this;
    }

    /**
     * Rotate this vector around another one.
     * @param center Vector to rotate around.
     * @param angle Rotate the vector by this number.
     */
    public rotateAround(center: Vector2, angle: number): Vector2 {
        const c: number = Math.cos(angle);
        const s: number = Math.sin(angle);
        const x: number = this.x - center.x;
        const y: number = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;
        return this;
    }

    /**
     * Round X and Y properties of this vector.
     */
    public round(): Vector2 {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    /**
     * Scale this vector by a factor.
     * @param factor The factor to scale the vector with.
     */
    public scale(factor: number): Vector2 {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    /**
     * Subtract this vector by another one.
     * @param vector Vector to subtract with.
     */
    public sub(vector: Vector2): Vector2 {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * Subtract this vector by a scalar.
     * @param scalar Number to subtract with.
     */
    public subScalar(scalar: number): Vector2 {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }

    /**
     * Set X and Y properties of this vector to zero.
     */
    public zero(): Vector2 {
        this.x = this.y = 0;
        return this;
    }

}
