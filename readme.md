gom is Go Mobile!
一个H5的项目框架
将实现webapp hybridapp spa mpa多种方式的开发模式

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
```javascript
require(['base/app', 'com/config', 'com/route'], function(App, config, route){
    new App(config, route).run();
});
```

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

+ GoM分页面渲染和ui组件渲染，其都继承于View对象,都有data属性，通过定义组织data，然后调用render方法可以实现不同的渲染方式';

+ 对象上有页面调用的视图，ctrl, 标题...,其中比较重要的是数据对象，绑定在cr.data上, 可以为静态数据或由model层ajax动态获取由ctrl赋值于此对象上，如果没有只是单纯的渲染不带数据的视图
`page.render(callback);`即可实现渲染当前路由对应的页面及数据,callback为页面渲染后回调，可无。

+ 视图上就存在一个data对象，包含视图所需数据，由模板引擎doT去渲染。

+ 每个路由都有相应的cr(current Route)对象，那么一个路由表的配置就类似如下：

```javascript
var r = require;
 var router = {
        // '/sample': {
        //     tmpl : 'sample'    //require  页面调用的模块名称 template
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
}
```
