/* jshint devel:true */
require.config({
    baseUrl: '../scripts',
    paths: {
        //'gom': '../../gom/src'      //src版本(../../gom/src)与build版本(../../gom/build)切换
    }
});


require(['App', 'com/config', 'route'], function(App, config, route){
    new App(config, route).run();
});
