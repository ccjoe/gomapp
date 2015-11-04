define(['auth/model'], function(authModel) {
    'use strict';
    var authSvc = require('auth/model');
    var comCtrl = require('com/ctrl');

    return {
        init: function(app, cr){
            var self = this;
            app.render(cr, function(){
                self.login();
            });
        },

        login: function(){
            $('.btn-next').on('click', function(){
                var args = $('form[name="loginForm"]').serialize();
                authSvc.login(args, function(data){
                    comCtrl.msg('登录成功');
                    location.href = '/#/';
                });
            });
        },

        logout: function(){

        }
    };
});

