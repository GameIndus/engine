abstract class Behavior {

    public runned: boolean;

    abstract run(gameobject: GameObject): void;

    abstract loop(gameobject: GameObject): void;

}