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

    public static degrees2radian(degrees: number): number {
        return degrees / MathUtil.degrees;
    }

    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private static degrees: number = 180 / Math.PI;

}
