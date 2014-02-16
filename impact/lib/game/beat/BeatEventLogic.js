ig.module(
	'game.beat.BeatEventLogic'
)
.requires(
	'game.beat.StreakEventLogic',
    'game.beat.Beat'
)
.defines(function(){

/**
 * The logic that indicates what should happen when a player either hits or
 * misses a beat or prematurely presses the beat button (see beattracklogic.js).
 * beatEventLogic currently handles the "normal" circumstance (i.e. when the user
 * is NOT in spirit mode).  When we create spirit mode, BeatEventLogic should become
 * a parent class and NormalBeatEventLogic and SpiritBeatEventLogic should be created.
 */
BeatEventLogic = ig.Class.extend({
	levelStats  : null,
	streakLogic : null,
    consumeBeat : false,
	
	init : function(levelStats ) {
		//this.levelStats = levelStats;
		this.streakLogic = new ig.StreakEventLogic(levelStats);
	},
	
	/** 
	*	When a player presses the beat button in time with one or more beats
	*   add the appropriate points to beats 
	*/
	onTarget : function(beats) {
        for( var i = 0; i < beats.length; i++ ) {
            beats[i].status = BeatStatus.STRUCK;
            beats[i].handled = true;
        }
        this.streakLogic.onTarget( beats );
	},
	
	/**
	*	When a player presses the beat button when there are no beats in the
	*   beatTrack hotspot then offTarget removes any streak and consumes the next beat
	*/
	offTarget : function( ) {
		this.streakLogic.offTarget();
	},
	
	/**
	*	When a player does not press the beat button and a beat has past by
	*   the beatTrack hotspot, then missed removes any streak.
	*/
	missed : function(beats) {
        for( var i = 0; i < beats.length; i++ ) {
            beats[i].status = BeatStatus.MISSED;
            beats[i].handled = true;
        }
		this.streakLogic.missed(beats);
	},

    fumbledBeats : function(beats) {
        this.missed( beats );
    }
});

});