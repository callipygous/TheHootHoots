ig.module(
    'game.stencils.StarfieldStencil'
)
.requires(
    'game.util.BinaryHeap',
    'game.util.Pos',
    'game.stencils.PointStarStencil'
)
.defines(function () {

    StarInfo = ig.Class.extend({
        //A pass is made first to locate stars in the field
        //then we calculate gravity form the original positions of the
        //stars.  The new positions of the stars is then
        originalPos : { x : 0, y : 0},

        //the original noise value determined via the Simplex noise function
        noiseValue : 0,

        pos : { x : 0, y : 0 },
        brightness : 0.25,
        mass : 1,

        init : function( pos, noiseValue, brightness, mass ) {
            this.pos = pos;
            this.originalPos.x = pos.x;
            this.originalPos.y = pos.y;

            this.noiseValue = noiseValue;
            this.brightness = brightness;
            this.mass = mass;
        }
    });

    StarfieldStencil = ig.Class.extend({

        pos  : new Pos( 0, 0 ),
        size : new Pos (0, 0 ),

        noiseGenerator : null,
        gridSize : 10,
        density : 0.5,
        densityVariability : 0,

        stars : [],
        numCols : 0,
        numRows : 0,

        stencil : new PointStarStencil( { x : 0, y : 0}, 1, 1, null),

        //TODO: Instead make it possibly a point, line, or curve
        centersOfMass : [],

        init : function( pos, size, gridSize, density, noiseGenerator ) {
            this.pos  = pos;
            this.size = size;
            this.gridSize = gridSize;
            this.density = density;
            this.noiseGenerator = noiseGenerator;

            this.numCols = this.size.x / gridSize;
            this.numRows = this.size.y / gridSize;

            this.stars = [];

            for(var i = 0; i < 3; i++ ) {
                this.centersOfMass[i] = new Pos( this.size.x * Math.random(),
                                                 this.size.y * Math.random());
            }

            this.createStars();
        },



        createStars : function() {
            var gravStars = [];
            var gridSize = this.gridSize;

            for( var gridCellX = 0; gridCellX < this.numCols; gridCellX++ ) {
                for( var gridCellY = 0; gridCellY < this.numRows; gridCellY++ ) {
                    var gridStart = { x : gridSize * gridCellX,   y : gridSize * gridCellY   };
                    var gridEnd   = { x : gridStart.x + gridSize, y : gridStart.y + gridSize };
                    for( var x = gridStart.x; x < gridEnd.x; x++ ) {
                        for( var y = gridStart.y; y < gridEnd.y; y++ ) {
                            var pos = new Pos( x, y );
                            var noise = ( 1 + this.noiseGenerator.noise( x, y ) ) / 2; //noise is between -1,1, normalize
                            var brightness = noise * noise;
                            var mass = Math.random() * 1;
                            mass = mass * mass;

                            if( MathUtil.rollAgainstChance(noise * this.density)) {
                                var starInfo = new StarInfo( pos, noise, brightness, mass );
                                if( MathUtil.rollAgainstChance(0.5)) {
                                    this.stars.push( starInfo  );
                                } else {
                                    gravStars.push( starInfo )
                                }
                            }
                        }
                    }
                }
            }

            //Apply gravity
            console.log( this.stars.length );
            var scaleXAvg = 0;
            var scaleYAvg = 0;
            for( var i = 0; i < gravStars.length; i++ ) {
                var currentStar = gravStars[i];
                for( var j = i +1; j < gravStars.length; j++ ) {
                    var otherStar = gravStars[j];
                    var vector = MathUtil.vectorTo( currentStar.originalPos, otherStar.originalPos );
                    if( i % 500 == 0 && j % 500 == 0 ) {
                        console.log( "VC: " + vector.x + ", " + vector.y );
                    }

                    var scaleX = ( vector.x == 0 ) ? 0 : 1000000 * PhysicsUtil.standardForceOfGravity( currentStar.mass, otherStar.mass, vector.x );
                    var scaleY = ( vector.y == 0 ) ? 0 : 1000000 * PhysicsUtil.standardForceOfGravity( currentStar.mass, otherStar.mass, vector.y );

                    scaleXAvg += scaleX;
                    scaleYAvg += scaleY;

                    currentStar.pos.x += scaleX;
                    currentStar.pos.y += scaleY;
                    otherStar.pos.x += -scaleX;
                    otherStar.pos.y += -scaleY;

                    if( i % 500 == 0 && j % 500 == 0 ) {
                        console.log( "mass1: " + currentStar.mass + "  mass2: " + otherStar.mass + " ( " + vector.x + ", " + vector.y + " ) " + scaleX + ", " + scaleY);
                    }
                }
            }

            for( var i = 0; i < gravStars.length; i++ ) {
                gravStars[i].pos.x = Math.floor( gravStars[i].pos.x );
                gravStars[i].pos.y = Math.floor( gravStars[i].pos.y );

                if( gravStars[i].pos.x != gravStars[i].originalPos.x ) {
                    console.log( gravStars[i].pos.x - gravStars[i].originalPos.x );
                }
            }

            this.stars = this.stars.concat( gravStars );
            gravStars = [];
            console.log( "SCALE X AVG: " + scaleX / gravStars.length );
            console.log( "SCALE Y AVG: " + scaleY / gravStars.length );


        },

        draw : function( context ) {
            context.save();
            this.drawStars( context );
            //this.drawGrid( context );
            context.restore();
        },

        drawStars : function( context ) {
            for(var i = 0; i < this.stars.length; i++ ) {
                var star = this.stars[i];

                if( star.pos.x >= 0 &&
                    star.pos.y >= 0 &&
                    star.pos.x < this.size.x &&
                    star.pos.y < this.size.y ) {

                    var color = Math.floor( Math.min(255, 528 * star.brightness) );
                    this.stencil.radius = star.mass * 4;
                    this.stencil.pos.x = star.pos.x;
                    this.stencil.pos.y = star.pos.y;
                    this.stencil.colorStops = [
                        new ColorStop(0,     { r : color, g : color, b : color, a : 1 } ),
                        new ColorStop(0.45,  { r : color, g : color, b : color, a : 0.55 } ),
                        new ColorStop(1,     { r : color, g : color, b : color, a : 0.25 } )
                    ];

                    this.stencil.draw( context );
                }
//                var color = ColorUtil.componentToHex( Math.min(255, 528 * star.brightness ).toString() );
//                context.fillStyle = "#" + color + color + color;
//                context.fillRect(star.pos.x, star.pos.y, star.mass * 10, star.mass * 10);
            }
        },

        drawGrid : function( context ) {
            context.save();
            context.strokeStyle = "#004400";
            for( var x = 0; x < this.numCols; x++ ) {
                var xPos = x * this.gridSize;
                context.beginPath();
                context.moveTo( xPos, 0);
                context.lineTo( xPos, this.size.y );
                context.stroke();
                context.closePath();
            }

            for( var y = 0; y < this.numRows; y++ ) {
                var yPos = y * this.gridSize;
                context.beginPath();
                context.moveTo( 0, yPos );
                context.lineTo( this.size.x, yPos );
                context.stroke();
                context.closePath();
            }

            context.restore();
        },

        drawNoise : function( context ) {
            for( var x = 0; x < this.size.x; x++ ) {
                for( var y = 0; y < this.size.y; y++ ) {
                    var noise = ( 1 + this.noiseGenerator.noise( x, y ) ) / 2; //noise is between -1,1, normalize

                    var color = ColorUtil.componentToHex( 128 * noise ).toString();
                    context.fillStyle = "#" + color + color + color;
                    context.fillRect(this.pos.x + x, this.pos.y + y, 2, 2);

                }
            }
        }

    });
});