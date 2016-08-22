function BoundaryBehavior(options){
	this.bounds  = (options != null && options.bounds != null) ? options.bounds : null;
	this.wrap    = (options != null && options.wrap != null) ? options.wrap : false;
	this.destroy = (options != null && options.destroy != null) ? options.destroy : false;
	this.align   = (options != null && options.align != null) ? options.align : "boundaries";
}

BoundaryBehavior.prototype = {

	run: function(go){
		var that = this;

		go.getPosition().applyHook(function(pos){
			var canvasSize = Game.getSize();
			var objectSize = go.getSize();
			var bounds     = null;

			if(that.bounds != null && that.bounds instanceof Rectangle) bounds = that.bounds.clone();
			else bounds = new Rectangle(0, 0, canvasSize.getWidth(), canvasSize.getHeight());

			var camera = (Game != null && Game.getCurrentScene() != null && Game.getCurrentScene().camera != null) ? Game.getCurrentScene().camera : null;
			if(camera != null){
				bounds.x += camera.getPosition().getX();
				bounds.y += camera.getPosition().getY();
			}


			switch(that.align){
				case "boundaries":
					if(!that.wrap){
						// Check all sides of the GameObject
						var left   = pos.getX() >= bounds.getLeft();
						var top    = pos.getY() >= bounds.getTop();
						var right  = (pos.getX() + objectSize.w) <= bounds.getRight();
						var bottom = (pos.getY() + objectSize.h) <= bounds.getBottom();


						if(that.destroy && (!left || !top || !right || !bottom)){
							Game.getCurrentScene().remove(go);
							return pos;
						}

						if(!left) pos.setX(bounds.getLeft());
						if(!top) pos.setY(bounds.getTop());
						if(!right) pos.setX(bounds.getRight() - objectSize.w);
						if(!bottom) pos.setY(bounds.getBottom() - objectSize.h);
					}else{

					}
				break;
				case "origin":
					
				break;
				default:
					return pos;
				break;
			}

			return pos;
		});
	},

	loop: function(go){ }

};