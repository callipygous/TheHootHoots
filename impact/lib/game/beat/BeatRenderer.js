ig.module(
    'game.beat.BeatRenderer'
)
.requires(
    'game.hud.HudItem',
    'game.beat.Beat'
)
.defines(function(){

    BeatRenderer = ig.HudItem.extend({

        //font: new ig.Font( 'media/04b03.font.png' ),
        animSheet: new ig.AnimationSheet( 'media/beat/galaxy_beats.png', 96, 96 ),
        animNames : ['fresh', 'struck', 'missed', 'past'],

        width  : 96,
        height : 96,

        init: function( ) {
            for( var i = 0; i < this.animNames.length; i++ ) {
                this.addAnim( this.animNames[i], 1, [i] );
            }
        },

        draw: function( beat, pos ) {
            this.currentAnim = this.anims[this.animNames[beat.status]];
            this.pos = pos;

            this.parent();
        },

        debugDraw : function( beat, pos ) {
            //draw info
        }
    });

});