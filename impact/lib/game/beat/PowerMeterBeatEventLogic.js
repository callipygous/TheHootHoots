ig.module(
    'game.beat.PowerMeterBeatEventLogic'
)
.requires(
    'game.beat.BeatEventLogic',
    'game.beat.StreakEventLogic',
    'game.beat.Beat'
)
.defines(function(){

    ig.PowerMeterBeatEventLogic = ig.BeatEventLogic.extend({
        powerStats : null,
        beatValue : null,

        init : function( beatValue, powerStats ) {
            this.beatValue   = beatValue;
            this.powerStats  = powerStats;
            this.streakLogic = new ig.StreakEventLogic( null );
        },

        onTarget : function( beats ) {
            this.parent( beats );
            this.powerStats.power = MathUtil.clamp( this.powerStats.power + beats.length * this.beatValue,
                                                    0, this.powerStats.maxPower );
        },

        offTarget : function( ) {
            this.parent();
        },

        missed : function( beats ) {
            this.parent( beats );
        },

        fumbledBeats : function( beats ) {
            this.parent( beats );
        }
    });

});