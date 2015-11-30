/* jshint devel:true */
require.config({
    baseUrl: '../scripts',
    paths: {
        'base': '../lib'
    }
});

require(['base/gom', 'com/config', 'route'], function(Gom, config, route){
    new Gom(config, route).run();
});
