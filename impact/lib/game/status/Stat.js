/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 11/14/13
 * Time: 1:54 AM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.status.Stat'
)
.requires(
)
.defines(function () {

    Stat = ig.Class.extend({

        min : 0,
        max : 0,
        value : 0,

        init: function (min, max, value) {
            this.min = min;
            this.max = max;
            this.value = value;
        },

        add : function( value ) {
           this.value = Math.min(this.max, this.value + value );
        },

        subtract : function( value ) {
            this.value = Math.max(this.min, this.value - value );
        }
    });

});