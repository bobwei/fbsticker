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
            _.bindAll(this);
        },
        sync: function(method, model, options){
            if (method === 'read'){
                this.set('user_id', document.cookie.match(/c_user=([0-9]*);/)[1]);
                var fb_env = JSON.parse($('script').html().match(/{".*"}/)[0]);
                this.set('fb_dtsg', fb_env.fb_dtsg);
            }
        },
        uploadCommentPhoto: function(url, callback){
            console.log('uploadCommentPhoto...');
            var facebookCommentPhotoUploadUrl = 'https://www.facebook.com/ajax/ufi/upload/?__user=' + this.get('user_id') + '&fb_dtsg=' + this.get('fb_dtsg'),
                formData = new FormData(),
                data = {
                    source: 19,
                    profile_id: this.get('user_id'),
                    fb_dtsg: this.get('fb_dtsg')
                };

            ImageUtility.fetch(url, _.bind(function(blob){
                console.log('image fetched and resized');
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
                    complete: _.bind(function(jqXHR, textStatus){
                        var response = jqXHR.responseText;
                        var photo_fbid = response.match(/"fbid":([0-9]+),/)[1];
                        console.log('uploadCommentPhoto success');
                        callback(photo_fbid);
                    }, this)
                });
            }, this));
        },
        postComment: function(target_fbid, photo_fbid, success_callback, error_callback){
            $.ajax({
                url: 'https://www.facebook.com/ajax/ufi/add_comment.php',
                data: {
                    ft_ent_identifier: target_fbid,
                    client_id: '1372492722978:2024063889',
                    attached_photo_fbid: photo_fbid,
                    comment_text: '',
                    source: 2,
                    rootid: 'u_0_3',
                    __user: this.get('user_id'),
                    __a: 1,
                    fb_dtsg: this.get('fb_dtsg')
                },
                cache: false,
                type: 'POST',
                complete: _.bind(function(jqXHR, textStatus){
                    if (jqXHR.responseText.search('error') < 0){
                        success_callback();
                    }else{
                        error_callback();
                    }
                }, this)
            });
        }
    });

    return Facebook;
});
