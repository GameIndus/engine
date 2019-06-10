/**
 * Unit test suite for Color class.
 *
 * This file is part of the GameIndus engine.
 * This file is used by Jest to test the engine.
 *
 * @copyright Copyright (c) 2019, Maxime Malgorn
 * @author Maxime Malgorn <maxime.malgorn@laposte.net>
 * @since 2.0.0
 */

import Color from "../../src/math/Color";

const R = 145;
const G = 50;
const B = 86;

let color: Color;

beforeEach(() => {
   color = new Color(R, G, B);
});

test("should create a valid color", () => {
    expect(color.r).toBe(R);
    expect(color.g).toBe(G);
    expect(color.b).toBe(B);
    expect(color.a).toBe(1);

    // Now check an invalid color
    color = new Color(4780, -1, 6.2, 2);
    expect(color.r).toBe(255);
    expect(color.g).toBe(0);
    expect(color.b).toBe(6);
    expect(color.a).toBe(1);
});

test("should have valid default colors", () => {
    // Check each default color.
    expect(Color.Black.rgba).toBe("rgba(0,0,0,1)");
    expect(Color.Brown.rgba).toBe("rgba(102,51,0,1)");
    expect(Color.Blue.rgba).toBe("rgba(0,0,255,1)");
    expect(Color.Cyan.rgba).toBe("rgba(0,255,255,1)");
    expect(Color.DarkBlue.rgba).toBe("rgba(0,0,139,1)");
    expect(Color.DarkGreen.rgba).toBe("rgba(0,100,0,1)");
    expect(Color.Gray.rgba).toBe("rgba(128,128,128,1)");
    expect(Color.Green.rgba).toBe("rgba(0,255,0,1)");
    expect(Color.LightBlue.rgba).toBe("rgba(173,216,230,1)");
    expect(Color.Magenta.rgba).toBe("rgba(255,0,255,1)");
    expect(Color.Orange.rgba).toBe("rgba(255,128,0,1)");
    expect(Color.Pink.rgba).toBe("rgba(255,51,255,1)");
    expect(Color.Purple.rgba).toBe("rgba(102,0,102,1)");
    expect(Color.Red.rgba).toBe("rgba(255,0,0,1)");
    expect(Color.Transparent.rgba).toBe("rgba(0,0,0,0)");
    expect(Color.White.rgba).toBe("rgba(255,255,255,1)");
    expect(Color.Yellow.rgba).toBe("rgba(255,255,0,1)");

    // Check random colors
    const random = Color.Random;
    expect(random.r).toBeGreaterThanOrEqual(0);
    expect(random.r).toBeLessThanOrEqual(255);
    expect(random.g).toBeGreaterThanOrEqual(0);
    expect(random.g).toBeLessThanOrEqual(255);
    expect(random.b).toBeGreaterThanOrEqual(0);
    expect(random.b).toBeLessThanOrEqual(255);
    expect(random.a).toBe(1);

    // A new color have to be instanced at each get.
    const darkBlue = Color.DarkBlue;
    darkBlue.r += 50;
    expect(darkBlue.r).not.toBe(Color.DarkBlue.r);
});

test("should create a color from its hex representation", () => {
    const color1 = Color.fromHex("#FF8974");
    expect(color1.rgba).toBe("rgba(255,137,116,1)");
    expect(color1.hex).toBe("#FF8974");

    const color2 = Color.fromHex("ed85C3");
    expect(color2.rgba).toBe("rgba(237,133,195,1)");
    expect(color2.hex).toBe("#ED85C3");

    const color3 = Color.fromHex("1Bc", 0.2);
    expect(color3.rgba).toBe("rgba(17,187,204,0.2)");
    expect(color3.hex).toBe("#11BBCC");

    expect(() => Color.fromHex("INVALID")).toThrow(Error);
    expect(() => Color.fromHex("#ZZZZZZ")).toThrow(Error);
});

test("should calculate a value for a color", () => {
    expect(color.value).toBe(9515606);
    expect(Color.Black.value).toBe(0);
    // tslint:disable-next-line:no-bitwise
    expect(Color.Red.value).toBe(255 << 16);
});

test("should calculate a hex representation", () => {
    expect(color.hex).toBe("#913256");
    expect(Color.Yellow.hex).toBe("#FFFF00");
    expect(Color.Green.hex).toBe("#00FF00");
    expect(Color.White.hex).toBe("#FFFFFF");
});

test("should calculate a hsl representation", () => {
    // Test basic cases
    expect(Color.Black.hsl).toEqual({h: 0, s: 0, l: 0});
    expect(Color.Red.hsl).toEqual({h: 0, s: 1, l: 0.5});
    expect(Color.Green.hsl).toEqual({h: 1 / 3, s: 1, l: 0.5});
    expect(Color.Blue.hsl).toEqual({h: 2 / 3, s: 1, l: 0.5});

    // Test specific cases
    expect(Color.Magenta.hsl.h * 2 * Math.PI).toBeCloseTo(Color.Magenta.hue);
    expect(Color.Pink.hsl).toEqual({h: 5 / 6, s: 1, l: 0.6});
});

test("should calculate the hue", () => {
    expect(color.hue).toBeCloseTo(5.898466);
    expect(Color.Black.hue).toBe(0);
    expect(Color.White.hue).toBe(0);
    expect(Color.Yellow.hue).toBeCloseTo(1.047197);
});

test("should get the rgba representation", () => {
    expect(color.rgba).toBe("rgba(" + R + "," + G + "," + B + ",1)");
    expect(Color.Black.rgba).toBe("rgba(0,0,0,1)");
    expect(Color.Brown.rgba).toBe("rgba(102,51,0,1)");
    expect(Color.Transparent.rgba).toBe("rgba(0,0,0,0)");
});

test("should clone a color instance", () => {
    const clone = color.clone();
    clone.r = color.r + 2;
    clone.g = color.g + 2;
    clone.b = color.b + 2;
    clone.a = color.a - 0.2;

    expect(clone.r).toBe(color.r + 2);
    expect(clone.g).toBe(color.g + 2);
    expect(clone.b).toBe(color.b + 2);
    expect(clone.a).toBe(color.a - 0.2);
});

test("should darken a color", () => {
    const gray = Color.White.darken(0.5);
    expect(gray.r).toBe(128);
    expect(gray.g).toBe(128);
    expect(gray.b).toBe(128);
    expect(gray.a).toBe(1);

    const black = Color.Brown.darken(20);
    expect(black.r).toBe(0);
    expect(black.g).toBe(0);
    expect(black.b).toBe(0);
    expect(black.a).toBe(1);

    expect(() => Color.Brown.darken(-1)).toThrow(RangeError);
});

test("should desaturate a color", () => {
    color.desaturate(0.5);
    expect(color.r).toBe(121);
    expect(color.g).toBe(74);
    expect(color.b).toBe(92);
    expect(color.a).toBe(1);

    const desaturated = Color.DarkGreen.desaturate(20);
    expect(desaturated.r).toBe(255);
    expect(desaturated.g).toBe(0);
    expect(desaturated.b).toBe(255);
    expect(desaturated.a).toBe(1);

    expect(() => Color.Cyan.desaturate(-1)).toThrow(RangeError);
});

test("should fade a color", () => {
    expect(color.fade(0.4).a).toBeCloseTo(0.6);
    expect(Color.Purple.fade(0.7).a).toBeCloseTo(0.3);
    expect(Color.Transparent.fade(0.8).a).toBe(0);
    expect(Color.Orange.fade(18).a).toBe(0);
    expect(() => Color.Cyan.fade(-2)).toThrow(RangeError);
});

test("should convert a color to a grayscale", () => {
    expect(color.grayscale().rgba).toBe("rgba(82,82,82,1)");
    expect(Color.Black.grayscale().rgba).toBe(Color.Black.rgba);
    expect(Color.LightBlue.grayscale().rgba).toBe("rgba(205,205,205,1)");
});

test("should check if a color is dark", () => {
    expect(color.isDark()).toBeTruthy();
    expect(Color.Black.isDark()).toBeTruthy();
    expect(Color.White.isDark()).toBeFalsy();
    expect(Color.Pink.isDark()).toBeFalsy();
});

test("shouls check if a color is light", () => {
    expect(color.isLight()).toBeFalsy();
    expect(Color.Black.isLight()).toBeFalsy();
    expect(Color.White.isLight()).toBeTruthy();
    expect(Color.Pink.isLight()).toBeTruthy();
});

test("should lighten a color", () => {
    const lighten = color.lighten(1.2);
    expect(lighten.r).toBe(234);
    expect(lighten.g).toBe(195);
    expect(lighten.b).toBe(210);
    expect(lighten.a).toBe(1);

    const white = Color.Yellow.lighten(20);
    expect(white.r).toBe(255);
    expect(white.g).toBe(255);
    expect(white.b).toBe(255);
    expect(white.a).toBe(1);

    expect(() => Color.Green.lighten(-1)).toThrow(RangeError);
});

test("should mix with another color", () => {
    color.mix(Color.Pink);
    expect(color.rgba).toBe("rgba(200,51,171,1)");

    color.mix(new Color(100, 186, 2, 0.2), 0.4);
    expect(color.rgba).toBe("rgba(186,70,147,0.52)");

    expect(Color.Transparent.mix(Color.Orange, 1).rgba).toBe(Color.Transparent.rgba);
    expect(() => color.mix(Color.Black, -2)).toThrow(RangeError);
    expect(() => color.mix(Color.Black, 1.2)).toThrow(RangeError);
});

test("should negate a color", () => {
    color.negate();
    expect(color.r).toBe(255 - R);
    expect(color.g).toBe(255 - G);
    expect(color.b).toBe(255 - B);

    const magenta = Color.Magenta.negate();
    expect(magenta.rgba).toBe("rgba(0,255,0,1)");
});

test("should opaque a color", () => {
    const fadeColor = Color.LightBlue;
    fadeColor.a = 0.2;

    expect(fadeColor.opaquer(0.4).a).toBeCloseTo(0.28);
    expect(fadeColor.opaquer(2).a).toBeCloseTo(0.84);
    expect(fadeColor.opaquer(20).a).toBe(1);
    expect(Color.Transparent.opaquer(18).a).toBe(0);
    expect(() => Color.DarkGreen.opaquer(-2)).toThrow(RangeError);
});

test("should saturate a color", () => {
    color.saturate(0.5);
    expect(color.r).toBe(169);
    expect(color.g).toBe(26);
    expect(color.b).toBe(80);
    expect(color.a).toBe(1);

    const saturated = Color.LightBlue.saturate(20);
    expect(saturated.r).toBe(0);
    expect(saturated.g).toBe(255);
    expect(saturated.b).toBe(255);
    expect(saturated.a).toBe(1);

    expect(() => Color.Orange.saturate(-1)).toThrow(RangeError);
});
