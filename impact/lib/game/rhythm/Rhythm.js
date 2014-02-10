ig.module( 'game.rhythm.Rhythm' )
.requires()
.defines(function(){
    Rhythm = ig.Class.extend({

        bpm : null,
        notes : [],

        init : function( time, difficulty ) {
            this.time = time;
            this.difficulty = difficulty;
        },

        insertNote : function( index, note ) {
            this.notes.splice( index, 0, note );
        },

        removeNote : function( index ) {
            this.notes.splice( index, 1 );
        }
    });
});
