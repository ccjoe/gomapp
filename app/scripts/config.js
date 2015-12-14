define(function() {
    'use strict';

    var config = {
        apiHost: 'http://h5.jc.me:3000/api/',    //服务端API HOST
        apiJSON: {                               //服务端API 通用结构为？
            successCode: 'success',              //状态
            data: []                             //数据
        },
        storeViewTmpl: true,                     //缓存模板
        expires: 24,                             //缓存时间(小时)
        returnClass: '.icon-left-nav',
        selector: {                              //站点ID配置
            viewport: '#viewport',               //页面Viewport
            header: '#header',                   //Header ID
            footer: '#footer',                   //Footer ID
            content: '.content'                  //页面交替内容
        }
    };

    return config;
});
