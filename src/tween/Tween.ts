import Signal from "../core/Signal";
import Color from "../math/Color";
import Time from "../time/Time";
import Util from "../util/Util";
import {Easing} from "./Easing";

export default class Tween {

    private readonly _onStart: Signal;

    private readonly _onUpdate: Signal;

    private readonly _onComplete: Signal;

    private _object: any;

    private _duration: number;

    private _delay: number;

    private _repeat: number;

    private _round: boolean;

    private _yoyo: boolean;

    private _minValue?: number;

    private _maxValue?: number;

    private _startValues: any;

    private _startValuesRepeat: any;

    private _endValues: any;

    private _isPlaying: boolean;

    private _startTime?: number;

    private _easing: Easing;

    private _reversed: boolean = false;

    private _startSignalFired?: boolean;

    private _destroyed?: boolean;

    public constructor(object: any) {
        this._object = object;
        this._onStart = new Signal();
        this._onUpdate = new Signal(true);
        this._onComplete = new Signal();
        this._duration = 1000;
        this._delay = 0;
        this._repeat = 0;
        this._round = false;
        this._yoyo = false;
        this._isPlaying = false;
        this._easing = Easing.LINEAR;
    }

    public delay(delay: number): Tween {
        this._delay = delay;
        return this;
    }

    public easing(easing: Easing): Tween {
        this._easing = easing;
        return this;
    }

    public end(): Tween {
        if (this._startTime) {
            this.update(this._startTime + this._duration);
        }
        return this;
    }

    public destroy(): Tween {
        this.stop();

        this._destroyed = true;

        return this;
    }

    public max(value: number): Tween {
        this._maxValue = value;
        return this;
    }

    public min(value: number): Tween {
        this._minValue = value;
        return this;
    }

    public repeat(times: number): Tween {
        this._repeat = times;
        return this;
    }

    public round(round: boolean): Tween {
        this._round = (round !== undefined) ? round : true;
        return this;
    }

    public start(time?: number): Tween {
        this._isPlaying = true;
        this._startValues = {};

        // Init start values
        if (typeof this._object === "number") {
            this._startValues[0] = this._object;
        } else if (Array.isArray(this._object)) {
            let i = 0;
            for (const prop of this._object) {
                this._startValues[i] = prop;
                i++;
            }
        } else {
            this._startValues = Util.copyObject(this._object);

            if (typeof (this._object).clone !== "undefined" && !(this._object instanceof Color)) {
                this._startValues = this._object.clone();
            }
        }

        this._startValuesRepeat = this._startValues || 0;

        // Init end values
        if (typeof this._endValues === "number") {
            const val = this._endValues * 1;
            this._endValues = {};
            this._endValues[0] = val;
        } else if (Array.isArray(this._endValues)) {
            let i = 0;
            const values = this._endValues.slice();

            this._endValues = {};

            for (const prop of values) {
                this._endValues[i] = prop;
                i++;
            }
        } else {
            if (this._endValues instanceof Color) {
                this._endValues = Util.copyObject(this._endValues);
            }
        }

        this._startTime = (time !== undefined) ? time : Time.now();
        this._startTime += this._delay;

        return this;
    }

    public stop(): Tween {
        if (!this._isPlaying) {
            return this;
        }

        this._isPlaying = false;

        return this;
    }

    public to(object: any, duration: number): Tween {
        if (duration !== undefined) {
            this._duration = duration;
        }

        this._endValues = object;
        return this;
    }

    public yoyo(yoyo: boolean = true): Tween {
        this._yoyo = yoyo;
        return this;
    }

    public update(time: number): boolean {
        let elapsed: number;
        let value: number;

        if (!this._startTime) {
            return false;
        }
        if (time < this._startTime) {
            return true;
        }
        if (!this._isPlaying) {
            return true;
        }
        if (this._destroyed) {
            return false;
        }

        if (!this._startSignalFired) {
            this._onStart.dispatch(this._object);
            this._startSignalFired = true;
        }

        elapsed = (time - this._startTime) / this._duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        value = Easing.apply(this._easing, elapsed);

        for (const property in this._endValues) {

            if (this._startValues[property] === undefined) {
                continue;
            }

            const start = this._startValues[property] || 0;
            const end = this._endValues[property];

            if (typeof end === "number") {
                let objvalue = start + (end - start) * value;

                if (this._minValue !== undefined && objvalue < this._minValue) {
                    objvalue = this._minValue;
                }
                if (this._maxValue !== undefined && objvalue > this._maxValue) {
                    objvalue = this._maxValue;
                }

                if (this._round) {
                    objvalue = Math.round(objvalue);
                }

                if (this._object[property] === undefined) {
                    this._object = objvalue;
                } else {
                    this._object[property] = objvalue;
                }
            }

        }

        if (!this._onUpdate.isEmpty) {
            this._onUpdate.dispatch(this._object, value);
        }

        if (elapsed === 1) {

            if (this._repeat > 0) {

                if (isFinite(this._repeat)) {
                    this._repeat--;
                }

                for (const property in this._startValuesRepeat) {
                    if (!this._startValuesRepeat.hasOwnProperty(property)) {
                        continue;
                    }

                    if (this._yoyo) {
                        const tmp = this._startValuesRepeat[property];

                        this._startValuesRepeat[property] = this._endValues[property];
                        this._endValues[property] = tmp;
                    }

                    this._startValues[property] = this._startValuesRepeat[property];

                }

                if (this._yoyo) {
                    this._reversed = !this._reversed;
                }

                this._startTime = time;
                return true;
            } else {
                this._onComplete.dispatch(this._object);
                return false;
            }
        }

        return true;
    }

}
