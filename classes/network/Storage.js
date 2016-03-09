function Storage(){

	this.online  = {};
	this.session = {};

}

Storage.prototype = {

	get: function(key){
		return this.session[key];
	},

	set: function(key, value){
		this.session[key] = value;
	},

};