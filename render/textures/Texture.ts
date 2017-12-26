class Texture {

	private _game : Game;

	private _source : HTMLImageElement | Gradient;
	private _buffer : CanvasBuffer;
	
	private _frame  : RectangleSize;
	private _crop   : Rectangle;
	private _repeat : boolean;
	
	private _hasFrame : boolean = false;
	private _valid    : boolean = false;


	public constructor(game: Game, sourceName: string, frame?: RectangleSize, crop?: Rectangle, repeat?: boolean){
		this._game = game;

		this._source = (game.cache != null && game.cache.getImage(sourceName)) ? game.cache.getImage(sourceName) : null;

		this._frame  = frame  || {width: 0, height: 0};
		this._crop   = crop   || new Rectangle();
		this._repeat = repeat || false;

		if( frame ) this._hasFrame = true;


		if( this._source && this._source.width && this._source.height ) {
			this.initBuffer();
		} else {
			let self = this;

			if( game.loader != null ) this.checkForRessource(sourceName);
			else {
				game.preload.add(function(){
					self.checkForRessource(sourceName);
				});
			}
		}
	}

	public get buffer(): CanvasBuffer {
		return this._buffer;
	}
	public get cropFrame(): Rectangle {
		return (this._crop.width > 0 && this._crop.height > 0) ? this._crop : new Rectangle(0, 0, this.source.width, this.source.height);
	}
	public get frame(): RectangleSize {
		return this._frame;
	}
	public get height(): number {
		return this._frame.height;
	}
	public get repeat(): boolean {
		return this._repeat;
	}
	public get source(): HTMLImageElement | Gradient {
		return this._source;
	}
	public get valid(): boolean {
		return this._valid;
	}
	public get width(): number {
		return this._frame.width;
	}

	public set repeat(repeat: boolean) {
		this._repeat = repeat;

		if( this._buffer )
			this._buffer.repeatSource = repeat;
	}



	public setFrameTo(width: number, height: number): void {

		this.frame.width  = width;
		this.frame.height = height;

		this._hasFrame = true;

		this._buffer.resize(width, height);
	}
	public cropTo(x: number, y: number, width: number, height: number): void {
		this._crop.setTo(x, y, width, height);
		
		if( this.buffer ) this._buffer.clip( this._crop );
	}

	protected initBuffer(): void {
		if( this.frame.width == 0 && this.frame.height == 0 ) {
			this.frame.width  = this.source.width;
			this.frame.height = this.source.height;
		}

		this._buffer = new CanvasBuffer(this.source);

		this._buffer.setup(this.width, this.height);
		this._buffer.repeatSource = this._repeat;

		if( this._crop.width == 0 && this._crop.height == 0 ) {
			this._crop.x      = 0;
			this._crop.y      = 0;
			this._crop.width  = this.width;
			this._crop.height = this.height;
		} else {
			this._buffer.clip( this._crop );
		}

		this._valid = this.frame && this.width > 0 && this.height > 0;
	}
	private checkForRessource(sourceName: string): void {
		let self = this;

		this._game.loader.onFileComplete.add(function(file: CacheFile){
			if( file.key == sourceName ) {
				self._source = file.data;
				self.initBuffer();

				this.dispose();
			}
		});
	}



	public static get EMPTY(): Texture {
		return null;
	}
	
}