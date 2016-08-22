function GeometricRenderer(options){
	this.gameobject = null;

	this.type     = (options.type != null) ? options.type : "rectangle";
	this.color    = (options.color != null) ? options.color : "black";
	this.drawType = (options.drawType != null) ? options.drawType : "fill";

	// Circle
	this.startCircle = (options.startCircle != null) ? options.startCircle : 0;
	this.endCircle = (options.endCircle != null) ? options.endCircle : 2;

	// Grid
	this.cellSize    = (options.cellSize != null) ? options.cellSize : [32, 32];
	this.offsetCells = (options.offsetCells != null) ? options.offsetCells : [0, 0];
	this.lineWidth   = (options.lineWidth != null) ? options.lineWidth : 1;
	this.dashed      = (options.dashed != null) ? options.dashed : false;
}

GeometricRenderer.prototype = {

	setGameObject: function(gameobject){
		this.gameobject = gameobject.ID;
	},

	render: function(dt){
		var scene      = Game.getCurrentScene();
		var gameobject = scene.getGameObject(this.gameobject);
		if(gameobject == null) return false;

		Game.getContext().globalAlpha = gameobject.opacity;
		Game.getContext().fillStyle   = this.color;
		Game.getContext().strokeStyle = this.color;

		if(this.dashed && this.dashed > 0) Game.getContext().setLineDash([this.dashed]);

		var center   = gameobject.getCenter();
		var position = gameobject.getPosition().clone();
		var size     = gameobject.size;
		var angle    = gameobject.angle;

		if(typeof size[0] === "string") size[0] = Game.getCanvas().size.x;
		if(typeof size[1] === "string") size[1] = Game.getCanvas().size.y;

		// Drawing
		Game.getContext().save();

		switch(this.type){
			case "rectangle":

				Game.getContext().lineWidth = this.lineWidth;

				if(angle != 0){
					Game.getContext().translate(center.x, center.y);
					Game.getContext().rotate(angle * Math.PI / 180);
					Game.getContext().translate(-center.x, -center.y);

					if(this.drawType == "fill")
						Game.getContext().fillRect(center.x - size[0]/2, center.y - size[1]/2, size[0], size[1]);
					else
						Game.getContext().strokeRect(center.x - size[0]/2, center.y - size[1]/2, size[0], size[1]);
				}else{
					Game.getContext().translate(position.getX() + (size[0]/2), position.getY()+(size[1]/2));
					
					if(this.drawType == "fill")
						Game.getContext().fillRect(-size[0]/2, -size[1]/2, size[0], size[1]);
					else
						Game.getContext().strokeRect(-size[0]/2, -size[1]/2, size[0], size[1]);
				}
				
			break;
			case "triangle":
				var beginX = position.getX()+(size[0]/2);
				var beginY = position.getY();

				Game.getContext().beginPath();
				Game.getContext().translate(position.getX()+(size[0]/2), position.getY()+(size[1]/2));

				if(angle != 0) Game.getContext().rotate(angle * Math.PI / 180);
				
				Game.getContext().moveTo(0, -size[1]/2);
				Game.getContext().lineTo(size[0]/2, size[1]/2);
				Game.getContext().lineTo(-size[0]/2, size[1]/2);
				Game.getContext().lineTo(0, -size[1]/2);

				if(this.drawType == "fill") Game.getContext().fill(); else Game.getContext().stroke();
			break;
			case "circle":
				var beginX = position.getX() + (size[0] / 2);
				var beginY = position.getY();
				
				Game.getContext().beginPath();
				Game.getContext().arc(
					position.getX() + (size[0] / 2), 
					position.getY() + (size[0] / 2),
					size[0] / 2,
					this.startCircle * Math.PI,
					this.endCircle * Math.PI
				);
				Game.getContext().lineWidth = this.lineWidth;

				if(this.drawType=="fill") Game.getContext().fill(); else Game.getContext().stroke();
			break;
			case "grid":
				var nums = {x: 0, y: 0};

				if(this.cellSize[0] == 0 || this.cellSize[1] == 0) return false;

				nums.x = Math.ceil(size[0] / (this.cellSize[0]));
				nums.y = Math.ceil(size[1] / (this.cellSize[1]));

				Game.getContext().beginPath();
				Game.getContext().lineWidth = this.lineWidth;

				for(var i = 0;i < nums.x; i++){
					var left = position.getX() + (this.offsetCells[0] + this.cellSize[0] * i);
					Game.getContext().moveTo(left, (position.getY()+this.offsetCells[1]));
					Game.getContext().lineTo(left, (position.getY()+(size[1]-this.offsetCells[1])));
				}
				for(var i = 0;i < nums.y; i++){
					var top = position.getY() + (this.offsetCells[1] + this.cellSize[1] * i)
					Game.getContext().moveTo((position.getX()+this.offsetCells[0]), top);
					Game.getContext().lineTo((position.getX()+(size[0]-this.offsetCells[0])), top);
				}

				Game.getContext().stroke();
			break;
		}
		
		Game.getContext().restore();
		
		// Debug
		if(Config.debugMode){
			var as  = gameobject.getSize();
			var ctx = Game.getCanvas().getContext();

			ctx.save();

			var rotationPoint = center;
			ctx.translate(rotationPoint.x, rotationPoint.y);
			ctx.rotate(gameobject.angle * Math.PI / 180);
			ctx.translate(-rotationPoint.x, -rotationPoint.y);

			ctx.beginPath();
			ctx.moveTo(center.x - as.w / 2, center.y - as.h / 2);
			ctx.lineTo(center.x + as.w / 2, center.y - as.h / 2);
			ctx.lineTo(center.x + as.w / 2, center.y + as.h / 2);
			ctx.lineTo(center.x - as.w / 2, center.y + as.h / 2);
			ctx.lineTo(center.x - as.w / 2, center.y - as.h / 2);
			ctx.strokeStyle = "black";
			ctx.lineWidth   = 1.5;
			ctx.stroke();

			ctx.restore();
		}

		Game.getContext().fillStyle   = "black";
		Game.getContext().strokeStyle = "black";
		Game.getContext().globalAlpha = 1;
		if(this.dashed) Game.getContext().setLineDash([]);
	},

	clone: function(){
		var renderer = new GeometricRenderer({
			type: this.type,
			color: this.color,
			drawType: this.drawType,
			startCircle: this.startCircle,
			endCircle: this.endCircle,
			cellSize: this.cellSize,
			offsetCells: this.offsetCells,
			lineWidth: this.lineWidth,
			dashed: this.dashed
		});

		if(this.gameobject != null) renderer.gameobject = this.gameobject;

		return renderer;
	}

};

window.GeometricRenderer = GeometricRenderer;