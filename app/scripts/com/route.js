'use strict';

define(['require',
    'com/ctrl',
    'main/ctrl',
    'auth/ctrl',
    'module/list_ctrl',
    'module/view_ctrl',
    'module/add_ctrl',
    'viewdoc/list_ctrl',
    'viewdoc/header_ctrl'
], function (require) {

    var r = require;

    //tmpl html FileName; ctrl js FileName
    var router = {
        // '/sample': {
        //     tmpl : 'sample'    //require  页面调用的模块名称 template
        //     ctrl : r('sample') //optional 页面对应的ctrl的路径 ctrl
        //     title: 'SAMPLE'    //optional 页面标题
        //     data : {}          //optional 页面需要的数据（一般不会直接写入，由ajax动态写入）
        //     wrapper: '#sample' //optional 页面需要插入的DOM位置
        //     seo: {
        //          title:        //上面title是显示在页面上的，这个设置是<title>标签里的值
        //          keyword:,
        //          descption:
        //     }
        // },
        '/': {
            tmplname: 'app',
            ctrl: r('main/ctrl'),
            title: 'test'
        },
        '/login': {
            tmplname: 'login',
            ctrl: r('auth/ctrl'),
            title: '登录'
        },
        '/viewdoc': {
            '/': {
                tmplname: 'viewdoc/list',
                ctrl: r('viewdoc/list_ctrl'),
                title: '用户组件'
            },
            '/header': {
                tmplname: 'viewdoc/header',
                ctrl: r('viewdoc/header_ctrl'),
                title: '头部设置文档'
            }
        },
        '/module': {
            '/': {
                tmplname: 'module/list',
                ctrl: r('module/list_ctrl')
            },
            '/:var': {
                tmplname: 'module/view',
                ctrl: r('module/view_ctrl')
            },
            '/add': {
                tmplname: 'module/add',
                ctrl: r('module/add_ctrl')
            },
            '/edit': {}
        },
        '/modal': {
            tmplname: '/pages/modal'
        },
        '/slide': {
            tmplname: '/pages/slide'
        },
        //HTTP 状态
        '/404': {
            tmplname: '404',
            data: {
                url: ''     //引起404的地址，默认为空;
            }
        },
        '/500': {
            tmplname: '500',
        }
    };


    return router;
});
