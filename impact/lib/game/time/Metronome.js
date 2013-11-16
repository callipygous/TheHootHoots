ig.module(
    'game.time.Metronome'
)
.requires(
    'game.time.ElapsedBeat'
)
.defines(function(){

//TODO: NEEDS TO BE REDONE SEE SCENELOGIC/GAMELOGIC
    /** TODO MAKE THIS SIMPLER **/
    /** Converts elapsed time in to elapsed beats */
    ig.Metronome = ig.Class.extend({
        bpm             : 0,
        bps				: 0,
        smallestFreq    : 0,
        timer   : null,
        running : false,
        pauseTick : 0,
        listeners : [], //make a map implementation
        timeLastUpdate : 0,

        init: function( bpm ) {
            this.bpm     = bpm;
            this.bps	 = bpm / 60;
            this.smallestFreq = 60 / bpm;
            this.timer = new ig.Timer();
            this.timer.reset();
        },

        update : function() {

            if( this.running ) {
                var elapsed = this.beat();
                for( var i = 0; i < this.listeners.length; i++ ) {
                    this.listeners[i].handleBeats( elapsed );
                }
            }

        },

        beat : function() {
            var timeElapsed = this.timer.tick() + this.pauseTick;
            this.pauseTick = 0;
            return new ig.ElapsedBeat(timeElapsed, timeElapsed * this.bps);
        },

        start : function () {
            this.timer.tick();
            this.running = true;
        },

        pause : function () {
            this.pauseTick  = this.timer.tick();
            this.running    = false;
        },

        addListener : function( listener ) {
            this.listeners.push( listener );
        },

        removeListener : function( listener ) {
            var index = this.listeners.indexOf( listener );
            if( index > -1 ) {
                this.listeners.splice( index, 1 );
            }
        }
    });

});