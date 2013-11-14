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
	
	init: function( beat ) {
		this.parent(0, 0);
		this.beat = beat;
		this.addAnim( 'idle',   1, [0] );
		this.width = 24;
		this.height = 24;
	},
	
	draw: function() {
		this.parent();
		//this.font.draw(this.beat.perc, this.pos.x + 20, this.pos.y + 20, ig.Font.ALIGN.CENTER );
	}
});

});