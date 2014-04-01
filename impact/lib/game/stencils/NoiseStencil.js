ig.module(
    'game.stencils.NoiseStencil'
)
.requires(
)
.defines(function () {

    NoiseStencil = ig.Class.extend({

        pos  : { x : 0, y : 0 },
        size : { x : 0, y : 0 },
        maxCoord  : { x : 0, y : 0 },
        noiseGenerator : null,
        opacity : 1,

        init: function ( pos, size, noiseGenerator, opacity ) {
            this.pos.x = pos.x;
            this.pos.y = pos.y

            this.size.x = size.x;
            this.size.y = size.y;

            this.maxCoord.x = this.pos.x + this.size.x;
            this.maxCoord.y = this.pos.y + this.size.y;

            this.noiseGenerator = noiseGenerator;
            this.opacity = opacity;
        },

        draw: function( context ) {
            context.save();
            context.globalAlpha = this.opacity;

            var minNoise = 0;
            var minNoise255 = 300;
            for( var i = 0; i < this.size.x; i++ ) {
                for( var j = 0; j < this.size.y; j++ ) {
                    var noise = this.noiseGenerator.noise(i, j);
                    noise = (noise + 1) / 2; //noise is between -1,1

                    var color = ColorUtil.componentToHex( 255 * noise ).toString();
                    context.fillStyle = "#" + color + color + color;
                    context.fillRect(this.pos.x + i, this.pos.y + j, 3, 3);
                }
            }

            console.log("Min: " + minNoise255 + " Noise: " + noise);

            context.restore();
        },

        clear : function( context ) {
            context.clearRect( this.pos.x, this.pos, this.size.x, this.size.y );
        }
    });

});