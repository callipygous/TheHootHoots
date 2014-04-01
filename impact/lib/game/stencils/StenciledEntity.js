ig.module(
    'game.stencils.StenciledEntity'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityStenciledEntity = ig.Entity.extend({

        /** The WritableImage of a Stencil Sheet that contains the image that represents this entity */
        stencilImage : null,

        /** The top-left point of the entity image in StencilImage.  Note, the width/height of the
         * entity should be the same as the width */
        src : { x : 0, y : 0 },
        imageSize : null,

        /** Speed of rotation */
        radiansPerSecond : 0,
        currentAngle : 0,

        stencilTimer : null,

        opacity : 1,

        init: function ( x, y, settings ) {
            this.parent( x, y, settings );

            this.stencilTimer = new ig.Timer();

            if( TypeUtil.isEmpty( this.imageSize) ) {
                this.imageSize = this.size;
            }
        },

        update : function() {
            this.parent();
            var tick = this.stencilTimer.tick();
            var radians = tick * this.radiansPerSecond;
            this.currentAngle += radians;
            if( this.currentAngle > Math.PI * 2 ) {
                this.currentAngle -= Math.PI * 2;
            } else if( this.currentAngle < 0 ) {
                this.currentAngle += Math.PI * 2;
            }
        },

        draw : function() {
            var context = ig.system.context;
            context.save();
            context.globalAlpha = this.opacity;

            if( this.currentAngle != 0 ) {
                var translateX = this.pos.x + this.imageSize.x / 2;
                var translateY = this.pos.y + this.imageSize.y / 2;

                context.translate( translateX, translateY );
                context.rotate( this.currentAngle );
                context.translate( -translateX, -translateY );
            }

            context.drawImage(
                this.stencilImage.data,
                this.src.x, this.src.y, this.imageSize.x, this.imageSize.y,
                this.pos.x, this.pos.y, this.imageSize.x, this.imageSize.y
            );

            context.restore();
        }
    });

});