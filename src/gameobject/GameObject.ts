import Game from "../core/Game";
import Point from "../geometry/Point";
import Position from "../geometry/Position";
import {RectangleSize} from "../geometry/Rectangle";
import Vector2 from "../math/Vector2";
import Animator from "./animator/Animator";
import Behavior from "./behavior/Behavior";
import Graphics from "./Graphics";
import Group from "./Group";

export default abstract class GameObject {

    protected game: Game;

    protected _animator: Animator;

    private _id: number;

    private _name: string;

    private _layer: number;

    private _rotation: number;

    private _scale: number;

    private _position: Position;

    private _anchor: Point;

    private _size: RectangleSize;

    private _velocity: Vector2 = new Vector2();

    private _renderer: boolean;

    private readonly _behaviors: Behavior[] = [];

    private _parent: Group | null;

    protected constructor(game: Game, name?: string) {
        this.game = game;
        this._animator = Animator.prototype;
        this._id = -1;
        this._name = name || "";
        this._layer = 0;
        this._rotation = 0;
        this._scale = 1;
        this._position = new Position();
        this._anchor = new Point();
        this._size = {width: 0, height: 0};
        this._velocity = new Vector2();
        this._renderer = false;
        this._behaviors = [];
        this._parent = null;
    }

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get layer(): number {
        return this._layer || 0;
    }

    public set layer(layer: number) {
        this._layer = layer;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get rotation(): number {
        return this._rotation;
    }

    public set rotation(rotation: number) {
        this._rotation = rotation;
    }

    public get scale(): number {
        return this._scale;
    }

    public set scale(scale: number) {
        this._scale = scale;
    }

    public get position(): Position {
        return this._position || new Position();
    }

    public set position(position: Position) {
        this._position = position;
    }

    public get anchor(): Point {
        return this._anchor;
    }

    public set anchor(anchor: Point) {
        this._anchor = anchor;
    }

    public get size(): RectangleSize {
        return this._size;
    }

    public set size(size: RectangleSize) {
        this._size = size;
    }

    public get velocity(): Vector2 {
        return this._velocity || new Vector2();
    }

    public set velocity(velocity: Vector2) {
        this._velocity = velocity;
    }

    public get behaviors(): Behavior[] {
        return this._behaviors || [];
    }

    public get animator(): Animator {
        if (this._animator) {
            return this._animator;
        }
        this._animator = new Animator(this.game, this);
        return this._animator;
    }

    public get parent(): Group | null {
        return this._parent;
    }

    public set parent(group: Group | null) {
        this._parent = group;
    }

    public get renderPosition(): Position {
        return this.position.clone().subtract(new Position(
            this.anchor.x * this.size.width * this.scale,
            this.anchor.y * this.size.height * this.scale,
        ));
    }

    public get renderSize(): RectangleSize {
        return {
            height: this.size.height * this.scale,
            width: this.size.width * this.scale,
        };
    }

    public addBehavior(behavior: Behavior): void {
        if (this._behaviors.indexOf(behavior) === -1) {
            this._behaviors.push(behavior);
        }
    }

    public setSize(width: number, height?: number): GameObject {
        this.size.width = width;
        this.size.height = height || width;

        return this;
    }

    public setPosition(x?: number, y?: number): GameObject {
        this.position.x = x || 0;
        this.position.y = y || this.position.x;

        return this;
    }

    public _update(): void {
        // Update behaviors
        for (const behavior of this.behaviors) {
            if (!behavior.runned) {
                behavior.runned = true;
                behavior.run(this);
            }

            behavior.loop(this);
        }

        // Update object's velocity
        if (!this.velocity.isZero()) {
            this.position.addX(this.velocity.x);
            this.position.addY(this.velocity.y);
        }

        this.update();
    }

    public abstract render(graphics: Graphics, time: number): void;

    public abstract update(): void;

}
