ig.module(
    'game.recording.commands.SetTextField'
).requires(
)
.defines(function () {

    //Note: All commands are expected to add themselves to the history if necessary
    //in order to allow them to concatenate with the previous event if they wish
    SetTextField = ig.Class.extend({

        //When a field is being edited, a SetTextField command will be active as long as
        //the focus has not moved from the field AND less than maxEditTime has passed
        maxEditTime : 10000,

        kind : 'SetTextField',

        //JQuery wrapped text input
        textField : null,

        //The undo or command history
        history   : null,

        //When true, no new SetTextField events can be concatenated with thsi one
        capped : false,

        //The text value of this field prior to this given edit
        previousValue : null,

        //The time in milliseconds since the unix epoch when this text field  action was last updated.
        //This is either from it's creation or a call to addLatestChange which concatenates the latest
        //change with the current one
        lastEdited : null,

        init: function ( id, history, pressed ) {
            var handled = tryToAddToPreviousEvent(id, history, pressed);
            if( !handled ) {
                this.textField = $('#' + id);
                this.history = history;
                this.capped = false;
                this.previousValue = this.textField.value;
                this.lastEdited = this.timeInMillis();
                this.history.push( this );
            }
        },

        timeInMillis : function() {
            return (new Date()).now();
        },

        tryToAddToPreviousEvent : function( id, history, pressed ) {
            var added = false;
            if( pressed && commands.length > 0 ) {
                var previousEvent = history.commands[0];
                if( previousEvent.kind == "SetTextField" && previousEvent.id == id && !previousEvent.capped ) {
                    if( this.timeInMillis() - previousEvent.lastEdited < this.maxEditTime ) {
                        previousEvent.addLatestChange();
                        added = true;
                    } else {
                        previousEvent.cap();
                    }
                }
            }

            return added;
        },

        cap : function() {

        },

        undo : function() {

        },

        redo : function() {

        }
    });
});