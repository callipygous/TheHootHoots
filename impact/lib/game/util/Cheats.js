ig.module(
    'game.util.Cheats'
)
.requires(

)
.defines(function(){

    Cheats = ig.Class.extend({

        init : function(  ) {

        },

        update : function() {

            if ( ig.input.pressed('god') ) {
                ig.game.powerStats.power = ig.game.powerStats.maxPower;
            }

            if ( ig.input.pressed('oneUp') ) {
                ig.game.oneUpStats.level = ig.game.oneUpStats.max;
            }


        }
    });

    addCheats = function() {
        ig.input.bind( ig.KEY.G, 'god' );
        ig.input.bind( ig.KEY.O, 'oneUp' );
    }
});