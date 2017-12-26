class MyPlugin extends Plugin {

    public constructor() {
        super("Mon Super Plugin");
    }

    public onEnable(): void {
        console.log("Plugin activé !");
    }

    public onDisable(): void {
        console.log("Plugin désactivé.");
    }

}