ig.module(
	'game.beat.BeatFactory'
)
.requires(
	'game.beat.Beat'
)
.defines(function(){

ig.BeatFactory = ig.Class.extend({
	beatTrack          : null,
	beatTrackView	   : null,
    unhandledBeats     : 0,
	
	init : function(beatTrack, beatTrackView) {
		this.beatTrack     = beatTrack;
		this.beatTrackView = beatTrackView;
	},

    handleBeats : function( elapsedBeat ) {
        //TODO: Need to add percentage based on how much over 1 we are
        this.unhandledBeats += elapsedBeat.elapsedBeats;
        if( this.unhandledBeats > 1 ) {
            this.unhandledBeats -= 1;
            this.makeBeat();
        }
    },
	
	makeBeat : function() {		
		var beat = new ig.Beat(0);
		this.beatTrack.enqueueBeat( beat );
		this.beatTrackView.enqueueBeat( beat );
	}
});

});

