define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/sticker_button.html',
    'text!../templates/sticker_selector.html',
    'text!../templates/sticker_shop.html',
    '../models/facebook',
    '../utils/image',
    '../collections/stickers'
], function($, _, Backbone,
            StickerButtonTemplate, StickerSelectorTemplate, StickerShopTemplate,
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

            this.stickerShopOffset = 0;
            this.stickerShopLimit = 25;
        },
        events: {
            'click .sticker-button': 'onStickerButtonClick',
            'click .stickers .sticker': 'onStickerClick',
            'click .sticker-selector-outer': 'onStickerSelectorBlur',
            'click .sticker-selector-wrapper': 'onStickerSelectorWrapperClick',
            'click .navigation-bar .tabs .tab': 'onTabClick',
            'click .download': 'onDownloadClick'
        },
        onDownloadClick: function(e){
            var button = $(e.currentTarget);

            var packageId = button.attr('packageId');
            var key = 'download:packages';
            var packages = JSON.parse((localStorage.getItem(key) || '[]'));
            packages.push(packageId);
            localStorage.setItem(key, JSON.stringify(packages));
            button.html('已下載');

            return false;
        },
        onStickerShopScroll: function(e){
            clearTimeout(this.stickerShopScrollDelay);
            this.stickerShopScrollDelay = setTimeout(_.bind(function(){
                var currentTarget = e.currentTarget;
                if (currentTarget.scrollHeight - $(currentTarget).scrollTop() < 470){
                    this.renderStickerShop(this.stickerShopOffset);
                    this.stickerShopOffset += this.stickerShopLimit;
                }
            }, this), 300);
        },
        onTabClick: function(e){
            //update .tab-indicator and .content-view scroll position
            var index = $(e.currentTarget).attr('index');

            this.$('.navigation-bar .tabs .tab-indicator').removeClass(function(index, klass){

                return (klass.match(/select\d+/) || []).join(' ');
            }).addClass('select' + index);

            this.$('.content-view').children().hide().eq(index).show();

            if (index === '1'){
                this.stickerShopOffset = 0;
                this.renderStickerShop(this.stickerShopOffset);
                this.stickerShopOffset += this.stickerShopLimit;
            }
        },
        onStickerSelectorWrapperClick: function(){

            return false;
        },
        onStickerSelectorBlur: function(){
            this.$('.sticker-selector-outer').hide();
            clearTimeout(this.isStickerSelectorOpenedDelay);
            this.isStickerSelectorOpenedDelay = setTimeout(_.bind(function(){
                window.isStickerSelectorOpened = false;
            }, this), 10000);
            //$('body').css('overflow', '');
        },
        onStickerClick: function(e){
            this.$('.sticker-selector-outer').hide();
            this.stickerButtonContainerFormElement.find('.sticker-loading').show();
            var stickerElement = $(e.currentTarget);
            this.facebook.uploadCommentPhoto(stickerElement.attr('url'), _.bind(function(photo_fbid){
                this.facebook.postComment(this.feedback_params.target_fbid,
                                          photo_fbid,
                                          _.bind(function(){
                                                clearTimeout(this.isStickerSelectorOpenedDelay);
                                                this.isStickerSelectorOpenedDelay = setTimeout(_.bind(function(){
                                                    this.$('.sticker-loading').hide();
                                                    window.isStickerSelectorOpened = false;
                                                }, this), 3000);
                                            },
                                            this),
                                          _.bind(function(){
                                                clearTimeout(this.isStickerSelectorOpenedDelay);
                                                this.isStickerSelectorOpenedDelay = setTimeout(_.bind(function(){
                                                    this.$('.sticker-loading').hide();
                                                    window.isStickerSelectorOpened = false;
                                                }, this), 3000);
                                            }, this)
                                          );
            }, this));
            //$('body').css('overflow', '');
        },
        onStickerButtonClick: function(e){
            window.isStickerSelectorOpened = true;
            // $('body').css('overflow', 'hidden');

            var stickerButton = $(e.currentTarget);
            var stickerSelectorOffset = this.getStickerSelectorOffset(stickerButton.offset(),
                                                                      stickerButton.width(),
                                                                      stickerButton.height());

            //find the container form that contains current clicked sticker button
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
            offset.left -= this.stickerSelectorWidth - 32;
            offset.top -= this.stickerSelectorHeight;

            if (offset.top < 45){
                //display below stickerButton
                offset.top += this.stickerSelectorHeight + stickerButtonHeight + 12;
            }else{
                //display above stickerButton
                offset.top -= 13 - 20;
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
        },
        renderStickerShop: function(offset){
            var limit = 25;
            if (!offset){
                offset = 0;
            }
            if (!offset){
                this.$('.stickers-shop').html(_.template(StickerShopTemplate)({
                    _: _,
                    stickerCollection: this.stickerCollection,
                    offset: offset,
                    limit: limit
                })).unbind('scroll').bind('scroll', this.onStickerShopScroll);
            }else{
                this.$('.stickers-shop').append(_.template(StickerShopTemplate)({
                    _: _,
                    stickerCollection: this.stickerCollection,
                    offset: offset,
                    limit: limit
                }));
            }
        }
    });

    return Stickers;
});
