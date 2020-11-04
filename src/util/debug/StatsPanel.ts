export default class StatsPanel {
    private static readonly PANEL_SIZE = [80, 48]

    private static readonly GRAPH_SIZE = [74, 30]

    private static readonly GRAPH_POS = [3, 15]

    private static readonly TEXT_POS = [3, 2]

    private readonly _name: string
    private readonly _foreground: string
    private readonly _background: string

    private _canvas: HTMLCanvasElement
    private _context: CanvasRenderingContext2D
    private _min = Infinity
    private _max = 0
    private _dr = 1

    public constructor(name: string, foreground: string, background: string) {
        this._name = name
        this._foreground = foreground
        this._background = background
        this._canvas = HTMLCanvasElement.prototype
        this._context = CanvasRenderingContext2D.prototype

        this.create()
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    public create(): void {
        this._canvas = document.createElement('canvas')

        this._canvas.width = StatsPanel.PANEL_SIZE[0]
        this._canvas.height = StatsPanel.PANEL_SIZE[1]
        this._canvas.style.cssText = 'width:' + this._canvas.width + 'px;height:' + this._canvas.height + 'px'

        const context = this._canvas.getContext('2d')
        if (context === null) {
            return
        }

        this._context = context
        this._context.font = 'bold 9px Helvetica,Arial,sans-serif'
        this._context.textBaseline = 'top'

        this._context.fillStyle = this._background
        this._context.fillRect(0, 0, StatsPanel.PANEL_SIZE[0], StatsPanel.PANEL_SIZE[1])

        this._context.fillStyle = this._foreground
        this._context.fillText(name, StatsPanel.TEXT_POS[0], StatsPanel.TEXT_POS[1])
        this._context.fillRect(
            StatsPanel.GRAPH_POS[0],
            StatsPanel.GRAPH_POS[1],
            StatsPanel.GRAPH_SIZE[0],
            StatsPanel.GRAPH_SIZE[1],
        )

        this._context.fillStyle = this._background
        this._context.globalAlpha = 0.9
        this._context.fillRect(
            StatsPanel.GRAPH_POS[0],
            StatsPanel.GRAPH_POS[1],
            StatsPanel.GRAPH_SIZE[0],
            StatsPanel.GRAPH_SIZE[1],
        )
    }

    public update(value: number, maxValue: number): void {
        const round = (v: number): number => {
            return Math.round(v)
        }
        const PR = 1

        this._min = Math.min(this._min, value)
        this._max = Math.max(this._max, value)

        this._context.fillStyle = this._background
        this._context.globalAlpha = 1
        this._context.fillRect(0, 0, StatsPanel.PANEL_SIZE[0], StatsPanel.GRAPH_POS[1])

        this._context.fillStyle = this._foreground
        this._context.fillText(
            round(value) + ' ' + this._name + ' (' + round(this._min) + '-' + round(this._max) + ')',
            StatsPanel.TEXT_POS[0],
            StatsPanel.TEXT_POS[1],
        )

        this._context.drawImage(
            this.canvas,
            StatsPanel.GRAPH_POS[0] + PR,
            StatsPanel.GRAPH_POS[1],
            StatsPanel.GRAPH_SIZE[0] - PR,
            StatsPanel.GRAPH_SIZE[1],
            StatsPanel.GRAPH_POS[0],
            StatsPanel.GRAPH_POS[1],
            StatsPanel.GRAPH_SIZE[0] - PR,
            StatsPanel.GRAPH_SIZE[1],
        )

        this._context.fillRect(
            StatsPanel.GRAPH_POS[0] + StatsPanel.GRAPH_SIZE[0] - PR,
            StatsPanel.GRAPH_POS[1],
            PR,
            StatsPanel.GRAPH_SIZE[1],
        )

        this._context.fillStyle = this._background
        this._context.globalAlpha = 0.9
        this._context.fillRect(
            StatsPanel.GRAPH_POS[0] + StatsPanel.GRAPH_SIZE[0] - PR,
            StatsPanel.GRAPH_POS[1],
            PR,
            round((1 - value / maxValue) * StatsPanel.GRAPH_SIZE[1]),
        )
    }
}
