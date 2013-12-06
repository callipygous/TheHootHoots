/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 12/6/13
 * Time: 12:12 AM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.obstacles.AutoAsteroidGenerator'
)
.requires(
    'game.obstacles.Asteroid',
    'game.obstacles.AsteroidGenerator'
)
.defines(function () {

    AutoAsteroidGenerator = AsteroidGenerator.extend({

        //To make this a useful game mode we should probably make this more nuanced
        //but this is fine for testing
        frequency : null,
        baseSize : null,
        sizeVariance : null,
        baseSpeed : null,
        speedVariance : null,
        timer : null,
        lastGenerated : 0,

        notTops : null,
        notRights : null,
        notBottoms : null,
        notLefts : null,

        init: function ( frequency, baseSize, sizeVariance, baseSpeed, speedVariance ) {
            this.frequency = frequency;
            this.baseSize  = baseSize;
            this.sizeVariance = sizeVariance;
            this.baseSpeed = baseSpeed;
            this.speedVariance = speedVariance;

            this.notTops    = this.populateNots( ScreenSides.TOP );
            this.notBottoms = this.populateNots( ScreenSides.BOTTOM );
            this.notRights  = this.populateNots( ScreenSides.RIGHT );
            this.notLefts   = this.populateNots( ScreenSides.LEFT );

            this.timer = new ig.Timer();
        },

        update : function() {
            var delta = this.timer.delta();


            if( this.frequency <= ( delta - this.lastGenerated ) ) {
                this.lastGenerated = delta;

                var startWall = MathUtil.chooseOne( ScreenSides.values );
                var start = this.choosePositionOnWall( startWall );

                var endWall = this.chooseOtherWall( startWall );
                var end   = this.choosePositionOnWall( endWall );

                while( MathUtil.distanceTo( start, end ) < ( 0.5 * ig.system.height ) ) {
                    endWall = this.chooseOtherWall( startWall );
                    end     = this.choosePositionOnWall( endWall );
                }

                var radius = MathUtil.rollVariation( this.baseSize, this.sizeVariance );
                var speed = MathUtil.rollVariation( this.baseSpeed, this.speedVariance );

                this.generate({
                    speed : speed, start : start, end : end, radius : radius,
                    delay  : 5,  variance : 0.5, numPoints : 40, img : this.asteroidImage, strokeColor : '#704000'
                });

            }
        },

        choosePositionOnWall : function( wall ) {
            var pos = 0;
            if( wall == ScreenSides.TOP ) {
                pos = { x : Math.floor( Math.random() * ig.system.width ), y : 0 };
            } else if( wall == ScreenSides.RIGHT ) {
                pos = { x : ig.system.width, y :  Math.floor( Math.random() * ig.system.height ) };
            } else if( wall == ScreenSides.BOTTOM ) {
                pos = { x : Math.floor( Math.random() * ig.system.width ), y : ig.system.height };
            } else {
                pos = { x : 0, y : Math.floor( Math.random() * ig.system.height )  };
            }

            return pos;
        },

        populateNots : function( wall ) {
            var walls = [];
            for( var i = 0; i < ScreenSides.values.length; i++ ) {
                if( ScreenSides.values[i] != wall ) {
                    walls += i;
                }
            }
            return walls;
        },

        chooseOtherWall : function( wall ) {
            var values = null;
            if( wall == ScreenSides.TOP ) {
                values = this.notTops;
            } else if( wall == ScreenSides.RIGHT ) {
                values = this.notRights;
            } else if( wall == ScreenSides.BOTTOM ) {
                values = this.notBottoms;
            } else {
                values = this.notLefts;
            }

            if( TypeUtil.isEmpty( values ) ) {
                console.log("WALL " + wall );
            }

            return MathUtil.chooseOne( values );
        }
});

});