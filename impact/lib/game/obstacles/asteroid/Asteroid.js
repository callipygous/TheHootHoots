ig.module(
    'game.obstacles.asteroid.Asteroid'
)
.requires(
    'game.stencils.StenciledEntity'
)
.defines(function () {

    EntityAsteroid = EntityStenciledEntity.extend({

        //if this is an asteroid that should interact with the player/lasers (i.e. non-decorative)
        isLive : true,

        //The location this asteroid starts from
        start : null,

        //The location this asteroid leaves the canvas
        end   : null,

        //travelling speed
        speed : null,

        //how many seconds delay before the asteroid is launched
        delay : 5,

        //The vector and magnitude of the asteroid after it is released
        releaseVelocity : null,

        //The timer used to launch this asteroid
        asteroidTimer : null,

        //has this asteroid been released, collisions don't happen before releasing.
        //Also the asteroid blinks until it is releasesd
        released : false,

        //The radius used for collision detection
        radius : null,

        //The x/y coordinates of the top-left of the image for this asteroid in img
        imgOffset : null,

        //If this entity has an x or y position below these two values then the entity is killed
        minKillPos : null,

        //If this entity has an x or y position above these two values then the enitty is killed
        maxKillPos : null,

        deathCallback : null,

        diameter : null,

        init: function ( x, y, settings ) {
            this.parent( x, y, settings );
            this.start = { x : x, y : y };
            this.asteroidTimer = new ig.Timer();
            var vector =  MathUtil.vectorTo(this.start, this.end);
            MathUtil.scaleVectorInPlace( this.speed, vector );
            this.releaseVelocity = vector;
            this.maxVel.x = 100000;
            this.maxVel.y = 100000;

            this.diameter = this.radius * 2;

            var bufferSize = 3 * this.radius;
            this.minKillPos = { x : -bufferSize, y : -bufferSize };
            this.maxKillPos = { x : ig.system.width + bufferSize, y : ig.system.height + bufferSize };
        },

        update : function() {
            var tick  = this.asteroidTimer.tick();
            this.delay -= tick;

            if( this.delay <= 0 && !this.released ) {
                this.vel.x = this.releaseVelocity.x;
                this.vel.y = this.releaseVelocity.y;
                this.released = true;
            }

//            if( this.released && this.isLive ) {
//                var player = ig.game.player;
//
//                if( MathUtil.distanceTo(this.pos, player.pos) < player.size.x + this.diameter ) {
//                    var minBound = { x : player.pos.x + player.collisionOffset.x,
//                                     y : player.pos.y + player.collisionOffset.y };
//
//                    var maxBound = { x : minBound.x + player.collisionSize.x,
//                                     y : minBound.y + player.collisionSize.y };
//                    var points = this.stencil.points;
//
//                    var current;
//
//                    for( var i = 0; i < points.length; i++ ) {
//                        current = MathUtil.translate( points[i], this.pos.x, this.pos.y );
//
//                        if( MathUtil.isBoundedBy( current, minBound, maxBound ) ) {
//                            player.collideWithAsteroid( this );
//                            break;
//                        }
//                    }
//                }
//            }

            if( this.pos.x < this.minKillPos.x || this.pos.x > this.maxKillPos.x ||
                this.pos.y < this.minKillPos.y || this.pos.y > this.maxKillPos.y ) {
                this.kill();
            }
            this.parent();
        },

        draw : function() {
            var originalOpacity = this.opacity;

            if( this.delay > 0 ) {
                var delta = this.stencilTimer.delta();
                var opacity = 1 * (delta % 0.75) / 0.75;
                this.opacity = originalOpacity * opacity;
            }
            this.parent();

//            ig.system.context.strokeStyle = "red";
//            ig.system.context.strokeRect( this.pos.x, this.pos.y, this.size.x, this.size.y);

            this.opacity = originalOpacity;
        },

        kill : function() {
            if( !TypeUtil.isEmpty( this.deathCallback ) ) {
                this.deathCallback();
            }
            this.parent();
        }
    });

});