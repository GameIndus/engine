export default class MathUtil {
    public static clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min
        } else if (max < value) {
            return max
        } else {
            return value
        }
    }

    public static degrees2radian(degrees: number): number {
        return degrees / MathUtil.degrees
    }

    private static degrees: number = 180 / Math.PI
}
