class GameObject {

    protected _game: Game;

    constructor(game: Game, name?: string) {
        this._game = game;
        if (name) this._name = name;
    }

    private _id: number;

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    private _layer: number;

    public get layer(): number {
        return this._layer || 0;
    }

    public set layer(layer: number) {
        this._layer = layer;
    }

    private _name: string;

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    private _rotation: number;

    public get rotation(): number {
        return this._rotation;
    }

    public set rotation(rotation: number) {
        this._rotation = rotation;
    }

    private _scale: number = 1;

    public get scale(): number {
        return this._scale;
    }

    public set scale(scale: number) {
        this._scale = scale;
    }

    private _position: Position = new Position();

    public get position(): Position {
        return this._position || new Position();
    }

    public set position(position: Position) {
        this._position = position;
    }

    private _anchor: Point = new Point(0, 0);

    public get anchor(): Point {
        return this._anchor;
    }

    public set anchor(anchor: Point) {
        this._anchor = anchor;
    }

    private _size: RectangleSize = {};

    public get size(): RectangleSize {
        return this._size;
    }

    public set size(size: RectangleSize) {
        this._size = size;
    }

    private _velocity: Vector2 = new Vector2();

    public get velocity(): Vector2 {
        return this._velocity || new Vector2();
    }

    public set velocity(velocity: Vector2) {
        this._velocity = velocity;
    }

    private _behaviors: Behavior[] = [];

    public get behaviors(): Behavior[] {
        return this._behaviors || [];
    }

    protected _animator: Animator;

    public get animator(): Animator {
        if (this._animator) return this._animator;
        this._animator = new Animator(this._game, this);
        return this._animator;
    }

    private _parent: Group;

    public get parent(): Group {
        return this._parent;
    }

    public set parent(group: Group) {
        this._parent = group;
    }

    public get renderPosition(): Position {
        return this.position.clone().subtract(new Position(
            this.anchor.x * this.size.width * this.scale,
            this.anchor.y * this.size.height * this.scale
        ));
    }

    public get renderSize(): RectangleSize {
        return {
            width: this.size.width * this.scale,
            height: this.size.height * this.scale
        };
    }

    public addBehavior(behavior: Behavior): void {
        if (this._behaviors.indexOf(behavior) > -1) return;
        this._behaviors.push(behavior);
    }

    public getLayer(): number {
        return this.layer;
    }

    public getName(): string {
        return this.name;
    }

    public getPosition(): Position {
        return this.position;
    }

    public setSize(width: number, height?: number): GameObject {
        this.size.width = width;
        this.size.height = (height === undefined) ? width : height;

        return this;
    }

    public setPosition(x?: number, y?: number): GameObject {
        this.position.x = x;
        this.position.y = (y === undefined) ? x : y;

        return this;
    }


    public render(graphics: Graphics, time: number): void {
    }

    public update(): void {
    }

    public _update(): void {

        // Update behaviors
        for (let behavior of this.behaviors) {
            if (!behavior.runned) {
                behavior.runned = true;
                behavior.run(this);
            }

            behavior.loop(this);
        }

        // Update object's velocity
        if (!this.velocity.isZero()) {
            this.position.addX(this.velocity.x);
            this.position.addY(this.velocity.y);
        }


        this.update();
    }
}