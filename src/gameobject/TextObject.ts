import Game from "../core/Game";
import Color from "../util/Color";
import GameObject from "./GameObject";
import Graphics from "./Graphics";

export default class TextObject extends GameObject {

    private readonly text: string;

    private _fontFamily: string;

    private _fontSize: number;

    private _color: Color;

    private _opacity: number;

    private _lineHeight?: number;

    public constructor(game: Game, name: string, text: string) {
        super(game, name);
        this.text = text;
        this._fontFamily = "Arial";
        this._fontSize = 16;
        this._color = Color.BLACK;
        this._opacity = 1;
    }

    public get fontFamily(): string {
        return this._fontFamily;
    }

    public set fontFamily(fontFamily: string) {
        this._fontFamily = fontFamily;
    }

    public get fontSize(): number {
        return this._fontSize;
    }

    public set fontSize(fontSize: number) {
        this._fontSize = fontSize;
        this._lineHeight = fontSize;
    }

    public get color(): Color {
        return this._color;
    }

    public set color(color: Color) {
        this._color = color;
    }

    public get opacity(): number {
        return this._opacity;
    }

    public set opacity(opacity: number) {
        this._opacity = opacity;
    }

    public get lineHeight(): number | undefined {
        return this._lineHeight;
    }

    public set lineHeight(lineHeight: number | undefined) {
        this._lineHeight = lineHeight;
    }

    public get isMultiline(): boolean {
        return this.text.indexOf("\n") > -1;
    }

    public getOpacity(): number {
        return this.opacity;
    }

    public update(): void {
        // Not implemented
    }

    public render(graphics: Graphics, time: number): void {
        graphics.writeTextAt(
            this.text, this.position.x, this.position.y,
            this.color, this.fontFamily, this.fontSize, this.lineHeight,
        );
    }

}
