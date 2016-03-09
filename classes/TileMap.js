/**
 * Tilemap
 * @class
 */
function TileMap(filename){
	this.scene = null;
	this.name  = "";

	this.size   = {w: 0, h: 0};
	this.tiles  = {};
	this.limits = null;

	this.collisionsMap = {};
}

TileMap.prototype = {

	setScene: function(scene){
		this.scene = scene;
	},

	getFirstTile: function(){
		if(this.tiles[Object.keys(this.tiles)[0]]!=null)
			return this.tiles[Object.keys(this.tiles)[0]].tiles[0];
		else
			return null;
	},
	getLimits: function(){
		if(this.limits!=null) return this.limits;
		
		var xLeft = 12000;
		var xRight = 0;
		var yTop = 12000;
		var yBottom = 0;

		for(var i=0;i<Object.keys(this.tiles).length;i++){
			var key = Object.keys(this.tiles)[i];
			for(var j=0;j<Object.keys(this.tiles[key].tiles).length;j++){
				var tile = this.tiles[key].tiles[j];

				var xPos = tile.objPos.x*tile.objSize[0];
				var xPosR = tile.objPos.x*tile.objSize[0]+tile.objSize[0];
				var yPos = tile.objPos.y*tile.objSize[1];
				var yPosB = tile.objPos.y*tile.objSize[1]+tile.objSize[1];

				if(xPos<=xLeft) xLeft = parseInt(xPos);
				if(xPosR>=xRight) xRight = parseInt(xPosR);
				if(yPos<=yTop) yTop = parseInt(yPos);
				if(yPosB>=yBottom) yBottom = parseInt(yPosB);
			}
		}

		var finalObj = {xLeft: xLeft, xRight: xRight, yBottom: yBottom, yTop: yTop};
		this.limits = finalObj;

		return finalObj;
	},
	getName: function(){
		return this.name
	},
	getTexture: function(){
		return Game.ressources.getRessource(this.getTextureName());
	},
	getTextureName: function(){
		var ft = this.getFirstTile();
		if(ft == null) return null;
		
		return ft.name;
	},
	getTileAt: function(x, y, layer){
		var keys = Object.keys(this.tiles);
		for(var i=0;i<keys.length;i++){
			var tileGroup = this.tiles[keys[i]];
			for(var j=0;j<tileGroup.tiles.length;j++){
				var tile = tileGroup.tiles[j];

				if(layer==undefined){
					if(tile.objPos.x==x&&tile.objPos.y==y)
						return tile;
				}else{
					if(tile.objPos.x==x&&tile.objPos.y==y&&tile.layer==layer)
						return tile;
				}
			}
		}

		return null;
	},

	hasCollisionAt: function(x, y, layer){
		var limits = this.getLimits(), firstTile = this.getFirstTile();
		var sizeW  = (limits.xRight - limits.xLeft) / firstTile.size[0];
		var sizeH  = (limits.yBottom - limits.yTop) / firstTile.size[1];

		var index = getIndexFromXY(x, y, sizeW);

		if(this.collisionsMap[layer] != null && this.collisionsMap[layer][index] !== undefined)
			return this.collisionsMap[layer][index];
		else
			return 0;
	},


	load: function(filename){
		var that = this;
		this.name = filename;

		loadJSON(Config.assetsDir+'/'+formatFilename(filename)+'.json', function(data){
			that.loadFromJson(data);
		}, function(error){console.log(error.statusText);});
	},

	loadFromJson: function(data){
		var keys = Object.keys(data);
		var o    = 0;

		var timeBefore = Date.now();

		for(var i=0;i<keys.length;i++){
			var name = keys[i];
			var tile = data[name];

			var tiles = [];
			var tKeys = Object.keys(tile.tiles);
			
			for(var j=0;j<tKeys.length;j++){
				var canvasPos = tKeys[j];
				var imgPos = tile.tiles[canvasPos];
				var layer = 0;
				var solid = false;

				canvasPos = canvasPos.split("-");
				var matchTest = canvasPos[1];

				if(canvasPos[1].indexOf('/') > -1){
					var split = canvasPos[1].split("/");
					layer = split[1];
					canvasPos[1] = split[0];
				}

				if(matchTest.indexOf('/s') > -1){
					solid = true;
				}

				var tileObj = new Tile(tile.src, [tile.size[0], tile.size[1]], {x: imgPos[0], y: imgPos[1]}, {x: canvasPos[0], y: canvasPos[1]}, tile.objSize, [tile.betweenX, tile.betweenY]);
				tileObj.scene = this.scene;
				tileObj.setLayer(layer);
				tileObj.setSolid(solid);

				this.size.w = tile.size[0];
				this.size.h = tile.size[1];

				tiles.push(tileObj);
				o++;
			}


			this.tiles[name] = {
				src: tile.src,
				tiles: tiles,
				betweenX: tile.betweenX,
				betweenY: tile.betweenY
			};
		}

		if(Config.debugMode){
			var time = (Date.now() - timeBefore)/1000;

			var timeToShow = (time)+" seconds.";
			if(time<1) timeToShow = (time*1000)+" milliseconds.";

			log("Tilemap '"+this.name+"' loaded with "+o+" tiles in "+timeToShow);
		}

		Game.events.dispatch("loadedTiles");
		this.scene.dispatchEvent("loadedTiles", {tiles: this.tiles, num: o});

		// Load Collision Map
		this.generateCollisionMap();
	},

	generateCollisionMap: function(){
		var timeBefore = Date.now();
		var limits = this.getLimits();

		for(var i = 0; i < Object.keys(this.tiles).length; i++){
			var key = Object.keys(this.tiles)[i];
			for(var j = 0; j < Object.keys(this.tiles[key].tiles).length; j++){
				var tile  = this.tiles[key].tiles[j];
				var sizeW  = (limits.xRight - limits.xLeft) / tile.size[0];	
				var index = getIndexFromXY(tile.objPos.x, tile.objPos.y, sizeW);

				var layer = parseInt(tile.layer);
				if(this.collisionsMap[layer] == null) this.collisionsMap[layer] = [];

				this.collisionsMap[layer][index] = (tile.isSolid()) ? 1 : 0;

				if(j + 1 == Object.keys(this.tiles[key].tiles).length){
					if(Config.debugMode){
						var time = (Date.now() - timeBefore)/1000;

						var timeToShow = (time)+" seconds.";
						if(time<1) timeToShow = (time*1000)+" milliseconds.";

						log("CollisionMap '"+this.name+"' loaded in "+timeToShow);
					}
				}
			}
		}
	},

	setCollisionMap: function(x, y, bool){
		var tile = this.getFirstTile();
		if(tile==null) return false;

		var sizeH = (this.getLimits().yBottom-this.getLimits().yTop)/tile.size[1];
		var index = getIndexFromXY(x-1, y-1, sizeH+1);

		this.collisionsMap[index] = bool;
	}

};