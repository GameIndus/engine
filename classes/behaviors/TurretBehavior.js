function TurretBehavior(options){
	this.target           = (options != null && options.target != null) ? options.target : null;
	this.targetNearObject = (options != null && options.targetNearObject != null) ? options.targetNearObject : false;
	this.angleStep        = (options != null && options.step != null) ? options.step : 360;
	this.idleAngle        = (options != null && options.idleAngle != null) ? options.idleAngle : -1;
	this.radius           = (options != null && options.radius != null) ? options.radius : -1;

	this.shootRate       = (options != null && options.shootRate != null) ? options.shootRate : 1;
	this.shootYield      = (options != null && options.shootYield != null) ? options.shootYield : 1;
	this.gunLength       = (options != null && options.gunLength != null) ? options.gunLength : -1;
	this.projectile      = (options != null && options.projectile != null) ? options.projectile : null;
	this.projectileSpeed = (options != null && options.projectileSpeed != null) ? options.projectileSpeed : 1;

	this.lastTargetPosition = null;
	this.angleToAdd         = 0;
	this.timer 				= null;
	this.shootNumber        = 0;
	this.bullets            = [];
}

TurretBehavior.prototype = {

	run: function(go){
		this.timer = new Timer();
	},

	loop: function(go){
		var targetPosition = null;
		if(this.target instanceof Position) targetPosition = this.target;
		if(this.target instanceof GameObject) targetPosition = this.target.getCenter();
		if(this.target == null && this.targetNearObject){
			var scene = Game.getCurrentScene();
			var near  = null, nearDistance = null;

			for(var i = 0; i < scene.gameobjects.length; i++){
				var obj  = scene.gameobjects[i];
				if(obj.getID() == go.getID() || this.bullets.indexOf(obj) > -1) continue;

				var dist = go.getCenter().distanceTo(obj.getCenter());

				if(nearDistance == null || dist < nearDistance){
					near = obj;nearDistance = dist;
				}
			}

			if(near != null) targetPosition = near.getCenter();
		}

		var far = false;
		if(targetPosition != null && this.radius > -1){
			var dist = go.getCenter().distanceTo(targetPosition);
			if(dist > this.radius) far = true;
		}

		if((targetPosition == null && this.idleAngle != -1) || (this.radius > -1 && far)){ // Move to idle Angle
			var angle         = -(this.idleAngle - 90) % 360;
			var anglePosition = new Position(Math.cos(angle * Math.PI / 180) * (go.getSize().w / 2), Math.sin(angle * Math.PI / 180) * (go.getSize().h / 2));
			targetPosition = new Position(go.getCenter().getX() + anglePosition.getX(), go.getCenter().getY() - anglePosition.getY());
		}
		if(targetPosition == null) return false;
		if(this.radius > -1 && far && this.idleAngle == -1) return false;

		if(targetPosition != null && !targetPosition.equals(this.lastTargetPosition)){
			var goPosition  = go.getCenter();
			var deltaAngle  = goPosition.angleTo(targetPosition);
			this.angleToAdd = deltaAngle - go.angle;

			if(Math.abs(this.angleToAdd) > 180)
				this.angleToAdd = (360 - Math.abs(this.angleToAdd)) * ((this.angleToAdd < 0) ? 1 : -1) % 360;
			if(Math.abs(this.angleToAdd) > 180)
				this.angleToAdd = (360 - Math.abs(this.angleToAdd)) * ((this.angleToAdd < 0) ? 1 : -1) % 360;

			this.lastTargetPosition = targetPosition.clone();
		}

		if(this.angleToAdd <= this.shootYield && this.projectile instanceof GameObject){
			var div = (this.timer.getTimeElapsed() / 1000) / this.shootRate;

			if((this.shootNumber + 1) < div){
				this.shootNumber++;

				function getGunLength(object){
					var size = object.getSize();
					var diag = Math.sqrt(size.w * size.w + size.h * size.h);
					return diag / 2;
				}

				// Prepare projectile & shoot it
				var shootAngle    = go.angle + 0;
				var newProjectile = this.projectile.clone();
				var gunLength     = (this.gunLength > -1) ? this.gunLength : getGunLength(go);
				var v             = new Vector2();
				var spawn         = new Position(Math.round(Math.cos((shootAngle - 90) * Math.PI / 180) * gunLength), 
												Math.round(Math.sin((shootAngle - 90) * Math.PI / 180) * gunLength)); 

				spawn.add(go.getCenter());

				v.setLength(this.projectileSpeed);
				v.setAngle(shootAngle);

				newProjectile.getPosition().set(spawn);
				newProjectile.rotate(shootAngle);
				newProjectile.setVelocity(v);
				newProjectile.setOpacity(1);

				Game.getCurrentScene().add(newProjectile);
				this.bullets.push(newProjectile);
			}
		}

		var step = this.angleStep;
		if(step > Math.abs(this.angleToAdd)) step = Math.abs(this.angleToAdd);

		var nextRotation = (this.angleToAdd < 0) ? -step : step;
		go.rotate(go.angle + nextRotation);

		this.angleToAdd -= nextRotation;
	}

};