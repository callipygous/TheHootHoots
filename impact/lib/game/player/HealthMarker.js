
ig.module(
    'game.player.HealthMarker'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityHealthMarker = ig.Entity.extend({

        healthLevel : 3,

        shake : 0,
        rotateDir : 1,
        maxRotate    : 0,
        rotateSpeed  : 0,
        currentAngle : 0,

        healthTimer : null,

        animSheet : new ig.AnimationSheet( 'media/hoots/adam/AdamHead.png', 100, 94 ),

        init: function ( x, y, settings ) {
            this.addAnim( "healthy", 0.5, [ 1 ]);
            this.addAnim( "warning", 0.5, [ 2 ]);
            this.addAnim( "danger",  0.5, [ 4 ]);

            this.size.x = 100;
            this.size.y = 94;

            this.healthTimer = new ig.Timer();
            this.parent( x, y, settings );
        },

        update : function() {
            var elapsedTime = this.healthTimer.delta();
            var health = ig.game.player.health;
            if( health >= 3 ) {
                this.currentAnim = this.anims["healthy"];
                this.shake = 2;
            } else if( health == 2 ) {
                this.currentAnim = this.anims["warning"];
                this.shake = 3;
            } else {
                this.currentAnim = this.anims["danger"];
                this.shake = 5;
            }

            if( this.healthTimer.delta() > 0 ) {
                if( this.currentAngle > this.maxRotate ) {
                    this.rotateDir = -1;
                } else if( this.currentAngle < -this.maxRotate ) {
                    this.rotateDir = 1;
                }

                this.rotateSpeed = this.rotateDir * this.shake * 0.01;
                this.maxRotate = ( Math.PI / 30 ) * this.shake;

                this.currentAngle += this.rotateSpeed * Math.random();

                var shakeRange = this.shake / 2;
                this.offset.x = shakeRange - ( this.shake * Math.random() );
                this.offset.y = shakeRange - ( this.shake * Math.random() );

                this.healthTimer.set( 0.05 );
            }

            this.parent();
        },

        draw : function() {
            if( ig.game.player.health >= this.healthLevel ) {
                this.currentAnim.angle = this.currentAngle;
                this.parent();
                this.currentAnim.angle = 0;
            }
        }
    });

});