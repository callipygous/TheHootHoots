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
        optional : false,
        handled : false,
        status : null,
        statusListeners : [],

        init: function(id) {
            this.id = id;
            this.progress = 0;
            this.status = BeatStatus.FRESH;
            this.handled = false;
        },

        addListener : function( beatListener ) {
            var index = this.statusListeners.indexOf( beatListener );
            if( index < 0 ) {
                this.statusListeners.push( beatListener );
            }
        },

        removeListener : function( beatListener ) {
            var index = this.statusListeners.indexOf( beatListener );
            if( index >= 0 ) {
                this.statusListeners.splice( index, 1 );
            }
        },

        setStatus : function( newStatus ) {
            var oldStatus = this.status;
            this.status = newStatus;

            for( var i = 0; i < this.statusListeners.length; i++ ) {
                this.statusListeners[i].handleBeatStatusChange( oldStatus, newStatus );
            }
        },

        getStatus : function( ) {
            return this.status;
        }


    });
});