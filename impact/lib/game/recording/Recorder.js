/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 11/17/13
 * Time: 9:06 PM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.recording.Recorder'
)
.requires(
    'game.recording.Rhythm'
)
.defines(function () {

    Recorder = ig.Class.extend({

        rhythm : null,
        recording : false,
        timer : null,
        currentTime : 0,

        init: function () {
            this.timer = new ig.Timer();
            this.rhythm = new Rhythm(60, []);
        },

        record : function() {
            this.recording = true;
            this.timer.reset();
            this.rhythm.clear();
            setRecorderViewStatus( this.recording );
        },

        stop : function() {
            this.recording = false;
            setRecorderViewStatus( this.recording );
        },

        play : function() {
            alert("PLAY");
        },

        copy : function() {
            showRecorderCopy( this.rhythm.toString() );
        },

        update : function() {
            if( this.recording ) {
                if( ig.input.pressed("space") ) {
                    var tick = this.timer.tick();
                    //Note: Because rhythm is set to 60 we can just
                    // add the beat with no adjustment
                    this.rhythm.addBeat( tick );
                }

                setRecorderTimer( this.timer.delta() );
            }
        },

        copyToClipboard : function (text) {
            window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
        }
    });
});