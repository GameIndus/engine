class Text extends GameObject {
    private text: string;

    constructor(game: Game, name: string, text: string) {
        super(game, name);

        this.text = text;
    }

    private _fontFamily: string = "Arial";

    public get fontFamily(): string {
        return this._fontFamily;
    }

    public set fontFamily(fontFamily: string) {
        this._fontFamily = fontFamily;
    }

    private _fontSize: number = 16;

    public get fontSize(): number {
        return this._fontSize;
    }

    public set fontSize(fontSize: number) {
        this._fontSize = fontSize;
        this._lineHeight = fontSize;
    }

    private _color: Color = Color.BLACK;

    public get color(): Color {
        return this._color;
    }

    public set color(color: Color) {
        this._color = color;
    }

    private _opacity: number = 1;

    public get opacity(): number {
        return this._opacity;
    }

    public set opacity(opacity: number) {
        this._opacity = opacity;
    }

    private _lineHeight: number;

    public get lineHeight(): number {
        return this._lineHeight;
    }

    public set lineHeight(lineHeight: number) {
        this._lineHeight = lineHeight;
    }

    public get isMultiline(): boolean {
        return this.text.indexOf("\n") > -1;
    }

    public getOpacity(): number {
        return this.opacity;
    }

    public render(graphics: Graphics, time: number): void {
        graphics.writeTextAt(this.text, this.position.x, this.position.y, this.color, this.fontFamily, this.fontSize, this.lineHeight);
    }

}
