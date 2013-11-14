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

	setPerc : function(perc) {
		this.percentage = perc;
	},
	
	setPercentage : function(value, limit) {
		this.percentage = (value / limit);
	},
	
	init: function( x, y, height, width, horizontal, color, startingPerc) {
		this.parent( x, y );
		this.height = height;
		this.width  = width;
		this.color  = color;
		this.percentage = startingPerc;
	},
	
	draw: function() {
		this.parent();
		
		var context = ig.system.context;
		
		
		var drawWidth  = this.width;
		var drawHeight = this.height;
		var drawX = 0;
		var drawY = 0;
		
		if(this.horizontal) {
			drawWidth = Math.round( this.width * this.percentage );
			drawX = ig.system.getDrawPos( this.pos.x );
			drawY = ig.system.getDrawPos( this.pos.y );
		} else {
			drawHeight = Math.round( this.height * this.percentage );
			drawX = ig.system.getDrawPos( this.pos.x );
			drawY = ig.system.getDrawPos( this.height - this.pos.y - drawHeight);
		}
		
		context.fillStyle = this.color;
		context.fillRect(drawX, drawY, drawWidth, drawHeight);
	}
});

});