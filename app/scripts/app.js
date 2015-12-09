/* jshint devel:true */
require.config({
    baseUrl: '../scripts',
    paths: {
        'gom': '../../gom/src'      //src版本(../../gom/src)与build版本(../../gom/build)切换
    }
});


require(['gom/gom', 'com/config', 'route'], function(Gom, config, route){
    new Gom.App(config, route).run();
});
