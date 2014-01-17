ig.module(
    'game.particles.StarGrid'
)
.requires(
    'impact.image'
)
.defines(function () {

    StarGrid = ig.Class.extend({

        shape : null,

        noiseImg : new ig.Image( 'media/noise.png' ),
        noiseOpacity : 0,

        stars : null,

        init: function () {

            for( var i = 0; i < 100; i++ ) {
                ig.game.spawnEntity("EntityRadialParticle", Math.random() * ig.system.width, Math.random() * ig.system.height, {
                    radius : Math.max(1, Math.random() * 5),

                    opacity  : 1, opacityDecay : 0,
                    killOnMaxRadius : true,
                    noiseOpacity : 0.25,

                    colorStops : [
                        new ColorStop(0,   this.randColor(    1,    0  ) ),
                        new ColorStop(.85, this.randColor(    1,    0  ) ),
                        new ColorStop(1,   this.randColor( 0.75,  0.25 ) )
                    ]
                } );
            }
        },

        randComponent : function( ) {
            return parseInt( Math.random() * 55 + 200 );
        },

        //need better color generation
        randColor : function( opacityBase, opacityVariability ) {
            return { r: this.randComponent(), g : this.randComponent(), b : this.randComponent(),
                    a : parseInt( Math.random() * opacityVariability + opacityBase ) };
        }
    });

});