class Color {
    private _rgba: RGBA;
    private _random: boolean;

    // a -> between 0 and 1
    constructor(r?: number, g?: number, b?: number, a?: number) {
        this._rgba = {
            r: r || 0,
            g: g || 0,
            b: b || 0,
            a: (a !== undefined) ? a * 255 : 255
        };

        if (this._rgba.a > 255) this._rgba.a = 255;
    }

    // --  STATIC COLORS --
    public static get BLACK(): Color {
        return new Color(0, 0, 0);
    }

    public static get BROWN(): Color {
        return new Color(102, 51, 0);
    }

    public static get BLUE(): Color {
        return new Color(0, 0, 255);
    }

    public static get CYAN(): Color {
        return new Color(0, 255, 255);
    }

    public static get DARK_BLUE(): Color {
        return new Color(0, 0, 139);
    }

    public static get DARK_GREEN(): Color {
        return new Color(0, 100, 0);
    }

    public static get GRAY(): Color {
        return new Color(128, 128, 128);
    }

    public static get GREEN(): Color {
        return new Color(0, 255, 0);
    }

    public static get LIGHT_BLUE(): Color {
        return new Color(173, 216, 230);
    }

    public static get MAGENTA(): Color {
        return new Color(255, 0, 255);
    }

    public static get ORANGE(): Color {
        return new Color(255, 128, 0);
    }

    public static get PINK(): Color {
        return new Color(255, 51, 255);
    }

    public static get PURPLE(): Color {
        return new Color(102, 0, 102);
    }

    public static get RANDOM(): Color {
        return new Color().randomize();
    }

    public static get RED(): Color {
        return new Color(255, 0, 0);
    }

    public static get TRANSPARENT(): Color {
        return new Color(0, 0, 0, 0);
    }

    public static get WHITE(): Color {
        return new Color(255, 255, 255);
    }

    public static get YELLOW(): Color {
        return new Color(255, 255, 0);
    }

    public get color(): number {
        return this._rgba.r << 16 | this._rgba.g << 8 | this._rgba.b;
    }

    public get color32(): number {
        return this._rgba.a << 24 | this._rgba.r << 16 | this._rgba.g << 8 | this._rgba.b;
    }

    public get isRandom(): boolean {
        return this._random;
    }

    public static fromHex(hex: string): Color {
        hex = hex.replace(/^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let regex: RegExpExecArray = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (regex) {
            let r: number = parseInt(regex[1], 16);
            let g: number = parseInt(regex[2], 16);
            let b: number = parseInt(regex[3], 16);

            return new Color(r, g, b);
        }

        return null;
    }

    public static fromRGB(r: number, g: number, b: number): Color {
        return new Color(r, g, b);
    }

    public static fromRGBA(r: number, g: number, b: number, a: number): Color {
        return new Color(r, g, b, a);
    }

    public static fromWeb(webColor: string): Color {
        let regex: RegExpExecArray = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/.exec(webColor);

        if (regex) {
            let r: number = parseInt(regex[1], 10);
            let g: number = parseInt(regex[2], 10);
            let b: number = parseInt(regex[3], 10);
            let a: number = regex[4] !== undefined ? parseFloat(regex[4]) : 1;

            return new Color(r, g, b, a);
        }

        return null;
    }

    public static mix(color1: Color, color2: Color): Color {
        return color1.clone().mixWith(color2);
    }

    public clone(): Color {
        return Color.fromRGBA(this._rgba.r, this._rgba.g, this._rgba.b, this._rgba.a);
    }

    public mixWith(color: Color): Color {
        let moyR: number = Math.round((this.toRGBA().r + color.toRGBA().r) / 2);
        let moyG: number = Math.round((this.toRGBA().g + color.toRGBA().g) / 2);
        let moyB: number = Math.round((this.toRGBA().b + color.toRGBA().b) / 2);
        let moyA: number = Math.round((this.toRGBA().a + color.toRGBA().a) / 2);

        this.setTo(moyR, moyG, moyB, moyA);
        return this;
    }

    public randomize(): Color {
        this._rgba.r = Maths.randomInt(0, 255);
        this._rgba.g = Maths.randomInt(0, 255);
        this._rgba.b = Maths.randomInt(0, 255);

        this._random = true;

        return this;
    }

    public setTo(r: number, g: number, b: number, a?: number): Color {
        this._rgba.r = r;
        this._rgba.g = g;
        this._rgba.b = b;

        if (a) this._rgba.a = a;

        return this;
    }

    public updateRGBA(property: string, value: number): Color {
        if (this._rgba[property] != null) this._rgba[property] = value;
        return this;
    }

    public toRGB(): RGB {
        return {r: this._rgba.r, g: this._rgba.g, b: this._rgba.b};
    }

    public toRGBA(): RGBA {
        return this._rgba;
    }

    public toString(prefix: string = "#"): string {
        if (prefix == "#") {
            return "#" + ((1 << 24) + (this.toRGBA().r << 16) + (this.toRGBA().g << 8) + this.toRGBA().b).toString(16).slice(1);
        } else if (prefix == "rgba") {
            return "rgba(" + this.toRGBA().r + "," + this.toRGBA().g + "," + this.toRGBA().b + "," + this.toRGBA().a + ")";
        } else {
            return '0x' + this.numberToHex(this.toRGBA().a) + this.numberToHex(this.toRGBA().r) + this.numberToHex(this.toRGBA().g) + this.numberToHex(this.toRGBA().b);
        }
    }

    private numberToHex(n: number): string {
        let hex: string = n.toString(16);
        return (hex.length === 1) ? '0' + hex : hex;
    }

}


interface RGB {
    r: number;
    g: number;
    b: number;
}

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}