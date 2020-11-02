import GameObject from "../gameobject/GameObject";
import Game from "./Game";
import Scene from "./Scene";

export default class Camera {

    private readonly game: Game;

    private scene: Scene;
    private gameobject: GameObject;

    constructor(game: Game, scene: Scene, gameobject?: GameObject) {
        this.game = game;

        this.scene = scene;
        if (this.gameobject !== undefined) {
            this.gameobject = gameobject;
        }
    }

}
