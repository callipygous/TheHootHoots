ig.module(
	'game.beat.BeatTrackView'
)
.requires(
	'game.hud.HudItem',
	'game.beat.BeatHItem'
)
.defines(function(){

ig.BeatTrackView = ig.HudItem.extend({
	vec : {x : 0, y : 0},	//ad this.vec to this.pos to get this.end (i.e. the vector from this.pos (start) to this.end)
	end : {x : 0, y : 0},	//HudItem.pos is the starting point
	beatItems : [],
	hotSpot   : null,
	
	enqueueBeat : function(beat) {
		this.beatItems[this.beatItems.length] = new ig.BeatHItem(beat);
	},
	
	dequeueBeat : function() {
		this.beatItems.splice(0, 1);
	},
	
	dequeueBeats : function(numBeats) {
		this.beatItems.splice(0, numBeats);
	},
	
	init: function( startX, startY, endX, endY, animSheet ) {
		this.parent( startX, startY );
		this.end.x = endX;
		this.end.y = endY;
		this.vec.x = this.end.x - this.pos.x;
		this.vec.y = this.end.y - this.pos.y;
        if( !TypeUtil.isEmpty( animSheet ) ) {
            this.animSheet = animSheet;
            this.addAnim( 'idle',   1, [0] ); //perhaps pass this in
        }
	},
	
	draw: function() {

        if( this.currentAnim ) {
            var animSheet = this.currentAnim.sheet;
            this.currentAnim.draw(Math.round(this.pos.x - ( animSheet.width  / 2 ) ), Math.round( this.pos.y ) );
        }

		var progress = 0.0;
        var beatItem = null;

		for(var i = 0; i < this.beatItems.length; i++) {
            beatItem = this.beatItems[i];
            progress = beatItem.beat.progress;
            beatItem.pos.x = this.pos.x + (this.vec.x * progress) - Math.round(beatItem.width  / 2);
            beatItem.pos.y = this.pos.y + (this.vec.y * progress) - Math.round(beatItem.height / 2);
			beatItem.draw();
		}
		
		if(this.hotSpot != null) {
			var hsStartX = this.pos.x - 5;
			var hsWidth  = 10;
			
			var hsStartY = this.pos.y + (this.vec.y * this.hotSpot.start);
            var hsEndY   = (this.vec.y * ( this.hotSpot.end - this.hotSpot.start) );
			var context = ig.system.context;
			context.fillStyle = 'red';
			context.fillRect(hsStartX, hsStartY, hsWidth, hsEndY);
		}
	}
});

});