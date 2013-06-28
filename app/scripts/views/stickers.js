define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    'use strict';

    var Stickers = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);
        },
        events: {
            'click .sticker-button': 'onStickerButtonClick'
        },
        onStickerButtonClick: function(){
            alert('');
        },
        render: function(){
            this.$('.innerWrap').append('<div class="sticker-button">貼圖</div>');

            return this;
        }
    });

    return Stickers;
});
