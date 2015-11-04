'use strict';

define(['require',
        'com/ctrl',
        'main/ctrl',
        'auth/ctrl',
        'module/list_ctrl',
        'module/view_ctrl',
        'module/add_ctrl'
        ], function(require) {

    var r = require;

    //tmpl html FileName; ctrl js FileName
    var router = {
        // '/sample': {
        //     tmpl : 'sample'    //require  页面调用的模块名称 template
        //     ctrl : r('sample') //optional 页面对应的ctrl的路径 ctrl
        //     title: 'SAMPLE'    //optional 页面标题
        //     data : {}          //optional 页面需要的数据（一般不会直接写入，由ajax动态写入）
        //     rendeTo: '#sample' //optional 页面需要插入的DOM位置
        // },
        '/' : {
            tmpl: 'app',
            ctrl: r('main/ctrl'),
            title: 'test'
        },
        '/login': {
            tmpl: 'login',
            ctrl: r('auth/ctrl'),
            title: '登录'
        },
        '/module':{
            '/' : {
                tmpl: 'module/list',
                ctrl: r('module/list_ctrl')
            },
            '/:var' : {
                tmpl: 'module/view',
                ctrl: r('module/view_ctrl')
            },
            '/add' : {
                tmpl: 'module/add',
                ctrl: r('module/add_ctrl')
            },
            '/edit': {

            }
        },
        '/modal': {
            tmpl: '/pages/modal'
        },
        '/slide': {
            tmpl: '/pages/slide'
        },
        //HTTP 状态
        '/404': {
            tmpl: '404',
            data: {
                url: ''     //引起404的地址，默认为空;
            }
        },
        '/500': {
            tmpl: '500',
        }
    };

    var ui = {
        header: {},
        footer: {},
        nav: {},
        modal:{},
        flash:{}
    };
    return {
        router: router,
        ui: ui
    };
});
