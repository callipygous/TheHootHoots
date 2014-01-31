
ig.module(
    'game.player.Player'
)
.requires(
    'impact.entity',
    'game.player.DyingPlayer'
)
.defines(function () {

    PlayerStatus = {
        live       : 0,
        dead       : 1,
        recovering : 2
    };

    EntityPlayer = ig.Entity.extend({

        animSheet : new ig.AnimationSheet( 'media/hoots/adam/FlightAnimations.png', 216, 155 ),

        //Live, Dead, Recovering
        status : PlayerStatus.live,

        recoverTimer : null,
        recoveryTime : 3,
        recoveryTimeLeft : 0,

        maxHealth : 4,

        halfWidth  : 108,
        halfHeight : 77,
        zIndex : -100,
        collisionBoxes  : [{ size : { x: 195, y : 50 }, offset : { x : 07,  y : 78 }},
                           { size : { x:  90, y : 50 }, offset : { x : 110, y : 28 }}],

        init: function ( x, y, settings ) {
            this.addAnim( "flight", 0.5, [ 27 ]);
            this.addAnim( "flapping", 0.03, [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
                                              10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                                              20, 21, 22, 23, 24, 25, 26]);

            this.recoverTimer = new ig.Timer();
            this.size.x = 216;
            this.size.y = 155;
            this.parent( x, y, settings );
        },

        update : function() {
            var vector = MathUtil.vectorTo( this.pos, ig.input.mouse );
            this.pos.x = ig.input.mouse.x - this.halfWidth;
            this.pos.y = ig.input.mouse.y - this.halfHeight;

            if( this.status == PlayerStatus.recovering ) {
                if( this.recoveryTimeLeft <= 0 ) {
                    this.status = PlayerStatus.live;
                } else {
                    this.recoveryTimeLeft -= this.recoverTimer.tick();
                }
            }

            this.parent();
        },

        getGlassesLocation : function () {
            return { x : this.pos.x + this.size.x, y : this.pos.y + this.size.y / 2.5 };
        },

        draw : function() {
            if( this.status != PlayerStatus.dead ) {
                var originalOpacity = this.currentAnim.alpha;
                if( this.status == PlayerStatus.recovering ) {
                    this.currentAnim.alpha = Math.abs( ( this.recoveryTimeLeft - parseInt( this.recoveryTimeLeft ) )  * originalOpacity );
                }

                this.parent();
                this.currentAnim.alpha = originalOpacity;
            }

            //this.debugDraw();
        },

        //For some reason if we create bound within collisionBoxToBound we end up crashing chrome
        collisionBoxToBound : function ( collisionBox, bound ) {
            bound.min.x = this.pos.x + collisionBox.offset.x;
            bound.min.y = this.pos.y + collisionBox.offset.y;
            bound.max.x = bound.min.x + collisionBox.size.x;
            bound.max.y = bound.min.y + collisionBox.size.y;
            return bound;
        },

        getCollisionBounds : function() {
            var boxes = [];
            for( var i = 0; i < this.collisionBoxes.length; i++ ) {
                boxes.push( this.collisionBoxToBound( this.collisionBoxes[i], { min : { x : 0, y : 0}, max : {x : 0, y : 0} } ) );
            }
            return boxes;
        },

        /**
         * @param asteroid The Asteroid that has collided with the player
         */
        collideWithAsteroid : function ( asteroid ) {
            if( this.health > 0 && this.status == PlayerStatus.live ) {
                this.health -= 1; //do not use receiveDamage as it will kill this player
                this.status = PlayerStatus.dead;
                this.launchDeadPlayer( this, asteroid );
                asteroid.kill();
            }
        },

        launchDeadPlayer : function ( player, asteroid ) {
            this.status = PlayerStatus.dead;
            var vel = { x : asteroid.vel.x, y : asteroid.vel.y };
            var magnitude = MathUtil.magnitude( vel );
            if( magnitude < 800 ) {
                MathUtil.scaleVectorInPlace( 800, MathUtil.normalize( vel ) );
            }

            var angularSpeed;
            if( asteroid.pos.x < this.pos.x + this.halfWidth ) {
                if( asteroid.pos.y < this.pos.y + this.halfHeight ) {
                    angularSpeed = -0.06;
                } else {
                    angularSpeed = 0.06;
                }
            } else {
                if( asteroid.pos.y < this.pos.y + this.halfHeight ) {
                    angularSpeed = 0.06;
                } else {
                    angularSpeed = -0.06;
                }
            }

            ig.game.spawnEntity( "EntityDyingPlayer", this.pos.x, this.pos.y, {
                player : player, vel : vel, angularSpeed : angularSpeed } );
        },

        startRecovery : function() {
            if( this.health > 0 ) {
                this.recoveryTimeLeft = this.recoveryTime;
                this.recoverTimer.tick();
                this.status = PlayerStatus.recovering;
            }
        },

        debugDraw : function() {
            ig.system.context.save();
            ig.system.context.strokeStyle = "green";
            ig.system.context.strokeRect( this.pos.x, this.pos.y, this.size.x, this.size.y );

            var bounds = this.getCollisionBounds();
            for( var i = 0; i < bounds.length; i++ ) {
                var bound = bounds[i];
                var start = bound.min;
                var widthX = bound.max.x - start.x;
                var widthY = bound.max.y - start.y;

                ig.system.context.strokeStyle = "blue";
                ig.system.context.strokeRect( start.x, start.y, widthX, widthY );
            }

            ig.system.context.restore();
        },

        tryGrantOneUp : function() {
            if( this.health < this.maxHealth ) {
                this.health += 1;
                return true;
            }

            return false;
        }
    });

});