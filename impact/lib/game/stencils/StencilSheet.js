ig.module(
    'game.stencils.StencilSheet'
)
.requires(
    'impact.entity'
)
.defines(function () {

    StencilSheet = ig.Class.extend({

        //info = { name : "", pos : {x,y}, factoryMethod, numReferences, refreshRate, tillRefresh, currentStencil }
        //tillRefresh and currentStencil are initialized by this class
        stencilInfo : [],
        stencilNameToInfo : {},

        sheetName : null,
        width     : null,
        height    : null,
        scratch   : null,
        refreshTimer : null,

        init: function ( sheetName, width, height, stencilInfo ) {
            this.sheetName = sheetName;
            this.width  = width;
            this.height = height;
            for( var i = 0; i < stencilInfo.length; i++ ) {
                if( TypeUtil.isEmpty( stencilInfo[i].references ) ) {
                    stencilInfo[i].references = 0;
                }
                this.stencilInfo.push( stencilInfo[i] );
                this.stencilNameToInfo[stencilInfo.name] = stencilInfo;
            }
            this.initializeScratch();
            this.refreshTimer = new ig.Timer();
        },

        initializeScratch : function()  {
            this.scratch = new WritableImage( this.sheetName, this.width, this.height );
            this.createStencils();
            this.populateScratch();
        },

        createStencils : function() {
            var curStencilInfo;
            for( var i = 0; i < this.stencilInfo.length; i++ ) {
                curStencilInfo = this.stencilInfo[i];
                curStencilInfo.currentStencil = curStencilInfo.factoryMethod();
                curStencilInfo.tillRefresh = Math.random() * curStencilInfo.refreshRate;
                if( TypeUtil.isEmpty( curStencilInfo.references ) ) {
                    curStencilInfo.reference = 0;
                }
            }
        },

        populateScratch : function() {
            this.scratch.context.clearRect( 0, 0, this.width, this.height );

            for( var i = 0; i < this.stencilInfo.length; i++ ) {
                this.stencilInfo[i].currentStencil.draw( this.scratch.context );
            }
        },

        addReference : function( id ) {
            this.stencilNameToInfo[id].references += 1;
        },

        removeReference : function( id ) {
            var stencilInfo = this.stencilNameToInfo[id];
            if( stencilInfo.references <= 0 ) {
               throw "Removing from <0 reference( " + id + " ) numReferences (" + this.stencilInfo.references;
            }
            stencilInfo.references -= 1;
        },

        refreshStencil : function( stencilInfo ) {
            stencilInfo.currentStencil.clear( this.scratch.context );
            stencilInfo.currentStencil = stencilInfo.factoryMethod();
            stencilInfo.currentStencil.draw( this.scratch.context );
            stencilInfo.tillRefresh = stencilInfo.refreshRate;
        },

        update : function( ) {
            var timePassed = this.refreshTimer.tick();
            for( var i = 0; i < this.stencilInfo.length; i++ ) {
                var stencilInfo = this.stencilInfo[i];
                stencilInfo.tillRefresh -= timePassed;
                if( stencilInfo.tillRefresh <= 0 && stencilInfo.references == 0 ) {
                    this.refreshStencil( stencilInfo );
                }
            }
        },

        debugDraw : function( pos ) {
            this.scratch.draw( pos.x, pos.y );
        }
    });
});