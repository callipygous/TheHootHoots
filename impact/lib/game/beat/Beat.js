/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 11/13/13
 * Time: 11:20 PM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.beat.Beat'
)
.requires(
)
.defines(function(){

    Beat = ig.Class.extend({
        id : -1,
        time : 0,
        optional : false,
        handled : false,
        status : null,

        init: function( id, time ) {
            this.id   = id;
            this.time = time;
            this.progress = 0;
            this.status = BeatStatus.FRESH;
            this.handled = false;
        }

    });
});