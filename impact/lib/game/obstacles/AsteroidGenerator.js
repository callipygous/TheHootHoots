/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 12/5/13
 * Time: 11:48 PM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.obstacles.AsteroidGenerator'
)
.requires(
    'game.obstacles.Asteroid'
)
.defines(function () {

    AsteroidGenerator = ig.Class.extend({

        asteroidImage : new ig.Image( 'media/asteroid.png' ),

        init: function () {
        },

        /**
         * Start and end must be of the type { wall : ScreenSide INT, pos : INT } where pos is the distance down the wall
         * @param start
         * @param end
         */
        generate : function( asteroidDef ) {
            ig.game.spawnEntity("EntityAsteroid", asteroidDef.start.x, asteroidDef.start.y, asteroidDef );
        }
    });

});