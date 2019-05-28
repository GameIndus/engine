import Game from "./Game";
import GamePlugin from "../plugin/GamePlugin";

export default class PluginManager {

    private static nbPlugin: number;

    private readonly _game: Game;

    private readonly _plugins: GamePlugin[];

    public constructor(game: Game) {
        this._game = game;
        this._plugins = [];
    }

    public register(plugin: GamePlugin): boolean {
        this._plugins.push(plugin);
        return plugin.register(this._game, PluginManager.nbPlugin++);
    }

    public remove(plugin: GamePlugin): boolean {
        for (const registeredPlugin of this._plugins) {
            if (registeredPlugin.id === plugin.id) {
                if (this._plugins.splice(this._plugins.indexOf(plugin), 1) != null) {
                    plugin.unregister();
                    return true;
                }
            }
        }

        return false;
    }

}
