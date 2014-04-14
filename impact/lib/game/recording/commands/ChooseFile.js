ig.module( 'game.recording.commands.ChooseFile' )
.requires( 'game.recording.commands.RecorderCommand' )
.defines(function(){
    ChooseFile = ig.Class.extend({

        undoable : true,
        redoable : true,

        newFile : null,
        previousFile : null,
        songMetadata : null,
        fileField : null,

        init : function( previousFile, newFile, songMetadata, fileField ) {
            this.previousFile = previousFile;
            this.newFile      = newFile;
            this.songMetadata = songMetadata;
            this.fileField = fileField;
        },

        doCommand : function( ) {
            this.songMetadata.file = this.newFile;
            this.fileField.val( this.newFile );
        },

        undoCommand : function( ) {
            this.songMetadata.file = this.previousFile;
            this.fileField.val( this.previousFile );
        }
    });
});
