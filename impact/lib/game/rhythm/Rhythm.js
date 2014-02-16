ig.module( 'game.rhythm.Rhythm' )
.requires()
.defines(function(){
    Rhythm = ig.Class.extend({

        bpm : null,
        notes : [],

        init : function( time, difficulty, notes ) {
            this.time = time;
            this.difficulty = difficulty;

            if( !TypeUtil.isEmpty(notes) ) {
                for( var i = 0; i < notes.length; i++ ) {
                    this.insertNote( i, new Note( notes[i].time, notes[i].difficulty ) );
                }
            }
        },

        insertNote : function( index, note ) {
            this.notes.splice( index, 0, note );
        },

        removeNote : function( index ) {
            this.notes.splice( index, 1 );
        }
    });
});
