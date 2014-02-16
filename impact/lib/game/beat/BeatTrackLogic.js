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
 BeatTrackLogic = ig.Class.extend({
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
		this.beatTrack.addTime( this.percPerBeat * elapsedBeat.elapsedBeats );
        var digest = this.beatTrack.digest;
        this.handleStruckBeats( digest );
        this.handleMissedBeats( digest );
	},

    /**
     * If the user has pressed the "strike" key:
     *     If there is one or more beats in the hotspot,
     *         Take the oldest beat in the hotspot and report it as onTarget, i.e. "struck"
     *     Else, If there are no beats in the hotspot,
     *         report an off target hit
     */
     handleStruckBeats : function( digest ) {
        this.fireBeatLogic( ig.input.pressed('beat'), digest );
     },

     fireBeatLogic : function( pressed, digest ) {
         var hsBeats = digest.inHotSpot;
         var unhandledHsBeat = null;
         var missedHsBeat = null;

         for(var i = 0; i < hsBeats.length && unhandledHsBeat == null; i++) {
             if( !hsBeats[i].handled ) {
                 unhandledHsBeat = hsBeats[i];
             }

             //We don't want to punish people twice for mashing down on a fumbled beat
             if( hsBeats[i].status == BeatStatus.MISSED ) {
                 missedHsBeat = hsBeats[i];
             }
         }

         if( pressed ) {
             if(unhandledHsBeat != null) {
                 this.beatEventHandler.onTarget([unhandledHsBeat]);
                 unhandledHsBeat.handled = true;
             } else {
                 if( missedHsBeat == null ) {
                     this.beatEventHandler.offTarget();
                     this.handleFumbledBeats( digest );
                 }
             }
         }
         unhandledHsBeat = null;
     },

     /**
      * When the spacebar is pressed and a beat is close to, but not in, the hotspot
      * it may be in the fumble spot.  If no beat is in the hot spot when the spacebar
      * is pressed then ALL beats in the fumble zone are considered missed.
      */
     handleFumbledBeats : function( digest ) {
         this.beatEventHandler.fumbledBeats( digest.inFumbleSpot );
     },

     /**
      * For each "unhandled" (i.e. non-struck ) beat in the destroy spot
      *     report it as missed
      * For ALL beats in the destroy
      *     remove it from the beatTrack/beatTrackView
      */
     handleMissedBeats : function( digest ) {
         var pastHsBeats = digest.pastHotSpot;
         var unhandledBeats = [];

         for(var i = 0; i < pastHsBeats.length; i++) {
             if(!pastHsBeats[i].handled) {
                 unhandledBeats[unhandledBeats.length] = pastHsBeats[i];
                 pastHsBeats[i].handled = true;
             }
         }

         if(unhandledBeats.length > 0) {
             this.beatEventHandler.missed(unhandledBeats);
         }
     }
});

});