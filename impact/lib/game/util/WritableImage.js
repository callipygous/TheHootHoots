ig.module(
    'game.util.WritableImage'
)
.requires(
    'impact.image'
)
.defines(function(){

    WritableImage = ig.Image.extend({
        data: null,
        width: 0,
        height: 0,
        loaded: false,
        failed: false,
        loadCallback: null,
        path: '',
        context : null,

        init: function( name, width, height ) {
            this.parent( null );
            this.width = width;
            this.height = height;
            this.data = ResourceUtil.makeScratchCanvas( name, width, height );
            this.loaded = true;
            WritableImage.cache[name] = this;

            this.context = this.data.getContext('2d');
        },


        load: function( loadCallback ) {
            this.loaded = true;
        },


        reload: function() {
            this.loaded = true;
        },


        onload: function( event ) {
            //TODO: Be sure to resize in case of canvas resizing
        },


        onerror: function( event ) {
        },


        resize: function( scale ) {
            //TODO: Check nearest neighbor resize in Image.jjs
        },

        dispose : function() {
            ResourceUtil.removeScratchCanvas( this.name );
        }
    });

    WritableImage.cache = {};
    WritableImage.dropImages = function() {
        WritableImage.cache = {};
    }

});