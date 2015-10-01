define(function(require) {
    'use strict';

    var comSvc = require('com/model');
    var comCtrl = require('com/model');
    return {  
        login: function(params, handler){
            comSvc.post('auth/login', params, handler);
        },

        logout: function(){
            comSvc.post('auth/logout', params, handler);
        }
    };
});

