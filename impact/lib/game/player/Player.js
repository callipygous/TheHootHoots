
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
        collisionBoxes  : [{ size : { x: 195, y : 50 }, offset : { x : 07,  y : 78 }},
                           { size : { x:  90, y : 50 }, offset : { x : 110, y : 28 }}],

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

        collideWithAsteroid : function ( asteroid ) {
            if( this.health > 0 ) {
                this.health -= 1;
                asteroid.kill();
            }
        },

        draw : function() {
            this.parent();

            ig.system.context.save();
            ig.system.context.strokeStyle = "green";
            ig.system.context.strokeRect( this.pos.x, this.pos.y, this.size.x, this.size.y );

            var bounds = this.getCollisionBounds();

            for( var i = 0; i < bounds.length; i++ ) {
                var bound = bounds[i];
                var start = bound.min;
                var widthX = bound.max.x - start.x;
                var widthY = bound.max.y - start.y;

   //             ig.system.context.strokeStyle = "blue";
   //             ig.system.context.strokeRect( start.x, start.y, widthX, widthY );
            }

            ig.system.context.restore();
        },

        collisionBoxToBound : function( collisionBox ) {

            var minBound = { x : this.pos.x + collisionBox.offset.x,
                             y : this.pos.y + collisionBox.offset.y };

            var maxBound = { x : minBound.x + collisionBox.size.x,
                             y : minBound.y + collisionBox.size.y };

            return { min : minBound, max : maxBound };
        },

        getCollisionBounds : function() {
            var boxes = [];
            for( var i = 0; i < this.collisionBoxes.length; i++ ) {
                boxes.push( this.collisionBoxToBound( this.collisionBoxes[i] ) );
            }
            return boxes;
        }
    });

});