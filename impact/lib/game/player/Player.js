
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

        init: function ( x, y, settings ) {
            this.addAnim( "flapping", 0.03, [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
                                              10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                                              20, 21, 22, 23, 24, 25, 26]);
            this.addAnim( "flight", 0.5, [ 27 ]);
            this.size.x = 216;
            this.size.y = 155;
            this.parent( x, y, settings );
        },

        update : function() {
            var vector = MathUtil.vectorTo( this.pos, ig.input.mouse );
            this.pos.x = ig.input.mouse.x - this.halfWidth;
            this.pos.y = ig.input.mouse.y - this.halfHeight;

            this.parent();
        }
    });

});