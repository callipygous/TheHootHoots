ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',

    'game.hud.Hud',
    'game.hud.HudItem',
    'game.time.Metronome',
    'game.recording.Recorder'
)
.defines(function(){

    TheHootHoots = ig.Game.extend({

        hud: new ig.Hud(),

        beatTrackAnimSheet : new ig.AnimationSheet( 'media/beat/beatmeter.png', 15, 480 ),
        beatTrackView : null,
        // Load a font
        font: new ig.Font( 'media/04b03.font.png' ),
        recorder : null,

        init: function() {
            ig.input.bind(ig.KEY.SPACE, 'space' );
            ig.input.bind(ig.KEY.MOUSE1, 'left-click');
            ig.input.bind(ig.KEY.MOUSE2, 'right-click');
            this.recorder = new Recorder();
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

// If our screen is smaller than 640px in width (that's CSS pixels), we scale the
// internal resolution of the canvas by 2. This gives us a larger viewport and
// also essentially enables retina resolution on the iPhone and other devices
// with small screens.
    var scale = (window.innerWidth < 640) ? 2 : 1;

// We want to run the game in "fullscreen", so let's use the window's size
// directly as the canvas' style size.
    var canvas = document.getElementById('canvas');
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';


// Listen to the window's 'resize' event and set the canvas' size each time
// it changes.
    window.addEventListener('resize', function(){
        // If the game hasn't started yet, there's nothing to do here
        if( !ig.system ) { return; }

        // Resize the canvas style and tell Impact to resize the canvas itself;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ig.system.resize( window.innerWidth * scale, window.innerHeight * scale );

        // Re-center the camera - it's dependend on the screen size.
        if( ig.game && ig.game.setupCamera ) {
            ig.game.setupCamera();
        }

        // Also repositon the touch buttons, if we have any
        if( window.myTouchButtons ) {
            window.myTouchButtons.align();
        }
    }, false);

    var width = window.innerWidth * scale * 0.9,
        height = window.innerHeight * scale * 0.9;
    ig.main( '#canvas', TheHootHoots, 60, width, height, 1 );
});
