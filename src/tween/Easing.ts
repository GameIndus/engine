// Based on tween.js (https://github.com/tweenjs/tween.js) by Robert Penner

export namespace Easing {

    export function apply(easing: Easing, v: number): number {
        switch (easing) {
            case Easing.LINEAR:
                return v;

            case Easing.BACK_IN:
                let s = 1.70158;
                return v * v * ((s + 1) * v - s);
            case Easing.BACK_OUT:
                s = 1.70158;
                return --v * v * ((s + 1) * v + s) + 1;
            case Easing.BACK_IN_OUT:
                s = 1.70158;
                v *= 2;
                if (v < 1) {
                    return 0.5 * (v * v * ((s + 1) * v - s));
                } else {
                    return 0.5 * ((v -= 2) * v * ((s + 1) * v + s) + 2);
                }

            case Easing.BOUNCE_IN:
                return 1 - Easing.apply(Easing.BOUNCE_OUT, 1 - v);
            case Easing.BOUNCE_OUT:
                if (v < (1 / 2.75)) {
                    return 7.5625 * v * v;
                } else if (v < (2 / 2.75)) {
                    return 7.5625 * (v -= (1.5 / 2.75)) * v + 0.75;
                } else if (v < (2.5 / 2.75)) {
                    return 7.5625 * (v -= (2.25 / 2.75)) * v + 0.9375;
                } else {
                    return 7.5625 * (v -= (2.625 / 2.75)) * v + 0.984375;
                }
            case Easing.BOUNCE_IN_OUT:
                if (v < 0.5) {
                    return Easing.apply(Easing.BOUNCE_IN, v * 2) * 0.5;
                } else {
                    return Easing.apply(Easing.BOUNCE_OUT, v * 2 - 1) * 0.5 + 0.5;
                }

            case Easing.CIRCULAR_IN:
                return 1 - Math.sqrt(1 - v * v);
            case Easing.CIRCULAR_OUT:
                return Math.sqrt(1 - (--v * v));
            case Easing.CIRCULAR_IN_OUT:
                v *= 2;
                if (v < 1) {
                    return -0.5 * (Math.sqrt(1 - v * v) - 1);
                } else {
                    return 0.5 * (Math.sqrt(1 - (v -= 2) * v) + 1);
                }

            case Easing.CUBIC_IN:
                return v * v * v;
            case Easing.CUBIC_OUT:
                return --v * v * v + 1;
            case Easing.CUBIC_IN_OUT:
                v *= 2;
                if (v < 1) {
                    return 0.5 * v * v * v;
                } else {
                    return 0.5 * ((v -= 2) * v * v + 2);
                }

            case Easing.ELASTIC_IN:
                if (v === 0) {
                    return 0;
                }
                if (v === 1) {
                    return 1;
                }
                return -Math.pow(2, 10 * (v - 1)) * Math.sin((v - 1.1) * 5 * Math.PI);
            case Easing.ELASTIC_OUT:
                if (v === 0) {
                    return 0;
                }
                if (v === 1) {
                    return 1;
                }
                return Math.pow(2, -10 * v) * Math.sin((v - 0.1) * 5 * Math.PI) + 1;
            case Easing.ELASTIC_IN_OUT:
                if (v === 0) {
                    return 0;
                }
                if (v === 1) {
                    return 1;
                }

                v *= 2;

                if (v < 1) {
                    return -0.5 * Math.pow(2, 10 * (v - 1)) * Math.sin((v - 1.1) * 5 * Math.PI);
                } else {
                    return 0.5 * Math.pow(2, -10 * (v - 1)) * Math.sin((v - 1.1) * 5 * Math.PI) + 1;
                }

            case Easing.EXPONENTIAL_IN:
                return v === 0 ? 0 : Math.pow(1024, v - 1);
            case Easing.EXPONENTIAL_OUT:
                return v === 1 ? 1 : 1 - Math.pow(2, -10 * v);
            case Easing.EXPONENTIAL_IN_OUT:
                if (v === 0) {
                    return 0;
                }
                if (v === 1) {
                    return 1;
                }

                v *= 2;

                if (v < 1) {
                    return 0.5 * Math.pow(1024, v - 1);
                } else {
                    return 0.5 * (-Math.pow(2, -10 * (v - 1)) + 2);
                }

            case Easing.QUADRATIC_IN:
                return v * v;
            case Easing.QUADRATIC_OUT:
                return v * (2 - v);
            case Easing.QUADRATIC_IN_OUT:
                v *= 2;
                if (v < 1) {
                    return 0.5 * v * v;
                } else {
                    return -0.5 * (--v * (v - 2) - 1);
                }

            case Easing.QUARTIC_IN:
                return v * v * v * v;
            case Easing.QUARTIC_OUT:
                return 1 - (--v * v * v * v);
            case Easing.QUARTIC_IN_OUT:
                v *= 2;
                if (v < 1) {
                    return 0.5 * v * v * v * v;
                } else {
                    return -0.5 * ((v -= 2) * v * v * v - 2);
                }

            case Easing.QUINTIC_IN:
                return v * v * v * v * v;
            case Easing.QUINTIC_OUT:
                return --v * v * v * v * v + 1;
            case Easing.QUINTIC_IN_OUT:
                v *= 2;
                if (v < 1) {
                    return 0.5 * v * v * v * v * v;
                } else {
                    return 0.5 * ((v -= 2) * v * v * v * v + 2);
                }

            case Easing.SINUSOIDAL_IN:
                return 1 - Math.cos(v * Math.PI / 2);
            case Easing.SINUSOIDAL_OUT:
                return Math.sin(v * Math.PI / 2);
            case Easing.SINUSOIDAL_IN_OUT:
                return 0.5 * (1 - Math.cos(Math.PI * v));

            default:
                return v;
        }
    }

}

export enum Easing {
    LINEAR,

    BACK_IN,
    BACK_OUT,
    BACK_IN_OUT,

    BOUNCE_IN,
    BOUNCE_OUT,
    BOUNCE_IN_OUT,

    CIRCULAR_IN,
    CIRCULAR_OUT,
    CIRCULAR_IN_OUT,

    CUBIC_IN,
    CUBIC_OUT,
    CUBIC_IN_OUT,

    ELASTIC_IN,
    ELASTIC_OUT,
    ELASTIC_IN_OUT,

    EXPONENTIAL_IN,
    EXPONENTIAL_OUT,
    EXPONENTIAL_IN_OUT,

    QUADRATIC_IN,
    QUADRATIC_OUT,
    QUADRATIC_IN_OUT,

    QUARTIC_IN,
    QUARTIC_OUT,
    QUARTIC_IN_OUT,

    QUINTIC_IN,
    QUINTIC_OUT,
    QUINTIC_IN_OUT,

    SINUSOIDAL_IN,
    SINUSOIDAL_OUT,
    SINUSOIDAL_IN_OUT,
}
