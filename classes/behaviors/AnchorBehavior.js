function AnchorBehavior(options){
	this.position = (options != null && options.position != null) ? options.position : null;
}

AnchorBehavior.prototype = {

	run: function(go){
		var that = this;

		if(this.position == null) this.position = go.getPosition().clone();

		go.getPosition().applyHook(function(pos){
			return that.getAnchorPosition(that.position);
		});
	},

	loop: function(go){
		if(this.position == null) return false;
		var size = Game.getSize();

		if(this.position.getX() < 0) this.position.setX(size.getWidth() + this.position.getX());
		if(this.position.getY() < 0) this.position.setY(size.getHeight() + this.position.getY());
		
		var anchorPos = this.getAnchorPosition(this.position);
		go.getPosition().set(anchorPos); 
	},

	getAnchorPosition: function(pos){
		if(pos == null || !(pos instanceof Position)) return new Position(0, 0);
		pos = pos.clone();

		var scene  = Game.getCurrentScene();
		var camera = scene.camera;

		if(camera != null) pos.add(camera.getPosition());
		return pos;
	}

};