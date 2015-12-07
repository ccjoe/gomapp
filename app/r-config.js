({
    // app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
    appDir: "./lib",
    // 模块根目录。默认情况下所有模块资源都相对此目录。
    // 若该值未指定，模块则相对build文件所在目录。
    // 若appDir值已指定，模块根目录baseUrl则相对appDir。
    baseUrl: "./",
    // 指定输出目录，若值未指定，则相对 build 文件所在目录
    dir: "./build",
    // 设置模块别名
    // RequireJS 2.0 中可以配置数组，顺序映射，当前面模块资源未成功加载时可顺序加载后续资源
    "paths": {
        "base": "./lib"
    },
    optimize: "uglify",
    modules: [{
        name: 'gom'
    }]
})
