一个H5的项目框架
__bower build__
`bower install jch5`

# 依赖：  
```
"requirejs":"~2.1.15",
"dot": "~1.0.3",
"history.js": "1.8.0",
"zepto-full": "~1.1.2",
"ratchet": "~2.0.2"
```

#运行入口
requirejs(['com/helper', 'com/config', 'com/route'], function(helper, config, route){
    helper.config = config;
    helper.route = route;
    helper.init();
});

二 APP路由相关的视图与控制器配置

每当路由到一个地址，会有相应的`cr对象`(currentRoute)，如下：
```
{
    tmpl : 'sample'    //require  页面调用的模块名称 template
    ctrl : r('sample') //optional 页面对应的ctrl的路径 ctrl
    title: 'SAMPLE'    //optional 页面标题
    data : {}          //optional 页面需要的数据（一般不会直接写入，由ajax动态写入）
    rendeTo: '#sample' //optional 页面需要插入的DOM位置
}
```

+ 对象上有页面调用的视图，ctrl, 标题...,其中比较重要的是数据对象，绑定在cr.data上, 可以为静态数据或由model层ajax动态获取由ctrl赋值于此对象上，如果没有只是单纯的渲染不带数据的视图
`helper.render(cr, fn);`即可实现渲染当前路由对应的页面及数据,fn为渲染后回调，可无。

+ 视图上就存在一个data对象，包含视图所需数据，由模板引擎doT去渲染。

+ 每个路由都有相应的cr对象，那么一个路由表的配置就类似如下：

```js
var r = require;
var router = {
    // '/sample': {
    //     tmpl : 'sample'    //require  页面调用的模块名称 template
    //     ctrl : r('sample') //optional 页面对应的ctrl的路径 ctrl
    //     title: 'SAMPLE'    //optional 页面标题
    //     data : {}          //optional 页面需要的数据（可以为静态数据或由model层ajax动态获取写在此对象上）
    //     rendeTo: '#sample' //optional 页面需要插入的DOM位置
    // },
    '/' : {
        tmpl: 'app',
        ctrl: r('main/ctrl'),
        title: 'H5-MVC By JOE'
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
    }
}
```