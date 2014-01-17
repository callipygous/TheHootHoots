
ig.module(
    'game.particles.SpiralParticle'
)
.requires(
    'game.particles.RadialParticle'
)
.defines(function () {

    EntitySpiralParticle = EntityRadialParticle.extend({

        rotationSpeed : null,
        numberOfArms : null,
        spiralArmArgs : null,

        spiralArms : [],

        init: function ( x, y, settings ) {
            this.parent( x, y, settings );
            //Construct arms
            var spacing = 2 * Math.PI / this.numberOfArms;
            for( var i = 0; i < this.numberOfArms; i++ ) {
                this.spiralArms.push( this.makeArm( i * spacing ) );
            }
        },

        makeArm : function( startRotation ) {
            var spiralArm = ig.game.spawnEntity( "EntitySpiralArm", this.pos.x, this.pos.y, this.spiralArmArgs );
            spiralArm.rotation = startRotation;
            return spiralArm;
        },

        kill : function() {
          this.parent();
          for( var i = 0; i < this.spiralArms.length; i++ ) {
              this.spiralArms[i].kill();
          }
        },

        update : function() {
            this.parent();
            for( var i = 0; i < this.spiralArms.length; i++ ) {
                this.spiralArms[i].rotation += this.rotationSpeed;
            }
        }
    });

});