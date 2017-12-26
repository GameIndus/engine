class GeometricAnimator extends Animator{

	protected _object     : GeometricObject;

	public   _colorTween : Tween;


	public constructor(game: Game, object: GeometricObject) {
		super(game, object);
		this._object = object;
	}


	protected get object(): GeometricObject {
		return this._object;
	}


	public color(colorTo: Color, duration: number, easing?: Easing, delay?: number, repeats?: number, yoyo?: boolean): Tween {
		if( this._colorTween ) this._colorTween.destroy();

		if( !easing ) easing = Easing.LINEAR;

		this._colorTween = this.game.tween(this.object.color).easing(easing).to(colorTo, duration);

		if( delay )   this._colorTween.delay(delay);
		if( repeats ) this._colorTween.repeat(repeats);
		if( yoyo )    this._colorTween.yoyo();

		this._colorTween.start();
		return this._colorTween;
	}

}