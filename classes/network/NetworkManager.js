function NetworkManager(){
	this.network;

	this.clients = {};
	this.objectsToSend = [];
}

NetworkManager.prototype = {

	load: function(){
		var that = this;
		this.network = new Network(Config.gameServer);

		this.network.onConnect(function(conn){
			// Load listeners
			that.onGameObjectUpdate();
		});
	},

	setNetwork: function(network){
		this.network = network;
	},

	getNetwork: function(){
		return this.network;
	},

	getConnection: function(){
		return (this.network!=null) ? this.network.getConnection() : null;
	},

	isConnected: function(){
		return (this.network!=null&&this.network.getConnection()!=null);
	},

	checkForClient: function(clientID){
		if(this.clients[clientID]==null)
			this.clients[clientID] = {gameobjects: []};
	},

	getClientsConnected: function(){
		return this.clients;
	},

	putGameObjectOnline: function(gameobject){
		this.objectsToSend.push(gameobject);
	},



	/*
	*	Senders (Do requests)
	*/
	updateNetwork: function(){
		if(this.getConnection() == null || this.getConnection().readyState === 3) return false;

		for(var i=0;i<this.objectsToSend.length;i++){
			var go = this.objectsToSend[i];

			var objStr = "gou/";
			var animationName = (go.animation != null) ? go.animation.name : "";

			objStr += go.ID+","+JSON.stringify(go.animation)+","+go.isAnimated+","+go.position[0]+","
					+ go.position[1]+","+go.size[0]+","+go.size[1]+","+go.scale+","+go.layer+","+go.renderer.name

			this.getConnection().send(objStr);
		}
	},

	/*
	*	Listeners
	*/
	onGameObjectUpdate: function(){
		var that = this;
		this.getNetwork().onMessage(function(event){
			var msg = event.data;
			var gs = msg.split("/");
    		var prefix = gs[0];
    		var params = gs[1].split(",");

    		if(prefix !== "gou") return false;


    		var clientID      = msg.split("$")[1];
			var gameobjectID  = params[0];
			var animation     = (params[1] != null) ? JSON.parse("{"+msg.substring(msg.lastIndexOf("{")+1,msg.lastIndexOf("}"))+"}") : null;
			var isAnimated    = params[2];
			var pos           = {x: params[3], y: params[4]};
			var size          = {w: params[5], y: params[6]};
			var scale         = params[7];
			var layer         = params[8];
			var textureName   = params[9];


			that.checkForClient(clientID);

			var scene         = Game.getCurrentScene();
			var client        = that.clients[clientID];
			var currentObject = false;

			for(var i=0;i<client.gameobjects.length;i++){
				if(client.gameobjects[i].netID==gameobjectID+"-net")
					currentObject = client.gameobjects[i];
			}

			if(currentObject){
				var sceneID = -1;
				for(var i=0;i<scene.gameobjects.length;i++){
					var go = scene.gameobjects[i];
					if(go==null) continue ;
					if(go.netID!=null&&go.netID==gameobjectID+"-net") sceneID = go.ID;
				}
				if(sceneID==-1) return false;

				currentObject.animation = null;
				currentObject.isAnimated = isAnimated;
				currentObject.defineAnimation(animation.name, animation.speed, animation.pos, animation.frames, animation.flipped);
				currentObject.setPosition(parseFloat(pos.x), parseFloat(pos.y));

				scene.gameobjects[sceneID] = currentObject;
			}else{
				var gameobject = new GameObject([parseFloat(size.w), parseFloat(size.h)]);
				gameobject.netID = gameobjectID+"-net";
				if(animation!=null)
					gameobject.defineAnimation(animation.name, animation.speed, animation.pos, animation.frames, animation.flipped);
				gameobject.setRenderer(new SpriteRenderer({name: textureName}));
				gameobject.setPosition(parseFloat(pos.x), parseFloat(pos.y));
				gameobject.setScale(scale);
				gameobject.setLayer(layer);

				client.gameobjects.push(gameobject);
				scene.addGameObject(gameobject);
			}
		});
	}

};