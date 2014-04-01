ig.module(
    'game.beat.EditorBeatTrackView'
)
.requires(
    'game.hud.HudItem'
)
.defines(function(){

    EditorBeatTrackView = ig.HudItem.extend({
        vec : {x : 0, y : 0},	//ad this.vec to this.pos to get this.end (i.e. the vector from this.pos (start) to this.end)
        end : {x : 0, y : 0},	//HudItem.pos is the starting point
        beatRenderer : null,
        beatTrack : null,

        hotSpotInterval    : { start : 0, end : 0 },
        fumbleSpotInterval : { start : 0, end : 0 },

        innerTrackWidth : null,
        innerTrackColor : "#777777",
        halfInnerTrackWidth  : null,

        font: new ig.Font( 'media/fonts/courierNew_16.font.png' ),

        init: function( startX, startY, endX, endY, beatRenderer, beatTrack ) {
            this.parent( startX, startY );
            this.end.x = endX;
            this.end.y = endY;
            this.vec.x = this.end.x - this.pos.x;
            this.vec.y = this.end.y - this.pos.y;

            this.beatRenderer = beatRenderer;
            this.beatTrack = beatTrack;
            this.innerTrackWidth = this.beatRenderer.width - this.beatRenderer.width * 0.25;
            this.halfInnerTrackWidth = this.innerTrackWidth / 2;
        },

        draw: function() {
            this.drawTrack();
            this.drawDebugInfo();
            this.drawBeats();
        },

        drawBeats : function() {

            var beats = this.beatTrack.beats;

            var beat = null;
            var percentage = null;
            var pos = { x : 0, y : 0 };

            ig.system.context.save();
            for(var i = this.beatTrack.earlyIndex; i < this.beatTrack.lateIndex && i < beats.length; i++) {
                beat = beats[i];

                percentage = this.timeToPercentage( beat.time );
                pos.x = this.pos.x + ( this.vec.x * percentage ) - Math.round( this.beatRenderer.width  / 2 );
                pos.y = this.pos.y + ( this.vec.y * percentage ) - Math.round( this.beatRenderer.height / 2 );

                this.beatRenderer.draw( beat, pos );
            }
            ig.system.context.restore();
        },

        drawTrack : function() {
            var context = ig.system.context;
            context.save();
            context.strokeStyle = this.innerTrackColor;

            var startX = this.pos.x - this.halfInnerTrackWidth;
            var startY = this.pos.y;

            var height = this.end.y - this.pos.y;

            context.strokeRect( startX, startY, this.innerTrackWidth , height );
            this.drawGrid( context );
            context.restore();
        },

        timeToPercentage : function( time ) {
            return 1 - ( ( time - this.beatTrack.activeTime.start ) / this.beatTrack.timespan );
        },

        drawDebugInfo : function() {
            this.hotSpotInterval.start = this.timeToPercentage( this.beatTrack.hotSpot.start );
            this.hotSpotInterval.end   = this.timeToPercentage( this.beatTrack.hotSpot.end );

            this.fumbleSpotInterval.start = this.timeToPercentage( this.beatTrack.fumbleSpot.start );
            this.fumbleSpotInterval.end   = this.timeToPercentage( this.beatTrack.fumbleSpot.end );

            this.drawInterval( this.hotSpotInterval,    'red'   );
            this.drawInterval( this.fumbleSpotInterval, 'green' );
        },

        drawGrid : function( context ) {

            var startX = this.pos.x - this.halfInnerTrackWidth;
            var endX = startX + this.innerTrackWidth;

            var startXHalf = startX + 0.25 * this.innerTrackWidth;
            var endXHalf   = startX + 0.75 * this.innerTrackWidth;

            var color;
            var perc = 0;
            var percHalf = 0;
            var height = 0;
            var heightHalf;

            var drawTime = Math.floor( ( this.beatTrack.activeTime.end - this.beatTrack.activeTime.start ) / 10 );
            if( drawTime < 1 ) {
                drawTime = 1;
            }


            var earliestWholeSecond = Math.ceil( this.beatTrack.activeTime.start );
            for( var i = earliestWholeSecond; i <= this.beatTrack.activeTime.end; i++ ) {


                perc = this.timeToPercentage( i );
                percHalf = this.timeToPercentage( i + 0.5 );
                if( i % 10 == 0 ) {
                    color = "#99EE99";
                } else if( i % 5 == 0 ) {
                    color = "#9999EE";
                } else {
                    color = "#666666";
                }

                height = this.vec.y * perc;
                heightHalf = this.vec.y * percHalf;

                context.strokeStyle = color;
                context.beginPath();
                context.moveTo( startX, height );
                context.lineTo( endX,   height );
                context.stroke();
                context.closePath();

                if( (i - earliestWholeSecond) % drawTime == 0 ) {
                    this.font.draw( TimeUtil.formatTime(i), this.pos.x, height - 20, ig.Font.ALIGN.CENTER );
                }

                context.beginPath();
                context.strokeStyle = "#333333";
                context.moveTo( startXHalf, heightHalf );
                context.lineTo( endXHalf,   heightHalf );
                context.stroke();
                context.closePath();
            }
        },

        drawInterval : function( interval, color ) {
            var startX = this.pos.x - 5;
            var width  = 10;

            var startY = this.pos.y + ( this.vec.y   * interval.start );
            var height = this.vec.y * ( interval.end - interval.start);

            var context = ig.system.context;
            context.save();
            context.fillStyle = color;
            context.fillRect(startX, startY, width, height);
            context.restore();
        }
    });

});