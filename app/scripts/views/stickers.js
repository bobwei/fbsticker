define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/sticker_button.html'
], function($, _, Backbone, StickerButtonTemplate){
    'use strict';

    var Stickers = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);
        },
        events: {
            'click .sticker-button': 'onStickerButtonClick'
        },
        onStickerButtonClick: function(){
            console.log('onStickerButtonClick');
        },
        render: function(){
            console.log('rendering sticker button...');
            this.$('textarea[name="add_comment_text"]').after(StickerButtonTemplate);

            return this;
        }
    });

    return Stickers;
});
