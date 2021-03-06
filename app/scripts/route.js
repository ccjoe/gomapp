'use strict';

define([
    'main/ctrl',
    'viewdoc/list_ctrl',
    'viewdoc/header_ctrl',
    'viewdoc/component_list_ctrl',
    'viewdoc/modal_ctrl',
    //'viewdoc/button_ctrl',
    'viewdoc/switch_ctrl',
    'viewdoc/switchall_ctrl',
    'viewdoc/scroll_ctrl',
    'viewdoc/forms_ctrl',
    'pluginsdoc/swipe_ctrl',
    'modeldoc/index_ctrl'
], function (main,
             viewdocList,
             viewdocHeader,
             viewdocComponentList,
             viewdocModal,
             //viewdocButton,
             viewdocSwitch,
             viewdocSwitchAll,
             viewdocScroll,
             viewdocForms,
             pluginsdocSwipe,
             modeldocIndex) {

    //tmpl html FileName; ctrl js FileName
    var router = {
         //'/sample': {
         //    tmpl : 'sample'    //optional(tmpl与ctrl必须指定一个) 页面调用的模块名称 template
         //    ctrl : sample optional 页面对应的ctrl的路径 ctrl
         //    title: 'SAMPLE'    //optional 页面标题
         //    data : {}          //optional 页面需要的数据（一般不会直接写入，由ajax动态写入）
         //    params: {}         //页面间相互传递数据时设置此对象
         //    wrapper: '#sample' //optional 页面需要插入的DOM位置
         //    seo: {
         //         title:        //上面title是显示在页面上的，这个设置是<title>标签里的值
         //         keyword:,
         //         descption:
         //    }
         //},
        '/': {
            tmplname: 'app',
            ctrl: main,
            title: 'GoM App'
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
                '/all':{
                    ctrl: viewdocSwitchAll,
                    title: 'Slide综合示例'
                },
                '/slide':{
                    ctrl: viewdocSwitchAll,
                    title: 'Slide示例'
                },
                '/tab':{
                    ctrl: viewdocSwitchAll,
                    title: 'Tab示例'
                },
                '/ajax':{
                    ctrl: viewdocSwitchAll,
                    title: 'switch配置示例'
                },
                '/:var': {                          //对于这种情况一般这一级的hash都会被处理为路由参数routeParams,但如果匹配到了（如/all）则走上面流程。
                    tmplname: 'viewdoc/switchall',
                    ctrl: viewdocSwitchAll,
                    title: 'Slide综合示例'
                }
            },
            '/scroll':{
                ctrl: viewdocScroll,
                title: 'Scroll',
                '/x':{
                    tmplname: 'viewdoc/scroll-x',
                    ctrl: viewdocScroll,
                    title: '水平Scroll',
                },
                '/y':{
                    tmplname: 'viewdoc/scroll-y',
                    ctrl: viewdocScroll,
                    title: '垂直Scroll',
                }
            },
            '/forms'  : {
                tmplname: 'viewdoc/forms',
                ctrl: viewdocForms,
                title: 'form表单相关'
            },
            '/button': {
                tmplname: 'viewdoc/button',
                title: '按钮Button文档',
                //ctrl: viewdocButton,    //纯静态页面可以不用ctrl初始化
            },
            '/icon': {
                tmplname: 'viewdoc/icon',
                title: 'icon及相关class'
            },
            '/text': {
                tmplname: 'viewdoc/text',
                title: '文字及排版'
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
        '/pagedoc': {
            tmplname: '/pagedoc/index',
            title: 'Page对象及Ctrl说明'
        },
        '/modeldoc': {
            tmplname: '/modeldoc/index',
            ctrl: modeldocIndex,
            title: 'Model对象'
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
