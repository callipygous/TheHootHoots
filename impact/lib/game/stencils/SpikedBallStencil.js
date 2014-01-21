ig.module(
    'game.stencils.SpikedBallStencil'
)
.requires(
)
.defines(function () {

    SpikedBallStencil = ig.Class.extend({

        pos : { x : 0, y : 0 },
        maxSize : 0,
        minPoints : { x : 0, y : 0 },
        maxPoints : { x : 0, y : 0 },
        points : null,
        numPoints : null,
        variance  : 0.25,
        radius : null, //The equation of a circle, takes an x/y
        opacity : 1,

        fillImg : null,
        strokeColor : null,

        init: function ( pos, maxSize, numPoints, variance, radius, opacity, fillImg, strokeColor ) {
            this.pos.x = pos.x;
            this.pos.y = pos.y;
            this.maxSize = maxSize;
            this.minPoint = { x : -maxSize / 2, y : -maxSize / 2 };
            this.maxPoint = { x :  maxSize / 2, y :  maxSize / 2 };
            this.numPoints = numPoints;
            this.variance = variance;
            this.radius = radius;
            this.opacity = opacity;
            this.fillImg = fillImg;
            this.strokeColor = strokeColor;
            this.points = this.makePoints();
        },

        draw: function( context ) {
            context.save();
            context.globalAlpha = this.opacity;

            context.beginPath();

            var point0 = this.points[0];

            context.moveTo( point0.x, point0.y );

            for( var i = 1; i < this.points.length; i++ ) {
                var point = this.points[i];
                context.lineTo( point.x, point.y);
            }

            context.lineTo( point0.x, point0.y );

            context.strokeStyle = this.strokeColor;
            context.lineWidth   = 4;
            context.stroke();
            context.fillStyle = context.createPattern( this.fillImg.data, "repeat" );
            context.fill();
            context.restore();
        },

        clear : function( context ) {
            context.clearRect( this.pos.x - this.maxSize / 2, this.pos.y - this.maxSize / 2, this.maxSize, this.maxSize );
        },

        //TODO: DETERMINE IF THERE ARE INTERSECTING LINES AND REMOVE THEM
        makePoints : function() {
            var points = [];

            //compute equidistant points around a circle
            var x0 = this.pos.x;
            var y0 = this.pos.y;

            var numPoints = 1 / this.numPoints;
            var multiplier = 2 * Math.PI * numPoints;

            for(var i = 0; i < this.numPoints; i++) {
                var x = x0 + this.radius * Math.cos( multiplier * i );
                var y = y0 + this.radius * Math.sin( multiplier * i );
                points[i] = {x : x, y : y};
            }

            for( var i = 0; i < points.length; i++ ) {
                MathUtil.translateInPlace( points[i], -this.pos.x, -this.pos.y);
            }

            //warp the coordinates based on variance
            for( var i=1; i < points.length; i++ ) {
                points[i] = this.warp( points[i], points[i-1] );
                points[i].x = MathUtil.clamp( points[i].x, this.minPoint.x, this.maxPoint.x );
                points[i].y = MathUtil.clamp( points[i].y, this.minPoint.y, this.maxPoint.y );
            }

            for( var i = 0; i < points.length; i++ ) {
                MathUtil.translateInPlace( points[i], this.pos.x, this.pos.y);
            }

            return points;
        },

        warp : function( point, previousPoint ) {
            var variance2 = this.variance * 2;
            var quadrant = MathUtil.quadrant( point, this.pos );

            var newPoint = {
                x : point.x * ( 1 + ( Math.random() * variance2 - this.variance ) ),
                y : point.y * ( 1 + ( Math.random() * variance2 - this.variance ) )
            };

            //instead sort and fix
            if( quadrant == 1 ) {
                if( newPoint.x < previousPoint.x && newPoint.y > previousPoint.y ) {
                    newPoint.y = point.y;
                }
            } else if( quadrant == 2 ) {
                if( newPoint.x > previousPoint.x && newPoint.y < previousPoint.y ) {
                    newPoint.x = point.x;
                }
            } else if( quadrant == 3 ) {
                if( newPoint.x > previousPoint.x && newPoint.y < previousPoint.y ) {
                    newPoint.y = point.y
                }
            } else if( quadrant == 4 ) {
                if( newPoint.x < previousPoint.x && newPoint.y < previousPoint.y ) {
                    newPoint.x = point.x;
                }
            } else {
                throw "Bad quadrant from math util: " + quadrant;
            }

            return newPoint;
        }
    });

});