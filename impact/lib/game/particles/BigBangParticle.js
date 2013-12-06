
ig.module(
    'game.particles.BigBangParticle'
)
.requires(
    'game.particles.RadialParticle',
    'game.particles.colorstops.ColorStop',
    'game.particles.colorstops.MorphingColorStop'
)
.defines(function () {
    var MaxRadius = 9000;

    EntityBigBangParticle = EntityRadialParticle.extend({

        preBang : {
            radialDecay  : 0,
            opacityDecay : 0,

            colorStops : [
                new ColorStop(0,  {r: 255, g : 255, b : 255, a : 1 }),
                new ColorStop(.5, {r: 70,  g : 150, b : 240, a : 1 }),
                new ColorStop(1,  {r: 18,  g : 17,  b : 240, a : 0 })
            ]
        },

        postBang : {
            radialDecay  : -600,
            opacityDecay : 0.1,

            colorStops : [
                new ColorStop(0,  {r: 120, g : 120, b : 18, a : 1 }),
                new ColorStop(.5, {r: 120, g : 170, b : 90, a : 1 }),
                new ColorStop(1,  {r: 18, g : 120, b : 18, a : 0 })
            ]
        },

        banged : false,
        flicker : null,
        flickerOpacity : 1,
        innerBang : null,

        init: function (x, y, ignoredSettings ) {
            this.bigBangTimer = new ig.Timer();

            var settings = {
                radius : 8,
                radialDecay  : this.preBang.radialDecay,
                minRadius : 0,  maxRadius : MaxRadius,

                opacity  : 1,
                opacityDecay : this.preBang.opacityDecay,

                colorStops    : this.preBang.colorStops
            };

            this.parent( x, y, settings );
        },

        bang : function() {
            if( !this.banged ) {
                this.banged = true;
                this.radialDecay  = this.postBang.radialDecay;
                this.opacityDecay = this.postBang.opacityDecay;
                this.colorStops   = this.postBang.colorStops;

                this.innerBang =
                    ig.game.spawnEntity("EntityRadialParticle", this.pos.x + this.radius/2, this.pos.y + this.radius/2, {
                        radius : 2, radialDecay : -1000,
                        minRadius : 0, maxRadius : MaxRadius,

                        opacity  : 1, opacityDecay : 0,
                        killOnMaxRadius : true,
                        noiseOpacity : 0.25,

                        colorStops : [
                            new MorphingColorStop(0, {r: 0,  g : 0,  b : 100, a : 1 },
                                                  this.getInnerBangMorphFunction( MaxRadius ) ),
                            new ColorStop(.75, { r: 120, g : 170, b : 90, a : 1  } ),
                            new ColorStop(1,   { r: 255, g : 255, b : 255, a : 1 } )
                        ]
                    })
            }
        },

        flicker : function() {
            this.flickering = 2;
            this.flickerOpacity = this.opacity;
        },

        update : function() {
            var secondsPassed = this.bigBangTimer.tick();

            if( this.flickering > 0 ) {
                this.flickerOpacity = this.flickerOpacity - ( Math.random() * 0.75 * secondsPassed );
            } else {
                this.flickerOpacity = 1;
            }

            if( this.banged ) {
                this.innerBang.noiseOpacity -= secondsPassed / 50;
            }

            this.parent();
        },

        draw : function() {
            var originalOpacity = this.opacity;
            this.opacity = this.flickerOpacity;
            this.parent();
            this.opacity = originalOpacity;
        },

        //The bigger the radius the bigger the stop distance gets (up to 0.75)
        getInnerBangMorphFunction : function( maxRadius ) {
            return function( colorStop, particleOpacity, particleRadius, secondsPassed ) {
                var progress = particleRadius / maxRadius * 0.75;
                colorStop.distance = progress * 0.75;
                colorStop.rgba.a  = ( 1 - progress ) * 0.5;
            }
        },

        kill : function() {
            this.innerBang.kill();
            this.parent();
        }

    });

});