define([
    'jquery',
    'underscore',
    'app/bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.min'
], function($, _){
    'use strict';

    var ImageUtility = function(){};
    // ImageUtility.resizeBlob = function(blob, callback){
    //     var canvas = document.createElement('canvas');
    //     var ctx = canvas.getContext('2d');
    //     var img = document.createElement('img');
    //     img.src = window.URL.createObjectURL(blob);
    //     img.onload = function(){
    //         ctx.drawImage(img, 0, 0, img.width * 0.6, img.height * 0.6);
    //         if (canvas.toBlob) {
    //             canvas.toBlob(
    //                 function (blob) {
    //                     callback(blob);
    //                 },
    //                 'image/png'
    //             );
    //         }
    //     };
    // };

    // //fetch given image url and package as blob
    // ImageUtility.fetch = function(url, callback){
    //     window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    //     function onError(e) {
    //         console.log('Error', e);
    //     }

    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', url, true);
    //     xhr.responseType = 'blob';

    //     xhr.onload = function(e){
    //         window.requestFileSystem(TEMPORARY, 1024 * 1024, function(fs){
    //             fs.root.getFile('image.png', {create: true}, function(fileEntry){
    //                 fileEntry.createWriter(function(writer){
    //                     var blob = new Blob([xhr.response], {type: 'image/png'});
    //                     callback(blob);
    //                 }, onError);
    //             }, onError);
    //         }, onError);
    //     };

    //     xhr.send();
    // };

    //resize image in background script instead of content script to prevent being
    //block by Chrome security policy
    ImageUtility.resize = function(url, callback){
        chrome.runtime.sendMessage({
            method: 'resize',
            url: url
        }, function(response){
            var blob = window.dataURLtoBlob && window.dataURLtoBlob(response.dataURL);
            callback(blob);
        });
    };

    return ImageUtility;
});
