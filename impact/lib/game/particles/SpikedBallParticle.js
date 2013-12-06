
ig.module(
    'game.particles.SpikedBallParticle'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntitySpikedBallParticle = ig.Entity.extend({

        points : null,
        numPoints : null,
        variance  : 0.25,
        radius : null, //The equation of a circle, takes an x/y
        radiansPerSecond : 1,
        currentAngle : 0,
        timer : null,
        img : null,
        opacity : 1,

        strokeColor : null,
        fill : null,

        init: function ( x, y, settings ) {
            this.parent( x, y, settings );
            this.points = this.makePoints();
            this.timer = new ig.Timer();
        },

        draw: function( ) {

            var context = ig.system.context;
            context.save();
            context.globalAlpha = this.opacity;

            context.translate(this.pos.x,this.pos.y);
            context.rotate( this.currentAngle );
            context.translate(-this.pos.x,-this.pos.y);
            context.beginPath();

            var point0 = this.points[0];
            var point0 = MathUtil.translate( this.points[0], this.pos.x, this.pos.y );

            context.moveTo( point0.x, point0.y );

            for( var i = 1; i < this.points.length; i++ ) {
                var point = this.points[i];
                var point = MathUtil.translate( this.points[i], this.pos.x, this.pos.y );
                context.lineTo( point.x, point.y);
            }

            context.lineTo( point0.x, point0.y );

            context.strokeStyle = this.strokeColor;
            context.lineWidth   = 4;
            context.stroke();
            context.fillStyle = context.createPattern( this.img.data, "repeat" );
            context.translate(this.pos.x,this.pos.y);
            context.fill();
            context.restore();
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
        },

        update : function() {
            this.parent();
            var tick = this.timer.tick();
            var radians = tick * this.radiansPerSecond;
            this.currentAngle += radians;
            if( this.currentAngle > Math.PI * 2 ) {
                this.currentAngle -= Math.PI * 2;
            }
        }
    });

});