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
        oneUpStats : null,
        beatValue : null,
        multipliers : [2, 4, 6],

        init : function( beatValue, powerStats, oneUpStats ) {
            this.beatValue   = beatValue;
            this.powerStats  = powerStats;
            this.oneUpStats  = oneUpStats;
            this.streakLogic = new ig.StreakEventLogic( [ 6, 12, 18 ] );
        },

        onTarget : function( beats ) {
            this.parent( beats );
            if( this.streakLogic.streak >= 2 ) {
                var value = Math.max(1, parseInt( this.streakLogic.streak / 3 ) ) * beats.length;
                this.oneUpStats.level += value;
            }
            var beatValue =  beats.length * this.beatValue * this.multipliers[this.streakLogic.nextStreakIndex];
            this.powerStats.power = MathUtil.clamp( this.powerStats.power + beatValue, 0, this.powerStats.maxPower );
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