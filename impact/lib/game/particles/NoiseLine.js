
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
        mid : null,
        end : null,

        margin : 0,

        pixels : [],
        likelihoodFunc : null,
        image : null,

        init: function (x, y, settings) {
            this.parent( x, y, settings );

            var minX = Math.max( 0, Math.min( this.start.x, this.end.x ) );
            var maxX = Math.max( this.start.x, this.end.x );

            var minY = Math.max( Math.min( this.start.y, this.end.y ), 0 );
            var maxY = Math.max( this.start.y, this.end.y );

            var midX = Math.floor( ( maxX + minX ) / 2 );
            var midY = Math.floor( ( maxY + minY ) / 2 );
            this.mid = { x : midX, y : midY };

            maxX += this.margin;
            maxY += this.margin;
            minX = Math.max( 0, minX - this.margin );
            minY = Math.max( 0, minY - this.margin );

            this.width  = maxX - minX;
            this.height = maxY - minY;

            this.image = new WritableImage( this.name, this.width, this.height );

            //Shouldn't need to do this twice, just choose the middle point and a direction perpendicular
            //to the line
            var maxLinearDistance = 0;
            var maxCircularDistance = 0;
            for( var j = minY; j <= maxY; j++ ) {
                for( var i = minX; i <= maxX; i++ ) {
                    var point = { x : i, y : j };
                    var distance = MathUtil.distToSegment( point, this.start, this.end );
                    if( distance > maxLinearDistance ) {
                        maxLinearDistance = distance;
                    }

                    distance = Math.abs( MathUtil.distanceTo( this.mid, point ) );
                    if( distance > maxCircularDistance ) {
                        maxCircularDistance = distance;
                    }
                }
            }

            if( this.likelihoodFunc == null ) {
                this.likelihoodFunc = function( circularDistance, linearDistance ) {

                    var normalizedDistance = linearDistance / maxLinearDistance;
                    var linearProb;
                    if( normalizedDistance < 0.1 && MathUtil.rollAgainstChance( 0.25 ) ) {
                        linearProb = 0;
                    } else {
                        linearProb = Math.pow( 0.9, normalizedDistance * 100 );
                    }

                    normalizedDistance = circularDistance / maxCircularDistance;
                    var circularProb = 1.2 * Math.pow( 0.94, normalizedDistance * 90 );

                    return 0.85 * ( linearProb + circularProb );
                }
            }

            this.image.context.fillStyle = "white";

            for( var j = minY; j <= maxY; j++ ) {
                for( var i = minX; i <= maxX; i++ ) {
                    var point = { x : i, y : j };
                    var circularDistance = MathUtil.distanceTo( this.mid, point );
                    var linearDistance = MathUtil.distToSegment( point, this.start, this.end );
                    var likelihood = this.likelihoodFunc( circularDistance, linearDistance );
                    if( MathUtil.rollAgainstChance( likelihood ) ) {
                        this.image.context.fillRect( i - minX, j - minY, 1, 1 );
                    }
                }
            }

            stackBlurCanvasRGB( this.image.context, 0, 0, this.width, this.height, 10 );
        },

        kill : function() {
            this.image.dispose();
            this.parent();
        },

        draw : function() {
            this.image.draw( this.pos.x, this.pos.y, 0, 0, this.width, this.height );
        }
    });

});