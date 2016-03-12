function Network(address){
	this.address = address;

	this.connection = null;
	this.onConnectEvent = null;

	this.onMessageEvents = [];

	this.connect();
}

Network.prototype = {

	connect: function(){
		var that = this;
		this.connection = new WebSocket(this.address);

		this.connection.onopen = function () {
			log("Connection opened. Waiting for message...");

			if(that.onConnectEvent !== null) that.onConnectEvent(this);
		}

		this.connection.onerror = function () {
			console.error("[GIEngine] Cannot connect to websocket server at "+this.address);
		}

		this.connection.onmessage = function(event){
			for(var key in that.onMessageEvents){
				var onMessageEvent = that.onMessageEvents[key];
				onMessageEvent(event);
			}
		}
	},

	getConnection: function(){
		return this.connection;
	},

	onConnect: function(callback){
		this.onConnectEvent = callback;
	},

	onMessage: function(callback){
		this.onMessageEvents.push(callback);
	}

};