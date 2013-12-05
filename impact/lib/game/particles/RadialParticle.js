ig.module(
    'game.particles.RadialParticle'
)
.requires(
    'impact.entity'
)
.defines(function () {
    //got some tips from
    //http://thecodeplayer.com/walkthrough/html5-canvas-experiment-a-cool-flame-fire-effect-using-particles
    EntityRadialParticle = ig.Entity.extend({

        radius : null,
        maxRadius : 1000,
        minRadius : 0,
        //subtract this much radius per second
        radialDecay : null,

        colorStops : [],

        opacity  : null,
        maxOpacity : 1,
        minOpacity : 0,

        //subtract this much opacity per second
        opacityDecay : null,

        timer : null,
        killOnZero       : true,
        killOnMaxRadius  : false,
        latestTick : 0,

        init: function (x, y, settings ) {
            this.parent( x, y, settings );
            this.timer = new ig.Timer();
        },

        draw : function() {
            var context = ig.system.context;
            context.beginPath();

            var gradient = context.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, this.radius);
            for( var i = 0; i < this.colorStops.length; i++ ) {
                var colorStop = this.colorStops[i];
                gradient.addColorStop(colorStop.distance, colorStop.getRgbaString( this.opacity ) );
            }
            context.fillStyle = gradient;
            context.arc(this.pos.x, this.pos.y, this.radius, Math.PI * 2, false );
            context.fill();
        },

        update : function() {
            var secondsPassed = this.timer.tick();
            if( this.opacityDecay != null ) {
                this.opacity = MathUtil.bound( this.opacity - ( this.opacityDecay * secondsPassed ),
                                               this.minOpacity, this.maxOpacity );
            }

            if( this.radialDecay != null ) {
                this.radius = MathUtil.bound( this.radius - ( this.radialDecay * secondsPassed ),
                                              this.minRadius, this.maxRadius );
            }

            if( this.killOnZero &&  (this.radius <= 0 || this.opacity <= 0 ) ) {
                this.kill();
            } else if( this.killOnMaxRadius && ( this.radius >= this.maxRadius ) ) {
                this.kill();
            }

            for( var i = 0; i < this.colorStops.length; i++ ) {
                this.colorStops[i].update( this.opacity, this.radius, secondsPassed );
            }
        },

        pause : function() {
            this.timer.pause();
        },

        unpause : function() {
            this.timer.unpause();
        }
    });

});