import GameObject from "../gameobject/GameObject";
import Position from "../geometry/Position";
import {RectangleSize} from "../geometry/Rectangle";
import Vector2 from "../math/Vector2";
import Game from "./Game";

interface MoveAxis {
    x: boolean,
    y: boolean
}

export default class Camera {

    protected game: Game;

    // TODO animations
    // protected _animator: Animator;

    private _id: number;

    private _name: string;

    private _position: Position;

    private _viewport: RectangleSize;

    private _zoom: number;

    private _velocity: Vector2 = new Vector2();

    private _renderer: boolean;

    constructor(game: Game, name?: string, viewport?: RectangleSize) {
        this.game = game;
        this._id = -1;
        this._name = name || "";
        this._position = new Position();
        this._viewport = viewport || {width: 0, height: 0};
        this._zoom = 1;
        this._velocity = new Vector2();
        this._renderer = false;
    }

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get position(): Position {
        return this._position || new Position();
    }

    public set position(position: Position) {
        this._position = position;
    }

    public get viewport(): RectangleSize {
        return this._viewport;
    }

    public set viewport(viewport: RectangleSize) {
        this._viewport = viewport;
    }

    public get zoom(): number {
        return this._zoom;
    }

    public set zoom(zoom: number) {
        this._zoom = zoom;
    }

    public get velocity(): Vector2 {
        return this._velocity || new Vector2();
    }

    public set velocity(velocity: Vector2) {
        this._velocity = velocity;
    }

    public setViewport(width: number, height?: number): Camera {
        this.viewport.width = width;
        this.viewport.height = height || width;

        return this;
    }

    public setPosition(x?: number, y?: number): Camera {
        this.position.x = x || 0;
        this.position.y = y || this.position.x;

        return this;
    }

    public _update(): void {
        if (!this.velocity.isZero()) {
            this.position.addX(this.velocity.x);
            this.position.addY(this.velocity.y)
        }
    }

}
