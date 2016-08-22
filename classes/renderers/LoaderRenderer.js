function LoaderRenderer(options){
    this.gameobject = null;

    this.pos = new Position();
    this.size = [];

    this.type  = (options.type!=null) ? options.type : "rectangle";
    this.color = (options.color!=null) ? options.color : "black";
    this.angle = (options.angle!=null) ? options.angle : 0;
    this.drawType = (options.drawType!=null) ? options.drawType : "fill";

    // Circle
    this.startCircle = (options.startCircle!=null) ? options.startCircle : 0;
    this.endCircle = (options.endCircle!=null) ? options.endCircle : 2;

    // Grid
    this.cellSize = (options.cellSize!=null) ? options.cellSize : [32, 32];
    this.offsetCells = (options.offsetCells!=null) ? options.offsetCells : [0, 0];
    this.lineWidth = (options.lineWidth!=null) ? options.lineWidth : 1;
}

LoaderRenderer.prototype = {

    setGameObject: function(gameobject){
        this.gameobject = gameobject;
        this.pos = gameobject.position;
        this.size = gameobject.size;

        if(typeof this.size[0] === "string") this.size[0] = Game.getCanvas().size.x;
        if(typeof this.size[1] === "string") this.size[1] = Game.getCanvas().size.y;
    },

    render: function(dt){
        var scene = Game.getCurrentScene();
        if(this.gameobject==null) return false;

        Game.getContext().fillStyle = this.color;
        Game.getContext().strokeStyle = this.color;

        if(this.type=="rectangle"){
            Game.getContext().save();

            Game.getContext().translate(this.pos.getX()+(this.size[0]/2), this.pos.getY()+(this.size[1]/2));
            if(this.angle != 0) Game.getContext().rotate(this.angle*Math.PI/180);
            if(this.drawType=="fill")
                Game.getContext().fillRect(-this.size[0]/2, -this.size[1]/2, this.size[0], this.size[1]);
            else
                Game.getContext().strokeRect(-this.size[0]/2, -this.size[1]/2, this.size[0], this.size[1]);

            Game.getContext().restore();
        }else if(this.type=="triangle"){
            Game.getContext().beginPath();

            var beginX = this.pos.getX() + (this.size[0]/2);
            var beginY = this.pos.getY();


            Game.getContext().save();

            Game.getContext().translate(this.pos.getX() + (this.size[0]/2), this.pos.getY()+(this.size[1]/2));
            Game.getContext().rotate(this.angle*Math.PI/180);

            Game.getContext().moveTo(0, -this.size[1]/2);
            Game.getContext().lineTo(this.size[0]/2, this.size[1]/2);
            Game.getContext().lineTo(-this.size[0]/2, this.size[1]/2);
            Game.getContext().lineTo(0, -this.size[1]/2);

            if(this.drawType=="fill") Game.getContext().fill(); else Game.getContext().stroke();

            Game.getContext().restore();
        }else if(this.type=="circle"){
            Game.getContext().beginPath();

            var beginX = this.pos.getX() + (this.size[0]/2);
            var beginY = this.pos.getY();

            Game.getContext().arc(
                this.pos.getX() + (this.size[0]/2),
                this.pos.getY() + (this.size[0]/2),
                this.size[0]/2,
                this.startCircle*Math.PI,
                this.endCircle*Math.PI
            );
            Game.getContext().lineWidth = this.lineWidth;

            if(this.drawType=="fill") Game.getContext().fill(); else Game.getContext().stroke();
        }else if(this.type=="grid"){
            var nums = {x: 0, y: 0};

            if(this.cellSize[0]==0||this.cellSize[1]==0) return false;

            nums.x = Math.ceil(this.size[0]/(this.cellSize[0]));
            nums.y = Math.ceil(this.size[1]/(this.cellSize[1]));

            Game.getContext().globalAlpha = this.gameobject.opacity;
            Game.getContext().beginPath();
            Game.getContext().lineWidth = this.lineWidth;

            // Draw horizontal lines
            for(var i=0;i<nums.x;i++){
                var left = this.pos.getX() + (this.offsetCells[0] + this.cellSize[0] * i);
                Game.getContext().moveTo(left, this.pos.getY() + this.offsetCells[1]);
                Game.getContext().lineTo(left, this.pos.getY() + (this.size[1]-this.offsetCells[1]));
            }
            // Draw vertical lines
            for(var i=0;i<nums.y;i++){
                var top = this.pos.getY() + (this.offsetCells[1] + this.cellSize[1] * i)
                Game.getContext().moveTo(this.pos.getX() + this.offsetCells[0], top);
                Game.getContext().lineTo(this.pos.getX() + (this.size[0]-this.offsetCells[0]), top);
            }


            Game.getContext().stroke();
        }

        Game.getContext().fillStyle = "black";
        Game.getContext().strokeStyle = "black";
        Game.getContext().globalAlpha = 1;
    }

};

window.LoaderRenderer = LoaderRenderer;