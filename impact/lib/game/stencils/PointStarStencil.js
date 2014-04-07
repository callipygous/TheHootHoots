ig.module(
    'game.stencils.PointStarStencil'
)
.requires(
)
.defines(function () {

    PointStarStencil = ig.Class.extend({

        pos    : null,
        radius : null,
        crossStrength : null,
        scratch : null,

        opacity      : 1,
        noiseOpacity : 0,

        colorStops : [],

        noiseImg : new ig.Image( 'media/noise.png' ),
        noisePattern : null,

        init : function( pos, radius, crossStrength, scratch ) {
            this.pos    = pos;
            this.radius = radius;
            this.crossStrength = crossStrength;
            this.scratch = scratch;
        },

        draw : function( context ) {
            context.save();
            context.beginPath();

            var gradient = context.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.radius);
            for( var i = 0; i < this.colorStops.length; i++ ) {
                var colorStop = this.colorStops[i];
                gradient.addColorStop(colorStop.distance, colorStop.getRgbaString( this.opacity ) );
            }
            context.fillStyle = gradient;
            context.arc(this.pos.x, this.pos.y, this.radius, Math.PI * 2, false );
            context.fill();

            if( this.noiseOpacity > 0 ) {
                context.globalAlpha = this.noiseOpacity;
                if( this.noisePattern == null ) {
                    this.noisePattern = context.createPattern( this.noiseImg.data, "repeat" );
                }
                context.fillStyle = this.noisePattern;
                context.fill();
            }

            context.closePath();
            context.restore();
        }

    })

});