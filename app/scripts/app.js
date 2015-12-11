/* jshint devel:true */
require.config({
    baseUrl: '../scripts'
});


require(['App', 'com/config', 'route'], function(App, config, route){
    new App(config, route).run();
});
