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
    'game.obstacles.asteroid.AutoAsteroidGenerator',

    'game.player.Player',

    'game.particles.SpiralArm',
    'game.particles.SpiralParticle',

    'game.util.WritableImage',

    'game.particles.NoiseLine',
    'game.particles.StarGrid'
)
.defines(function(){

TheHootHoots = ig.Game.extend({

    hud: new ig.Hud(),

    asteroidImage : new ig.Image( 'media/asteroid.png' ),
    strokeColor : "#704000",

    beatTrackAnimSheet : new ig.AnimationSheet( 'media/MilkyWay1024_shaved2.png', 155, 1024 ),
    beatTrackView : null,
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    timer : null,
	bigBang : null,
    asteroidGenerator : null,
    player : null,

    tmpSpike : null,

    //TODO: ANY CLICK ON THE MOUSE BUTTON WHEN YOU HAVE ENERGY IS A FREE STRIKE (WITH NO CONSEQUENCES)

	init: function() {
        this.timer = new ig.Timer();
        ig.input.state("CanvasTouch");
        ig.input.bind( ig.KEY.SPACE, 'space' );
        ig.input.bind( ig.KEY.MOUSE1, "CanvasTouch" );
        ig.input.initMouse();

        //var hotSpot     = { start : 0.94, end : 0.99 };
        var fumblePerc  = 0.75;
        var hotSpot     = { start : 0.70, end : 0.75 };
        var destroySpot = { start : 1.0,  end : 10.0 };

        this.beatEventLogic = new ig.BeatEventLogic(null);

        this.beatTrack = new ig.BeatTrack( hotSpot, destroySpot, fumblePerc );
        this.beatTrackView = new ig.BeatTrackView( 100, 0, 100, 1024, this.beatTrackAnimSheet, this.beatTrack );
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
        this.asteroidGenerator = new AutoAsteroidGenerator( "asteroidGen", 4, 0.5, 50, 0.5, 600, 0.8 );

        //new StarGrid();

        var reverseSpiralArmArg = {
            radius : 6,

            topAngle       : /*Math.PI / 4*/ 0,
            bottomAngle    : 1.5 * Math.PI / 2,

            control1Angle  :  1.5 * Math.PI / 6,
            control1Magnitude : 10,

            control2Angle  : 1.5 * Math.PI / 4,
            control2Magnitude : 16,

            endAngle :  1.5 * Math.PI / 3,
            endMagnitude : 20,

            colorStops : [
                new ColorStop(0,   { r: 255, g : 20,   b : 20,  a : 1 } ),
                new ColorStop(0.75, { r: 255, g : 200,  b : 20,  a : 1 } ),
                new ColorStop(0.75, { r: 255, g : 200,  b : 20,  a : 0.5 } )
            ]
        };

        this.spawnEntity("EntitySpiralParticle", 400, 400, {
            opacity : 1,
            radius :6,

            colorStops : [
                new ColorStop(0,    { r: 255, g : 20,  b : 20,  a : 1     } ),
                new ColorStop(0.65, { r: 255, g : 10,  b : 10,  a : 0.75  } ),
                new ColorStop(0.85, { r: 255, g : 10,  b : 10,  a : 0.50  } ),
                new ColorStop(1,    { r: 255, g : 0,   b : 0,   a : 0     } ),
            ],

            //noiseOpacity : 0.25,
            spiralArmArgs : reverseSpiralArmArg,
            numberOfArms : 5,
            rotationSpeed : -0.007
        });

        this.spawnEntity("EntityNoiseLine", 200, 200, {
            name : "MyNoiseLine",
            start : { x : 400, y : 100  },
            end   : { x : 100, y : 400 },

            margin : 100
        });

        this.player = this.spawnEntity( "EntityPlayer", 100, 100 );
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
        //this.asteroidGenerator.debugDraw( { x: 0, y : 0} );
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
