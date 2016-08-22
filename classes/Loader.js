function Loader(){
	this.isLoaded = false;
	this.initialized  = false;

	this.percent = 0;
	this.step    = 50;
	// this.progressBarColor = "#329A45";
	this.progressBarColor = "#438EED";
	this.progressBarWidth = 500;

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
			that.initialized = true;
		}
		logoImg.onerror = function(){that.initialized = true;}

		this.background  = new GameObject([canvasSize.getWidth(), canvasSize.getHeight()]);
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
		this.acrochText.setPosition(this.progressBg.position.getX() + 65, middleY - 5);
		this.acrochText.setFontSize(16);
		this.acrochText.setFont("Helvetica");
		this.acrochText.setColor("#383838");

		this.debugText.setPosition(canvasSize.x-100, 15);
		this.debugText.setFontSize(11);
		this.debugText.setColor("#111");
	},

	update: function(){
		if(!this.initialized) return false;

		var ressourcesLoaded = Game.getRessources().ressourcesLoaded+SoundsManager.soundsLoaded;
		var ressourcesTotal = Game.getRessources().ressourcesNum+SoundsManager.soundsNum;

		this.percent = (ressourcesLoaded/ressourcesTotal)*100;

		if((ressourcesTotal==0&&this.updateNumber>60*3)){
			this.toAdd = 500;
		}
		if(isNaN(this.percent) || this.percent>100) this.percent = 100;

		if((this.percent == 100 && this.toAdd == 0 && this.progressBarLastPercent == 100)){
			Game.getEventsManager().dispatch("loaded");
			this.isLoaded = true;
			if(Config.debugMode) console.log("[GIEngine] Game loaded. Start Game loop.");
		}

		this.updateNumber++;
	},

	render: function(){
		if(!this.initialized) return false;

		var cs = Game.getCanvas().getSize();

		if(this.lastCanvasSize == null || this.lastCanvasSize.getWidth() != cs.getWidth() || this.lastCanvasSize.getHeight() != cs.getHeight()){
			var middleX = cs.getWidth() / 2, middleY = cs.getHeight() / 2;

			this.progressBg.setPosition(middleX - this.progressBg.size[0] / 2, middleY + 25);
			this.progressBar.setPosition(this.progressBg.position.getX(), middleY + 25);
			this.statusText.setPosition(this.progressBg.position.getX() + this.progressBg.size[0] - 28, middleY + 25 + 15);
			this.acrochText.setPosition(this.progressBg.position.getX() + 65, middleY - 5);
			this.debugText.setPosition(cs.getWidth() - 100, 15);

			if(this.progressBg.getSize().w >= cs.getWidth()){
				this.progressBg.getPosition().setX(20);
				this.progressBar.getPosition().setX(20);
				this.progressBg.setSize(cs.getWidth() - 40, this.progressBg.getSize().h);

				this.progressBarWidth = this.progressBg.getSize().w;

				this.acrochText.setText("Plateforme de création de jeux vidéo.");
				this.acrochText.getPosition().setX(cs.getWidth() - (20 + this.acrochText.getSize().w));
				this.statusText.getPosition().setX(cs.getWidth() - (20 + this.statusText.getSize().w));
				this.debugText.getPosition().setX(cs.getWidth() - (20 + this.debugText.getSize().w));
			}

			this.lastCanvasSize = cs;
		}

		// Set progress-bar width with the percent
		if(isNaN(this.percent)) this.percent = 0;
		var width = this.progressBarWidth * (this.percent/100);

		if(this.progressBarLastWidth!=width){
			this.toAdd += parseInt(width)-parseInt(this.progressBarLastWidth);
		}

		if(this.toAdd < 0) this.toAdd = 0;

		if(this.toAdd > 0){
			var newWidth = this.progressBar.size[0]+this.step;
			if(newWidth > this.progressBarWidth) newWidth = this.progressBarWidth;
			this.progressBar.setSize(newWidth, 2);
			this.toAdd -= this.step;
		}

		this.progressBarLastWidth = width;

		// Update text
		var tempPercent = (this.progressBar.size[0] / this.progressBarWidth) * 100;
		this.statusText.setText("v" + Config.version);
		this.progressBarLastPercent = tempPercent;

		// Do Render
		this.background.renderer.render(Game.delta);
		this.progressBg.renderer.render(Game.delta);
		this.progressBar.renderer.render(Game.delta);
		this.acrochText.draw(Game.delta);
		if(Config.debugMode) this.statusText.draw(Game.delta);
		if(Config.debugMode) this.debugText.draw(Game.delta);

		// Render logo
		if(this.logo != null){
			var renderRect = new Rectangle((cs.getWidth() / 2 - 600 / 2) + 40, (cs.getHeight() / 2 - 80), 410, 83);

			if((renderRect.getY() + renderRect.getWidth()) > cs.getWidth()){
				var newHeight  = (renderRect.getHeight() / renderRect.getWidth()) * cs.getWidth();
				renderRect = new Rectangle(10, renderRect.getY() + (renderRect.getHeight() - newHeight), cs.getWidth() - 20, newHeight);
			}

			Game.getContext().drawImage(this.logo, 0, 0, 800, 162, renderRect.getX(), renderRect.getY(), renderRect.getWidth(), renderRect.getHeight());
		}
	}

};