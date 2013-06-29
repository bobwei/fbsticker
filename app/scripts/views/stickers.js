define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/sticker_button.html',
    'text!../templates/sticker_selector.html',
    '../models/facebook',
    '../utils/image',
    '../collections/stickers'
], function($, _, Backbone,
            StickerButtonTemplate, StickerSelectorTemplate,
            Facebook, ImageUtility,
            StickersCollection){
    'use strict';

    var Stickers = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);

            this.stickerSelectorWidth = 300;
            this.stickerSelectorHeight = 300;
            this.facebook = new Facebook();
            this.facebook.sync('read');

            this.stickerCollection = new StickersCollection();
            this.stickerCollection.fetch();
        },
        events: {
            'click .sticker-button': 'onStickerButtonClick',
            'click .sticker': 'onStickerClick',
            'click .sticker-selector-outer': 'onStickerSelectorBlur'
        },
        onStickerSelectorBlur: function(e){
            this.$('.sticker-selector-outer').hide();
        },
        onStickerClick: function(e){
            this.$('.sticker-selector-outer').hide();
            this.stickerButtonContainerFormElement.find('.sticker-loading').show();
            var stickerElement = $(e.currentTarget);
            this.facebook.uploadCommentPhoto(stickerElement.attr('url'), _.bind(function(photo_fbid){
                this.facebook.postComment(this.feedback_params.target_fbid,
                                          photo_fbid,
                                          _.bind(function(){
                                                this.$('.sticker-loading').hide();
                                            },
                                            this),
                                          _.bind(function(){
                                                this.$('.sticker-loading').hide();
                                            }, this)
                                          );
            }, this));
        },
        onStickerButtonClick: function(e){
            var stickerButton = $(e.currentTarget);
            var stickerSelectorOffset = this.getStickerSelectorOffset(stickerButton.offset(),
                                                                      stickerButton.width(),
                                                                      stickerButton.height());

            $('form').each(_.bind(function(i, element){
                if ($.contains(element, stickerButton[0])){
                    this.stickerButtonContainerFormElement = $(element);
                    var value = this.stickerButtonContainerFormElement.find('input[name="feedback_params"]').attr('value');
                    this.feedback_params = JSON.parse(value);

                    return;
                }
            }, this));

            this.renderStickerSelector(stickerSelectorOffset);
        },
        getStickerSelectorOffset: function(stickerButtonOffset, stickerButtonWidth, stickerButtonHeight){
            var offset = stickerButtonOffset;
            offset.left -= this.stickerSelectorWidth - 0;
            offset.top -= this.stickerSelectorHeight;

            if (offset.top < 45){
                //display below stickerButton
                offset.top += this.stickerSelectorHeight + stickerButtonHeight + 5;
            }else{
                //display above stickerButton
                offset.top -= 25;
            }

            return offset;
        },
        renderStickerButton: function(){
            console.log('rendering sticker button...');
            this.$('.sticker-button').remove();
            this.$('textarea[name="add_comment_text"]').after(StickerButtonTemplate);
            this.$('textarea[name="add_comment_text_text"]').after(StickerButtonTemplate);

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
                this.$el.append(_.template(StickerSelectorTemplate)({
                    _: _,
                    stickerCollection: this.stickerCollection
                }));
            }
            this.$('.sticker-selector-wrapper')
                .css('top', '').css('left', '')
                .offset(offset);
            this.$('.sticker-selector-outer').show();

            return this;
        }
    });

    return Stickers;
});
