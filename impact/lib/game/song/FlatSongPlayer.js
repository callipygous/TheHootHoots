ig.module(
    'game.song.FlatSongPlayer'
)
.requires(
    'game.beat.AbstractBeatFactory'
)
.defines(function () {

    //Plays Rhythms as recorder by RecordingMain
    FlatSongPlayer = ig.AbstractBeatFactory.extend({

        /**
         * The beats to play in total beat form
         * e.g.
         * If beats = [2, 4, 6, 7.5, 8] and there are 60 beats per minute
         * Then at 2 seconds, 4 seconds, 6 seconds, 7.5 seconds, and 8 seconds
         * in there will be beats made.
         */
        beats : null,
        beatIndex : 0,
        totalElapsedBeats : 0,

        init: function ( beatTrack, beatTrackView, beats ) {
            this.parent( beatTrack, beatTrackView );
            this.beats = beats;
        },

        handleBeats : function( elapsedBeat ) {
            this.totalElapsedBeats += elapsedBeat.elapsedBeats;
            while( this.beats[this.beatIndex] <= this.totalElapsedBeats &&
                   this.beatIndex < this.beats.length ) {
                this.makeBeat();
                this.beatIndex++;
            }
        }
    });

});