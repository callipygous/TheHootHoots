/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 12/6/13
 * Time: 12:12 AM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.obstacles.ListAsteroidGenerator'
)
.requires(
    'game.obstacles.Asteroid',
    'game.obstacles.AsteroidGenerator'
)
.defines(function () {

    ListAsteroidGenerator = AsteroidGenerator.extend({

        //The next asteroid to generate
        asteroidIndex : 0,

        //Asteroid list should contain a list of { asteroid : AsteroidDef, time : Time } ordered by time
        asteroidList : null,

        timer : null,

        init: function ( asteroidList ) {
            this.asteroidList = asteroidList;
            this.timer = new ig.Timer();
        },

        update : function() {
            if( this.asteroidIndex < this.asteroidList.length ) {
                var delta = this.timer.delta();
                while( this.asteroidList[this.asteroidIndex].time <= delta ) {
                    this.generate( this.asteroidList[this.asteroidIndex].asteroid );
                    this.asteroidIndex++;
                }
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