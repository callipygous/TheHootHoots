ig.module(
    'game.beat.BeatTrackUtils'
)
.requires(
    'game.beat.Beat',
    'game.beat.BeatRenderer',
    'game.beat.BeatTrackView',
    'game.beat.EditorBeatTrackView',
    'game.beat.EditorBeatRenderer',
    'game.beat.BeatTrackLogic',
    'game.beat.BeatTrack',
    'game.beat.BeatEventLogic',
    'game.beat.PowerMeterBeatEventLogic'
)
.defines(function(){

    trackToBeats = function( track, beats ) {
        var note = null;
        var notes = track.rhythm.notes;
        for( var i = 0; i < notes.length; i++ ) {
            note = notes[i];
            beats.push( new Beat( i, note.time ) );
        }

        return beats;
    };

    makeBeatTrack = function( currentTime, hotSpotOffset, hotSpotWidth, fumbleWidth, timespan,
                              trackAnimSheet, track, beatEventLogic, hud, metronome ){
        var beats = trackToBeats( track, [] );
        var beatRenderer = new BeatRenderer();
        var beatTrack = new BeatTrack( currentTime, hotSpotOffset, hotSpotWidth, fumbleWidth, timespan, beats );
        var beatTrackView  = new BeatTrackView( 100, 0, 100, 1024, trackAnimSheet, beatRenderer, beatTrack );
        var beatTrackLogic = new BeatTrackLogic( beatTrack, beatTrackView, 3, beatEventLogic );

        hud.addItem( "BEAT_TRACK_VIEW", beatTrackView );

        metronome.addListener( beatTrackLogic );

        return {
            beatTrack      : beatTrack,
            beatTrackView  : beatTrackView,
            beatTrackLogic : beatTrackLogic
        };
    };

    makeEditorBeatTrack = function( currentTime, hotSpotOffset, hotSpotWidth, fumbleWidth, timespan,
                                    trackAnimSheet, track, hud, metronome ){
        var beats = trackToBeats( track, [] );
        var beatRenderer = new EditorBeatRenderer();
        var beatTrack = new BeatTrack( currentTime, hotSpotOffset, hotSpotWidth, fumbleWidth, timespan, beats );
        var beatTrackView  = new EditorBeatTrackView( 100, 0, 100, 1024, beatRenderer, beatTrack );
        var beatTrackLogic = new BeatTrackLogic( beatTrack, beatTrackView, 3,
            new PowerMeterBeatEventLogic(5, {maxPower : 100, power : 0}, {max : 100, level : 0})  );

        hud.addItem( "BEAT_TRACK_VIEW", beatTrackView );

        metronome.addListener( beatTrackLogic );

        return {
            beatTrack      : beatTrack,
            beatTrackView  : beatTrackView,
            beatTrackLogic : beatTrackLogic
        };
    }

});