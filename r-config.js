({
   //appDir: 'app/scripts', // app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
    baseUrl: 'app/scripts',       // 模块根目录。默认情况下所有模块资源都相对此目录。  若appDir值已指定，模块根目录baseUrl则相对appDir。
    dir: 'dist/scripts/',      // 指定输出目录，若值未指定，则相对 build 文件所在目录
    paths:{
        Gom : '../gom/build/gom'
    },
    modules: [
        {
            name: 'app',
            exclude: ['Gom'],
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true
})
