ig.module(
    'game.particles.SpiralArm'
)
.requires(
    'impact.entity'
)
.defines(function () {
    EntitySpiralArm = ig.Entity.extend({

        topAngle     : null,
        topStart     : null,

        bottomAngle : null,
        bottomStart : null,

        control1Angle     : null,
        control1Magnitude : null,
        control1Point     : null,

        control2Angle     : null,
        control2Magnitude : null,
        control2Point     : null,

        endAngle : null,
        endMagnitude : null,

        radius : null,

        rotation : 0,

        colorStops : [],

        //instead do angle * vector for end
        //
        init : function( x, y, settings ) {
            this.parent( x, y, settings );

            this.topStart    = MathUtil.angleToScaledVector( this.topAngle, this.radius );
            this.bottomStart = MathUtil.angleToScaledVector ( this.bottomAngle, this.radius );
            this.control1Point = MathUtil.angleToScaledVector ( this.control1Angle, this.control1Magnitude );
            this.control2Point = MathUtil.angleToScaledVector( this.control2Angle, this.control2Magnitude );
            this.endPoint = MathUtil.angleToScaledVector( this.endAngle, this.endMagnitude );
        },

        bezier : function( context, start, control1, control2, end ) {
            context.moveTo( start.x, start.y );
            context.bezierCurveTo( control1.x, control1.y, control2.x, control2.y, end.x, end.y );
        },

        draw : function() {
            var context = ig.system.context;
            context.save();
            context.beginPath();

            context.translate( this.pos.x, this.pos.y );
            context.rotate( this.rotation );

            context.moveTo( this.topStart.x, this.topStart.y );
            context.bezierCurveTo( this.control1Point.x, this.control1Point.y, this.control2Point.x, this.control2Point.y, this.endPoint.x,  this.endPoint.y );
            context.bezierCurveTo( this.control2Point.x, this.control2Point.y, this.control1Point.x, this.control1Point.y, this.bottomStart.x, this.bottomStart.y );

            var gradient = context.createRadialGradient( this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.radius );
            DrawUtil.addColorStops( gradient, this.colorStops, 1 );
            context.fillStyle = gradient;
            context.fill();
            context.closePath();
            context.restore();
        },

        debugDraw : function() {
           var context = ig.system.context;
           context.fillStyle = "white";
           context.fill();

           context.strokeStyle = "red";
           context.stroke();

           context.fillStyle = "teal";
           context.fillRect( 0, 0, 2, 2 );

           context.fillStyle = "blue";
           context.fillRect( this.topStart.x, this.topStart.y, 2, 2 );
           context.fillStyle = "green";
           context.fillRect( this.control1Point.x, this.control1Point.y, 2, 2 );
           context.fillStyle = "yellow";
           context.fillRect( this.control2Point.x, this.control2Point.y, 2, 2 );

           context.fillStyle = "white";
           context.fillRect( this.endPoint.x, this.endPoint.y, 2, 2 );
        }

    });

});