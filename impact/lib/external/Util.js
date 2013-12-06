/**
 * Utils that should be succinct and may be used often
 */
var Sk = {
    assert : function(condition, message) {
        if(TypeUtil.isEmpty(condition) || !condition) {
            throw message;
        }
    }
}

var StringUtil = {
    paren : function(str) {
        return "( " + str + " )";
    },

    undefinedToEmpty : function(str) {
        if( TypeUtil.isDefined( str ) ) {
            return str;
        } else {
            return "";
        }
    }
}

var TypeUtil = {
    isDefined : function(value) {
        return typeof value != 'undefined';
    },

    hasProp : function(value, prop) {
        return this.isDefined(value[prop]);
    },

    isEmpty : function(value) {
        return !this.isDefined(value) || value == null;
    },

    make2DArray : function(rows, columns, defaultValue) {
        var arr = Array(rows);
        for(var i = 0; i < rows.length; i++) {
            arr[i] = Array(columns);
            for(var j = 0; j < columns.length; j++) {
                arr[i][j] = defaultValue;
            }
        }

        return arr;
    }
};

var MathUtil = {
    rollVariation : function(value, variance) {
        var maxVariance = value * variance;
        return value + ( maxVariance * 2 * Math.random() ) - maxVariance;
    },

    rollAgainstChance : function(chance) {
        return Math.random() <= chance;
    },

    /**
     * Return a value that is in between max and min.  If the value
     * is outside of max and min, return max or min depending on if the
     * value is less or greater than min/max
     * @param value The value to limit
     * @param min The minimum value that can be returned
     * @param max The maximum value that can be returned
     */
    bound : function(value, min, max) {
        var bound = value;
        if(value < min) {
            bound = min;
        } else if(value > max) {
            bound = max;
        }

        return bound;
    },

    isBoundedBy : function(toTest, lowerBound, upperBound) {
        return toTest.x >= lowerBound.x && toTest.y >= lowerBound.y &&
               toTest.x <= upperBound.x && toTest.y <= upperBound.y;
    },

    /**
     * Compute a normalized vector between two points.
     * @param start
     * @param end
     * @returns {{x: number, y: number}}
     */
    normalizedVectorBetween : function(start, end) {
        var xd = end.pos.x - start.pos.x;
        var yd = end.pos.y - start.pos.y;
        var dist = Math.sqrt( xd*xd + yd*yd ); //same as distance up to here
        return {x : xd / dist, y : yd / dist};
    },

    scaleVector : function(magnitude, vector) {
        return {
            x: magnitude * vector.x,
            y: magnitude * vector.y
        };
    },

    scaleVectorInPlace : function(magnitude, vector) {
        vector.x = vector.x * magnitude;
        vector.y = vector.y * magnitude;
    },

    //equation of an ellipse (x / a)^2 + (y / b)^ 2 = 1
    //this is an approximation
    circumferenceOfEllipse : function( a, b ) {
        var h = Math.pow( ( a - b ), 2 ) / Math.pow( ( a + b ), 2 );
        var h2 = h * h;
        var h3 = h2 * h;
        return Math.PI * ( a + b ) * ( 1 + 0.25 * h + 0.015625 * h2 * 0.00390625 * h3 );
    },

    quadrant : function( point, origin ) {
        var quadrant = 1;
        if( point.x < origin.x ) {
            if( point.y > origin.y ) {
                quadrant = 2;
            } else {
                quadrant = 3;
            }
        } else if( point.y < origin.y ) {
            quadrant = 4;
        }
        return quadrant;
    },

    distanceTo: function( start, end ) {
        var xd = start.x - end.x;
        var yd = start.y - end.y;
        return Math.sqrt( xd*xd + yd*yd );
    },

    angleTo: function( start, end ) {
        return Math.atan2( end.y  - start.y, end.x - start.x );
    },

    vectorTo: function( start, end ) {
        var xd = end.x - start.x;
        var yd = end.y - start.y;
        var dist = Math.sqrt( xd*xd + yd*yd ); //same as distance up to here
        return {x : xd / dist, y : yd / dist};
    },

    normalize : function( vector ) {
        var magnitude = Math.sqrt( vector.x * vector.x + vector.y + vector.y );
        vector.x /= magnitude;
        vector.y /= magnitude;
    },

    translateInPlace : function( point, transX, transY ) {
        point.x += transX;
        point.y += transY;
    },

    translate : function( point, transX, transY ) {
        var newPoint = { x : point.x, y : point.y };
        this.translateInPlace( newPoint, transX, transY );
        return newPoint;
    },

    chooseOne : function( values ) {
        return values[Math.floor( Math.random() * values.length )];
    }
};

var CombatUtil = {

    computeDamage : function(attack, defense) {

    },

    /**
     * Util to determine which entities are within range of a given tower.
     *
     * @param type      The type being detected
     * @param tower     The tower entity
     * @returns {Array} The array of entities within range of the tower
     */
    getEntitiesInRange: function(type,tower) {

        var arrTestEntities = [];
        var arrEntitiesInRange = [];

        arrTestEntities = ig.game.getEntitiesByType(type);

        if(arrTestEntities.length != 0){
            for(var i=0;i<arrTestEntities.length;i++){
                var testObject = arrTestEntities[i];
                if(testObject != undefined && testObject != null){
                    if(tower.distanceTo(testObject) <= tower.range){
                        arrEntitiesInRange.push(testObject);
                    }
                }
            }
        }
        return arrEntitiesInRange;
    },

    /**
     * Util to determine which entities of a given type are closest to the object.
     *
     * @param type      The type being detected
     * @param tower     The affected entity
     * @returns {Entity} The closest entity to the object
     */
    getClosestEntity: function(type,myObject) {

        var arrTestEntities = [];
        var closestEntity = null;

        arrTestEntities = ig.game.getEntitiesByType(type);
        //console.log("total: " + arrTestEntities.length);
        if(arrTestEntities.length != 0){
            for(var i=0;i<arrTestEntities.length;i++){
                var testObject = arrTestEntities[i];
                //console.log("testing: " + i);
                if(testObject != undefined && testObject != null){
                    if(closestEntity != null){
                       if(myObject.distanceTo(testObject) <= myObject.distanceTo(closestEntity)){
                            closestEntity = testObject;
                        }
                    }
                    else{
                        closestEntity = testObject;
                    }
                }
            }
        }
        return closestEntity;
    }
};

var BeatStatus = {
    FRESH  : 0,
    STRUCK : 1,
    MISSED : 2,
    PAST   : 3
};

var SongUtil = {
    savedSongToBeats : function( song ) {
        var bpm   = song.bpm;
        var beats = song.beats;
        var outBeats = [];
        var elapsedBeats = 0;

        for( var i = 0; i < beats.length; i++ ) {
            elapsedBeats += beats[i];
            outBeats[i] = elapsedBeats;
        }

        return { "bpm" : bpm, "beats" : outBeats };
    }
};

var TimeUtil = {

    formatTime : function( timeInSeconds ) {
        //Recorder will be set by recorder main
        var secondsInAMinute = 60;
        var secondsInAnHour  = 60 * secondsInAMinute;
        var secondsInADay    = 24 * secondsInAnHour;

        var timeLeft = timeInSeconds;

        var hours   = Math.floor( timeLeft / secondsInAnHour );
        timeLeft -= hours * secondsInAnHour;

        var minutes = Math.floor( timeLeft / secondsInAMinute );
        timeLeft -= minutes * secondsInAMinute;

        var seconds = Math.floor( timeLeft );
        timeLeft -= seconds;

        var time = TimeUtil.twoDigits( minutes ) + ":" + TimeUtil.twoDigits( seconds ) +
                   ":" + timeLeft.toString().substring(2,4);
        return time;
    },

    twoDigits : function( number ) {
        var str = number.toString();
        if( str.length < 2 ) {
            str = "0" + str;
        }
        return str;
    }
};

var ScreenSides = {
  TOP    : 0,
  RIGHT  : 1,
  BOTTOM : 2,
  LEFT   : 3
};

ScreenSides.values = [ScreenSides.TOP, ScreenSides.RIGHT, ScreenSides.BOTTOM, ScreenSides.LEFT];
