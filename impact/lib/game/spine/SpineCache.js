/**
 * Created with JetBrains WebStorm.
 * User: Owner
 * Date: 12/15/13
 * Time: 11:33 PM
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.spine.SpineLoader'
)
.requires(
)
.defines(function () {

    //Subclass ig.Loader to use SpineLoader
    SpineLoader = ig.Class.extend({

        canvas          : null,
        turbulenzEngine : null,
        graphicsDevice  : null,
        draw2d          : null,

        init: function() {
            this.canvas = ig.system.canvas;
            this.turbulenzEngine = WebGLTurbulenzEngine.create({canvas: canvas});
            this.graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
            this.draw2d = Draw2D.create({graphicsDevice: graphicsDevice})
        },

        loadAtlas : function(atlasText) {
            var textureCount = 0;
            atlas = new spine.Atlas(atlasText, {
                load: function (page, path, atlas) {
                    textureCount++;

                    //CREATE ALL TEXTURES IN THE LOADER, CACHE THEM USING THE ONLOAD
                    //CREATE AN ATLAS IN THE LOADER BUT IT JUST SETS THE PAGE ATTRIBUTES
                    //FROM THE TEXTURE
                    //Load SKELETON DATA AS WELL AS A RESOURCE
                    //NOT
                    graphicsDevice.createTexture({
                        src: "../data/" + path,
                        mipmaps: true,
                        onload: function (texture) {
                            page.rendererObject = texture;
                            page.width = texture.width;
                            page.height = texture.height;
                            atlas.updateUVs(page);
                            textureCount--;
                        }
                    });
                },
                unload: function (texture) {
                    texture.destroy();
                }
            });
            function waitForTextures () {
                if (!textureCount)
                    TurbulenzEngine.request("../data/" + skeletonName + ".json", loadSkeletonData);
                else
                    setTimeout(waitForTextures, 100);
            }
            waitForTextures();
        }
    });

});