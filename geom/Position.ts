class Position{
	private _x: number;
	private _y: number;

	private _lerpPos: Position;
	private _lerpFactor: number;

	private hooks: Function[];

	constructor(x?: number, y?: number){
		this.x = x || 0;
		this.y = y || 0;
	}

	public get x(): number{
		return this._x;
	}
	public get y(): number{
		return this._y;
	}

	public set x(x: number){
		this._x = x;
	}
	public set y(y: number){
		this._y = y;
	}

	public add(position: Position): Position{
		this.addX(position.getX());
		this.addY(position.getY());
		return this;
	}
	public addX(x: number): Position{
		this.x = this.hook(this.x + x);
		return this;
	}
	public addY(y: number): Position{
		this.y = this.hook(this.y + y, true);
		return this;
	}

	public angleTo(position: Position): number{
		let piAngle: number = Math.atan2((this.getY() - position.getY()), (this.getX() - position.getX()));
		let deAngle: number = ((180 * piAngle / Math.PI) - 90) % 360;
		return deAngle;
	}
	public clone(): Position{
		return new Position(this.x, this.y);
	}
	public distanceTo(position: Position): number{
		let dX: number = position.getX() - this.getX(), 
			dY: number = position.getY() - this.getY();
		return Math.sqrt(dX * dX  + dY * dY);
	}
	public equals(position: Position): boolean{
		return (position != null && position.x == this.x && position.y == this.y);
	}

	public getX(): number{
		return this.x;
	}
	public getY(): number{
		return this.y;
	}

	public lerpTo(position: Position, factor: number){
		this._lerpPos = position;
		this._lerpFactor = factor;
	}

	public round(): Position {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}

	public set(x: number, y: number): Position {
		this.x = x;
		this.y = y;
		return this;
	}
	public setX(x: number): Position {
		this.x = x;
		return this;
	}
	public setY(y: number): Position {
		this.y = y;
		return this;
	}

	public shortestAngleTo(position: Position): number{
		let angle: number = this.angleTo(position);
		return (angle > 180) ? (angle - 360) : angle;
	}

	public subtract(position: Position): Position{
		position = this.hookPosition(position);
		this.subtractX(position.getX());
		this.subtractY(position.getY());

		return this;
	}
	public subtractX(x: number): Position{
		this.x = this.hook(this.x - x);
		return this;
	}
	public subtractY(y: number): Position{
		this.y = this.hook(this.y - y);
		return this;
	}

	private applyHook(func: Function){
		if(this.hooks == undefined) this.hooks = [];
		this.hooks.push(func);
	}
	private hook(n: number, isY = false): number{
		if(!this.hooks) return n;
		if(this.hooks.length == 0) return n;
		let position: Position = new Position((isY) ? this.getX() : n, (isY) ? n : this.getY());

		this.hooks.forEach(function(hook){
			let back: Position = hook(position);
			if(back != null) position = back;
		});

		if(isY) return position.getY();
		else return position.getX();
	}
	private hookPosition(position: Position): Position{
		if(!this.hooks) return position;
		if(this.hooks.length == 0) return position;
		position = position.clone();

		this.hooks.forEach(function(hook){
			let back: Position = hook(position);
			if(back != null) position = back;
		});

		return position;
	}

}