class Signal{

	private _bindings : Function[];
	private _active   : boolean;
	private _memorize : boolean;

	private _prevParameters: any[];
	private _shouldPropagate: boolean;


	public constructor(memorize?: boolean){
		this._bindings  = [];
		this._active    = true;

		this._memorize  = memorize;
	}

	public get bindings(): Function[]{
		return this._bindings;
	}
	public get active(): boolean{
		return this._active;
	}
	public get isEmpty(): boolean{
		return this.bindings.length == 0;
	}
	public get memorize(): boolean{
		return this._memorize;
	}


	public add(func: Function): Signal{
		if(func != null)
			this.bindings.push(func);

		return this;
	}
	public dispatch(...args: any[]){
		if(!this.active) return;
		if(this.memorize) this._prevParameters = args;

		// After memorize, we check for bindings
		if(!this.bindings.length) return;

		let n: number 			 = this.bindings.length;
		let bindings: Function[] = this.bindings.splice(0);

		if(this.memorize) this._bindings = bindings;

		// Reset propagation
		this._shouldPropagate = true;

		do{
			n--;
		} while (bindings[n] && this._shouldPropagate && bindings[n].apply(this, args) !== false);
	}
	public dispose(){
		this.removeAll();
		
		this._bindings       = [];
		this._prevParameters = [];
	}
	public forget(){
		this._prevParameters = [];
	}
	public halt(){
		this._shouldPropagate = false;
	}
	public hasBinding(func: Function): boolean{
		return (this.bindings.indexOf(func) > -1);
	}
	public removeAll(){
		this.bindings.length = 0;
	}


	public toString(): string{
		return "[Signal active:" + this.active + " memorize:" + this.memorize + " listeners:" + this.bindings.length + "]";
	}
}