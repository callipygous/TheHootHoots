ig.module(
    'game.beat.EditorBeatRenderer'
)
.requires(
    'game.hud.HudItem'
)
.defines(function(){

    EditorBeatRenderer = ig.HudItem.extend({

        statusToForeground : [
            "yellow",
            "#666666",
            "#800000",
            "red"
        ],

        statusToBackground : [
            "#CC9900",
            "#0033CC",
            "#200000",
            "#660000"
        ],

        width  : 96,
        height : 64,
        halfWidth : 48,
        halfHeight : 32,

        font: new ig.Font( 'media/fonts/courierNew_16.font.png' ),

        init: function( ) {
        },

        draw: function( beat, pos ) {
            var context = ig.system.context;

            var foreground = this.statusToForeground[beat.status];
            var background = this.statusToBackground[beat.status];

            this.fillBeat( context, background, pos );
            this.strokeBeat( context, foreground, 2, pos );
            this.drawCenter( context, foreground, pos );
            this.drawTime( beat, pos );
        },

        strokeBeat : function( context, color, lineWidth, pos ) {
            context.lineWidth   = lineWidth;
            context.strokeStyle = color;
            context.strokeRect( pos.x, pos.y, this.width, this.height );
        },

        fillBeat : function( context, color, pos ) {

            context.fillStyle = color;
            context.fillRect(pos.x, pos.y, this.width, this.height);
        },

        drawCenter : function( context, color, pos ) {
            var centerLeft  = { x : pos.x, y : pos.y + this.halfHeight };
            var centerRight = { x : pos.x + this.width, y : centerLeft.y };

            context.fillStyle = color;
            context.beginPath();
            context.moveTo( centerLeft.x, centerLeft.y );
            context.lineTo( centerRight.x, centerRight.y );
            context.stroke();
        },

        drawTime : function( beat, pos ) {
            this.font.draw( TimeUtil.formatTime(beat.time), pos.x + 5, pos.y + 12, ig.Font.ALIGN.LEFT );
        },

        debugDraw : function( beat, pos ) {
            //draw info
        }
    });

});