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
            var element = $(e.currentTarget);
            this.facebook.uploadCommentPhoto(element.attr('url'));
            // console.log('onStickerClick');
            // var element = $(e.currentTarget),
            //     facebookCommentPhotoUploadUrl = 'https://www.facebook.com/ajax/ufi/upload/?__user=' + this.facebook.get('user_id') + '&fb_dtsg=' + this.facebook.get('fb_dtsg'),
            //     formData = new FormData(),
            //     data = {
            //         source: 19,
            //         profile_id: this.facebook.get('user_id'),
            //         fb_dtsg: this.facebook.get('fb_dtsg')
            //     };

            // ImageUtility.fetch(element.attr('url'), function(blob){
            //     console.log('image fetched');
            //     formData.append('sticker.png', blob);
            //     for (var key in data){
            //         formData.append(key, data[key]);
            //     }

            //     $.ajax({
            //         url: facebookCommentPhotoUploadUrl,
            //         data: formData,
            //         cache: false,
            //         contentType: false,
            //         processData: false,
            //         type: 'POST',
            //         error: function(error){
            //             console.log('upload comment photo error');
            //             console.log(error);
            //         },
            //         success: function(response){
            //             console.log('upload comment photo success');
            //             console.log(response);
            //         }
            //     });
            // });
        },
        onStickerButtonClick: function(e){
            var stickerButton = $(e.currentTarget);
            var stickerSelectorOffset = this.getStickerSelectorOffset(stickerButton.offset(),
                                                                      stickerButton.width(),
                                                                      stickerButton.height());
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
