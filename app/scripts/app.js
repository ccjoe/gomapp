/* jshint devel:true */
/**
 *框架配置和AppDemo配置,
 **/
var isdebug = !!~location.search.indexOf('debug=1');
var config = {
    //hostPath: '',       //相对域名根目录的路径，例如布署在a.com/b/c/下, hostPath即/b/c/(沿没实现,需验证)
    VERSION: 'release', //发布时的版本号
    DEBUG: isdebug,
    GOM_PATH: isdebug ? '/gom/src/gom' : '/gom/build/gom',
    API_HOST: 'http://h5.jc.me:3000/api/',    //服务端API HOST
    STORE_VIEWS: true,                        //缓存模板
    EXPIRES: isdebug ? 0 : 24,                //缓存时间(小时)
    CLASSES: {                                //站点ID配置
        VIEWPORT: '#viewport',                //页面Viewport
        HEADER: '#header',                    //Header ID
        FOOTER: '#footer',                    //Footer ID
        CONTENT: '.content'                   //页面交替内容
    }
};

requirejs.config({
    baseUrl: 'scripts',
    paths:{
        Gom : config.GOM_PATH,               //定义paths.Gom,则采取的是requirejs引入Gom,直接引入gom.js文件时不需要此配置
    },
    shim:{
        'route': ['Gom']
    },
    urlArgs: "v=" + (config.DEBUG ? (new Date()).getTime() : config.VERSION)
});
console.log('APP RUN');
require(['Gom', 'route'], function(Gom,  route){
    new Gom.App(config, route).run();
});
