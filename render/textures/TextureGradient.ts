class GradientTexture extends Texture {

	private _gradient : Gradient;


	public constructor(game: Game, gradient: Gradient){
		super(game, null);

		this._gradient = gradient;
		this.initBuffer();
	}

	public get source(): Gradient {
		return this._gradient;
	}

}