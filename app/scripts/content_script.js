require.config({
    baseUrl: chrome.extension.getURL('/'),
    paths: {
        jquery: 'app/bower_components/jquery/jquery',
        underscore: 'app/bower_components/underscore/underscore-min',
        backbone: 'app/bower_components/backbone/backbone-min',
        text: 'app/bower_components/requirejs-text/text'
    },
    shim: {
        'underscore': {
            deps: [],
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    }
});

require(['jquery',
        'underscore',
        'backbone',
        'app/scripts/views/stickers'
        ], function($, _, Backbone, Stickers){
    'use strict';

    $(function(){
        var stickers = new Stickers({
            el: $('body')
        });
        stickers.renderStickerButton();

        setInterval(function(){
            stickers.renderStickerButton();
        }, 5000);

        // var DOMSubtreeModifiedRef = null;
        // $('body').bind('DOMSubtreeModified', function(e){
        //     clearTimeout(DOMSubtreeModifiedRef);
        //     DOMSubtreeModifiedRef = setTimeout(function(){
        //         console.log('DOMSubtreeModified');
        //         console.log(e);
        //         stickers.renderStickerButton();
        //     }, 1000);
        // });
    });
});
