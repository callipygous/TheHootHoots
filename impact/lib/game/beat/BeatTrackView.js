ig.module(
	'game.beat.BeatTrackView'
)
.requires(
	'game.hud.HudItem',
	'game.beat.BeatHItem'
)
.defines(function(){

BeatTrackView = ig.HudItem.extend({
	vec : {x : 0, y : 0},	//ad this.vec to this.pos to get this.end (i.e. the vector from this.pos (start) to this.end)
	end : {x : 0, y : 0},	//HudItem.pos is the starting point
	beatRenderer : null,
    beatTrack : null,

    hotSpotInterval    : { start : 0, end : 0 },
    fumbleSpotInterval : { start : 0, end : 0 },

    init: function( startX, startY, endX, endY, animSheet, beatRenderer, beatTrack ) {
        this.parent( startX, startY );
        this.end.x = endX;
        this.end.y = endY;
        this.vec.x = this.end.x - this.pos.x;
        this.vec.y = this.end.y - this.pos.y;
        if( !TypeUtil.isEmpty( animSheet ) ) {
            this.animSheet = animSheet;
            this.addAnim( 'idle',   1, [0] ); //perhaps pass this in
        }

        this.beatRenderer = beatRenderer;
        this.beatTrack = beatTrack;
    },

	draw: function() {

        if( this.currentAnim ) {
            var animSheet = this.currentAnim.sheet;
            this.currentAnim.draw(Math.round(this.pos.x - ( animSheet.width  / 2 ) ), Math.round( this.pos.y ) );
        }

        this.drawDebugInfo();

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