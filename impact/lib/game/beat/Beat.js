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

    ig.Beat = ig.Class.extend({
        id : -1,
        progress : 0,
        handled : false,

        init: function(id) {
            this.id = id;
            this.progress = 0;
            this.handled = false;
        }
    });

});