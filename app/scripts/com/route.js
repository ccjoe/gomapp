define(['require', 
        'com/ctrl', 
        'main/ctrl', 
        'auth/ctrl', 
        'module/list_ctrl',
        'module/view_ctrl'
        ], function(require) {
    
    var r = require;

    //tmpl html FileName; ctrl js FileName
    var router = {
        //首页
        '/' : {
            tmpl: 'app',
            ctrl: r('main/ctrl'),
        },
        //登录
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
            ':var' : {
                tmpl: 'module/view',
                ctrl: r('module/view_ctrl')
            },
            'add' : {

            },
            'edit': {

            }
        },
        //HTTP 状态
        '/404': {
            tmpl: '404',
        },        
        '/500': {
            tmpl: '500',
        }
    }

    var ui = {
        header: {},
        footer: {},
        nav: {},
        modal:{},
        flash:{}
    }
    return {
        router: router,
        ui: ui
    }
});
