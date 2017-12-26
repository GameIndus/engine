class Tween {

	private _object   : any;
	private _duration : number  = 1000;
	private _delay    : number  = 0;
	private _repeat   : number  = 0;
	private _round    : boolean = false;
	private _yoyo     : boolean = false;

	private _minValue : number;
	private _maxValue : number;

	private _startValues       : any;
	private _startValuesRepeat : any;
	private _endValues         : any;

	private _isPlaying : boolean = false;
	private _startTime : number;
	private _easing    : Easing  = Easing.LINEAR;
	private _reversed  : boolean = false;

	private _startSignalFired : boolean;
	private _destroyed        : boolean;

	public onStart    : Signal = new Signal();
	public onUpdate   : Signal = new Signal(true);
	public onComplete : Signal = new Signal();


	public constructor(object: any) {
		this._object = object;
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
		this.update(this._startTime + this._duration);
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
		this._isPlaying   = true;

		this._startValues = {};

		// Init start values
		if( typeof this._object === "number" ) this._startValues[0] = this._object;
		else if( Array.isArray(this._object) ) {
			let i = 0;

			for( let prop of this._object ) {
				this._startValues[i] = prop;
				i++;
			}
		} else {
			if( this._object instanceof Color ) this._startValues = Util.copyObject(this._object.toRGBA());
			else this._startValues = Util.copyObject(this._object);

			if( typeof(this._object)["clone"] !== "undefined" && !(this._object instanceof Color) )
				this._startValues = this._object.clone();
		}

		this._startValuesRepeat = this._startValues || 0;

		// Init end values
		if( typeof this._endValues === "number" ) {
			let val = this._endValues * 1;
			this._endValues    = {};
			this._endValues[0] = val;
		} else if( Array.isArray(this._endValues) ) {
			let i      = 0;
			let values = this._endValues.slice();

			this._endValues = {};

			for( let prop of values ) {
				this._endValues[i] = prop;
				i++;
			}
		} else {
			if( this._endValues instanceof Color ) this._endValues = Util.copyObject(this._endValues.toRGBA());
		}

		this._startTime  = (time !== undefined) ? time : Time.now();
		this._startTime += this._delay;
	
		return this;
	}
	public stop(): Tween {
		if( !this._isPlaying ) return this;

		this._isPlaying = false;

		return this;
	}

	public to(object: any, duration: number): Tween {
		if( duration !== undefined ) 
			this._duration = duration;

		this._endValues = object;
		return this;
	}

	public yoyo(yoyo: boolean = true): Tween {
		this._yoyo = yoyo;
		return this;
	}


	public update(time: number): boolean {
		let elapsed : number;
		let value   : number;

		if( time < this._startTime ) return true;
		if( !this._isPlaying )       return true;
		if( this._destroyed )        return false;

		if( !this._startSignalFired ) {
			this.onStart.dispatch(this._object);
			this._startSignalFired = true;
		}

		elapsed = ( time - this._startTime ) / this._duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value   = Easing.apply(this._easing, elapsed);

		for( let property in this._endValues ) {

			if( this._startValues[property] === undefined ) continue;

			let start = this._startValues[property] || 0;
			let end   = this._endValues[property];


			if( typeof end === "number" ) {
				let objvalue = start + (end - start) * value;

				if( this._minValue !== undefined && objvalue < this._minValue ) objvalue = this._minValue;
				if( this._maxValue !== undefined && objvalue > this._maxValue ) objvalue = this._maxValue;

				if( this._round ) objvalue = Math.round( objvalue );

				if( this._object instanceof Color ) {
					if(objvalue <   0) objvalue = 0;
					if(objvalue > 255) objvalue = 255;
					objvalue = Math.round(objvalue);

					this._object.updateRGBA(property, objvalue);
				} else {
					if( this._object[property] === undefined ) this._object           = objvalue;
					else                                       this._object[property] = objvalue;
				}
			}

		}

		if( !this.onUpdate.isEmpty )
			this.onUpdate.dispatch(this._object, value);

		if( elapsed === 1 ) {
			
			if( this._repeat > 0 ) {

				if( isFinite(this._repeat) ) this._repeat--;

				for( let property in this._startValuesRepeat ) {
					if( !this._startValuesRepeat.hasOwnProperty(property) ) continue;

					if( this._yoyo ) {
						let tmp = this._startValuesRepeat[property];

						this._startValuesRepeat[property] = this._endValues[property];
						this._endValues[property] = tmp;
					}

					this._startValues[property] = this._startValuesRepeat[property];

				}

				if( this._yoyo ) this._reversed = !this._reversed;

				this._startTime = time;

				return true;
			} else {

				this.onComplete.dispatch(this._object);
				
				return false;
			}
		}

		return true;
	}

}