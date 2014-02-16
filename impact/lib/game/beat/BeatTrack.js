ig.module(
    'game.beat.BeatTrack'
)
.requires(
)
.defines(function(){
    //Previous iterations of this class were much more decoupled and cohesive but
    //it led to a number of issues, such as fast forwarding/reversing etc for the
    //recorder
    BeatTrack = ig.Class.extend({
        //The set of beats on this BeatTrack, ordered by time
        beats : [],

        //The earliest beat currently within the active part of this BeatTrack
        //This index usually corresponds to the lowest beat on the track
        earlyIndex : 0,

        //One PAST the latest beat currently within the active part of this BeatTrack
        //This index usually corresponds to the highest beat on the track
        lateIndex  : 0,

        //The amount of time that the active part of the BeatTrack represents
        timespan     : null,

        //The earliest time that should be considered on the active BeatTrack
        // this.beats[earlyIndex].time >= this.activeTime.start
        // this.activeTime.end - this.activeTime.start = timespan
        // this.beats[lateIndex].time <= this.activeTime.end
        activeTime : { start : null, end : null },

        //The time in the center of the hotspot, what should be the currentTime of the music
        currentTime : null,

        //the current time ranges of the hotspot
        hotSpot     : { start : null, end : null, offset : null, width : null },
        fumbleSpot  : { start : null, end : null, width : null },

        //current summary of what beats are in the fumbleSpot, hotSpot, or past the hotSpot
        digest : null,

        init: function(currentTime, hotSpotOffset, hotSpotWidth, fumbleWidth, timespan, beats) {
            this.hotSpot.offset    = hotSpotOffset;
            this.hotSpot.width     = hotSpotWidth;
            this.fumbleSpot.width  = fumbleWidth;
            this.timespan          = timespan;
            this.setTime( currentTime );

            this.beats = beats;
        },

        setTime : function( time ) {
            this.currentTime    = time;
            this.hotSpot.start  = this.currentTime - ( this.hotSpot.width / 2 );
            this.hotSpot.end    = this.hotSpot.start + this.hotSpot.width;

            this.fumbleSpot.start = this.hotSpot.end;
            this.fumbleSpot.end   = this.hotSpot.end + this.fumbleSpot.width;

            this.activeTime.start = this.currentTime - (this.timespan - this.hotSpot.offset);
            this.activeTime.end   = this.activeTime.start + this.timespan;
            this.findActiveIndices();
        },

        addTime : function( time ) {
            this.currentTime += time;
            this.hotSpot.start += time;
            this.hotSpot.end   += time;
            this.fumbleSpot.start += time;
            this.fumbleSpot.end   += time;
            this.activeTime.start += time;
            this.activeTime.end   += time;
            this.findActiveIndices();
        },

        findActiveIndices : function( ) {
            if( this.beats.length == 0 ) {
                this.earlyIndex = 0;
                this.lateIndex  = 0;
            } else {

                while( this.earlyIndex < this.beats.length &&
                       this.beats[this.earlyIndex].time <= this.activeTime.start ) {
                    this.earlyIndex++;
                }

                if( this.earlyIndex > 0 ) {
                    this.earlyIndex--; //we always over shoot by 1
                }

                while( this.lateIndex < this.beats.length &&
                       this.beats[this.lateIndex].time <= this.activeTime.end ) {
                    this.lateIndex++;
                }
            }

            this.calculateDigest();
        },

        calculateDigest : function() {
            var inFumbleSpot = [];
            var inHotSpot    = [];
            var pastHotSpot  = [];

            for( var i = this.earlyIndex; i < this.lateIndex && i < this.beats.length; i++ ) {
                var time = this.beats[i].time;
                if( time < this.hotSpot.start ) {
                    pastHotSpot.push( this.beats[i] );
                } else if( time <= this.hotSpot.end ) {
                    inHotSpot.push( this.beats[i] );
                } else if( time <= this.fumbleSpot.end ) {
                    inFumbleSpot.push( this.beats[i] );
                } else {
                    break;
                }
            }

            this.digest = {
                inFumbleSpot : inFumbleSpot,
                inHotSpot    : inHotSpot,
                pastHotSpot  : pastHotSpot
            };
        }
    });

});