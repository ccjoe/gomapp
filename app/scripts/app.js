/* jshint devel:true */
requirejs.config({
    baseUrl: '../scripts',
    paths: {
        'core': '../lib'
    }
});

requirejs(['core/core', 'com/config', 'com/route'], function(core, config, route){
    core.config = config;
    core.route = route;
    core.init();
});

