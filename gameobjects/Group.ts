class Group extends GameObject {

	private _children : GameObject[];


	public onAddedToGroup : Signal = new Signal(true);


	public constructor(game: Game, name?: string) {
		super(game, name);
	}

	public get children(): GameObject[] {
		return this.children;
	}


	public add(object: GameObject, silent: boolean = false, index?: number): GameObject {
		if (object.parent === this) return object;



		return object;
	}




	// private addToGroup(gameobject, )

}