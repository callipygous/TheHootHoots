/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 12/2/13
 * Time: 10:03 PM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.particles.colorstops.ColorStop'
)
.requires(
)
.defines(function () {

    ColorStop = ig.Class.extend({

        distance : 0,
        rgba : { r : 0, g : 0, b : 0, a : 1 },

        init: function ( distance, rgba ) {
            if( !TypeUtil.isEmpty( distance ) ) {
                this.distance = distance;
            }

            if( !TypeUtil.isEmpty( rgba ) ) {
                this.rgba = rgba;
            }
        },

        getRgbaString : function( gradientOpacity ) {
            var rgba = this.rgba;
            return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " +
                             rgba.a * gradientOpacity + ")";
        },

        update : function( opacity, radius, secondsPassed ) {

        }
    });

});