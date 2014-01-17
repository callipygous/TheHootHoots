
ig.module(
    'game.particles.NoiseLine'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityNoiseLine = ig.Entity.extend({

        name : null,
        start : null,
        end : null,

        margin : 0,

        pixels : [],
        likelihoodFunc : null,
        image : null,

        init: function (x, y, settings) {
            this.parent( x, y, settings );

            var minX = Math.max( 0, Math.min( this.start.x, this.end.x ) - this.margin );
            var maxX = Math.max( this.start.x, this.end.x ) + this.margin;

            var minY = Math.max( Math.min( this.start.y, this.end.y ) - this.margin, 0 );
            var maxY = Math.max( this.start.y, this.end.y ) + this.margin;
            this.image = new WritableImage( this.name, maxX - minX, maxY - minY );

            if( this.likelihoodFunc == null ) {
                var maxDistance = MathUtil.distanceTo( { x : minX, y : minY}, { x : maxX, y : maxY } ) / 2;
                this.likelihoodFunc = function( distance ) {
                    var normalizedDistance = distance / maxDistance;
                    if( normalizedDistance < 0.1 && MathUtil.rollAgainstChance( 0.25 ) ) {
                        return 0;
                    }

                    return Math.pow( 0.85, normalizedDistance * 100 );
                }
            }

            this.image.context.fillStyle = "white";

            for( var j = minY; j <= maxY; j++ ) {
                for( var i = minX; i <= maxX; i++ ) {
                    var point = { x : i, y : j };
                    var distance = MathUtil.distToSegment( point, this.start, this.end );
                    var likelihood = this.likelihoodFunc( distance );
                    if( MathUtil.rollAgainstChance( likelihood ) ) {
                        this.image.context.fillRect( i, j, 1, 1 );
                    }
                }
            }
        },

        kill : function() {
            this.image.dispose();
            this.parent();
        },

        draw : function() {
            this.image.draw( this.pos.x, this.pos.y );
        }
    });

});