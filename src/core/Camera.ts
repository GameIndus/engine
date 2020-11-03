import GameObject from "../gameobject/GameObject";
import Position from "../geometry/Position";
import {RectangleSize} from "../geometry/Rectangle";
import Vector2 from "../math/Vector2";
import Game from "./Game";
import Scene from "./Scene";

interface MoveAxis {
    x: boolean,
    y: boolean
}

export default class Camera {

    private readonly game: Game;

    private scene: Scene;
    private gameobject: GameObject;

    private offset: Position;
    private position: Position;
    private speed: Vector2;
    private zoom: number;

    private objectLastPosition: Position;
    private objectDistance: RectangleSize;
    private toAdd: Position;

    private canMoveOn: MoveAxis;

    constructor(game: Game, scene: Scene, gameobject: GameObject) {
        this.game = game;

        this.scene = scene;
        this.gameobject = gameobject;

        this.offset = new Position();
        this.position = new Position();
        this.speed = new Vector2();
        this.zoom = 1;

        this.objectLastPosition = new Position();
        this.objectDistance = {width: 0, height: 0};
        this.toAdd = new Position();

        this.canMoveOn = {x: true, y: true};
    }

    public setScene(scene: Scene): void {
        this.scene = scene;
    }

    public setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;



        if (this.canMoveOn.x) {
            this.offset.addX(-this.position.x);
        }
        if (this.canMoveOn.y) {
            this.offset.addY(-this.position.y);
        }
    }

    public setCanMoveOn(axe: string, bool: boolean): void {
        axe = axe.toUpperCase();
        if (axe === "X" || axe === "HORIZONTAL") {
            this.canMoveOn.x = bool;
        }
        if (axe === "Y" || axe === "VERTICAL") {
            this.canMoveOn.y = bool;
        }
    }

    public setSpeed(speed: Vector2): void {
        this.speed = speed;
    }

    public setZoom(zoom: number): void {
        this.zoom = zoom;
    }

    public getCenter(): object {
        const cs = this.game.canvas.size;
        return {x: -this.offset.x + cs.width / 2, y: -this.offset.y + cs.height / 2};
    }

    public attachTo(gameobject: GameObject): void {
        this.gameobject = gameobject;
    }

    public updateOnGameobject() {
        if (this.gameobject === null || this.scene === null) { return false; }

        if (this.speed.x === 0) { this.speed.x++; }
        if (this.speed.y === 0) { this.speed.y++; }

        const canvasSize = {width: this.game.canvas.size.width, height: this.game.canvas.size.height};
        let middle = {x: canvasSize.width / 2, y: canvasSize.height / 2};

        if (this.speed.x >= 1) {
            this.objectDistance.width = this.gameobject.position.x - (-this.offset.x + middle.x);

            if (this.objectDistance.width > 1 || this.objectDistance.width < -1) {
                if (this.objectDistance.width < 0) {
                    this.toAdd.x++;
                } else {
                    this.toAdd.x--;
                }
            }
        }

        if(this.speed.y >= 1) {
            this.objectDistance.height = this.gameobject.position.y - (-this.offset.y + middle.y);

            if (this.objectDistance.height > 1 || this.objectDistance.height < -1) {
                if (this.objectDistance.width < 0) {
                    this.toAdd.y++;
                } else {
                    this.toAdd.y--;
                }
            }
        }

        /// Update Camera offset
        let speedMovement = {x: this.toAdd.x * this.speed.x, y: this.toAdd.y * this.speed.y};

        this.offset.x = -this.position.x * this.speed.x + speedMovement.x;
        this.offset.y = -this.position.y * this.speed.y + speedMovement.y;

        this.objectLastPosition = this.gameobject.position;
    }

    public _update(): void {
        if (this.gameobject != null) { this.updateOnGameobject(); }

        if (this.canMoveOn.x) this.offset.x = -this.position.x;
        if (this.canMoveOn.y) this.offset.y = -this.position.y;
    }

}
