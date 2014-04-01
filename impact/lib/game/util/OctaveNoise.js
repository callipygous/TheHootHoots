// This implementation is borrowed.  See perlin-noise-simplex.js in the
// external/third-party/perlin folder

ig.module(
    'game.util.OctaveNoise'
)
.requires(

)
.defines(function(){

    OctaveNoise = ig.Class.extend({

        octaves     : [],
        noiseGen    : null,

        init : function( octaves, noiseGen ) {
            this.octaves  = octaves;
            this.noiseGen = noiseGen;
        },

        noise : function( x, y ) {
            var total = 0.0;
            var maxAmplitude = 0.0;

            for( var i = 0; i < this.octaves.length; i++ ) {
                var octave = this.octaves[i];
                maxAmplitude += octave.amplitude;
                total += this.noiseGen.noise(x * octave.frequency, y * octave.frequency) * octave.amplitude;
            }

            return total / maxAmplitude;
        }
    });

    Octave = ig.Class.extend({

        amplitude : null,
        frequency : null,

        init : function(amplitude, frequency) {
            this.amplitude = amplitude;
            this.frequency = frequency;
        }
    });

    generateOctaves = function( numOctaves, persistence, scale ) {
        var octaves = [];
        var frequency = scale;
        var amplitude = 1.0;

        for( var i = 0; i < numOctaves; i++ ) {
            octaves[i] = new Octave(amplitude, frequency);
            frequency *= 2.0;
            amplitude *= persistence
        }

        return octaves;
    };

    generateDefaultOctaves = function( numOctaves ) {
        return generateOctaves( numOctaves, 0.5, 0.01 );
    }

});