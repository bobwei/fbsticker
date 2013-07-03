define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    'use strict';

    var Stickers = Backbone.Collection.extend({
        initialize: function(){
            _.bindAll(this);
        },
        url: function () {

            return 'http://dl.stickershop.line.naver.jp/products/productVersions_1014.meta';
        },
        sync: function(method, model, options){
            if (method === 'read'){
                var params = _.extend({
                    type: 'GET',
                    dataType: 'json',
                    url: this.url()
                }, options);

                return $.ajax(params);
            }
        },
        getDownloadedModels: function(){
            var key = 'download:packages';
            var packages = JSON.parse(localStorage.getItem(key) || '[]');

            return _.filter(this.models, function(model){

                return packages.indexOf(String(model.get(0))) > -1;
            });
        },
        parse: function(response){
            var objects = _.filter(response.versions, function(obj){

                return true;
            });

            return objects;
        }
    });

    return Stickers;
});
