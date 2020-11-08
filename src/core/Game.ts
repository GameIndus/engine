import Graphics from '../gameobject/Graphics'
import Input from '../input/Input'
import DataCache from '../loader/DataCache'
import Loader from '../loader/Loader'
import Canvas from '../renderer/canvas/Canvas'
import SoundManager from '../sound/SoundManager'
import Time from '../time/Time'
import Tween from '../tween/Tween'
import TweenManager from '../tween/TweenManager'
import Debug from '../util/Debug'
import Device, { DeviceBrowser } from '../util/Device'
import { GameConfig } from '../util/GameConfig'
import GameLoop from '../util/GameLoop'
import GameStorage from './GameStorage'
import PluginManager from './PluginManager'
import Scene from './Scene'
import Signal from './Signal'

export default class Game {
    public static readonly VERSION = '2.1.0'

    private _resolution: number

    private _antialiasing: boolean

    private _running: boolean

    private _config: GameConfig

    private _deltaTime: number

    private _quickstart: boolean

    private _lastLogicFrames: number

    private _diffLogicFrames: number

    private _sound: SoundManager

    private _storage: GameStorage

    private _width: number

    private _height: number

    private _isBooted: boolean

    private _paused: boolean

    private _scenes: Scene[]

    private _currentScene: Scene

    private _cache: DataCache

    private _canvas: Canvas

    private _debug?: Debug

    private _device: Device

    private _graphics: Graphics

    private _input: Input

    private _loader: Loader

    private _loop: GameLoop

    private _plugins: PluginManager

    private _time: Time

    private _tweens: TweenManager

    private readonly _onPreload: Signal

    private readonly _onPause: Signal

    private readonly _onResume: Signal

    public constructor(config?: GameConfig) {
        if (config !== undefined) {
            this._config = config
            this._parseConfig(config)
        }

        this._resolution = 1
        this._antialiasing = true
        this._running = false
        this._config = {}
        this._deltaTime = 0
        this._quickstart = true
        this._lastLogicFrames = 0
        this._diffLogicFrames = 0
        this._sound = SoundManager.prototype
        this._storage = GameStorage.prototype
        this._width = 800
        this._height = 600
        this._isBooted = false
        this._paused = false
        this._scenes = []
        this._currentScene = new Scene(this, 'root')
        this._cache = DataCache.prototype
        this._canvas = Canvas.prototype
        this._device = new Device()
        this._graphics = Graphics.prototype
        this._input = Input.prototype
        this._loader = Loader.prototype
        this._loop = GameLoop.prototype
        this._plugins = PluginManager.prototype
        this._time = Time.prototype
        this._tweens = TweenManager.prototype
        this._onPreload = new Signal(true)
        this._onPause = new Signal(true)
        this._onResume = new Signal(true)

        this.device.whenReady(this.boot, this)
    }

    public get config(): GameConfig {
        return this._config
    }

    public get width(): number {
        return this._width
    }

    public get height(): number {
        return this._height
    }

    public get isBooted(): boolean {
        return this._isBooted
    }

    public get paused(): boolean {
        return this._paused
    }

    public get scenes(): Scene[] {
        return this._scenes
    }

    public get currentScene(): Scene {
        return this._currentScene
    }

    public set currentScene(scene: Scene) {
        this._currentScene = scene
    }

    public get cache(): DataCache {
        return this._cache
    }

    public get canvas(): Canvas {
        return this._canvas
    }

    public get debug(): Debug | undefined {
        return this._debug
    }

    public get device(): Device {
        return this._device
    }

    public get graphics(): Graphics {
        return this._graphics
    }

    public get input(): Input {
        return this._input
    }

    public get loader(): Loader {
        return this._loader
    }

    public get loop(): GameLoop {
        return this._loop
    }

    public get plugins(): PluginManager {
        return this._plugins
    }

    public get time(): Time {
        return this._time
    }

    public get tweens(): TweenManager {
        return this._tweens
    }

    public get onPause(): Signal {
        return this._onPause
    }

    public get onResume(): Signal {
        return this._onResume
    }

    public get debugModeActivated(): boolean {
        return this.debug != null
    }

    public get isLoaded(): boolean {
        return this.loader.gameLoaded
    }

    public get preload(): Signal {
        return this._onPreload
    }

    public createScene(name: string): Scene {
        // Check if this scene already exists
        const currentScene = this.getScene(name)
        if (currentScene != null) {
            return currentScene
        }

        // Create a new scene and add it to the engine
        const scene: Scene = new Scene(this, name)

        this._scenes.push(scene)

        // Set this scene by default if needed
        if (this._currentScene == null) {
            this._currentScene = scene
        }

        return scene
    }

    public getScene(name: string): Scene | null {
        for (const scene of this._scenes) {
            if (scene.name === name) {
                return scene
            }
        }

        return null
    }

    public getCurrentScene(): Scene {
        return this.currentScene
    }

    public setCurrentScene(scene: Scene | string): void {
        if (typeof scene === 'string') {
            const sceneObject = this.getScene(scene)
            if (sceneObject != null) {
                this.currentScene = sceneObject
            }
        } else {
            this.currentScene = scene
        }
    }

    public tween(object: any): Tween {
        return this.tweens.add(new Tween(object))
    }

    public pause(): void {
        if (!this.paused) {
            this._paused = true
            this.time.gamePaused()
            this.onPause.dispatch()
        }
    }

    public resume(): void {
        if (this.paused) {
            this._paused = false
            this.time.gameResumed()
            this.onResume.dispatch()
        }
    }

    public update(time: number): void {
        let step = 0
        const updates = 0
        let logicFrames = 0

        this._time.update(time)

        // Start stats if debug mode activated
        if (this.debug && this.isLoaded) {
            this.debug.stats.begin()
        }

        if (this._quickstart) {
            // First update logic & render
            this.updateLogic()
            this.updateRender(this.time.fps)

            this._quickstart = false

            return
        }

        // Too many logic frames, only render game
        if (this._diffLogicFrames >= 2) {
            this._diffLogicFrames = 0
            this._deltaTime = 0

            this.updateRender(this.time.fps)
        } else {
            step = 1000.0 / this.time.fps
            this._deltaTime += Math.max(Math.min(step * 3, this.time.elapsed), 0)

            while (this._deltaTime >= step) {
                this._deltaTime -= step

                logicFrames++

                this.updateLogic()
                this.time.refresh()
            }

            // Too many logic frames
            if (logicFrames > this._lastLogicFrames) {
                this._diffLogicFrames++
            } else if (logicFrames < this._lastLogicFrames) {
                this._diffLogicFrames = 0
            }

            this._lastLogicFrames = logicFrames

            this.updateRender(this._deltaTime / step)
        }

        if (this.debug && this.isLoaded) {
            this.debug.stats.end()
        }
    }

    private _parseConfig(config?: GameConfig): void {
        if (config && typeof config.width !== 'undefined') {
            this._width = config.width
        }

        if (config && typeof config.height !== 'undefined') {
            this._height = config.height
        }

        if (config && config.debug === true) {
            this._debug = new Debug(this)
        }
    }

    private _showConsoleHeader(): void {
        if (this.device.browser === DeviceBrowser.CHROME) {
            console.log(
                '%c %c %c GameIndus v' + Game.VERSION + ' | Moteur Canvas %c %c %c https://gameindus.fr/',
                'background: #cbd0d3',
                'background: #3498db',
                'color: #ffffff; background: #2980b9;',
                'background: #3498db',
                'background: #cbd0d3',
                'background: #ffffff',
            )

            if (this.debugModeActivated) {
                console.log(
                    '%c %c %c Mode développeur activé, pensez à le désactiver avant publication. %c %c %c',
                    'background: #cbd0d3',
                    'background: #f39c12',
                    'color: #ffffff; background: #e67e22;',
                    'background: #f39c12',
                    'background: #cbd0d3',
                    'background: #ffffff',
                )
            }
        } else if (window.console) {
            console.log('GameIndus v' + Game.VERSION + ' | Moteur Canvas | https://gameindus.fr')
        }
    }

    private boot(): void {
        if (this.isBooted) {
            return
        }

        this._isBooted = true
        this._canvas = new Canvas()

        this._canvas.setup(this.width, this.height, this._config.canvasId, this._config.parent, this._config.autoFocus)

        this._cache = new DataCache()
        this._graphics = new Graphics(this.canvas)
        this._input = new Input(this)
        this._loader = new Loader(this, this._config.loader)
        this._plugins = new PluginManager(this)
        this._sound = new SoundManager(this)
        this._storage = new GameStorage(this)
        this._time = new Time(this)
        this._tweens = new TweenManager()

        // Preload
        this._onPreload.dispatch(this)

        if (this._debug != null) {
            this._debug.boot()
        }

        this._time.boot()
        this._input.boot()

        if (this._config.forceSetTimeout !== undefined) {
            this._loop = new GameLoop(this, this._config.forceSetTimeout)
        } else {
            this._loop = new GameLoop(this, false)
        }

        this._loader.start()
        this.loop.start()

        if (window.focus) {
            window.focus()
        }

        this._showConsoleHeader()
    }

    private updateLogic(): void {
        if (this.paused) {
            return
        }

        if (this.isLoaded && !this.loader.splash.inRendering) {
            this.currentScene.update()

            this.tweens.update()
            this.input.update()
        } else {
            this.loader.splash.update()
        }
    }

    private updateRender(elapsedTime: number): void {
        this.canvas.clear()

        if (this.isLoaded && !this.loader.splash.inRendering) {
            if (this.currentScene.camera !== null) {
                this.currentScene.camera.begin()
                this.currentScene.camera.update()
            }

            this.currentScene.render(elapsedTime)

            if (this.currentScene.camera !== null) {
                this.currentScene.camera.end()
            }
        }
    }
}
