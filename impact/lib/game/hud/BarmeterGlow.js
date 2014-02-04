ig.module(
    'game.hud.BarmeterGlow'
)
.requires(
    'game.hud.HudItem'
)
.defines(function(){

    ig.BarmeterGlow = ig.HudItem.extend({
        glowTimer : null,
        timeLeft : 0,
        maxTime : null,
        timePassed : 0,

        init: function( maxTime ) {
            this.glowTimer = new ig.Timer();
            this.maxTime = maxTime;
        },

        start : function( time ){
            var actualTime;
            if( TypeUtil.isEmpty( time ) ) {
                actualTime = this.maxTime;
            } else {
                actualTime = time;
            }

            if( !this.isRunning() ) {
                this.glowTimer.tick();
            }

            this.timeLeft = Math.max( actualTime, this.timeLeft );
        },

        update : function() {
            if( this.isRunning() ) {
                this.timePassed = this.glowTimer.tick();
                this.timeLeft -= this.timePassed;
            } else {
                this.timePassed = 0;
            }
        },

        shouldBarMeterDraw : function( barmeter ) {
            return true;
        },

        preBarmeterDraw : function( barmeter) {
        },

        postBarmeterDraw : function( barmeter ) {
        },

        isRunning : function() {
            return this.timeLeft > 0;
        }

    });

});