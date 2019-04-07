import GamePlugin from "../core/GamePlugin";

export default class MyPlugin extends GamePlugin {

    public constructor() {
        super("Mon Super GamePlugin");
    }

    public onEnable(): void {
        console.log("GamePlugin activé !");
    }

    public onDisable(): void {
        console.log("GamePlugin désactivé.");
    }

}
