ig.module(
	'game.beat.BeatHItem'
)
.requires(
	'game.hud.HudItem',
	'game.beat.Beat'
)
.defines(function(){

ig.BeatHItem = ig.HudItem.extend({
	beat : null,

	//font: new ig.Font( 'media/04b03.font.png' ),
	animSheet: new ig.AnimationSheet( 'media/beat/beat.png', 24, 24 ),
	animNames : ['fresh', 'struck', 'missed', 'past'],

	init: function( beat ) {
		this.parent(0, 0);
		this.beat = beat;
        this.beat.addListener( this );
        for( var i = 0; i < this.animNames.length; i++ ) {
            this.addAnim(this.animNames[i], 1, [i]);
        }
		this.width = 24;
		this.height = 24;
	},

    handleBeatStatusChange : function( oldStatus, newStatus ) {
        this.setAnim( this.animNames[newStatus] );
    },
	
	draw: function() {
        this.currentAnim = this.anims[this.animNames[this.beat.status]];

		this.parent();
		//this.font.draw(this.beat.perc, this.pos.x + 20, this.pos.y + 20, ig.Font.ALIGN.CENTER );
	}
});

});