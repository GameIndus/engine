/**
 * Scene
 * @class
 */
function Scene(){
	this.gameobjects = [];
	this.backgrounds = [];
	this.camera      = null;
	this.tilemap     = null;

	this.gameobjectsMap = {};

	this.texts     = [];
	this.particles = [];

	// Custom events (only scene)
	this.events = {loadedTiles: []};

	this._indexes = 0;
}

Scene.prototype = {

	add: function(object){
		if(object instanceof GameObject) this.addGameObject(object);
		else if(object instanceof Text) this.addText(object);
		else if(object instanceof Background) this.addBackground(object);
		else if(object instanceof Camera) this.setActiveCamera(object);
		else if(object instanceof TileMap) this.setTileMap(object);
	},
	remove: function(object){
		if(object instanceof GameObject) this.removeGameObject(object);
		else if(object instanceof Text) this.removeText(object);
		else if(object instanceof Background) this.removeBackground(object);
		else if(object instanceof Camera) this.camera = null;
		else if(object instanceof TileMap) this.tilemap = null;
	},
	
	addGameObject: function(gameobject){
		// Check if this gameobject already exists
		if(this.gameobjects.indexOf(gameobject) > -1) return false;

		gameobject.ID    = this._indexes;
		if(gameobject.getRenderer() != null) gameobject.getRenderer().gameobject = gameobject.ID;

		this.gameobjects.push(gameobject);

		this._indexes++;
	},
	registerGameObject: function(name, gameobject){
		this.addGameObject(gameobject);
		gameobject.name = name;
		this.gameobjectsMap[name] = gameobject.ID;
	},
	getGameObject: function(obj){
		if(typeof(obj) === "string"){
			for(var i=0;i<Object.keys(this.gameobjectsMap).length;i++){
				var name = Object.keys(this.gameobjectsMap)[i];
				var ID   = this.gameobjectsMap[name];

				if(name==obj)
					return this.getGameObject(parseInt(ID));
			}
		}else{
			var ID = parseInt(obj);

			for(var i=0;i<this.gameobjects.length;i++)
				if(this.gameobjects[i].ID==ID)
					return this.gameobjects[i];
		}

		return null;
	},
	cloneGameObject: function(from, to){
		var gameobject = this.getGameObject(from);
		if(gameobject == null) return false;

		var cloneGo = gameobject.clone();
		this.registerGameObject(to, cloneGo);

		return cloneGo;
	},
	removeGameObject: function(gameobject){
		if(this.gameobjects.indexOf(gameobject) > -1)
			this.gameobjects.splice(this.gameobjects.indexOf(gameobject), 1);
	},

	/**
	 * Adding Text into the Scene
	 * @param {Text} text The text object
	 */
	addText: function(text){
		// Check if this text already exists
		if(this.texts.indexOf(text) > -1) return false;

		this.texts.push(text);
	},

	addBackground: function(background){
		// Check if this background already exists
		if(this.backgrounds.indexOf(background) > -1) return false;

		background.setScene(this);
		this.backgrounds.push(background);
	},
	removeBackground: function(background){
		if(this.backgrounds.indexOf(background) > -1)
			this.backgrounds.splice(this.backgrounds.indexOf(background), 1);
	},


	setActiveCamera: function(camera){
		this.camera = camera;
		this.camera.setScene(this);
	},
	getActiveCamera: function(){
		return this.camera;
	},

	setTileMap: function(filename){
		if(filename instanceof TileMap || filename === null){
			if(filename instanceof TileMap) filename.setScene(this);
			
			this.tilemap = filename;
			return false;
		}

		var map = new TileMap();
		map.setScene(this);
		this.tilemap = map;
		map.load(filename);
	},
	getTileMap: function(){
		return this.tilemap;
	},

	getText: function(name){
		for(var i=0;i<this.texts.length;i++){
			if(this.texts[i].text==name)
				return this.texts[i];
		}

		return null;
	},
	removeText: function(text){
		if(this.texts.indexOf(text) > -1)
			this.texts.splice(this.texts.indexOf(text), 1);
	},
	getObjectAt: function(x, y, layer, objectExcluded){
		var checkPosition = new Position(x, y);
		if(x instanceof Position){ checkPosition = x;layer = y;objectExcluded = layer; }

		for(var i = 0;i < this.gameobjects.length; i++){
			if(this.gameobjects[i] == null) continue ;
			var gameobject = this.gameobjects[i];
			var rectangle  = gameobject.getBordersRectangle();

			if(gameobject == objectExcluded) continue;
			if(layer !== undefined && layer != gameobject.getLayer()) continue;

			if(rectangle.inside(checkPosition)) return gameobject;
		}

		return null;
	},

	addParticle: function(particleObj){
		particleObj.scene = this;
		this.particles.push(particleObj);							
	},

	update: function(dt){
		for(var i=0;i<this.backgrounds.length;i++)
			this.backgrounds[i].update();

		for(var i = 0;i < this.gameobjects.length; i++){
			var go = this.gameobjects[i];
			if(go == null) continue ;
			
			if(go.physicEngine != null) go.physicEngine.update();
			if(go.getRenderer() != null && typeof(go.getRenderer().update) === "function") 
				go.getRenderer().update(Game.delta);

			go.update();
		}

		if(this.camera != null) this.camera.update();
	},
	render: function(dt){
		if(this.camera != null) this.camera.begin();

		for(var i=0;i<this.backgrounds.length;i++){
			this.backgrounds[i].render();
		}

		var objs = {
			0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]
		};

		if(this.getTileMap() != null){
			var tilemap = this.getTileMap();
			var keys = Object.keys(tilemap.tiles);
			for(var i = 0; i < keys.length; i++){
				var tileGroup = tilemap.tiles[keys[i]];

				for(var j = 0; j < tileGroup.tiles.length; j++){
					var tile = tileGroup.tiles[j];
					tile.type = "tile";

					if(Game.ressources.getRessource(tileGroup.src) != null)
						objs[tile.layer].push(tile);
				}
			}
		}

		for(var i=0;i<this.gameobjects.length;i++){
			var go = this.gameobjects[i];
			if(go==null) continue ;
			go.type = "gameobject";

			if(go.getRenderer()!=null&&go.getRenderer().name!==undefined){ // Sprite Renderer
				if(Game.ressources.getRessource(go.getRenderer().name)!=null){
					objs[go.layer].push(go);
				}
			}else if(go.getRenderer()!=null&&go.getRenderer().type!=""){ // Geometric Renderer
				objs[go.layer].push(go);
			}
		}

		keys = Object.keys(objs);
		for(var i=0;i<keys.length;i++){
			objs[keys[i]].sort( function(a,b) {
				return a.getBorder("bottom") + 1 - b.getBorder("bottom"); 
			});

			for(var j=0;j<objs[keys[i]].length;j++){
				var obj = objs[keys[i]][j];
				if(obj.type == "gameobject"){
					obj.getRenderer().render(dt);
				}else if(obj.type == "tile"){
					obj.render();
				}
			}
		}

		// Render particles
		for(var i=0;i<this.particles.length;i++)
			this.particles[i].draw();

		// Render texts
		for(var i=0;i<this.texts.length;i++)
			this.texts[i].draw();

		if(this.camera != null) this.camera.end();
	},

	// Custom events (only scene)
	
	dispatchEvent: function(name, data){
		if(this.events[name]==null) return false;
		for(var i=0;i<this.events[name].length;i++)
			this.events[name][i](data);
	},

	onLoadedTiles: function(callback){
		this.events["loadedTiles"].push(callback);
	}
	

};