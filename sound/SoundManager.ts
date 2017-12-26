class SoundManager{
	
	private _game : Game;

	private _volume   : number  = 1;
	private _channels : number  = 32;
	private _muted    : boolean = false;

	private _context  : AudioContext;
	private _gainNode : GainNode;

	private _sounds : Sound[] = [];


	public constructor(game: Game) {
		this._game = game;
	}


	public add(key: string, volume: number = 1, loop: boolean = false): Sound {
		let sound = new Sound();

		this._sounds.push(sound);
		return sound;
	}

	public boot(): void {
		if ( this._game.device.operatingSystem == DeviceOS.IOS && !this._game.device.supportsAudio ) {
            this._channels = 1;
        }

		if( window["AudioContext"] ) {
			try {
				this._context = new window["AudioContext"]();
			} catch(error) {
				this._context = null;
			}
		} else if( window["webkitAudioContext"] ) {
			try {
				this._context = new window["webkitAudioContext"]();
			} catch(error) {
				this._context = null;
			}
		}

		if( this._context !== null ) {
			this._gainNode = this._context.createGain();
            this._gainNode.connect(this._context.destination);
		}
	}

}