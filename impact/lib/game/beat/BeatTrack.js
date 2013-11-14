ig.module(
    'game.beat.BeatTrack'
)
.requires(
)
.defines(function(){

    ig.BeatTrack = ig.Class.extend({
        beats : [],	//a list of percentages {id : int, perc : double}
        hotSpot     : {start : -1.0, end : -1.0},
        destroySpot : {start : -1.0, end : -1.0},

        enqueueBeat : function(beat) {
            beat.perc = 0;
            this.beats[this.beats.length] = beat;
        },

        dequeueBeat  : function() {
            this.beats.splice(0, 1);
        },

        dequeueBeats : function(beats) {
            this.beats.splice(0, beats);
        },

        dequeueGT : function(limit) {
            var i = 0;
            while(this.beats[i++] > limit);
            return this.beats.splice(0, i);
        },

        dequeueGTE : function(limit) {
            var i = 0;
            while(this.beats[i++] >= limit);
            return this.beats.splice(0, i);
        },

        shiftBeats : function(perc) {
            for(var i = 0; i < this.beats.length; i++) {
                this.beats[i].perc += perc;
            }
        },

        //perhaps handle inHotSpot and pastHotSpot in one pass
        inHotSpot : function(){
            var hs = this.hotSpot;
            var outBeats = [];
            for(var i = 0; i < this.beats.length && this.beats[i].perc <= hs.end; i++) {
                if(this.beats[i].perc >= hs.start) {
                    outBeats[outBeats.length] = this.beats[i];
                }
            }

            return outBeats;
        },

        inDestroySpot : function() {
            var ds = this.destroySpot;
            var outBeats = [];
            for(var i = 0; i < this.beats.length && this.beats[i].perc <= ds.end; i++) {
                if(this.beats[i].perc >= ds.start) {
                    outBeats[outBeats.length] = this.beats[i];
                }
            }

            return outBeats;
        },

        init: function(hsStart , hsEnd, dsStart, dsEnd) {
            this.hotSpot.start = hsStart;
            this.hotSpot.end   = hsEnd;
            this.destroySpot.start = dsStart;
            this.destroySpot.end   = dsEnd;
        }
    });

});