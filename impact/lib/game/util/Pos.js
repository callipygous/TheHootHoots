ig.module(
    'game.util.Pos'
)
.requires(
)
.defines(function(){

    Pos = ig.Class.extend({

        x : 0,
        y : 0,

        init : function(x, y) {
            this.x = x;
            this.y = y;
        }

    });
});