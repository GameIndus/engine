class Mouse{
	private game               : Game;

	private _clicksHistory     : Position[]       = [];
	private _lastClickPosition : Position;
	private _lastPosition      : Position;
	private _downButtons       : MouseClickType[] = [];

	public  onClick            : Signal = new Signal(true);
	public  onDown             : Signal = new Signal(true);
	public  onMove             : Signal = new Signal(true);
	public  onUp               : Signal = new Signal(true);
	public  onWheel            : Signal = new Signal(true);


	public constructor(game: Game){
		this.game = game;

		this.bind();
	}

	public get clicksHistory(): Position[]{
		return this._clicksHistory;
	}
	public get downButtons(): MouseClickType[]{
		return this._downButtons;
	}
	public get lastClickPosition(): Position{
		return this._lastClickPosition;
	}
	public get lastPosition(): Position{
		return this._lastPosition;
	}


	private bind(): void {
		let canvas: HTMLCanvasElement = this.game.canvas.element;

		canvas.removeEventListener( "click"       , this._onClick.bind(this)       );
		canvas.removeEventListener( "mousedown"   , this._onDown.bind(this)        );
		canvas.removeEventListener( "mousemove"   , this._onMove.bind(this)        );
		canvas.removeEventListener( "mouseup"     , this._onUp.bind(this)          );
		canvas.removeEventListener( "wheel"       , this._onWheel.bind(this)       );
		canvas.removeEventListener( "contextmenu" , this._onContextMenu.bind(this) );

		canvas.addEventListener( "click"       , this._onClick.bind(this)       , true);
		canvas.addEventListener( "mousedown"   , this._onDown.bind(this)        , true);
		canvas.addEventListener( "mousemove"   , this._onMove.bind(this)        , true);
		canvas.addEventListener( "mouseup"     , this._onUp.bind(this)          , true);
		canvas.addEventListener( "wheel"       , this._onWheel.bind(this)       , true);
		canvas.addEventListener( "contextmenu" , this._onContextMenu.bind(this) , true);
	}

	private _onClick(event: MouseEvent): boolean{
		let pos: Position = Mouse.positionFromEvent(event);

		this._lastClickPosition = pos.clone();
		this._clicksHistory.push(pos.clone());

		this.onClick.dispatch(pos.clone(), MouseClickType.LEFT_CLICK);

		return false;
	}
	private _onContextMenu(event: Event): boolean{
		event.preventDefault();
		return false;
	}
	private _onDown(event: MouseEvent): void{
		let pos  : Position       = Mouse.positionFromEvent(event);
		let type : MouseClickType = MouseClickType.LEFT_CLICK;

		if(event.which == 2) type = MouseClickType.MIDDLE_CLICK;
		if(event.which == 3) type = MouseClickType.RIGHT_CLICK;

		if(this._downButtons.indexOf(type) == -1)
			this._downButtons.push(type);

		this.onDown.dispatch(pos.clone(), type);
	}
	private _onMove(event: MouseEvent): void{
		let pos: Position = Mouse.positionFromEvent(event);

		this._lastPosition = pos.clone();

		this.onMove.dispatch(this.lastPosition);
	}
	private _onUp(event: MouseEvent): void{
		let pos  : Position       = Mouse.positionFromEvent(event);
		let type : MouseClickType = MouseClickType.LEFT_CLICK;

		if(event.which == 2) type = MouseClickType.MIDDLE_CLICK;
		if(event.which == 3) type = MouseClickType.RIGHT_CLICK;

		if(this._downButtons.indexOf(type) > -1)
			Util.removeFrom(this._downButtons, type);

		this.onUp.dispatch(pos.clone(), type);
	}
	private _onWheel(event: MouseWheelEvent): boolean{
		let direction: MouseWheelDirection = MouseWheelDirection.DOWN;
		
		event.preventDefault();

		if(event.wheelDeltaY < 0) 
			direction = MouseWheelDirection.UP;


		this.onWheel.dispatch(direction);

		return false;
	}




	private static positionFromEvent(event: MouseEvent): Position{
		let x: number = event.x || event.clientX || event.pageX;
		let y: number = event.y || event.clientY || event.pageY;

		return new Position(x, y);
	}
}


enum MouseClickType{
	LEFT_CLICK,
	MIDDLE_CLICK,
	RIGHT_CLICK
}

enum MouseWheelDirection{
	UP, DOWN
}