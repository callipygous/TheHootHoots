ig.module(
	'game.beat.StreakEventLogic'
)
.requires( )
.defines(function(){

ig.StreakEventLogic = ig.Class.extend({
	streak : 0,
	onStreak : false,
	nextStreakIndex : 0,
	streakLimits : [],
	
	init : function( streakLimits ) {
        this.streakLimits = streakLimits;
	},
		
	onTarget : function(beats) {
		this.streak += beats.length;

		if(this.nextStreakIndex < this.streakLimits.length && this.streak >= this.streakLimits[this.nextStreakIndex]) {
			this.nextStreak();
		}
	},
	
	offTarget : function( ) {
		this.resetStreak();
	},
	
	missed : function(beats) {
		this.resetStreak();
	},
	
	nextStreak : function() {
		this.onStreak        = true;
		this.nextStreakIndex += 1;
	},
	
	resetStreak : function() {
		this.streak          = 0;
		this.onStreak        = false;
		this.nextStreakIndex = 0;
	}
});

});