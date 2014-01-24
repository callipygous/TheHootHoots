ig.module(
	'game.hud.Barmeter'
)
.requires(
	'game.hud.HudItem'
)
.defines(function(){

ig.BarMeter = ig.HudItem.extend({
//7, 480, .1, 15, 480	
	width:  0,
	height: 0,
	percentage: .1,
	horizontal: false,
	color : 'blue',
    strokeColor : 'green',
    strokeWidth : null,

	setPerc : function(perc) {
		this.percentage = perc;
	},
	
	setPercentage : function(value, limit) {
		this.percentage = (value / limit);
	},
	
	init: function( x, y, width, height, horizontal, color, strokeColor, strokeWidth, startingPerc ) {
		this.parent( x, y );
		this.width  = width;
        this.height = height;
		this.color  = color;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
		this.percentage = startingPerc;
	},
	
	draw: function() {
		this.parent();
		
		var context = ig.system.context;
		
		
		var drawWidth  = this.width;
		var drawHeight = this.height;
		var drawX = 0;
		var drawY = 0;
        var outlineX = 0;
        var outlineY = 0;
		
		if(this.horizontal) {
			drawWidth = Math.round( this.width * this.percentage );
			drawX = ig.system.getDrawPos( this.pos.x );
			drawY = ig.system.getDrawPos( this.pos.y );
            outlineX = drawX;
            outlineY = drawY;
		} else {
			drawHeight = Math.round( this.height * this.percentage );
            drawX = ig.system.getDrawPos( this.pos.x );
            drawY = ig.system.getDrawPos( this.pos.y + this.height - drawHeight );
            outlineX = ig.system.getDrawPos( this.pos.x );
            outlineY = ig.system.getDrawPos( this.pos.y );

		}
		
		context.fillStyle = this.color;
		context.fillRect(drawX, drawY, drawWidth, drawHeight);

        context.lineWidth = this.strokeWidth;
        context.strokeStyle = this.strokeColor;
        context.strokeRect( outlineX, outlineY, this.width, this.height );
	}
});

});