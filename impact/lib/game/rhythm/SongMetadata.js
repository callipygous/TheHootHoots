ig.module( 'game.rhythm.SongMetadata' )
.requires()
.defines(function(){
    SongMetadata = ig.Class.extend({

        projectBase : null,
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
