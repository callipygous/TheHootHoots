ig.module( 'game.recording.commands.RecorderCommand' )
.requires()
.defines(function(){
    RecorderCommand = ig.Class.extend({

        undoable : true,
        redoable : true,

        init : function( ) {
        },

        doCommand : function( ) {
        },

        undoCommand : function( ) {
        }
    });
});
