export default class MathUtil {

    public static clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min;
        } else if (max < value) {
            return max;
        } else {
            return value;
        }
    }

    public static radian2degrees(radians: number): number {
        return radians * MathUtil.degrees;
    }

    public static degrees2radian(degrees: number): number {
        return degrees / MathUtil.degrees;
    }

    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static randomOccInt(occ: number): number {
        return MathUtil.randomInt(0, occ - 1);
    }

    private static degrees: number = 180 / Math.PI;

}
