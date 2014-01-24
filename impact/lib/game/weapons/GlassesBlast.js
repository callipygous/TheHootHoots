ig.module(
    'game.weapons.GlassesBlast'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityGlassesBlast = ig.Entity.extend({
        zIndex : 100,

        radius : 10,
        exitBuffer : 200,
        damage : 55,
        glasses : null,
        animSheet : new ig.AnimationSheet( 'media/hoots/adam/weapon/laser_small.png', 140, 25 ),

        init: function ( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( "start", 0.05, [ 0, 0, 1,  2,  3,  4,  5,  6,  7,  8,  9,
                                          10, 11, 12, 13, 14, 15, 16, 17, 19, 19, 20 ], true );
            this.currentAnim.angle = settings.angle;
            var lengthVector = MathUtil.angleToScaledVector( settings.angle, 187); //animSheet.width?

            this.offset.x = 140 * Math.cos( settings.angle );
            this.offset.y = 13 + Math.sin( settings.angle ) * 140;
            this.currentAnim.pivot.x =  0;
            this.currentAnim.pivot.y =  22;
        },

        kill : function() {
            this.glasses.removeBlast( this );
            this.parent();
        },

        update : function() {
            this.parent();

            if( ScreenUtil.onScreen( this ) ) {
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
            } else {
                this.kill();
            }
        },

        hit : function( entity ) {
            entity.receiveDamage( this.damage, this );
            this.kill();
        },

        draw : function() {
            this.parent();
        }
    });

});