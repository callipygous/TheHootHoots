ig.module(
	'game.hud.HudItem'
)
.requires(
	'impact.animation',
	'impact.impact'
)
.defines(function(){

ig.HudItem = ig.Class.extend({
	id: 0,
	settings: {},
	
	width: 0,
	height: 0,
	pos:  {x: 0, y:0},
	zIndex: 0,
	
	anims: {},
	animSheet: null,
	currentAnim: null,
	
	init: function( x, y) {
		this.pos.x = x;
		this.pos.y = y;
	},
	
	addAnim: function( name, frameTime, sequence, stop ) {
		if( !this.animSheet ) {
			throw( 'No animSheet to add the animation '+name+' to.' );
		}
		var a = new ig.Animation( this.animSheet, frameTime, sequence, stop );
		this.anims[name] = a;
		if( !this.currentAnim ) {
			this.currentAnim = a;
		}
		
		return a;
	},
	
	update: function() {	
		if( this.currentAnim ) {
			this.currentAnim.update();
		}
	},
	
	draw: function() {
		if( this.currentAnim ) {
			this.currentAnim.draw(Math.round(this.pos.x), Math.round(this.pos.y));
		}
	}
});

});