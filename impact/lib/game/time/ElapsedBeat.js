ig.module(
    'game.time.ElapsedBeat'
)
.requires(
)
.defines(function(){

    ig.ElapsedBeat = ig.Class.extend({
        elapsedBeats : null,
        elapsedTime  : null,

        init : function(elapsedBeats, elapsedTime) {
            this.elapsedBeats = elapsedBeats;
            this.elapsedTime  = elapsedTime;
        }
    });

});