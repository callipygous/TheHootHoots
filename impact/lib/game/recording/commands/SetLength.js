ig.module( 'game.recording.commands.SetLength' )
.requires( 'game.recording.commands.RecorderCommand' )
.defines(function(){
    SetLength = ig.Class.extend({

        undoable : true,
        redoable : true,

        prevLength : null,
        newLength : null,

        songMetadata : null,

        lengthField : null,
        playSlider : null,

        init : function( prevLength, newLength, songMetaData, lengthField, playSlider ) {
            this.prevLength = prevLength;
            this.newLength  = newLength;

            this.songMetadata = songMetaData;

            this.lengthField = lengthField;
            this.playSlider  = playSlider;
        },

        doCommand : function( ) {
            this.songMetadata.length = this.newLength;
            this.lengthField.val( TimeUtil.formatTime( this.newLength, false ) );
            this.playSlider.slider( "option", "max", this.newLength );
        },

        undoCommand : function( ) {
            this.songMetadata.length = this.prevLength;
            this.lengthField.val( TimeUtil.formatTime( this.prevLength, false ) );
            this.playSlider.slider( "option", "max", this.prevLength );
        }
    });
});
