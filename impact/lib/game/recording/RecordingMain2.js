ig.module(
    'game.recording.RecordingMain2'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.image',


    'game.hud.Hud',
    'game.hud.HudItem',
    'game.time.Metronome',
    'game.recording.Recorder2'
)
.defines(function(){

    RecordingMain2 = ig.Game.extend({

        hud: new ig.Hud(),

        beatTrackAnimSheet : new ig.AnimationSheet( 'media/beat/beatmeter.png', 15, 480 ),
        beatTrackView : null,
        // Load a font
        font: new ig.Font( 'media/04b03.font.png' ),
        recorder : null,

        init: function() {
            ig.input.bind(ig.KEY.SPACE, 'beat' );
            ig.input.bind(ig.KEY.MOUSE1, 'beat');
            ig.input.bind(ig.KEY.MOUSE2, 'right-click');
            this.recorder = new Recorder2();
            recorder = this.recorder;
        },

        update: function() {
            // Update all entities and backgroundMaps
            this.parent();

            this.recorder.update();
            // Add your own, additional update code here
        },

        draw: function() {
            // Draw all entities and backgroundMaps
            this.parent();
            this.hud.draw();
        }
    });

    ig.main( '#canvas', RecordingMain2, 60, 980, 790, 1 );
});
