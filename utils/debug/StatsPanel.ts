class StatsPanel {

    private _name: string;
    private _foreground: string;
    private _background: string;
    private _context: CanvasRenderingContext2D;
    private _min: number = Infinity;
    private _max: number = 0;
    private _dr: number = 1;
    private PANEL_SIZE = [80, 48];
    private GRAPH_SIZE = [74, 30];
    private GRAPH_POS = [3, 15];
    private TEXT_POS = [3, 2];

    public constructor(name: string, foreground: string, background: string) {
        this._name = name;
        this._foreground = foreground;
        this._background = background;

        this.create();
    }

    private _canvas: HTMLCanvasElement;

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }


    public create(): void {
        this._canvas = document.createElement("canvas");

        this._canvas.width = this.PANEL_SIZE[0];
        this._canvas.height = this.PANEL_SIZE[1];
        this._canvas.style.cssText = "width:" + this._canvas.width + "px;height:" + this._canvas.height + "px";

        this._context = this._canvas.getContext("2d");
        this._context.font = "bold 9px Helvetica,Arial,sans-serif";
        this._context.textBaseline = "top";

        this._context.fillStyle = this._background;
        this._context.fillRect(0, 0, this.PANEL_SIZE[0], this.PANEL_SIZE[1]);

        this._context.fillStyle = this._foreground;
        this._context.fillText(name, this.TEXT_POS[0], this.TEXT_POS[1]);
        this._context.fillRect(this.GRAPH_POS[0], this.GRAPH_POS[1], this.GRAPH_SIZE[0], this.GRAPH_SIZE[1]);

        this._context.fillStyle = this._background;
        this._context.globalAlpha = 0.9;
        this._context.fillRect(this.GRAPH_POS[0], this.GRAPH_POS[1], this.GRAPH_SIZE[0], this.GRAPH_SIZE[1]);
    }

    public update(value: number, maxValue: number): void {
        let round = (v: number): number => {
            return Math.round(v);
        };
        let PR = 1;

        this._min = Math.min(this._min, value);
        this._max = Math.max(this._max, value);


        this._context.fillStyle = this._background;
        this._context.globalAlpha = 1;
        this._context.fillRect(0, 0, this.PANEL_SIZE[0], this.GRAPH_POS[1]);

        this._context.fillStyle = this._foreground;
        this._context.fillText(round(value) + ' ' + this._name + ' (' + round(this._min) + '-' + round(this._max) + ')', this.TEXT_POS[0], this.TEXT_POS[1]);

        this._context.drawImage(this.canvas, this.GRAPH_POS[0] + PR, this.GRAPH_POS[1], this.GRAPH_SIZE[0] - PR, this.GRAPH_SIZE[1], this.GRAPH_POS[0], this.GRAPH_POS[1], this.GRAPH_SIZE[0] - PR, this.GRAPH_SIZE[1]);

        this._context.fillRect(this.GRAPH_POS[0] + this.GRAPH_SIZE[0] - PR, this.GRAPH_POS[1], PR, this.GRAPH_SIZE[1]);

        this._context.fillStyle = this._background;
        this._context.globalAlpha = 0.9;
        this._context.fillRect(this.GRAPH_POS[0] + this.GRAPH_SIZE[0] - PR, this.GRAPH_POS[1], PR, round((1 - (value / maxValue)) * this.GRAPH_SIZE[1]));
    }

}