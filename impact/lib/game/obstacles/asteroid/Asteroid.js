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

        halfSize : { x : 0, y : 0},

        init: function ( x, y, settings ) {
            this.parent( x, y, settings );
            this.start = { x : x, y : y };
            this.asteroidTimer = new ig.Timer();
            var vector =  MathUtil.vectorTo(this.start, this.end);
            MathUtil.scaleVectorInPlace( this.speed, vector );
            this.releaseVelocity = vector;
            this.maxVel.x = 100000;
            this.maxVel.y = 100000;

            this.halfSize.x = this.size.x / 2;
            this.halfSize.y = this.size.y / 2;
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

            if( this.released && this.isLive ) {
                var player = ig.game.player;

                if( MathUtil.distanceTo(this.pos, player.pos) < player.size.x + this.diameter ) {
                    var bounds = ig.game.player.getCollisionBounds();
                    var points = this.stencil.points;

                    for( var i = 0; i < points.length; i++ ) {
                        var current = this.rotateStencilPointInPlace( points[i] );

                        for( var j = 0; j < bounds.length; j++ ) {
                            if( MathUtil.isBoundedBy( current, bounds[j].min, bounds[j].max ) ) {
                                player.collideWithAsteroid( this );
                                break;
                            }
                        }
                    }
                }
            }

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

//            this.debugDraw();

            this.opacity = originalOpacity;
        },

        kill : function() {
            if( !TypeUtil.isEmpty( this.deathCallback ) ) {
                this.deathCallback();
            }
            this.parent();
        },

        rotateStencilPointInPlace : function( point ) {
            var newPoint = { x : point.x, y : point.y };
            MathUtil.translateInPlace( newPoint, -this.imgOffset.x - this.halfSize.x, -this.imgOffset.y - this.halfSize.y );
            newPoint = MathUtil.rotate( newPoint, this.currentAngle);
            MathUtil.translateInPlace( newPoint, this.pos.x, this.pos.y );
            MathUtil.translateInPlace( newPoint, this.halfSize.x, this.halfSize.y );
            return newPoint;
        },

        debugDraw : function() {
            var points = this.stencil.points;

            ig.system.context.fillStyle = "green";
            ig.system.context.fillRect(this.pos.x, this.pos.y, 2, 2);

            for( var i = 0; i < points.length; i++ ) {
                var current = this.rotateStencilPointInPlace( points[i] );

                ig.system.context.fillStyle = "red";
                ig.system.context.fillRect(current.x, current.y, 2, 2);
            }
            ig.system.context.strokeStyle = "blue";
            ig.system.context.strokeRect( this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    });

});