
ig.module(
    'game.particles.colorstops.MorphingColorStop'
)
.requires(
    'game.particles.colorstops.ColorStop'
)
.defines(function () {

    MorphingColorStop = ColorStop.extend({

        morphFunction : null,

        init: function ( distance, rgba, morphFunction ) {
            this.parent(distance, rgba );
            this.morphFunction = morphFunction;
        },

        update : function( particleOpacity, particleRadius, secondsPassed ) {
            if( !TypeUtil.isEmpty( this.morphFunction ) ) {
                this.morphFunction( this, particleOpacity, particleRadius, secondsPassed );
            }
        }
    });

});