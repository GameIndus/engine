import Game from "../core/Game";
import {DeviceOS} from "../util/Device";
import Sound from "./Sound";

export default class SoundManager {

    private _game: Game;

    private _volume: number = 1;

    private _channels: number = 32;

    private _muted: boolean = false;

    private _context: AudioContext | null;

    private _gainNode: GainNode | null;

    private _sounds: Sound[] = [];

    public constructor(game: Game) {
        this._game = game;
        this._context = null;
        this._gainNode = null;
    }

    public add(key: string, volume: number = 1, loop: boolean = false): Sound {
        const sound = new Sound(this._game);

        this._sounds.push(sound);
        return sound;
    }

    public boot(): void {
        if (this._game.device.operatingSystem === DeviceOS.IOS && !this._game.device.supportsAudio) {
            this._channels = 1;
        }

        if (AudioContext) {
            try {
                this._context = new AudioContext();
            } catch (error) {
                this._context = null;
            }
        }

        if (this._context !== null) {
            this._gainNode = this._context.createGain();
            this._gainNode.connect(this._context.destination);
        }
    }

}
