/**
 * Class representing a color.
 *
 * This file is part of the GameIndus engine.
 *
 * @copyright Copyright (c) 2019, Maxime Malgorn
 * @author Maxime Malgorn <maxime.malgorn@laposte.net>
 * @since 2.0.0
 */
export default class Color {
    /**
     * Black color (#000000)
     */
    public static get Black(): Color {
        return new Color(0, 0, 0)
    }

    /**
     * Brown color (#663300)
     */
    public static get Brown(): Color {
        return new Color(102, 51, 0)
    }

    /**
     * Blue color (#0000FF)
     */
    public static get Blue(): Color {
        return new Color(0, 0, 255)
    }

    /**
     * Cyan color (#00FFFF)
     */
    public static get Cyan(): Color {
        return new Color(0, 255, 255)
    }

    /**
     * Dark blue color (#00008B)
     */
    public static get DarkBlue(): Color {
        return new Color(0, 0, 139)
    }

    /**
     * Dark green color (#006400)
     */
    public static get DarkGreen(): Color {
        return new Color(0, 100, 0)
    }

    /**
     * Gray color (#808080)
     */
    public static get Gray(): Color {
        return new Color(128, 128, 128)
    }

    /**
     * Green color (#00FF00)
     */
    public static get Green(): Color {
        return new Color(0, 255, 0)
    }

    /**
     * Light blue color (#ADD8E6)
     */
    public static get LightBlue(): Color {
        return new Color(173, 216, 230)
    }

    /**
     * Magenta color (#FF00FF)
     */
    public static get Magenta(): Color {
        return new Color(255, 0, 255)
    }

    /**
     * Orange color (#FF8000)
     */
    public static get Orange(): Color {
        return new Color(255, 128, 0)
    }

    /**
     * Pink color (#FF33FF)
     */
    public static get Pink(): Color {
        return new Color(255, 51, 255)
    }

    /**
     * Purple color (#660066)
     */
    public static get Purple(): Color {
        return new Color(102, 0, 102)
    }

    /**
     * Return a random color.
     */
    public static get Random(): Color {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        return new Color(r, g, b)
    }

    /**
     * Red color (#FF0000)
     */
    public static get Red(): Color {
        return new Color(255, 0, 0)
    }

    /**
     * Transparent color (black with a zero alpha)
     */
    public static get Transparent(): Color {
        return new Color(0, 0, 0, 0)
    }

    /**
     * White color (#FFFFFF)
     */
    public static get White(): Color {
        return new Color(255, 255, 255)
    }

    /**
     * Yellow color (#FFFF00)
     */
    public static get Yellow(): Color {
        return new Color(255, 255, 0)
    }

    /**
     * Create a new color object from its hex representation.
     * @param hex Hex representation of the color
     * @param a Alpha component to apply
     */
    public static fromHex(hex: string, a?: number): Color {
        const h = '0123456789ABCDEF'
        hex = hex.toUpperCase().replace('#', '')

        let r = -1
        let g = -1
        let b = -1

        if (hex.length === 3) {
            r = h.indexOf(hex[0]) * 16 + h.indexOf(hex[0])
            g = h.indexOf(hex[1]) * 16 + h.indexOf(hex[1])
            b = h.indexOf(hex[2]) * 16 + h.indexOf(hex[2])
        } else if (hex.length === 6) {
            r = h.indexOf(hex[0]) * 16 + h.indexOf(hex[1])
            g = h.indexOf(hex[2]) * 16 + h.indexOf(hex[3])
            b = h.indexOf(hex[4]) * 16 + h.indexOf(hex[5])
        }

        if (r < 0 || g < 0 || b < 0) {
            throw new Error('Invalid hex string : ' + hex)
        }

        return new Color(r, g, b, a !== undefined ? a : 1)
    }

    /**
     * Red property
     */
    private _r = 0

    /**
     * Green property
     */
    private _g = 0

    /**
     * Blue property
     */
    private _b = 0

    /**
     * Alpha property
     */
    private _a = 1

    /**
     * Construct a new color instance.
     * @param r Red component (from 0 to 255)
     * @param g Green component (from 0 to 255)
     * @param b Blue component (from 0 to 255)
     * @param a Alpha channel (from 0 to 1)
     */
    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a !== undefined ? a : 1
    }

    /**
     * Return the red property of the color
     */
    public get r(): number {
        return this._r
    }

    /**
     * Set the red property of the color
     * @param r value to set
     */
    public set r(r: number) {
        this._r = Math.max(Math.min(Math.round(r), 255), 0)
    }

    /**
     * Return the green property of the color
     */
    public get g(): number {
        return this._g
    }

    /**
     * Set the green property of the color
     * @param g value to set
     */
    public set g(g: number) {
        this._g = Math.max(Math.min(Math.round(g), 255), 0)
    }

    /**
     * Return the blue property of the color
     */
    public get b(): number {
        return this._b
    }

    /**
     * Set the blue property of the color
     * @param b value to set
     */
    public set b(b: number) {
        this._b = Math.max(Math.min(Math.round(b), 255), 0)
    }

    /**
     * Return the transparency property of the color
     */
    public get a(): number {
        return this._a
    }

    /**
     * Set the transparency property
     * @param a value to set
     */
    public set a(a: number) {
        this._a = Math.max(Math.min(a, 1), 0)
    }

    /**
     * Return the hex representation of this color.
     * String will be always composed with uppercase letters.
     */
    public get hex(): string {
        // tslint:disable-next-line:no-bitwise
        const hex = '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
        return hex.toUpperCase()
    }

    /**
     * Return the hsl representation of this color.
     * (Hue, Saturation, Lightness)
     * @see https://gist.github.com/mjackson/5311256
     */
    public get hsl(): HSLColor {
        const r = this.r / 255
        const g = this.g / 255
        const b = this.b / 255
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const l = (max + min) / 2

        let h = 0
        let s = 0

        if (max === min) {
            h = s = 0 // achromatic
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0)
                    break
                case g:
                    h = (b - r) / d + 2
                    break
                case b:
                    h = (r - g) / d + 4
                    break
            }

            h /= 6
        }

        return { h, s, l }
    }

    /**
     * Return the hue of this color.
     * Represented on a circle (from 0 to 2PI).
     * @see https://en.wikipedia.org/wiki/Hue
     */
    public get hue(): number {
        const hue = Math.atan2(1.73205080757 * (this.g - this.b), 2 * this.r - this.g - this.b)
        const pi2 = 2 * Math.PI
        return ((hue % pi2) + pi2) % pi2
    }

    /**
     * Return the RGBA representation of the color.
     */
    public get rgba(): string {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')'
    }

    /**
     * Calculate the decimal value of the color.
     */
    public get value(): number {
        // tslint:disable-next-line:no-bitwise
        return (this.r << 16) | (this.g << 8) | this.b
    }

    /**
     * Clone of the current color.
     */
    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a)
    }

    /**
     * Darken the current color.
     * @param ratio Ratio to apply for the darken operation.
     */
    public darken(ratio: number): Color {
        if (ratio < 0) {
            throw new RangeError('ratio must be positive (' + ratio + ').')
        }

        const hsl = this.hsl
        hsl.l -= hsl.l * ratio
        this.applyHsl(hsl)
        return this
    }

    /**
     * Desaturate the current color.
     * @param ratio Ratio to apply on the saturation channel.
     */
    public desaturate(ratio: number): Color {
        if (ratio < 0) {
            throw new RangeError('ratio must be positive (' + ratio + ').')
        }

        const hsl = this.hsl
        hsl.s -= hsl.s * ratio
        this.applyHsl(hsl)
        return this
    }

    /**
     * Fade the current color.
     * @param ratio Ratio to apply on the alpha channel.
     */
    public fade(ratio: number): Color {
        if (ratio < 0) {
            throw new RangeError('ratio must be positive (' + ratio + ').')
        }

        this.a -= this.a * ratio
        return this
    }

    /**
     * Convert the current color to a grayscale.
     * @see http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
     */
    public grayscale(): Color {
        const value = this.r * 0.3 + this.g * 0.59 + this.b * 0.11

        this.r = value
        this.g = value
        this.b = value

        return this
    }

    /**
     * Check is the color is dark.
     * @see https://24ways.org/2010/calculating-color-contrast
     */
    public isDark(): boolean {
        const yiq = (this.r * 299 + this.g * 587 + this.b * 114) / 1000
        return yiq < 128
    }

    /**
     * Check if the color is light.
     */
    public isLight(): boolean {
        return !this.isDark()
    }

    /**
     * Lighten the current color.
     * @param ratio Ratio to apply for the lighten operation.
     */
    public lighten(ratio: number): Color {
        if (ratio < 0) {
            throw new RangeError('ratio must be positive (' + ratio + ').')
        }

        const hsl = this.hsl
        hsl.l += hsl.l * ratio
        this.applyHsl(hsl)
        return this
    }

    /**
     * Mix this color with another one.
     * @param color Color to mix with.
     * @param weight Determine how much of each color will be in the result.
     *               A larger weight indicates that more of the current color should be used.
     */
    public mix(color: Color, weight = 0.5): Color {
        if (weight < 0 || weight > 1) {
            throw new RangeError('weight must be in range [0-1]')
        }

        const w = 2 * weight - 1
        const alpha = this.a - color.a
        const factor = ((w * alpha === -1 ? w : (w + alpha) / (1 + w * alpha)) + 1) / 2.0
        const opposite = 1 - factor

        this.r = factor * this.r + opposite * color.r
        this.g = factor * this.g + opposite * color.g
        this.b = factor * this.b + opposite * color.b
        this.a = this.a * weight + color.a * (1 - weight)

        return this
    }

    /**
     * Negate the color.
     */
    public negate(): Color {
        this.r = 255 - this.r
        this.g = 255 - this.g
        this.b = 255 - this.b
        return this
    }

    /**
     * Opaque the current color.
     * @param ratio Ratio to apply on the alpha channel.
     */
    public opaquer(ratio: number): Color {
        if (ratio < 0) {
            throw new RangeError('ratio must be positive (' + ratio + ').')
        }

        this.a += this.a * ratio
        return this
    }

    /**
     * Saturate the current color.
     * @param ratio Ratio to apply on the saturation channel.
     */
    public saturate(ratio: number): Color {
        if (ratio < 0) {
            throw new RangeError('ratio must be positive (' + ratio + ').')
        }

        const hsl = this.hsl
        hsl.s += hsl.s * ratio
        this.applyHsl(hsl)
        return this
    }

    /**
     * Apply HSL properties to the current color.
     * (Hue, Saturation, Lightness)
     * @see https://gist.github.com/mjackson/5311256
     */
    private applyHsl(hsl: HSLColor) {
        if (hsl.s === 0) {
            this.r = this.g = this.b = hsl.l * 255 // achromatic
        } else {
            const q = hsl.l < 0.5 ? hsl.l * (1 + hsl.s) : hsl.l + hsl.s - hsl.l * hsl.s
            const p = 2 * hsl.l - q

            this.r = hue2rgb(p, q, hsl.h + 1 / 3) * 255
            this.g = hue2rgb(p, q, hsl.h) * 255
            this.b = hue2rgb(p, q, hsl.h - 1 / 3) * 255
        }
    }
}

/**
 * Helper to convert HSL properties to a RGB color.
 * @param p The P property for the conversion
 * @param q The Q property for the conversion
 * @param t The T property for the conversion
 */
const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) {
        t += 1
    }
    if (t > 1) {
        t -= 1
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t
    }
    if (t < 1 / 2) {
        return q
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6
    }
    return p
}

/**
 * Internal interface which represents a color
 * in its HSL representation.
 */
export interface HSLColor {
    h: number
    s: number
    l: number
}
