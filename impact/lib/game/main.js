ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'impact.image',

    'game.beat.BeatTrackView',
    'game.beat.BeatTrackLogic',
    'game.beat.BeatTrack',
    'game.beat.BeatEventLogic',

    'game.hud.Hud',
    'game.hud.HudItem',
    'game.time.Metronome',


    'game.song.flatsongs.HeartBeat',
    'game.song.FlatSongPlayer',

    'game.particles.BigBangParticle',
    'game.obstacles.AutoAsteroidGenerator'
)
.defines(function(){

TheHootHoots = ig.Game.extend({

    hud: new ig.Hud(),

    beatTrackAnimSheet : new ig.AnimationSheet( 'media/beat/beatmeter.png', 15, 480 ),
    beatTrackView : null,
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    timer : null,
	bigBang : null,
    asteroidGenerator : null,

    //TODO: ANY CLICK ON THE MOUSE BUTTON WHEN YOU HAVE ENERGY IS A FREE STRIKE (WITH NO CONSEQUENCES)

	init: function() {
        this.timer = new ig.Timer();
        ig.input.bind( ig.KEY.SPACE, 'space' );

        //var hotSpot     = { start : 0.94, end : 0.99 };
        var fumblePerc  = 0.75;
        var hotSpot     = { start : 0.70, end : 0.75 };
        var destroySpot = { start : 1.0,  end : 10.0 };

        this.beatEventLogic = new ig.BeatEventLogic(null);

        this.beatTrack = new ig.BeatTrack( hotSpot, destroySpot, fumblePerc );
        this.beatTrackView = new ig.BeatTrackView( 300, 100, 300, 580, this.beatTrackAnimSheet, this.beatTrack );
        this.beatTrackView.hotSpot = hotSpot;
        this.beatTrackView.fumblePerc = fumblePerc;
        this.beatTrackLogic = new ig.BeatTrackLogic( this.beatTrack, this.beatTrackView, 3, this.beatEventLogic );

        this.hud.addItem("BEAT_TRACK_VIEW", this.beatTrackView);

        var beats = SongUtil.savedSongToBeats( HeartBeat ).beats;
        this.beatFactory = new FlatSongPlayer( this.beatTrack, this.beatTrackView, beats );

        this.metronome = new ig.Metronome( 60 );
        this.metronome.addListener( this.beatTrackLogic );
        this.metronome.addListener( this.beatFactory );
        this.metronome.start();

        this.bigBang = this.spawnEntity("EntityBigBangParticle", ig.system.width / 2, ig.system.height / 2);
        this.asteroidGenerator = new AutoAsteroidGenerator( 0.5, 50, 0.5, 600, 0.8 );
	},
	
	update: function() {
        var delta = this.timer.delta();
        if( Math.floor( delta )  % 3 == 0 && !this.bigBang.banged ) {
            this.bigBang.flicker();
        }

        if( delta > 5 && !this.bigBang.banged ) {
            this.bigBang.bang();
        }

		// Update all entities and backgroundMaps
		this.parent();
		this.metronome.update();
        this.asteroidGenerator.update();
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width  * 0.8 ,
			y = ig.system.height * 0.1 ;

        this.hud.draw();
        this.font.draw( TimeUtil.formatTime( this.timer.delta() ), x, y, ig.Font.ALIGN.CENTER );
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
