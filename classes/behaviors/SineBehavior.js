function SineBehavior(options){
	this.mode      = (options != null && options.mode != null) ? options.mode : "vertical";
	this.magnitude = (options != null && options.magnitude != null) ? options.magnitude : 20;
	this.period    = (options != null && options.period != null) ? options.period : 4;

	this.currentAngle    = 0;
	this.defaultPosition = null;
	this.cameraPosition  = null;
}

SineBehavior.prototype = {

	run: function(go){ this.defaultPosition = go.getCenter().clone(); },

	loop: function(go){
		if(this.defaultPosition == null) return false;
		var delta = Game.delta;

		if(Game.getCurrentScene() != null && Game.getCurrentScene().camera != null){
			var camera = Game.getCurrentScene().camera;

			if(this.cameraPosition != null && !this.cameraPosition.equals(camera.getPosition())){
				var diff = this.cameraPosition.clone().substract(camera.getPosition());
				this.defaultPosition.substract(diff);
			}
			this.cameraPosition = camera.getPosition().clone();
		}

		var angleForNextLoop = 2 * Math.PI; 
		var incrAngle        = delta * angleForNextLoop / this.period;

		if(this.mode == "vertical"){
			var y = this.defaultPosition.getY() + Math.sin(this.currentAngle) * (this.magnitude / 2);
			go.getPosition().setY(y);
		}else if(this.mode == "horizontal"){
			var x = this.defaultPosition.getX() + Math.cos(this.currentAngle) * (this.magnitude / 2);
			go.getPosition().setX(x);
		}
		
		this.currentAngle += incrAngle;
	}

};