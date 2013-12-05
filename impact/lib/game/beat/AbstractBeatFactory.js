ig.module(
	'game.beat.AbstractBeatFactory'
)
.requires(
	'game.beat.Beat'
)
.defines(function(){

ig.AbstractBeatFactory = ig.Class.extend({
	beatTrack          : null,
	beatTrackView	   : null,
	
	init : function(beatTrack, beatTrackView) {
		this.beatTrack     = beatTrack;
		this.beatTrackView = beatTrackView;
	},

    handleBeats : function( elapsedBeat ) {
    },
	
	makeBeat : function() {
		var beat = new ig.Beat(0);
		this.beatTrack.enqueueBeat( beat );
		this.beatTrackView.enqueueBeat( beat );
	}
});

});

