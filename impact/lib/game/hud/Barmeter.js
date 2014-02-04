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
    glow : null,

    glowTimeLeft : 0,
    glowTimer : null,

    drawCoords : {},

	setPerc : function(perc) {
		this.percentage = perc;
	},
	
	setPercentage : function(value, limit) {
		this.percentage = (value / limit);
	},
	
	init: function( x, y, width, height, horizontal, color, strokeColor, strokeWidth, startingPerc, glow ) {
		this.parent( x, y );
		this.width  = width;
        this.height = height;
		this.color  = color;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
		this.percentage = startingPerc;
        this.glow = glow;
        this.glowTimer = new ig.Timer();
	},

    getDrawCoords : function() {

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

    },

    update : function() {
        this.parent();
        var drawCoords = this.drawCoords;
        drawCoords.drawWidth = this.width;
        drawCoords.drawHeight = this.drawHeight;

        if(this.horizontal) {
            drawCoords.drawWidth = Math.round( this.width * this.percentage );
            drawCoords.drawX = ig.system.getDrawPos( this.pos.x );
            drawCoords.drawY = ig.system.getDrawPos( this.pos.y );
            drawCoords.outlineX = drawCoords.drawX;
            drawCoords.outlineY = drawCoords.drawY;
        } else {
            drawCoords.drawHeight = Math.round( this.height * this.percentage );
            drawCoords.drawX = ig.system.getDrawPos( this.pos.x );
            drawCoords.drawY = ig.system.getDrawPos( this.pos.y + this.height - drawCoords.drawHeight );
            drawCoords.outlineX = ig.system.getDrawPos( this.pos.x );
            drawCoords.outlineY = ig.system.getDrawPos( this.pos.y );
        }

        if( !TypeUtil.isEmpty( this.glow ) ) {
            this.glow.update();
        }
    },

    strokeMeter : function( color, lineWidth, drawCoords ) {
        var context    = ig.system.context;

        context.lineWidth   = lineWidth;
        context.strokeStyle = color;
        context.strokeRect( drawCoords.outlineX, drawCoords.outlineY, this.width, this.height );
    },

    fillMeter : function( color, drawCoords ) {
        var context = ig.system.context;

        context.fillStyle = color;
        context.fillRect(drawCoords.drawX, drawCoords.drawY, drawCoords.drawWidth, drawCoords.drawHeight);
    },

	draw: function() {
		this.parent();
		ig.system.context.save();

        var draw = true;
        if( !TypeUtil.isEmpty(this.glow) ) {
            draw = this.glow.shouldBarMeterDraw( this );
            this.glow.preBarmeterDraw( this );
        }

        if( draw ) {
            this.fillMeter( this.color, this.drawCoords );
            this.strokeMeter( this.strokeColor, this.strokeWidth, this.drawCoords );
        }

        if( !TypeUtil.isEmpty(this.glow) ) {
            this.glow.postBarmeterDraw( this );
        }


        ig.system.context.restore();
	},

    startGlow : function( time ) {
        this.glowTimeLeft = time;
        this.glowTimer.tick();
    }
});

});