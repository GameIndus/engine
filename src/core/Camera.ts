import GameObject from "../gameobject/GameObject";
import Position from "../geometry/Position";
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

    private canMoveOn: MoveAxis;

    constructor(game: Game, scene: Scene, gameobject: GameObject) {
        this.game = game;

        this.scene = scene;
        this.gameobject = gameobject;

        this.offset = new Position();
        this.position = new Position();
        this.speed = new Vector2();
        this.zoom = 1;

        this.canMoveOn = { x: true, y: true };
    }

    public setScene(scene: Scene): void {
        this.scene = scene;
    }

    public setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;

        if (this.canMoveOn.x) {
            this.offset.x = -this.position.x
        }
        if (this.canMoveOn.y) {
            this.offset.y = -this.position.y
        }
    }

    public setCanMoveOn(axe: string, bool: boolean): void {
        axe = axe.toUpperCase();
        if (axe === "X" || axe === "HORIZONTAL") { this.canMoveOn.x = bool; }
        if (axe === "Y" || axe === "VERTICAL") { this.canMoveOn.y = bool; }
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

    public checkForMove(): void {
        const canvasMiddleWidth = this.game.canvas.size.width / 2;

        if (this.gameobject.position.getX() >= canvasMiddleWidth) {

        }
    }

}
