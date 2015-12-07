/* jshint devel:true */
require.config({
    baseUrl: '../scripts',
    paths: {
        'base': '../lib'    //框架路径地址
    }
});

require(['base/gom', 'com/config', 'route'], function(Gom, config, route){
    new Gom(config, route).run();
});
