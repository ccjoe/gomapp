define(function() {
    'use strict';
    return {
        init: function(helper, cr){
            console.log(cr.routeParams, "路由变量");
            helper.render(cr);
        }
    };
});

