class Scene {
    private game: Game;
    // Render loop
    private _sortedGameobjects: GameObject[] = [];
    private _gameobjectsRendered: number = 0;
    private _currentObjectId: number = 0;

    public constructor(game: Game, name: string) {
        this.game = game;
        this._name = name;
    }

    public static get EMPTY(): Scene {
        return new Scene(null, null);
    }

    private _id: number;

    public get id(): number {
        return this._id;
    }

    private _name: string;

    public get name(): string {
        return this._name;
    }

    private _gameobjects: GameObject[] = [];

    public get gameobjects(): GameObject[] {
        return this._gameobjects;
    }

    public add(gameobject: GameObject): GameObject {
        if (!this.game) return null;

        gameobject.id = this._currentObjectId;
        this._currentObjectId++;

        this._gameobjects.push(gameobject);
        return gameobject;
    }

    public createShape(name: string, shapeType?: ShapeType, position?: Position, size?: RectangleSize | number, color?: Color): GeometricObject {
        let geometricObject = new GeometricObject(this.game, name, shapeType, position, size, color);

        this.add(geometricObject);
        return geometricObject;
    }

    public createComplexShape(name: string, shape: ComplexShape, position?: Position, size?: RectangleSize | number, color?: Color): GeometricObject {
        let geometricObject = new GeometricObject(this.game, name, ShapeType.COMPLEX, position, size, color, true, shape);

        this.add(geometricObject);
        return geometricObject;
    }

    public createCustomShape(name: string, points: Point[], color?: Color): GeometricObject {
        let geometricObject = new GeometricObject(this.game, name, ShapeType.POLYGON, null, null, color, true, points);

        this.add(geometricObject);
        return geometricObject;
    }

    public createParticleEmitter(name: string, config?: ParticleEmitterConfig): ParticleEmitter {
        let emitter = new ParticleEmitter(this.game, name, config);

        this.add(emitter);
        return emitter;
    }

    public createSprite(name: string, texture: string, position?: Position, size?: RectangleSize | number, config?: SpriteConfig): Sprite {
        let sprite = new Sprite(this.game, name, texture, position, size, config);

        this.add(sprite);
        return sprite;
    }

    public createText(name: string, text: string, position?: Position, color?: Color): Text {
        let textObject = new Text(this.game, name, text);

        if (position) textObject.position = position;
        if (color) textObject.color = color;

        this.add(textObject);
        return textObject;
    }

    public get(name: string): GameObject {
        for (let gameobject of this.gameobjects)
            if (gameobject.name == name)
                return gameobject;

        return null;
    }

    public update(): void {
        if (!this.game) return null;

        for (let gameobject of this._gameobjects)
            gameobject._update();
    }

    public render(time: number): void {
        if (!this.game) return null;

        // Sort gameobjects by layer when its needed
        if (this._gameobjects.length != this._gameobjectsRendered) {

            this._sortedGameobjects = Util.sortArrayByProperty(this._gameobjects, "layer");
            this._gameobjectsRendered = this._gameobjects.length;

        }


        for (let gameobject of this._sortedGameobjects) {
            gameobject.render(this.game.graphics, time);
        }
    }

}