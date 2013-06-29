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
// require.config({
//     paths: {
//         jquery: '../bower_components/jquery/jquery',
//         bootstrap: 'vendor/bootstrap'
//     },
//     shim: {
//         bootstrap: {
//             deps: ['jquery'],
//             exports: 'jquery'
//         }
//     }
// });

require(['app/scripts/app', 'jquery'], function (app, $) {
    'use strict';

    //handle message sent from content scripts
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
        if (request.method === 'getFacebookCookies'){
            chrome.cookies.get({
                url: 'https://www.facebook.com'
            }, function(response){
                sendResponse('123');
                console.log('cookies response');
                console.log(response);
            });
        }
    });

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
