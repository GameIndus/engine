import Game from "../core/Game";
import Signal from "../core/Signal";
import Position from "../geometry/Position";
import Util from "../utils/Util";

export default class Mouse {

    private static positionFromEvent(event: MouseEvent): Position {
        const x: number = event.x || event.clientX || event.pageX;
        const y: number = event.y || event.clientY || event.pageY;

        return new Position(x, y);
    }

    private readonly _onClick: Signal;

    private readonly _onDown: Signal;

    private readonly _onMove: Signal;

    private readonly _onUp: Signal;

    private readonly _onWheel: Signal;

    private game: Game;

    private readonly _clicksHistory: Position[];

    private readonly _downButtons: MouseClickType[];

    private _lastClickPosition: Position;

    private _lastPosition: Position;

    public constructor(game: Game) {
        this.game = game;
        this._onClick = new Signal(true);
        this._onDown = new Signal(true);
        this._onMove = new Signal(true);
        this._onUp = new Signal(true);
        this._onWheel = new Signal(true);
        this._clicksHistory = [];
        this._downButtons = [];
        this._lastClickPosition = new Position(-1, -1);
        this._lastPosition = new Position(-1, -1);

        this.bind();
    }

    public get clicksHistory(): Position[] {
        return this._clicksHistory;
    }

    public get lastClickPosition(): Position {
        return this._lastClickPosition;
    }

    public get lastPosition(): Position {
        return this._lastPosition;
    }

    public get downButtons(): MouseClickType[] {
        return this._downButtons;
    }

    private bind(): void {
        const canvas: HTMLCanvasElement = this.game.canvas.element;

        canvas.removeEventListener("click", this.handleClick.bind(this));
        canvas.removeEventListener("mousedown", this.handleDown.bind(this));
        canvas.removeEventListener("mousemove", this.handleMove.bind(this));
        canvas.removeEventListener("mouseup", this.handleUp.bind(this));
        canvas.removeEventListener("wheel", this.handleWheel.bind(this));
        canvas.removeEventListener("contextmenu", this.handleContextMenu.bind(this));

        canvas.addEventListener("click", this.handleClick.bind(this), true);
        canvas.addEventListener("mousedown", this.handleDown.bind(this), true);
        canvas.addEventListener("mousemove", this.handleMove.bind(this), true);
        canvas.addEventListener("mouseup", this.handleUp.bind(this), true);
        canvas.addEventListener("wheel", this.handleWheel.bind(this), true);
        canvas.addEventListener("contextmenu", this.handleContextMenu.bind(this), true);
    }

    private handleClick(event: MouseEvent): boolean {
        const pos: Position = Mouse.positionFromEvent(event);

        this._lastClickPosition = pos.clone();
        this._clicksHistory.push(pos.clone());

        this._onClick.dispatch(pos.clone(), MouseClickType.LEFT_CLICK);

        return false;
    }

    private handleContextMenu(event: Event): boolean {
        event.preventDefault();
        return false;
    }

    private handleDown(event: MouseEvent): void {
        const pos: Position = Mouse.positionFromEvent(event);
        let type: MouseClickType = MouseClickType.LEFT_CLICK;

        if (event.which === 2) {
            type = MouseClickType.MIDDLE_CLICK;
        }
        if (event.which === 3) {
            type = MouseClickType.RIGHT_CLICK;
        }

        if (this._downButtons.indexOf(type) === -1) {
            this._downButtons.push(type);
        }

        this._onDown.dispatch(pos.clone(), type);
    }

    private handleMove(event: MouseEvent): void {
        const pos: Position = Mouse.positionFromEvent(event);
        this._lastPosition = pos.clone();
        this._onMove.dispatch(this.lastPosition);
    }

    private handleUp(event: MouseEvent): void {
        const pos: Position = Mouse.positionFromEvent(event);
        let type: MouseClickType = MouseClickType.LEFT_CLICK;

        if (event.which === 2) {
            type = MouseClickType.MIDDLE_CLICK;
        }
        if (event.which === 3) {
            type = MouseClickType.RIGHT_CLICK;
        }

        if (this._downButtons.indexOf(type) > -1) {
            Util.removeFrom(this._downButtons, type);
        }

        this._onUp.dispatch(pos.clone(), type);
    }

    private handleWheel(event: WheelEvent): boolean {
        let direction: MouseWheelDirection = MouseWheelDirection.DOWN;

        event.preventDefault();

        if (event.deltaY < 0) {
            direction = MouseWheelDirection.UP;
        }

        this._onWheel.dispatch(direction);

        return false;
    }
}

enum MouseClickType {
    LEFT_CLICK,
    MIDDLE_CLICK,
    RIGHT_CLICK,
}

enum MouseWheelDirection {
    UP, DOWN,
}
