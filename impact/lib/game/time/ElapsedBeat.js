ig.module(
    'game.time.ElapsedBeat'
)
.requires(
)
.defines(function(){

    ig.ElapsedBeat = ig.Class.extend({
        elapsedBeats : null,
        elapsedTime  : null,

        init : function(elapsedTime, elapsedBeats ) {
            this.elapsedTime  = elapsedTime;
            this.elapsedBeats = elapsedBeats;
        }
    });

});