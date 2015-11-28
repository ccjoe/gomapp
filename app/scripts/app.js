/* jshint devel:true */
require.config({
    baseUrl: '../scripts',
    paths: {
        'base': '../lib'
    }
});

require(['base/app', 'com/config', 'route'], function(App, config, route){
    new App(config, route).run();
});
