ig.module(
	'game.beat.StreakEventLogic'
)
.requires('game.beat.BeatStrikeLogic')
.defines(function(){

ig.StreakEventLogic = ig.Class.extend({
	levelStats : null,
	streak : 0,
	onStreak : false,
	nextStreakIndex : 0,
	streakLimits : [],
	spiritAdded : 1,
	
	init : function(levelStats) {
		this.levelStats = levelStats;
	},
		
	onTarget : function(beats) {
		this.streak += beats.length;
		if(this.nextStreakIndex < this.streakLimits.length && this.streak > this.streakLimits[this.nextStreakIndex]) {
			this.nextStreak();
		}
		
		if(this.onStreak) {
			this.levelStats.spirit += this.spiritAdded;
		}
	},
	
	offTarget : function() {
		this.resetStreak();
	},
	
	missed : function(beats) {
		this.resetStreak();
	},
	
	nextStreak : function() {
		this.onStreak        = true;
		this.spiritAdded     += 1;
		this.nextStreakIndex += 1;
	},
	
	resetStreak : function() {
		this.streak          = 0;
		this.onStreak        = false;
		this.spiritAdded     = 1;
		this.nextStreakIndex = 0;
	}
});

});