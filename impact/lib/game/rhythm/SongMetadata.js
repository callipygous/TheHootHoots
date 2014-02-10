ig.module( 'game.rhythm.Note' )
.requires()
.defines(function(){
    SongMetadata = ig.Class.extend({

        file : null,

        name : null,
        artist : null,

        length : null,
        formats : null,

        init : function( metadata ) {
            if( !TypeUtil.isEmpty(metadata) ) {
                ig.merge( this, metadata );
            }
        }
    });
});
