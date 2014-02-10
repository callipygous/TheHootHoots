ig.module( 'game.rhythm.Track' )
.requires()
.defines(function(){
    Track = ig.Class.extend({
        songMetadata : null,
        rhythm : null,

        init : function( songMetadata, rhythm ) {
            this.songMetadata = songMetadata;
            this.rhythm       = rhythm;
        }
    });
});
