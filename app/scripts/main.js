require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app', 'jquery', 'bootstrap'], function (app, $) {
    'use strict';

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, info) {
        if (info.status === 'complete'){
            if (info.url.match(/http[s]:\/\/www.facebook.com.*/)){
                // chrome.tabs.executeScript(tabId, {
                //     'file': ''
                // });
            }
        }
    });
});
