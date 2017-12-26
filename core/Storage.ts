class Storage {

    private _game: Game;
    private _id: string;

    public constructor(game: Game, id?: string) {
        this._game = game;

        if (id) this._id = id;
        else this._id = "gameindus";
    }


    public get isSupported(): boolean {
        return this._game.device.supports(DeviceCapability.LOCALSTORAGE);
    }


    public get(key: string, defaultValue: any): any {
        if (!this.isSupported) return null;
        var raw = localStorage.getItem(this._id + '.' + key);

        if (raw === null) return defaultValue;

        try {
            return this._decode(raw);
        } catch (e) {
            return raw;
        }
    }

    public has(key: string): boolean {
        if (!this.isSupported) return;
        return localStorage.getItem(this._id + '.' + key) !== null;
    }

    public remove(key: string): void {
        if (!this.isSupported) return;
        localStorage.removeItem(this._id + '.' + key);
    }

    public reset(): void {
        if (!this.isSupported) return;

        for (var i = localStorage.length - 1; i >= 0; i--) {
            var key = localStorage.key(i);
            if (key.indexOf(this._id + '.') !== -1) localStorage.removeItem(key);
        }
    }

    public set(key: string, value: any): void {
        if (!this.isSupported) return;
        localStorage.setItem(this._id + '.' + key, this._encode(value));
    }


    private _encode(value: any): any {
        return JSON.stringify(value);
    }

    private _decode(value: any): any {
        return JSON.parse(value);
    }

}