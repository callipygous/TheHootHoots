
ig.module(
    'game.weapons.FiringLogic'
)
.requires(
    'impact.entity'
)
.defines(function () {

    FiringLogic = ig.Class.extend({
        weapon : null,

        init: function ( weapon ) {
            this.weapon = weapon;
        },

        update : function() {
            if( ig.input.pressed('fire') ) {
                var digest = ig.game.beatTrack.digest;
                if( digest.inHotSpot.length > 0 ) {
                    ig.game.beatTrackLogic.fireBeatLogic( true, digest );
                }

                var start = ig.game.player.getGlassesLocation();
                this.weapon.fire( start );
            }
        }
    });

});