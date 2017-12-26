class Maths {

    private static degrees: number = 180 / Math.PI;


    public static clamp(value: number, min: number, max: number): number {
        if (value < min) return min;
        else if (max < value) return max;
        else return value;
    }

    // Trigonometry
    public static radian2degrees(radians: number): number {
        return radians * Maths.degrees;
    }

    public static degrees2radian(degrees: number): number {
        return degrees / Maths.degrees;
    }


    // Randomization
    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static randomOccInt(occ: number): number {
        return Maths.randomInt(0, occ - 1);
    }

}