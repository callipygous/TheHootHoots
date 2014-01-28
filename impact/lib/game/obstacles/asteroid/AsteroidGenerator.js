ig.module(
    'game.obstacles.asteroid.AsteroidGenerator'
)
.requires(
    'impact.entity',
    'game.obstacles.asteroid.Asteroid',
    'game.stencils.StencilSheet',
    'game.stencils.SpikedBallStencil'
)
.defines(function () {

    AsteroidGenerator = ig.Class.extend({

        asteroidImage : new ig.Image( 'media/asteroid.png' ),
        strokeColor : "#704000",

        radius    : null,
        variance  : null,
        maxRadius : null,
        stencilSheet : null,

        //Asteroids will be laid out in two rows
        //Where sheetWidth full asteroids will be laid out at the top
        //then below that Math.floor(2/3rds) of the width of the sheet
        //will be filled with half width asteroids and 1/3rd with quarter
        //width asteroids
        sheetWidth : null,

        largeAsteroids    : null,
        numLargeAsteroids : 0,

        mediumAsteroids   : null,
        numMediumAsteroids : 0,

        smallAsteroids1    : null,
        numSmallAsteroids1 : 0,

        smallAsteroids2    : null,
        numSmallAsteroids2 : 0,

        allSmall : null,
        numAllSmall : 0,

        init: function ( id, sheetWidth, numPoints, variance, radius ) {
            this.radius = radius;
            this.variance = variance;
            this.maxRadius = radius + radius * ( variance * 2 );
            this.sheetWidth = sheetWidth;

            //The image is intended to be arranged like this
            //L   L   L   L
            //M M M M M M SSSS

            this.numLargeAsteroids = sheetWidth;
            this.largeAsteroids  = this.makeAsteroidStencilInfo(
                "lAst", { x : 0, y : 0 }, { x : 2 * this.maxRadius, y : 2 * this.maxRadius },
                sheetWidth, numPoints, variance, radius
            );

            var row2Y = this.maxRadius * 2;
            var mediumBlocks = parseInt( Math.floor( sheetWidth * 0.75 ) );
            this.numMediumAsteroids = mediumBlocks * 2;
            this.mediumAsteroids = this.makeAsteroidStencilInfo(
                "mAst", { x : 0, y : row2Y }, { x : this.maxRadius, y : this.maxRadius },
                this.numMediumAsteroids, numPoints, variance, radius / 2
            );

            var smallBlockStartX = mediumBlocks * this.maxRadius * 2;
            var smallBlocks = ( sheetWidth - mediumBlocks );
            var smallWidth = this.maxRadius / 2
            this.numSmallAsteroids1 = smallBlocks * 4;
            this.smallAsteroids1 = this.makeAsteroidStencilInfo(
                "sAst", { x : smallBlockStartX, y : row2Y }, { x : smallWidth, y  :smallWidth },
                this.numSmallAsteroids1, numPoints, variance, radius / 4
            );

            this.numSmallAsteroids2 = smallBlocks * 4;
            this.smallAsteroids2 = this.makeAsteroidStencilInfo(
                "sAst2", { x : smallBlockStartX, y : parseInt( Math.floor( this.maxRadius * 2.5 )) }, { x : smallWidth, y : smallWidth },
                this.numSmallAsteroids2, numPoints, variance, radius / 4
            );

            this.allSmall = this.smallAsteroids1.concat( this.smallAsteroids2 );
            this.numAllSmall = this.numSmallAsteroids1 + this.numSmallAsteroids2;

            var stencilSheetWidth  = this.maxRadius * sheetWidth * 2;
            var stencilSheetHeight = parseInt( Math.ceil( this.maxRadius * 3 ) );
            this.stencilSheet = new StencilSheet( id, stencilSheetWidth, stencilSheetHeight,
                this.largeAsteroids.concat(
                    this.mediumAsteroids.concat(
                        this.smallAsteroids1.concat(
                            this.smallAsteroids2
                        )
                    )
                )
            );
        },

        //need to fold small asteroids
        makeAsteroidStencilInfo : function( idPrefix, pos, size, numAsteroids, numPoints, variance, radius ) {
            var storage = [];
            var asteroidImage = this.asteroidImage;
            var strokeColor = this.strokeColor;

            for( var i = 0; i < numAsteroids; i++ ) {

                var nameToStencilInfo = {
                    name : idPrefix + "_" + 1,
                    pos  : { x : pos.x + ( i * size.x ), y : pos.y },
                    refreshRate : 300,
                    size : size,

                    factoryMethod : function() {
                        var original = this.pos;
                        var modifiedPos = { x : original.x + size.x / 2, y : original.y + size.y / 2 };
                        return new SpikedBallStencil( modifiedPos, size.x,
                            numPoints, variance, radius, 1, asteroidImage, strokeColor );
                    }
                }

                storage[i] = nameToStencilInfo;
            }

            return storage;
        },

        update : function() {
            this.stencilSheet.update();
        },

        pickLarge : function() {
            return MathUtil.chooseOne( this.largeAsteroids );
        },

        pickMedium : function() {
            return MathUtil.chooseOne( this.mediumAsteroids );
        },

        pickSmall : function() {
            return MathUtil.chooseOne( this.allSmall );
        },

        /**
         * Start and end must be of the type { wall : ScreenSide INT, pos : INT } where pos is the distance down the wall
         * @param start
         * @param end
         */
        generate : function( asteroidDef, size ) {
            var stencilSheet = this.stencilSheet;
            var stencilInfo = null;
            if( size == 'large' ) {
                stencilInfo = this.pickLarge();
                asteroidDef.health = 100;

            } else if( size == 'medium' ) {
                stencilInfo = this.pickMedium();
                asteroidDef.health = 50;

            } else if( size == 'small' ) {
                stencilInfo = this.pickSmall();
                asteroidDef.health = 25;
            }

            asteroidDef.stencil = stencilInfo.currentStencil;
            asteroidDef.src = stencilInfo.pos;
            asteroidDef.size = stencilInfo.size;
            asteroidDef.imageSize = stencilInfo.size;
            asteroidDef.stencilImage = this.stencilSheet.scratch;
            asteroidDef.imgOffset = stencilInfo.pos;
            asteroidDef.radius = this.radius /*- this.radius * this.variance*/;

            stencilSheet.addReference( stencilInfo.id );
            asteroidDef.deathCallback = function() {
                stencilSheet.removeReference( stencilInfo.id );
            };

            return ig.game.spawnEntity( "EntityAsteroid", asteroidDef.start.x, asteroidDef.start.y, asteroidDef );
        },

        offsetMagnitude : function( sizeType ) {
            var magnitude = null;
            if( sizeType == 'large' ) {
                return this.maxRadius;
            } else if( sizeType == 'medium' ) {
                return parseInt( Math.floor( this.maxRadius / 2 ) );
            } else if( sizeType == 'small' ) {
                return parseInt( Math.floor( this.maxRadius / 4 ) );
            }

            if( magnitude == null ) {
                throw "Unrecognized sizeType( " + sizeType + " ) ";
            }
        },

        dispose : function() {
            this.scratchImage.dispose();
            this.scratchImage = null;
        },

        //For debug purposes only
        debugDraw : function( pos ) {
            this.stencilSheet.debugDraw( pos );
        }
    });

});