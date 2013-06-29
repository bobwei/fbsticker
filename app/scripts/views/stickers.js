define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/sticker_button.html',
    'text!../templates/sticker_selector.html',
    '../models/facebook',
    '../utils/image'
], function($, _, Backbone,
            StickerButtonTemplate, StickerSelectorTemplate,
            Facebook, ImageUtility){
    'use strict';

    var Stickers = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);

            this.stickerSelectorWidth = 300;
            this.stickerSelectorHeight = 300;
            this.facebook = new Facebook();
            this.facebook.sync('read');
        },
        events: {
            'click .sticker-button': 'onStickerButtonClick',
            'click .sticker': 'onStickerClick'
        },
        onStickerClick: function(e){
            var stickerElement = $(e.currentTarget);
            console.log(this.feedback_params);
            // this.facebook.uploadCommentPhoto(element.attr('url'));
        },
        onStickerButtonClick: function(e){
            var stickerButton = $(e.currentTarget);
            var stickerSelectorOffset = this.getStickerSelectorOffset(stickerButton.offset(),
                                                                      stickerButton.width(),
                                                                      stickerButton.height());

            $('form').each(_.bind(function(i, element){
                if ($.contains(element, stickerButton[0])){
                    var value = $(element).find('input[name="feedback_params"]').attr('value');
                    this.feedback_params = JSON.parse(value);

                    return;
                }
            }, this));

            this.renderStickerSelector(stickerSelectorOffset);
        },
        getStickerSelectorOffset: function(stickerButtonOffset, stickerButtonWidth, stickerButtonHeight){
            var offset = stickerButtonOffset;
            offset.left -= this.stickerSelectorWidth - stickerButtonWidth;
            offset.top -= this.stickerSelectorHeight;

            if (offset.top < 45){
                offset.top += this.stickerSelectorHeight + stickerButtonHeight + 5;
            }

            return offset;
        },
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
            this.$('.sticker-selector-wrapper')
                .css('top', '').css('left', '')
                .offset(offset).toggle();

            return this;
        }
    });

    return Stickers;
});
