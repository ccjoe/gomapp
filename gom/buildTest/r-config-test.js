({
    //appDir: './test',
    baseUrl: './test',
    dir: './build',
    paths: {
        'BB': 'bb/bb',
        'CC': 'cc/cc',
        'AA': 'aa'
    },
  /*  shim:{
        'AA': ['BB', 'CC'],
    },*/
    modules: [
        {
            name: 'AA'
        }
    ],
    fileExclusionRegExp: /^(r|r-config)\.js|build|readme.md$/,
    optimizeCss: 'standard',
    removeCombined: true
})
