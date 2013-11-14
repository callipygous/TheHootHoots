/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 11/14/13
 * Time: 1:51 AM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.status.LevelStats'
)
.requires(
)
.defines(function () {

    LevelStats = ig.Class.extend({

        beat : null,
        spirit : null,
        score : 0,

        init: function ( maxBeat, maxSpirit ) {
            this.beat   = new Stat(0,  maxBeat  );
            this.spirit = new Stat(0, maxSpirit );
        }
    });

});