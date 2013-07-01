require.config({
    baseUrl: chrome.extension.getURL('/'),
    paths: {
        jquery: 'app/bower_components/jquery/jquery',
        underscore: 'app/bower_components/underscore/underscore-min',
        backbone: 'app/bower_components/backbone/backbone-min',
        text: 'app/bower_components/requirejs-text/text'
        // pixastic: 'app/bower_components/pixastic/pixastic'
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
        'app/bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.min'
        ], function($){
    'use strict';
    console.log('backgrount scripts running...');

    var STICKER_WIDTH = 100,
        STICKER_HEIGHT = 100;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.method === 'resize'){
            var canvas = document.createElement('canvas');
            var img = document.createElement('img');
            img.onload = function(){
                $(canvas).attr('width', STICKER_WIDTH + 'px').attr('height', STICKER_HEIGHT + 'px');
                var ctx = canvas.getContext('2d');
                // ctx.fillStyle = '#edeff4';
                // ctx.fillRect (0, 0);
                ctx.drawImage(img,
                              0, 0, img.width, img.height,
                              0, 0, STICKER_WIDTH, STICKER_HEIGHT);
                // ctx.drawImage(img, 0, 0);
                sendResponse({
                    dataURL: canvas.toDataURL()
                });
            };
            img.src = request.url;

            return true;
        }
    });

    //handle message sent from content scripts
    // chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    //     if (request.method === 'getFacebookCookies'){
    //         chrome.cookies.get({
    //             url: 'https://www.facebook.com'
    //         }, function(response){
    //             sendResponse('123');
    //             console.log('cookies response');
    //             console.log(response);
    //         });
    //     }
    // });

    // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, info) {
    //     if (info.status === 'complete'){
    //         if (info.url.match(/http[s]:\/\/www.facebook.com.*/)){
    //             // chrome.tabs.executeScript(tabId, {
    //             //     'file': ''
    //             // });
    //         }
    //     }
    // });
});
