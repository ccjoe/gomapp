'use strict';

define([
    'main/ctrl',
    'auth/ctrl',
    'module/list_ctrl',
    'module/view_ctrl',
    'module/add_ctrl',
    'viewdoc/list_ctrl',
    'viewdoc/header_ctrl',
    'viewdoc/component_list_ctrl',
    'viewdoc/modal_ctrl',
    //'viewdoc/button_ctrl',
    'viewdoc/switch_ctrl',
    'viewdoc/switchall_ctrl',
    'pluginsdoc/swipe_ctrl'
], function (main,
             auth,
             moduleList,
             moduleView,
             moduleAdd,
             viewdocList,
             viewdocHeader,
             viewdocComponentList,
             viewdocModal,
             //viewdocButton,
             viewdocSwitch,
             viewdocSwitchAll,
             pluginsdocSwipe) {

    //tmpl html FileName; ctrl js FileName
    var router = {
        // '/sample': {
        //     tmpl : 'sample'    //optional(tmpl与ctrl必须指定一个) 页面调用的模块名称 template
        //     ctrl : sample optional 页面对应的ctrl的路径 ctrl
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
            ctrl: main,
            title: 'GoM App'
        },
        '/login': {
            tmplname: 'login',
            ctrl: auth,
            title: '登录'
        },
        '/viewdoc': {
            '/': {
                tmplname: 'viewdoc/component_list',
                ctrl: viewdocComponentList,
                title: '用户组件'
            },
            '/header': {
                tmplname: 'viewdoc/header',
                ctrl: viewdocHeader,
                title: '头部设置文档'
            },
            '/list': {
                tmplname: 'viewdoc/list',
                ctrl: viewdocList,
                title: '列表文档'
            },
            '/modal': {
                tmplname: 'viewdoc/modal',
                ctrl: viewdocModal,
                title: 'Modal设置文档'
            },
            '/switch':{
                tmplname: 'viewdoc/switch',
                ctrl: viewdocSwitch,
                title: 'Slide',
                ':id': {
                    tmplname: 'viewdoc/switchall',
                    ctrl: viewdocSwitchAll,
                    title: 'Slide综合示例'
                }
            },
            '/button': {
                tmplname: 'viewdoc/button',
                title: '按钮Button文档',
                //ctrl: viewdocButton,    //纯静态页面可以不用ctrl初始化
            }
        },
        '/pluginsdoc':{
            '/swipe':{
                tmplname: 'pluginsdoc/swipe',
                ctrl: pluginsdocSwipe,
                title: 'Swipe'
            },
            '/fx':{
                tmplname: 'plugindocs/fx',
                //ctrl: pluginsdocFx,
                title: 'Fx'
            }
        },
        '/module': {
            '/': {
                tmplname: 'module/list',
                ctrl: moduleList
            },
            '/:var': {
                tmplname: 'module/view',
                ctrl: moduleView
            },
            '/add': {
                tmplname: 'module/add',
                ctrl: moduleAdd
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
            tmplname: '500'
        }
    };


    return router;
});
