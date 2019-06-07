import Time from "../time/Time";
import Tween from "./Tween";

export default class TweenManager {

    private _tweens: Tween[] = [];

    public get tweens(): Tween[] {
        return this._tweens;
    }

    public add(tween: Tween): Tween {
        this._tweens.push(tween);
        return tween;
    }

    public remove(tween: Tween): void {
        const i = this._tweens.indexOf(tween);
        if (i >= -1) {
            this._tweens.splice(i, 1);
        }
    }

    public update(): void {
        if (this._tweens.length > 0) {
            let i = 0;
            const time = Time.now();

            while (i < this._tweens.length) {
                if (this._tweens[i].update(time)) {
                    i++;
                } else {
                    this._tweens.splice(i, 1);
                }
            }
        }
    }

}
