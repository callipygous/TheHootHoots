ig.module(
    'game.player.DyingPlayer'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityDyingPlayer = ig.Entity.extend({

        buffer : 0,
        angularSpeed : 0,
        player : null,
        animSheet : new ig.AnimationSheet( 'media/hoots/adam/FlightAnimations.png', 216, 155 ),
        maxVel : { x: 10000, y : 10000 },
        twoPi : Math.PI * 2,

        init: function ( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( "dying", 0.5, [ 27 ]);
            this.size = { x : 216, y : 155 };
            this.buffer = 3 * this.size.x;
        },

        update : function() {
            this.parent();
            if( this.pos.x < -this.buffer || this.pos.y < -this.buffer ||
                this.pos.x > ig.system.width + this.buffer ||
                this.pos.y > ig.system.height + this.buffer )   {
                this.player.startRecovery();
                this.kill();
            }

            this.currentAnim.angle += this.angularSpeed;
            if( this.currentAnim.angle > this.twoPi ) {
                this.currentAnim.angle -= this.twoPi;
            }
        }
    });

});