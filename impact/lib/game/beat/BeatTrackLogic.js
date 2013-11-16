ig.module(
	'game.beat.BeatTrackLogic'
)
.requires(
	'game.beat.Beat'
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
 * When a beat has been hit, BeatTrackLogic calls BeatEventLogic.onTarget
 * When a beat has been missed, BeatTrackLogic calls BeatEventLogic.missed
 * When a beat button press is off target, BeatTrackLogic calls BeatEventLogic.offTarget
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
	
	handleBeats : function( elapsedBeat ) {
		this.beatTrack.shiftBeats(this.percPerBeat * elapsedBeat.elapsedBeats);
        this.handleStruckBeats();
        this.handleMissedBeats();
	},

    /**
     * If the user has pressed the "strike" key:
     *     If there is one or more beats in the hotspot,
     *         Take the oldest beat in the hotspot and report it as onTarget, i.e. "struck"
     *     Else, If there are no beats in the hotspot,
     *         report an off target hit
     */
    handleStruckBeats : function() {
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
    },

     /**
      * For each "unhandled" (i.e. non-struck ) beat in the destroy spot
      *     report it as missed
      * For ALL beats in the destroy
      *     remove it from the beatTrack/beatTrackView
      */
     handleMissedBeats : function() {
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