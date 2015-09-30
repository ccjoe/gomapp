/* jshint devel:true */
requirejs.config({
    baseUrl: '../scripts',
    paths: {
        // app: '/app/scripts/'
    }
});

requirejs(['com/helper', 'com/config', 'com/route'], function(helper, config, route){
	helper.config = config;
	helper.route = route;
	helper.init();
});

