function ErrorView(gameClass){
	this.enabled = false;

	this.game = gameClass;
	this.text = "Erreurs de script détéctées";
	this.subText = "Ctrl-Shift-J pour avoir plus d'informations";

	this.metrics = null;
	this.subMetrics = null;
}

ErrorView.prototype = {

	render: function(){
		var ctx = this.game.getContext();

		var sizes = this.game.getSize();
		var middles = {x: sizes.getWidth() / 2, y: sizes.getHeight() / 2};

		if(this.metrics == null) this.metrics = Game.getContext().measureText(this.text);
		if(this.subMetrics == null) this.subMetrics = Game.getContext().measureText(this.subText);

		var positions    = new Position(middles.x - this.metrics.width / 1.2, middles.y - 10);
		var subPositions = new Position(middles.x - this.subMetrics.width / 1.5, middles.y - 8);

		// Clear canvas
		ctx.clearRect(0, 0, sizes.getWidth(), sizes.getHeight());

		// Draw background
		ctx.fillStyle = "#EFEFEF";
		ctx.fillRect(0, 0, sizes.getWidth(), sizes.getHeight());

		// Draw text
		ctx.font = "20px Arial";
		ctx.fillStyle = "#383838";
		ctx.fillText(this.text, positions.getX(), positions.getY());

		// Draw sub text
		ctx.font = "16px Arial";
		ctx.fillStyle = "#383838";
		ctx.fillText(this.subText, subPositions.getX(), positions.getY() + 25);
	}

};