ig.module(
    'game.weapons.Glasses'
)
.requires(
    'game.weapons.GlassesBlast'
)
.defines(function () {

    Glasses = ig.Class.extend({

        speed : 1000,
        powerStats : null,
        costs : null,
        blasts : 0,
        asteroids : [],

        init: function ( powerStats, costs  ) {
            this.powerStats = powerStats;
            this.costs = costs;
        },

        fire : function( start ) {
            if( !ig.game.player.hidden ) {
                if( this.powerStats.power >= this.costs.getCurrentCost() ) {
                    this.powerStats.power -= this.costs.getCurrentCost();
                    var angles = [-(Math.PI / 6), -0.25, 0, 0.25, (Math.PI / 6)];

                    for( var i = 0; i < angles.length; i++ ) {
                        var vector = MathUtil.angleToScaledVector( angles[i], this.speed );
                        var glasses = this;
                        ig.game.spawnEntity( "EntityGlassesBlast", start.x, start.y, {
                            vel : vector, maxVel : { x : 1000, y : 1000 }, angle : angles[i],
                            glasses : glasses
                        });
                        this.blasts += 1;
                    }
                }
            }
        },

        removeBlast : function( blast ) {
            this.blasts -= 1;
        },

        update : function() {
            //get a list of active asteroids so we don't have to query the game per blast
            if( this.blasts > 0 ) {
                this.refreshAsteroids();
            }
        },

        refreshAsteroids : function() {
            this.asteroids = [];
            var allAsteroids = ig.game.getEntitiesByType("EntityAsteroid");
            for( var i = 0; i < allAsteroids.length; i++ ) {
                if( allAsteroids[i].isLive ) {
                    this.asteroids.push( allAsteroids[i] );
                }
            }
        }
    });

});