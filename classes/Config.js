function Config(){
	this.version   = 0.04;
	this.debugMode = true;

	this.defaultSize = {w: 320, h: 320};
	this.assetsDir   = "assets";
	this.gameServer  = "ws://localhost:8080/";

	this.layers = 10;
}

var Config = new Config();