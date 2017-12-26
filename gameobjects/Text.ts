class Text extends GameObject{
	private text: string;

	private _fontFamily : string = "Arial";
	private _fontSize   : number = 16;
	private _color      : Color  = Color.BLACK;
	private _opacity    : number = 1;
	private _lineHeight : number;



	constructor(game: Game, name: string, text: string){
		super(game, name);
		
		this.text = text;
	}


	public get fontFamily(): string {
		return this._fontFamily;
	}
	public get fontSize(): number {
		return this._fontSize;
	}
	public get color(): Color {
		return this._color;
	}
	public get isMultiline(): boolean {
		return this.text.indexOf("\n") > -1;
	}
	public get lineHeight(): number {
		return this._lineHeight;
	}
	public get opacity(): number {
		return this._opacity;
	}


	public set fontFamily(fontFamily: string) {
		this._fontFamily = fontFamily;
	}
	public set fontSize(fontSize: number) {
		this._fontSize   = fontSize;
		this._lineHeight = fontSize;
	}
	public set color(color: Color) {
		this._color = color;
	}
	public set lineHeight(lineHeight: number) {
		this._lineHeight = lineHeight;
	}
	public set opacity(opacity: number) {
		this._opacity = opacity;
	}


	public getOpacity(): number{
		return this.opacity;
	}

	public render(graphics: Graphics, time: number): void{
		graphics.writeTextAt(this.text, this.position.x, this.position.y, this.color, this.fontFamily, this.fontSize, this.lineHeight);
	}

}
