/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 11/17/13
 * Time: 9:18 PM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.recording.Rhythm'
)
.requires(
)
.defines(function () {

    Rhythm = ig.Class.extend({

        bpm : 0,
        beats : [],

        init: function (bpm, beats) {
            this.bpm = bpm;
            if( !TypeUtil.isEmpty( beats ) ) {
                this.beats = beats;
            }
        },

        addBeat : function( beat ) {
            this.beats.push( beat );
        },

        clear : function() {
          this.beats = [];
        },

        head : function( ) {
            return this.beats[0];
        },

        toString : function() {
            var truncatedBeats = [];
            for( var i = 0; i < this.beats.length; i++ ) {
                truncatedBeats[i] = (new Number(this.beats[i])).toFixed(4).toString();
            }
            return "{ bpm : " + this.bpm + ", beats : [" + truncatedBeats.join() + "] }";
        }



    });

});