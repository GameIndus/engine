function Loader(){
	this.isLoaded = false;
	this.initialized  = false;

	this.percent = 0;
	this.step    = 5;
	// this.progressBarColor = "#329A45";
	this.progressBarColor = "#438EED";

	// Objects
	this.background;
	this.logo;
	this.progressBg;
	this.progressBar;
	this.statusText;
	this.acrochText;
	this.debugText;

	// Don't touch this
	this.toAdd = 0;
	this.updateNumber = 0;
	this.progressBarLastPercent = 0;
	this.progressBarLastWidth = 0;

	this.lastCanvasSize = null;
}

Loader.prototype = {

	init: function(){
		// Define vars
		var canvasSize = Game.getCanvas().getSize();
		var middleX    = canvasSize.getWidth() / 2;
		var middleY    = canvasSize.getHeight() / 2;

		// Load Logo image
		var that = this;
		var logoImg = new Image();
		logoImg.src = "https://gameindus.fr/imgs/logo/logo-medium.png";
		logoImg.onload = function(){
			that.logo = this;
		}

		this.background  = new GameObject([canvasSize.w, canvasSize.h]);
		this.progressBg  = new GameObject([500, 2]);
		this.progressBar = new GameObject([0, 2]);
		this.statusText  = new Text("v?.??");
		this.acrochText  = new Text("La plateforme collaborative de création de jeux vidéo en ligne.");
		this.debugText  = new Text("Mode développeur");

		this.background.setPosition(0, 0);
		this.background.setRenderer(new LoaderRenderer({color: "#ECECEC"}));
		this.progressBg.setPosition(middleX - this.progressBg.size[0] / 2, middleY + 25);
		this.progressBg.setRenderer(new LoaderRenderer({color: "#DDD"}));
		this.progressBar.setPosition(this.progressBg.position.getX(), middleY + 25);
		this.progressBar.setRenderer(new LoaderRenderer({color: this.progressBarColor}));
		this.statusText.setPosition(this.progressBg.position.getX() + this.progressBg.size[0]-28, middleY+25+15);
		this.statusText.setFontSize(12);
		this.statusText.setColor("#383838");
		this.acrochText.setPosition(this.progressBg.position.getX() + 65, middleY+5);
		this.acrochText.setFontSize(16);
		this.acrochText.setFont("Helvetica");
		this.acrochText.setColor("#383838");

		this.debugText.setPosition(canvasSize.x-100, 15);
		this.debugText.setFontSize(11);
		this.debugText.setColor("#111");

		this.initialized = true;

		this.lastCanvasSize = canvasSize;
	},

	update: function(){
		if(!this.initialized) return false;

		var ressourcesLoaded = Game.getRessources().ressourcesLoaded+SoundsManager.soundsLoaded;
		var ressourcesTotal = Game.getRessources().ressourcesNum+SoundsManager.soundsNum;

		this.percent = (ressourcesLoaded/ressourcesTotal)*100;

		if((ressourcesTotal==0&&this.updateNumber>60*3)){
			this.toAdd = 500;
		}
		if(isNaN(this.percent)||this.percent>100) this.percent = 100;

		if((this.percent==100&&this.toAdd==0&&this.progressBarLastPercent==100)){
			Game.getEventsManager().dispatch("loaded");
			this.isLoaded = true;
			if(Config.debugMode) console.log("[GIEngine] Game loaded. Start Game loop.");
		}

		this.updateNumber++;
	},

	render: function(){
		if(!this.initialized) return false;

		var cs = Game.getCanvas().getSize();
		if(this.lastCanvasSize != cs){
			var middleX = cs.getWidth() / 2, middleY = cs.getHeight() / 2;

			this.progressBg.setPosition(middleX - this.progressBg.size[0] / 2, middleY + 25);
			this.progressBar.setPosition(this.progressBg.position.getX(), middleY + 25);
			this.statusText.setPosition(this.progressBg.position.getX() + this.progressBg.size[0] - 28, middleY + 25 + 15);
			this.acrochText.setPosition(this.progressBg.position.getX() + 65, middleY + 5);
			this.debugText.setPosition(cs.x - 100, 15);

			this.lastCanvasSize = cs;
		}

		// Set progress-bar width with the percent
		var maxWidth = 500;
		if(isNaN(this.percent)) this.percent = 0;
		var width = maxWidth*(this.percent/100);

		if(this.progressBarLastWidth!=width){
			this.toAdd += parseInt(width)-parseInt(this.progressBarLastWidth);
		}

		if(this.toAdd<0) this.toAdd = 0;

		if(this.toAdd>0){
			var newWidth = this.progressBar.size[0]+this.step;
			if(newWidth>maxWidth) newWidth = maxWidth;
			this.progressBar.setSize(newWidth, 2);
			this.toAdd -= this.step;
		}

		this.progressBarLastWidth = width;

		// Update text
		var tempPercent = (this.progressBar.size[0]/maxWidth)*100;
		this.statusText.setText("v"+Config.version);
		this.progressBarLastPercent = tempPercent;

		// Do Render
		this.background.renderer.render(Game.delta);
		this.progressBg.renderer.render(Game.delta);
		this.progressBar.renderer.render(Game.delta);
		this.acrochText.draw(Game.delta);
		if(Config.debugMode) this.statusText.draw(Game.delta);
		if(Config.debugMode) this.debugText.draw(Game.delta);

		// Render logo
		if(this.logo!=null)
			Game.getContext().drawImage(this.logo, 0, 0, 800, 162, (Game.getCanvas().getSize().w/2-600/2)+40, (Game.getCanvas().getSize().h/2-80), 410, 83);
	}

};