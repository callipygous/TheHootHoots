ig.module( 'game.rhythm.Note' )
.requires()
.defines(function(){
    Note = ig.Class.extend({

        time : null,
        difficulty : null,

        init : function( time, difficulty ) {
            this.time = time;
            this.difficulty = difficulty;
        }
    });
});
