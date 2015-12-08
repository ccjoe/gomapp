({
    appDir: 'app/scripts', // app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
    baseUrl: './',       // 模块根目录。默认情况下所有模块资源都相对此目录。  若appDir值已指定，模块根目录baseUrl则相对appDir。
    dir: '../../build',      // 指定输出目录，若值未指定，则相对 build 文件所在目录
    modules: [
        {
            name: 'app',
            exclude: ['../../gom/gom']
        }
        ,{
            name: '../../gom/gom'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    path: {                     // RequireJS 2.0 中可以配置数组，顺序映射，当前面模块资源未成功加载时可顺序加载后续资源
        'fastclick': '/bower_components/fastclick/lib/fastclick',
        'underscore': '../../bower_components/underscore/underscore',
        'zepto': '../../bower_components/zepto-full/zepto',
        'zepto.history': '../../bower_components/history.js/scripts/bundled/html5/zepto.history'
    }
})
