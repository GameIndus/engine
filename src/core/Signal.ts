export default class Signal {

    private _prevParameters: any[];

    private _shouldPropagate: boolean;

    private _bindings: Array<(...args: any) => boolean>;

    private _active: boolean;

    private readonly _memorize: boolean;

    public constructor(memorize?: boolean) {
        this._prevParameters = [];
        this._bindings = [];
        this._active = true;
        this._shouldPropagate = false;

        this._memorize = memorize || false;
    }

    public get bindings(): Array<(...args: any) => boolean> {
        return this._bindings;
    }

    public get active(): boolean {
        return this._active;
    }

    public get memorize(): boolean {
        return this._memorize;
    }

    public get isEmpty(): boolean {
        return this.bindings.length === 0;
    }

    public add(func: (...args: any) => boolean): Signal {
        if (func != null) {
            this.bindings.push(func);
        }

        return this;
    }

    public dispatch(...args: any) {
        if (this.active) {
            if (this.memorize) {
                this._prevParameters = args;
            }

            // After memorize, we check for bindings
            if (this.bindings.length) {
                let n: number = this.bindings.length;
                const bindings = this.bindings.splice(0);

                if (this.memorize) {
                    this._bindings = bindings;
                }

                // Reset propagation
                this._shouldPropagate = true;

                do {
                    n--;
                } while (bindings[n] && this._shouldPropagate && bindings[n].apply(this, args));
            }
        }
    }

    public dispose() {
        this.removeAll();

        this._bindings = [];
        this._prevParameters = [];
    }

    public forget() {
        this._prevParameters = [];
    }

    public halt() {
        this._shouldPropagate = false;
    }

    public hasBinding(func: (...args: any) => boolean): boolean {
        return this.bindings.indexOf(func) > -1;
    }

    public removeAll() {
        this.bindings.length = 0;
    }

    public toString(): string {
        return "[Signal active:" + this.active + " memorize:" +
            this.memorize + " listeners:" + this.bindings.length + "]";
    }

}
