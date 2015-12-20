({
    baseUrl: './src',
    dir: './build',
    paths: {
        Gom:   'gom',
        App:   'app',
        UI :   'ui/ui',
        Header:'ui/ui.header',
        Forms: 'ui/ui.forms',
        List:  'ui/ui.list',
        Modal: 'ui/ui.modal',
        Sides: 'ui/ui.sides',
        Scroll:'ui/ui.scroll',
        Slide: 'ui/ui.slide',
        Select:'ui/ui.select',
        View:  'core/view',
        Page:  'core/page',
        Service:'core/service',
        Store: 'utils/store',
        Url:   'utils/url',
        Fx:    'utils/fx',
        Swipe: 'utils/swipe',
        Utils: 'utils/utils',
        UITmpl:'ui/ui.tmpl'
    },
    modules: [
        {
            name: 'Gom'
        }
    ],
    fileExclusionRegExp: /^(r|r-config)\.js|build|styles|3rd|ui\.tmpl\.html|readme.md$/,
    optimizeCss: 'standard',
    removeCombined: true
})
