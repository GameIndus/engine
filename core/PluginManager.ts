class PluginManager {
	
	private static nbPluginStk : number;

	private _game    : Game;
	private _plugins : Plugin[];


	public constructor(game: Game) {
		this._game    = game;
		this._plugins = [];

		this.register(new MyPlugin());
	}


	public register(plugin: Plugin): boolean {
		this._plugins.push(plugin);

		return plugin.register(this._game, PluginManager.nbPluginStk++);
	}
	public remove(plugin: Plugin): boolean {
		for (let registeredPlugin of this._plugins)
			if (registeredPlugin.id == plugin.id)
				if (this._plugins.splice(this._plugins.indexOf(plugin), 1) != null) {
					plugin.unregister();
					return true;
				}

		return false;
	}

}