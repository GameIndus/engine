import GameObject from "../gameobject/GameObject";
import Position from "../geometry/Position";
import Vector2 from "../math/Vector2";
import Game from "./Game";
import Scene from "./Scene";

export default class Camera {

    private readonly game: Game;

    private scene: Scene;
    //private gameobject?: GameObject;

    private position: Position;
    private speed: Vector2;
    private zoom: number;

    private canMoveOn;

    constructor(game: Game, scene: Scene, gameobject?: GameObject) {
        this.game = game;

        this.scene = scene;
        //this.gameobject = gameobject;

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
    }

    public setMoveOn(axe: string, bool: boolean): void {
        axe = axe.toUpperCase();
        if (axe === "X" || axe === "HORIZONTAL") { this.canMoveOn.x = bool; }
        if (axe === "Y" || axe === "VERTICAL") { this.canMoveOn.y = bool; }
    }

}
