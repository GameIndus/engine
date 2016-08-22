function ButtonBehavior(options){
	this.cible            = (options != null && options.cible != null) ? options.cible : null;
	this.trigger          = (options != null && options.trigger != null) ? options.trigger : "left";
	this.activeAfterClick = (options != null && options.activeAfterClick != null) ? options.activeAfterClick : false;
	this.overAnimation    = (options != null && options.overAnimation != null) ? options.overAnimation : null;
	this.clickAnimation   = (options != null && options.clickAnimation != null) ? options.clickAnimation : null;

	this.downLastFrame    = false;
	this.defaultAnimation = null;
}

ButtonBehavior.prototype = {

	run: function(go){
		if(go.animation == null && Object.keys(go.animations).length > 0) this.defaultAnimation = Object.keys(go.animations)[0];
		else if(go.animation != null) this.defaultAnimation = go.animation.name;
	},

	loop: function(go){
		if(this.cible != null){
			var cursorPosition = Input.getLastCursorPosition();

			if(Input.mouseIsDown(this.trigger)){
				if(!this.activeAfterClick) this.activeButton(go);
				else this.downLastFrame = true;

				if(this.clickAnimation != null && this.defaultAnimation != null && this.positionOnButton(cursorPosition, go)){
					go.setAnimation(this.clickAnimation);
				}else{
					go.setAnimation(this.defaultAnimation);
				}
			}else{
				if(this.downLastFrame && this.activeAfterClick){
					this.downLastFrame = false;
					this.activeButton(go);
				}

				if(this.overAnimation != null && this.defaultAnimation != null && this.positionOnButton(cursorPosition, go)){
					go.setAnimation(this.overAnimation);
				}else{
					go.setAnimation(this.defaultAnimation);
				}
			}
		}
	},

	activeButton: function(button){
		var cursorPosition = Input.getLastCursorPosition();

		function ValidURL(str) {
		  	var pattern = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
			
			return pattern.test(str);
		}
		
		if(this.positionOnButton(cursorPosition, button)){
			if(ValidURL(this.cible)){
				var w = window.open(this.cible, '_blank');
				if(w != null) w.focus();
			}else{
				Game.setCurrentScene(this.cible);
			}
		}
	},
	positionOnButton: function(position, button){
		var buttonSize     = button.getSize();
		var buttonPosition = button.getPosition().clone();

		if(Game.getCurrentScene() != null && Game.getCurrentScene().camera != null) buttonPosition.add(Game.getCurrentScene().camera.getPosition());

		var triggerZone = new Rectangle(buttonPosition.getX(), buttonPosition.getY(), buttonSize.w, buttonSize.h);
		return triggerZone.inside(position);
	}

};