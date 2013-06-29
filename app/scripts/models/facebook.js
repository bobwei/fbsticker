define([
    'jquery',
    'underscore',
    'backbone',
    '../utils/image'
], function($, _, Backbone, ImageUtility){
    'use strict';

    var Facebook = Backbone.Model.extend({
        defaults: {
            user_id: '',
            fb_dtsg: ''
        },
        initialize: function(){

        },
        sync: function(method, model, options){
            if (method === 'read'){
                this.set('user_id', document.cookie.match(/c_user=([0-9]*);/)[1]);
                var fb_env = JSON.parse($('script').html().match(/{".*"}/)[0]);
                this.set('fb_dtsg', fb_env.fb_dtsg);
            }
        },
        uploadCommentPhoto: function(url){
            console.log('uploadCommentPhoto...');
            var facebookCommentPhotoUploadUrl = 'https://www.facebook.com/ajax/ufi/upload/?__user=' + this.get('user_id') + '&fb_dtsg=' + this.get('fb_dtsg'),
                formData = new FormData(),
                data = {
                    source: 19,
                    profile_id: this.get('user_id'),
                    fb_dtsg: this.get('fb_dtsg')
                };

            ImageUtility.fetch(url, function(blob){
                console.log('image fetched');
                formData.append('sticker.png', blob);
                for (var key in data){
                    formData.append(key, data[key]);
                }

                $.ajax({
                    url: facebookCommentPhotoUploadUrl,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    complete: function(jqXHR, textStatus){
                        var response = jqXHR.responseText;
                        var fbid = response.match(/"fbid":([0-9]+),/)[1];
                        console.log('uploadCommentPhoto success');
                    }
                });
            });
        },
        postCommet: function(){

        }
    });

    return Facebook;
});
