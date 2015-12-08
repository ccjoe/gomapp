/* jshint devel:true */
require.config({
    baseUrl: '../scripts',
    paths: {
        'gom': '../../gom/gom',      //src版本(../../gom/gom)与build版本(../../gom/build/gom)切换
        'zepto': '../bower_components/zepto-full/zepto',
        'fastclick': '../bower_components/fastclick/lib/fastclick',
        'underscore': '../bower_components/underscore/underscore',
        'zepto.history': '../bower_components/history.js/scripts/bundled/html5/zepto.history'
    }
});


require(['gom/gom', 'com/config', 'route'], function(Gom, config, route){
    new Gom(config, route).run();
});
