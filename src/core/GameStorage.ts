import {DeviceCapability} from "../util/Device";
import Game from "./Game";

export default class GameStorage {

    private static _encode(value: any): any {
        return JSON.stringify(value);
    }

    private static _decode(value: any): any {
        return JSON.parse(value);
    }

    private _game: Game;

    private readonly _id: string | null;

    public constructor(game: Game, id?: string) {
        this._game = game;
        this._id = id || null;
    }

    public get isSupported(): boolean {
        return this._game.device.supports(DeviceCapability.LOCALSTORAGE);
    }

    public get(key: string, defaultValue: any): any {
        if (!this.isSupported) {
            return null;
        }
        const raw = localStorage.getItem("gameindus_" + this._id + "." + key);

        if (raw === null) {
            return defaultValue;
        }

        try {
            return GameStorage._decode(raw);
        } catch (e) {
            return raw;
        }
    }

    public set(key: string, value: any): void {
        if (this.isSupported) {
            localStorage.setItem(this._id + "." + key, GameStorage._encode(value));
        }
    }

    public has(key: string): boolean {
        return this.isSupported && localStorage.getItem(this._id + "." + key) !== null;
    }

    public remove(key: string): void {
        if (this.isSupported) {
            localStorage.removeItem(this._id + "." + key);
        }
    }

    public reset(): void {
        if (this.isSupported) {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.indexOf(this._id + ".") !== -1) {
                    localStorage.removeItem(key);
                }
            }
        }
    }

}
