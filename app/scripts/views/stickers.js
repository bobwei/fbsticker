define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/sticker_button.html',
    'text!../templates/sticker_selector.html'
], function($, _, Backbone, StickerButtonTemplate, StickerSelectorTemplate){
    'use strict';

    var Stickers = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);

            this.stickerSelectorWidth = 300;
            this.stickerSelectorHeight = 300;
        },
        events: {
            'click .sticker-button': 'onStickerButtonClick'
        },
        onStickerButtonClick: function(e){
            var stickerButton = $(e.currentTarget);
            var offset = stickerButton.offset();
            offset.left -= this.stickerSelectorWidth;
            offset.top -= this.stickerSelectorHeight;

            console.log(offset);
            this.renderStickerSelector(offset);
        },
        // getStickerSelectorElement: function(){
        //     if (!this._stickerSelectorElement){
        //         this._stickerSelectorElement = this.$('.sticker-selector-wrapper');
        //     }

        //     return this._stickerSelectorElement;
        // },
        // resetCachedElements: function(){
        //     this._stickerSelectorElement = null;
        // },
        renderStickerButton: function(){
            console.log('rendering sticker button...');
            this.$('textarea[name="add_comment_text"]').after(StickerButtonTemplate);

            return this;
        },
        renderStickerSelector: function(offset){
            if (!offset){
                offset = {
                    top: 0,
                    left: 0
                };
            }
            if (!this.$('.sticker-selector-wrapper').length){
                this.$el.append(StickerSelectorTemplate);
            }
            console.log(offset);
            this.$('.sticker-selector-wrapper')
                .css('top', '').css('left', '')
                .offset(offset).toggle();

            return this;
        }
    });

    return Stickers;
});
