
ig.module(
    'game.player.Player'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityPlayer = ig.Entity.extend({

        animSheet : new ig.AnimationSheet( 'media/hoots/adam/FlightAnimations.png', 216, 155 ),

        halfWidth  : 108,
        halfHeight : 77,
        zIndex : -100,

        init: function ( x, y, settings ) {
            this.addAnim( "flight", 0.5, [ 27 ]);
            this.addAnim( "flapping", 0.03, [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
                                              10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                                              20, 21, 22, 23, 24, 25, 26]);
            this.size.x = 216;
            this.size.y = 155;
            this.parent( x, y, settings );
        },

        update : function() {
            var vector = MathUtil.vectorTo( this.pos, ig.input.mouse );
            this.pos.x = ig.input.mouse.x - this.halfWidth;
            this.pos.y = ig.input.mouse.y - this.halfHeight;

            this.parent();
        },

        getGlassesLocation : function () {
            return { x : this.pos.x + this.size.x, y : this.pos.y + this.size.y / 2.5 };
        },

        checkForHit : function () {

            var asteroids = this.glasses.asteroids;
            for( var i = 0; i < asteroids.length; i++ ) {
                var asteroid = asteroids[i];
                if( asteroid.isLive && asteroid.released ) {
                    var distance = MathUtil.distanceTo( this.pos, MathUtil.center( asteroid.pos, asteroid.size ) );
                    var limit =  asteroid.radius + this.radius + ( asteroid.variance * asteroid.radius / 2 );
                    if( distance < limit ) {
                        this.hit( asteroid );
                    }
                }
            }
        }
    });

});