class Group extends GameObject {

    public onAddedToGroup: Signal = new Signal(true);

    public constructor(game: Game, name?: string) {
        super(game, name);
    }

    private _children: GameObject[];

    public get children(): GameObject[] {
        return this.children;
    }


    public add(object: GameObject, silent: boolean = false, index?: number): GameObject {
        if (object.parent === this) return object;


        return object;
    }


    // private addToGroup(gameobject, )

}