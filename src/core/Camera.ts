import {ShapeType} from "..";
import GameObject from "../gameobject/GameObject";
import Position from "../geometry/Position";
import Rectangle, {RectangleSize} from "../geometry/Rectangle";
import Color from "../math/Color";
import Vector2 from "../math/Vector2";
import Game from "./Game";

interface MoveAxis {
    x: boolean,
    y: boolean
}

export default class Camera {

    protected game: Game;

    private _id: number;

    private _name: string;

    private _position: Position;

    private _viewport: RectangleSize;

    private _zoom: number;

    /// private _velocity: Vector2 = new Vector2();
    private _velocity: Vector2 = new Vector2(1, 1);

    private _target: GameObject;

    private _deadZone: Position = new Position();

    private _canMoveOn: MoveAxis;

    private _debug: Rectangle;

    constructor(game: Game, name?: string, position?: Position, viewport?: RectangleSize, target?: GameObject) {
        this.game = game;
        this._id = -1;
        this._name = name || "";
        this._position = position || new Position();
        this._viewport = viewport || {width: 0, height: 0};
        this._zoom = 1;
        this._target = target || GameObject.prototype;
        this._canMoveOn = {x: true, y: true};

        this._debug = new Rectangle();
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

    public get target(): GameObject {
        return this._target;
    }

    public set target(target: GameObject) {
        this._target = target;
    }

    public get canMoveOn(): MoveAxis {
        return this._canMoveOn;
    }

    public setCanMoveOn(x: boolean, y?: boolean): void {
        this._canMoveOn.x = x;
        this._canMoveOn.y = y || x;
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

    public setTarget(target: GameObject): Camera {
        this._target = target;
        return this;
    }

    public attachTo(target: GameObject) {
        this._target = target;
        this._deadZone.x = this._viewport.width / 2;
        this._deadZone.y = this._viewport.height / 2;
    }

    public _update(): void {
        if (this.target) {
            if (this.canMoveOn.x) {
                if (this.target.position.x - this.position.x + this._deadZone.x > this.viewport.width) {
                    console.log("X > "+ (this.target.position.x - (this.viewport.width - this._deadZone.x)));
                    this.position.setX(this.target.position.x - (this.viewport.width - this._deadZone.x));
                } else if (this.target.position.x - this._deadZone.x < this.position.x) {
                    console.log("X > "+ (this.target.position.x - this._deadZone.x));
                    this.position.setX(this.target.position.x - this._deadZone.x);
                }
            }
            if (this.canMoveOn.y) {
                if (this.target.position.y - this.position.y + this._deadZone.y > this.viewport.height) {
                    //console.log("Y > "+ (this.target.position.y - (this.viewport.height - this._deadZone.y)));
                    this.position.setY(this.target.position.y - (this.viewport.height - this._deadZone.y));
                    this.game.canvas.context.restore();

                }else if (this.target.position.x - this._deadZone.y < this.position.x) {
                    //console.log("Y > "+ (this.target.position.y - this._deadZone.y));
                    this.position.setY(this.target.position.y - this._deadZone.y);
                }
            }

            if (!this.velocity.isZero()) {
                this.game.canvas.context.translate(this.position.x, this.position.y);
            }
        }
    }
}
