import Game from "../core/Game";
import Circle from "../geometry/Circle";
import Point from "../geometry/Point";
import Polygon from "../geometry/Polygon";
import Position from "../geometry/Position";
import Rectangle from "../geometry/Rectangle";
import {ComplexShape, ShapeType} from "../geometry/Shape";
import Triangle from "../geometry/Triangle";
import Color from "../utils/Color";
import GeometricAnimator from "./animators/GeometricAnimator";
import GameObject from "./GameObject";
import Graphics from "./Graphics";

export default class GeometricObject extends GameObject {

    protected _animator: GeometricAnimator;

    private _fill: boolean;

    private _color: Color;

    private _shapeType: ShapeType;

    private _shapePattern: ComplexShape | null;

    constructor(game: Game, name?: string, shapeType?: ShapeType, position?: Position,
                size?: number | any, color?: Color, fill?: boolean, shapePattern?: ComplexShape) {
        super(game, name);

        if (size) {
            if (typeof size === "number") {
                this.size = {width: size, height: size};
            } else if (size instanceof Object) { // TODO Create a Size interface here
                this.setSize(size.width, size.height);
            }
        }
        if (position) {
            this.setPosition(position.x, position.y);
        }

        this._animator = GeometricAnimator.prototype;
        this._fill = fill || true;
        this._color = color || Color.BLACK;
        this._shapeType = shapeType || ShapeType.RECTANGLE;
        this._shapePattern = shapePattern || null;
    }

    public get color(): Color {
        return this._color || Color.BLACK;
    }

    public set color(color: Color) {
        this._color = color;
    }

    public get shapePattern(): ComplexShape | Point[] | null {
        return this._shapePattern;
    }

    public get animator(): GeometricAnimator {
        if (this._animator) {
            return this._animator;
        }
        this._animator = new GeometricAnimator(this.game, this);
        return this._animator;
    }

    public get filled(): boolean {
        return this._fill;
    }

    public set filled(fill: boolean) {
        this._fill = fill;
    }

    public get shapeType(): ShapeType {
        return this._shapeType;
    }

    public set shapeType(shapeType: ShapeType) {
        this._shapeType = shapeType;
    }

    public render(graphics: Graphics, time: number): void {
        switch (this.shapeType) {
            case ShapeType.RECTANGLE:
                graphics.drawShape(
                    new Rectangle(
                        this.renderPosition.x, this.renderPosition.y,
                        this.renderSize.width, this.renderSize.height,
                    ),
                    this.filled,
                    this.color,
                );
                break;

            case ShapeType.CIRCLE:
                const minSize = Math.min(this.renderSize.width, this.renderSize.height);
                graphics.drawShape(
                    new Circle(this.renderPosition.x, this.renderPosition.y, minSize),
                    this.filled, this.color,
                );
                break;

            case ShapeType.TRIANGLE:
                graphics.drawShape(new Triangle(), this.filled, this.color);
                break;

            // Custom shape
            case ShapeType.POLYGON:
                if (this._shapePattern) {
                    graphics.drawShape(new Polygon(this._shapePattern.points), this.filled, this.color);
                }
                break;

            // Complex shapes
            case ShapeType.COMPLEX:
                if (this._shapePattern) {
                    this._shapePattern.calculatePoints(this.position, this.size);
                    graphics.drawShape(this._shapePattern, this.filled, this.color);
                }
                break;
        }
    }

    public update(): void {
        // Not implemented
    }

}
