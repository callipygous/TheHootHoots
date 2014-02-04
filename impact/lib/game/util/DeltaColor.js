ig.module(
    'game.util.DeltaColor'
)
.requires(

)
.defines(function(){

        DeltaColor = ig.Class.extend({

        start   : { r : 0, g : 0, b : 0, a : 0 },
        end     : { r : 0, g : 0, b : 0, a : 0 },
        current : { r : 0, g : 0, b : 0, a : 0 },
        rate    : { r : 0, g : 0, b : 0, a : 0 },

        init : function( start, end, rateMagnitude ) {

            this.start = ColorUtil.hexToRgba( start );
            this.end   = ColorUtil.hexToRgba( end );
            this.current = ColorUtil.cloneRgba( this.start );

            this.rate = {
                r : this.rateForComponent( this.start.r, this.end.r, rateMagnitude.r ),
                g : this.rateForComponent( this.start.g, this.end.g, rateMagnitude.g ),
                b : this.rateForComponent( this.start.b, this.end.b, rateMagnitude.b ),
                a : this.rateForComponent( this.start.a, this.end.a, rateMagnitude.a )
            };
        },

        rateForComponent : function( start, end, rate ) {
            return rate * MathUtil.sign( start, end );
        },

        addRateToComponents : function( timePassed ) {
            this.current.r = this.current.r + this.rate.r * timePassed;
            this.current.g = this.current.g + this.rate.g * timePassed;
            this.current.b = this.current.b + this.rate.b * timePassed;
            this.current.a = this.current.a + this.rate.a * timePassed;
        },

        reset : function() {
            this.current = ColorUtil.cloneRgba( this.start );
        }
    });
});