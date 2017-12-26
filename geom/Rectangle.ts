class Rectangle implements Shape {
	private _x: number;
	private _y: number;
	private _width : number;
	private _height: number;

	constructor(x?: number, y?: number, width?: number, height?: number){
		this.x      = x || 0;
		this.y      = y || 0;
		this.width  = width || 0;
		this.height = height || 0;
	}

	public get x(): number{
		return this._x;
	}
	public get y(): number{
		return this._y;
	}
	public get width(): number{
		return this._width;
	}
	public get height(): number{
		return this._height;
	}
	public get empty(): boolean{
		return (!this.width || !this.height);
	}
	public get points(): Point[]{
		return [
			new Point(this.x              , this.y              ),
			new Point(this.x + this.width , this.y              ),
			new Point(this.x + this.width , this.y + this.height),
			new Point(this.x              , this.y + this.height)
		]
	}

	public set x(x: number){
		this._x = x;
	}
	public set y(y: number){
		this._y = y;
	}
	public set width(width: number){
		this._width = width;
	}
	public set height(height: number){
		this._height = height;
	}
	public set empty(empty: boolean){
		if(empty) this.setTo(0, 0, 0, 0);
	}


	public clone(): Rectangle{
		return new Rectangle(this.x, this.y, this.width, this.height);
	}
	public copyFrom(rectangle: Rectangle): Rectangle{
		return this.setTo(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	}
	public copyTo(rectangle: Rectangle): Rectangle{
		rectangle.x = this.x;
		rectangle.y = this.y;
		rectangle.width = this.width;
		rectangle.height = this.height;
		return this;
	}
	public getPoint(position: RectanglePosition, out?: Point): Point{
		let point: Point = out || new Point();

		switch(position){
			default:
			case RectanglePosition.TOP_LEFT:
				return point.setTo(this.x, this.y);
			case RectanglePosition.TOP_CENTER:
				return point.setTo(this.x + this.getSize().width / 2, this.y);
			case RectanglePosition.TOP_RIGHT:
				return point.setTo(this.x + this.getSize().width, this.y);
			case RectanglePosition.CENTER_LEFT:
				return point.setTo(this.x, this.y + this.getSize().height / 2);
			case RectanglePosition.CENTER:
				return point.setTo(this.x + this.getSize().width / 2, this.y + this.getSize().height / 2);
			case RectanglePosition.CENTER_RIGHT:
				return point.setTo(this.x + this.getSize().width, this.y + this.getSize().height / 2);
			case RectanglePosition.BOTTOM_LEFT:
				return point.setTo(this.x, this.y + this.getSize().height);
			case RectanglePosition.BOTTOM_CENTER:
				return point.setTo(this.x + this.getSize().width / 2, this.y + this.getSize().height);
			case RectanglePosition.BOTTOM_RIGHT:
				return point.setTo(this.x + this.getSize().width, this.y + this.getSize().height);
		}
	}
	public getSize(): RectangleSize{
		return {width: this.width, height: this.height};
	}
	public isEmpty(): boolean{
		return this.empty;
	}
	public intersects(rectangle : Rectangle): boolean{
		return (rectangle.x    <= this.x      + this.width 
				&& this.x      <= rectangle.x + rectangle.width 
				&& rectangle.y <= this.y      + this.height 
				&& this.y      <= rectangle.y + rectangle.height);
	}
	public pad(top: number = 0, left: number = 0, bottom: number = 0, right: number = 0): Rectangle{
		this.x      -= left;
		this.y      -= top;
		this.width  += left + right;
		this.height += top  + bottom;

		return this;
	}
	public resize(width: number, height: number): Rectangle{
		this.width = width;
		this.height = height;
		return this;
	}
	public scale(x: number, y?: number): Rectangle{
		this.width *= x;
		this.height *= y || x;
		return this;
	}
	public setTo(x: number, y: number, width: number, height: number): Rectangle{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		return this;
	}

	public toString(): string{
		return "{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}";
	}
}

const enum RectanglePosition{
	TOP_LEFT,
	TOP_CENTER,
	TOP_RIGHT,
	CENTER_LEFT,
	CENTER,
	CENTER_RIGHT,
	BOTTOM_LEFT,
	BOTTOM_CENTER,
	BOTTOM_RIGHT
}

namespace RectangleSize{
	export function clone(size: RectangleSize): RectangleSize{
		return {width: size.width, height: size.height};
	}
}
interface RectangleSize{
	width?: number;
	height?: number;
}