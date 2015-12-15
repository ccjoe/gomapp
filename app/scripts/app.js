/* jshint devel:true */
var config = {
    DEBUG: true,
    GOM_PATH: '/gom/src/gom',
    API_HOST: 'http://h5.jc.me:3000/api/',    //服务端API HOST
    STORE_VIEWS: true,                        //缓存模板
    EXPIRES: 24,                              //缓存时间(小时)
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
        Gom : config.GOM_PATH               //定义paths.Gom,则采取的是requirejs引入Gom,直接引入gom.js文件时不需要此配置
    },
    urlArgs: "v=" + config.DEBUG ? (new Date()).getTime() : 'release'
});

require(['Gom', './route'], function(Gom,  route){
    new Gom.App(config, route).run();
});
