ig.module(
	'game.beat.BeatTrackLogic'
)
.requires(
	'game.lib.beat' 
)
.defines(function(){

//Terminology:
//Beat Button: The button a user uses to keep time and react to beats in the beatTrackView, 
//			  usually the space bar.
//Hotspot: The part of the beatTrack wherein if a user presses the "beat" button
//         then the beat has been "hit"
//Active Beat: The beat in or closest to the "hotspot" without passing the hotspot
//Handled Beat: A beat which has already been "hit" or "missed", see below
//Hit: When a beat is in the hotspot (and hasn't already been handled) and the user 
//     presses the "beat" button, then the beat is hit
//Missed: When a beat passes the hotspot without being hit, it is missed
//Off-Target: If the user presses the beat button and no beat is in the hotspot that
//            press is considered off-target.

/*
 * When a beat has been hit, BeatTrackLogic calls BeatStrikeLogic.onTarget
 * When a beat has been missed, BeatTrackLogic calls BeatStrikeLogic.missed
 * When a beat button press is off target, BeatTrackLogic calls BeatStrikeLogic.offTarget
 */
 ig.BeatTrackLogic = ig.Class.extend({
	beatTrack      : null,
	beatTrackView  : null,
	beatsPerTrack  : 0,
	percPerBeat    : 0,
	beatEventHandler : null,
	
	beatsAccum : 0,
	paused : false,
	
	init : function(beatTrack, beatTrackView, beatsPerTrack, beatEventHandler) {
		this.beatTrack        = beatTrack;
		this.beatTrackView    = beatTrackView;
		this.beatsPerTrack    = beatsPerTrack;
		this.percPerBeat      = 1/this.beatsPerTrack;
		this.beatEventHandler = beatEventHandler;
	},
	
	handleBeats : function(beats) {
		this.beatTrack.shiftBeats(this.percPerBeat * beats);
		
		var hsBeats = this.beatTrack.inHotSpot();
		var unhandledHsBeat = null;
		
		for(var i = 0; i < hsBeats.length && unhandledHsBeat == null; i++) {
			if(!hsBeats[i].handled) {
				unhandledHsBeat = hsBeats[i];
			}
		}
		
		if( ig.input.pressed('space') ) {
			if(unhandledHsBeat != null) {
				this.beatEventHandler.onTarget([unhandledHsBeat]);
				unhandledHsBeat.handled = true;
			}
		} else {
			this.beatEventHandler.offTarget();
		}
		unhandledHsBeat = null;

		var pastHsBeats = this.beatTrack.inDestroySpot();
		var unhandledBeats = [];
		for(var i = 0; i < pastHsBeats.length; i++) {
			if(!pastHsBeats[i].handled) {
				unhandledBeats[unhandledBeats.length] = pastHsBeats[i];
				pastHsBeats[i].handled = true;
			}
		}
		if(pastHsBeats.length > 0) {
			this.beatEventHandler.missed(unhandledBeats);
			this.beatTrack.dequeueBeats(pastHsBeats.length);
			this.beatTrackView.dequeueBeats(pastHsBeats.length);
		}
	}
});

});