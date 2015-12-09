({
    appDir: './',
    baseUrl: './',
    dir: './build',
    modules: [
        {
            name: 'gom/gom'
        }
    ],
    fileExclusionRegExp: /^(r|r-config)\.js|build|readme.md$/,
    optimizeCss: 'standard',
    removeCombined: true,
    //cssIn: 'gom/style/main',
    //out: 'build/gom/gom.css',
    //依赖，暂时依赖，1去掉zepto.history, 去掉fastclick
    path: {
        'fastclick': '/bower_components/fastclick/lib/fastclick',
        'underscore': '../../bower_components/underscore/underscore',
        'zepto': '../../bower_components/zepto-full/zepto',
        'zepto.history': '../../bower_components/history.js/scripts/bundled/html5/zepto.history'
    }
})
