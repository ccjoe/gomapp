/* jshint devel:true */
requirejs.config({
    baseUrl: '../scripts',
    paths: {
        'base': '../lib'
    }
});

requirejs(['base/app', 'com/config', 'com/route'], function(App, config, route){
    new App(config, route).init();
});
