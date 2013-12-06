/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 12/5/13
 * Time: 1:50 AM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.obstacles.Asteroid'
)
.requires(
    'game.particles.SpikedBallParticle'
)
.defines(function () {

    EntityAsteroid = EntitySpikedBallParticle.extend({

        start : null,
        end   : null,
        speed : null,
        delay : 5,
        releaseVelocity : null,
        asteroidTimer : null,
        released : false,

        init: function ( x, y, settings ) {
            this.parent( x, y, settings );
            this.start = { x : x, y : y };
            this.asteroidTimer = new ig.Timer();
            var vector =  MathUtil.vectorTo(this.start, this.end);
            MathUtil.scaleVectorInPlace( this.speed, vector );
            this.releaseVelocity = vector;
            this.maxVel.x = 100000;
            this.maxVel.y = 100000;
        },

        update : function() {
            var tick  = this.asteroidTimer.tick();
            this.delay -= tick;

            if( this.delay <= 0 && !this.released ) {
                this.vel.x = this.releaseVelocity.x;
                this.vel.y = this.releaseVelocity.y;
                this.released = true;
            }

            var bufferSize = 3 * this.radius;

            if( this.pos.x < ( -bufferSize )  || this.pos.x > ( ig.system.width + bufferSize ) ||
                this.pos.y < ( -bufferSize )  || this.pos.y > ( ig.system.height + bufferSize ) ) {
                this.kill();
            }
            this.parent();
        },

        draw : function() {
            var originalOpacity = this.opacity;

            if( this.delay > 0 ) {
                var delta = this.timer.delta();
                var opacity = 1 * (delta % 0.75) / 0.75;
                this.opacity = originalOpacity * opacity;
            }
            this.parent();

            this.opacity = originalOpacity;
        }
    });

});