import GameObject from "../GameObject";

export default abstract class Behavior {

    public runned?: boolean;

    public abstract run(gameobject: GameObject): void;

    public abstract loop(gameobject: GameObject): void;

}
