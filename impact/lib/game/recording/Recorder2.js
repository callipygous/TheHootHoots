ig.module(
    'game.recording.Recorder2'
)
.requires(
    'game.beat.BeatTrackUtils',
    'game.beat.PowerMeterBeatEventLogic',

    'game.recording.commands.ChooseFile',
    'game.recording.commands.SetLength',

    'game.rhythm.Rhythm',
    'game.rhythm.SongMetadata',
    'game.rhythm.Track'
)
.defines(function () {

        Recorder2 = ig.Class.extend({

        time  : null,
        track : null,

        beatTrack     : null,
        beatTrackView : null,

        timer : null,

        recording : false,

        baseTimeSpan : 6,

        init: function () {
            //todo substitute EventLogic
            this.track = new Track( new SongMetadata(), new Rhythm(60, []) );

            //var beatResult = makeEditorBeatTrack( 0, 0.75, 0.5, 0.25, 6, this.beatTrackAnimSheet, HeartBeat, this.hud, this.metronome );

        },

        record : function() {
            this.recording = true;
            //this.timer.reset();
            //this.rhythm.clear();
            //setRecorderViewStatus( this.recording );
        },

        stop : function() {
            this.recording = false;
            //setRecorderViewStatus( this.recording );
        },

        play : function() {
        },

        copy : function() {
           // showRecorderCopy( this.rhythm.toString() );
        },

        update : function() {
            /*if( this.recording ) {
                if( ig.input.pressed("beat") ) {
                    var tick = this.timer.tick();
                    //Note: Because rhythm is set to 60 we can just
                    // add the beat with no adjustment
                    this.rhythm.addBeat( tick );
                }

                setRecorderTimer( this.timer.delta() );
            } */
        },

        copyToClipboard : function (text) {
           // window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
        },

        //The update methods keep the underlying beatTrack data up to date with the UI
        //this is done so that the beatTrack display in "game" will reflect the UI and
        //NOT require special handling

        updateFile : function( $input ) {
            var cmd = new ChooseFile( this.track.songMetadata.file, $input.val(), this.track.songMetadata, $input );
            cmd.doCommand();
            return false;
        },

        updateLength : function( $lengthField, $slider ) {
            var cmd = new SetLength( this.track.songMetadata.length, TimeUtil.timeStrToSeconds( $lengthField.val() ),
                                     this.track.songMetadata, $lengthField, $slider );
            cmd.doCommand();
            return false;
        },

        updateName : function() {

        },

        updateArtist : function() {

        },

        updateFormat : function() {

        }

    });
});