class Canvas {

    protected initialized: boolean;
    private game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    protected _wrapper: HTMLElement;

    public get wrapper(): HTMLElement {
        return this._wrapper;
    }

    protected _canvas: HTMLCanvasElement;

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    protected _context: CanvasRenderingContext2D;

    public get context(): CanvasRenderingContext2D {
        return this._context;
    }

    public get element(): HTMLCanvasElement {
        return this._canvas;
    }

    public get size(): RectangleSize {
        if (!this.element) return {width: 0, height: 0};

        return {width: this.element.width, height: this.element.height};
    }

    public clear(): void {
        if (!this.context) return;
        this.context.clearRect(0, 0, this.game.width, this.game.height);
    }

    public setup(width: number, height: number, id?: string, parent?: HTMLElement, autoFocus?: boolean): void {
        if (this.initialized) return;
        this.initialized = true;

        this._canvas = document.createElement("canvas");

        if (id !== '' && id != undefined) {
            this.canvas.id = id;
        }

        this.canvas.style.display = "block";
        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.tabIndex = 1000;

        this.addToDOM(parent);

        if (autoFocus) this.canvas.focus();

        this._context = this.canvas.getContext("2d");
    }

    private addToDOM(parent: HTMLElement): void {
        let target: HTMLElement;
        let wrapper: HTMLElement = document.createElement("div");

        if (parent && parent.nodeType === 1) {
            target = parent;
        } else {
            target = document.body;
        }

        target.style.overflow = "hidden";

        // wrapper.className      = "gameindus-engine-wrapper";
        wrapper.style.display = "block";
        wrapper.style.position = "relative";
        wrapper.style.width = this.canvas.width + "px";
        wrapper.style.height = this.canvas.height + "px";

        this._wrapper = wrapper;

        wrapper.appendChild(this.canvas);
        target.appendChild(wrapper);
    }

    private removeFromDOM(): void {
        if (this.initialized && this.canvas != null && this.canvas.parentNode != null) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }

}