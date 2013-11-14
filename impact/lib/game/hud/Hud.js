ig.module(
	'game.hud.Hud'
)
.requires(
)
.defines(function(){

ig.Hud = ig.Class.extend({
	
	itemNames : [],
	items : [],
	zIndex: 10000000,
	
	init: function() {
	},
	
	draw: function( ) {
		for( var i = 0; i < this.itemNames.length; i++ ) {
			this.items[this.itemNames[i]].draw();
		}
	},
	
	addItem : function( name, item ) {
		this.itemNames[this.itemNames.length] = name;
		this.items[name] = item;
	},
	
	removeItem : function( name ) {
		var i = 0;
		while(i < this.itemNames.length && this.itemNames[i] != name);
		
		if(this.itemNames[i] != name)
			return null;
		
		this.itemNames.splice(i, 1);
		return this.items.splice(i, 1);
	}
});

});