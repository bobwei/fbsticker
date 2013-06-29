define([
    'jquery',
    'underscore'
], function($, _){
    'use strict';

    var ImageUtility = function(){};

    //fetch given image url and package as blob
    ImageUtility.fetch = function(url, callback){
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

        function onError(e) {
            console.log('Error', e);
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function(e){
            window.requestFileSystem(TEMPORARY, 1024 * 1024, function(fs){
                fs.root.getFile('image.png', {create: true}, function(fileEntry){
                    fileEntry.createWriter(function(writer){
                        var blob = new Blob([xhr.response], {type: 'image/png'});
                        callback(blob);
                    }, onError);
                }, onError);
            }, onError);
        };

        xhr.send();
    };

    return ImageUtility;
});
