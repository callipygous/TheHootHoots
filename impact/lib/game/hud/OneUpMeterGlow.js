ig.module(
    'game.hud.OneUpMeterGlow'
)
.requires(
    'game.hud.BarmeterGlow'
)
.defines(function(){

    ig.OneUpMeterGlow = ig.BarmeterGlow.extend({
        foregroundColor : null,
        backgroundColor : null,

        rate : { r : 0, g : 0, b : 0, a : 0 },

        /**
         * The
         * @param maxTime
         * @param foregroundColor a delta color
         * @param backgroundColor a delta color
         * @param rateMagnitude
         */
        init: function( maxTime, foregroundColor, backgroundColor ) {
            this.parent( maxTime );
            this.glowTimer = new ig.Timer();
            this.maxTime = maxTime;
            this.foregroundColor = foregroundColor;
            this.backgroundColor = backgroundColor;
        },

        rateForComponent : function( start, end, rate ) {
            return rate * MathUtil.sign( start, end );
        },

        start : function() {
            this.foregroundColor.reset();
            this.backgroundColor.reset();
            this.parent();
        },

        update : function() {
            this.parent();

            if( this.isRunning() ) {
                this.foregroundColor.addRateToComponents( this.timePassed );
                this.backgroundColor.addRateToComponents( this.timePassed );
            }
        },

        shouldBarMeterDraw : function( barmeter ) {
            return true;
        },

        preBarmeterDraw : function( barmeter) {
           if( this.isRunning() ) {
                barmeter.fillMeter( ColorUtil.rgbaToHex_noA( this.backgroundColor.current ), barmeter.drawCoords );
           }
        },

        postBarmeterDraw : function( barmeter ) {
           if( this.isRunning() ) {
                barmeter.strokeMeter( ColorUtil.rgbaToHex_noA( this.foregroundColor.current ), 2, barmeter.drawCoords );
           }
        }

    });

});